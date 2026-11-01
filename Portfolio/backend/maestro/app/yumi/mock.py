import asyncio
import json
import time
import uuid
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.yumi.client import NearbyQuery, NotAvailable, NotFound, PlaceNotFound
from app.yumi.filters import distance_m, matches
from app.yumi.models import (
    LatLng,
    LiveStatus,
    LiveStatusKind,
    Place,
    Region,
    Reservation,
    ReservationRequest,
)

FIXTURES = Path(__file__).parent / "fixtures"
KST = timezone(timedelta(hours=9))
# 로그인 없는 공개 API 라 문의 기록이 끝없이 쌓이지 않게 — 오래된 것부터 지운다
QUERY_TTL_SECONDS = 10 * 60
MAX_QUERIES = 1000


@lru_cache
def _load(name: str) -> list[dict[str, Any]]:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


# 사장님 답을 흉내 낸 값 — 문의 종류별
MOCK_ANSWERS: dict[LiveStatusKind, tuple[str, str]] = {
    "wait": ("limited", "지금 대기 약 10분이에요"),
    "seats": ("available", "바로 앉으실 수 있어요"),
    "item": ("available", "오늘 준비돼 있어요"),
}

# 리뉴얼 '자리 물어보기' — 시연할 때마다 같은 결과가 나오게 식당마다 답 하나를 고정한다
SEAT_ANSWERS: list[tuple[str, str | None]] = [
    ("available", "바로 앉으실 수 있어요"),
    ("limited", "바 자리만 있어요"),
    ("unavailable", "지금은 자리가 없어요"),
    ("no_response", None),
]


def seat_answer(place_id: str) -> tuple[str, str | None]:
    """매장 id 로 정한 고정 답 — hash() 는 실행마다 달라서 글자 코드 합을 쓴다."""
    return SEAT_ANSWERS[sum(map(ord, place_id)) % len(SEAT_ANSWERS)]


class MockYumiClient:
    """fixtures/*.json 으로 유미 API 를 흉내 낸다. 키 없이 개발하고, 발표 때 API 가 죽으면 이걸로 버틴다.

    실시간 문의·예약은 answer_delay 초 뒤에 사장님이 답한 것처럼 바뀐다 (simulated=True).
    문의·예약 기록은 이 객체 안에 두므로, 앱에서는 하나만 만들어 같이 쓴다(deps.py).
    real 모드에서도 실제 사장님께 보내지 않으려고 이 흉내를 쓴다 — 그때는 fixtures 에 없는
    실제 매장 id 가 들어오므로 accept_any_place=True 로 만든다.
    """

    def __init__(
        self, answer_delay: float = 3.0, accept_any_place: bool = False
    ) -> None:
        self.answer_delay = answer_delay
        self.accept_any_place = accept_any_place
        self._queries: dict[str, tuple[float, LiveStatus]] = {}
        self._reservations: dict[str, tuple[float, Reservation]] = {}
        self._fixed_answers: dict[str, tuple[str, str | None]] = {}

    async def resolve_region(self, dong: str) -> list[Region]:
        return [
            Region.model_validate(raw)
            for raw in _load("regions.json")
            if dong in raw["dong"] or dong in raw["fullName"]
        ]

    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        center = LatLng(lat=query.lat, lng=query.lng)
        found: list[Place] = []
        for raw in _load("places.json"):
            place = Place.model_validate(raw)
            distance = distance_m(center, place.location)
            if distance > query.radius or not matches(place, query.filters):
                continue
            found.append(place.model_copy(update={"distance_m": round(distance)}))

        if query.sort == "discovery":
            # 실제 추천 순위는 알 수 없어서, 믿을 만하고 최근 정보가 많은 순으로 흉내 낸다
            found.sort(
                key=lambda p: p.confidence + (p.freshness_score or 0), reverse=True
            )
        else:
            found.sort(key=lambda p: p.distance_m or 0)
        return found[: query.page_size]

    async def get_place(self, place_id: str) -> Place:
        for raw in _load("places.json"):
            if raw["id"] == place_id:
                return Place.model_validate(raw)
        raise PlaceNotFound(place_id)

    # ── 확인·예약 ─────────────────────────────────────────────────────────

    def _is_partner(self, place_id: str) -> bool:
        """파트너(yumiReservable) 매장만 사장님 앱이 있다."""
        for raw in _load("places.json"):
            if raw["id"] == place_id:
                return bool(raw.get("yumiReservable"))
        if self.accept_any_place:
            # real 모드 — 파트너인지는 프론트가 실제 데이터(yumiReservable)로 이미 가렸다
            return True
        raise PlaceNotFound(place_id)

    async def _wait_until_answered(self, created: float, wait: int) -> None:
        remaining = created + self.answer_delay - time.monotonic()
        if remaining > 0 and wait > 0:
            await asyncio.sleep(min(wait, remaining))

    def _answered(self, created: float) -> bool:
        return time.monotonic() - created >= self.answer_delay

    async def ask_live_status(
        self,
        place_id: str,
        kind: LiveStatusKind,
        topic: str,
        question: str | None = None,
    ) -> LiveStatus:
        if not self._is_partner(place_id):
            raise NotAvailable("live_status_not_available")
        # 같은 매장·주제에 이미 받은 답이 있으면 사장님을 다시 귀찮게 하지 않고 그 답을 준다
        for created, query in self._queries.values():
            same = query.place_id == place_id and query.topic == topic
            if same and self._answered(created):
                return self._settle_query(created, query).model_copy(
                    update={"reused": True}
                )
        query = LiveStatus(
            query_id=f"mock-q-{uuid.uuid4().hex[:8]}",
            place_id=place_id,
            kind=kind,
            topic=topic,
            status="pending",
            simulated=True,
        )
        self._remember(query)
        return query

    async def simulate_seat_ask(self, place_id: str, topic: str) -> LiveStatus:
        """체험용 자리 묻기 — 파트너인지 따지지 않고 어느 식당이든 흉내 낸 답을 준다 (simulated=True)."""
        query = LiveStatus(
            query_id=f"mock-q-{uuid.uuid4().hex[:8]}",
            place_id=place_id,
            kind="seats",
            topic=topic,
            status="pending",
            simulated=True,
        )
        self._remember(query)
        self._fixed_answers[query.query_id] = seat_answer(place_id)
        return query

    def _remember(self, query: LiveStatus) -> None:
        now = time.monotonic()
        for query_id, (created, _) in list(self._queries.items()):
            if now - created >= QUERY_TTL_SECONDS or len(self._queries) >= MAX_QUERIES:
                del self._queries[query_id]
                self._fixed_answers.pop(query_id, None)
            else:
                break  # dict 는 넣은 순서라 여기서부터는 더 새것뿐이다
        self._queries[query.query_id] = (now, query)

    def _settle_query(self, created: float, query: LiveStatus) -> LiveStatus:
        if not self._answered(created) or query.status != "pending":
            return query
        status, note = (
            self._fixed_answers.get(query.query_id) or MOCK_ANSWERS[query.kind]
        )
        settled = query.model_copy(
            update={"status": status, "note": note, "verified_at": datetime.now(KST)}
        )
        self._queries[query.query_id] = (created, settled)
        return settled

    async def get_live_status(self, query_id: str, wait: int = 0) -> LiveStatus:
        if query_id not in self._queries:
            raise NotFound(query_id)
        created, _ = self._queries[query_id]
        await self._wait_until_answered(created, wait)
        return self._settle_query(*self._queries[query_id])

    async def request_reservation(self, request: ReservationRequest) -> Reservation:
        if not self._is_partner(request.place_id):
            raise NotAvailable("reservation_not_available")
        reservation = Reservation(
            reservation_id=f"mock-r-{uuid.uuid4().hex[:8]}",
            place_id=request.place_id,
            reservation_time=request.reservation_time,
            guest_count=request.guest_count,
            status="pending",
            simulated=True,
        )
        self._reservations[reservation.reservation_id] = (
            time.monotonic(),
            reservation,
        )
        return reservation

    async def get_reservation(self, reservation_id: str, wait: int = 0) -> Reservation:
        if reservation_id not in self._reservations:
            raise NotFound(reservation_id)
        created, reservation = self._reservations[reservation_id]
        await self._wait_until_answered(created, wait)
        if self._answered(created) and reservation.status == "pending":
            reservation = reservation.model_copy(update={"status": "confirmed"})
            self._reservations[reservation_id] = (created, reservation)
        return reservation
