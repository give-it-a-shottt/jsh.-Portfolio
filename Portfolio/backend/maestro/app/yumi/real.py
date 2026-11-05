"""헤이유미 REST API 클라이언트 (real 모드).

2026-10-07 실제 응답을 보고 맞춘 것
  - 응답은 {"success", "data", "meta"} 봉투에 담겨 온다 → data 만 꺼낸다
  - 요청 1번마다 X-Ratelimit-Remaining 이 1씩 준다 (기본 무료 한도는 하루 70토큰) → 같은 검색은 잠깐 캐시한다
  - '을지로'·'성수'는 동이 아니라 상권(kind=district)으로 풀린다 — Region 모델이 빈 코드를 받는다

★ 실시간 문의·예약은 실제 사장님 앱으로 푸시가 간다. 개발·발표 중에 진짜 사장님을 귀찮게 하지 않도록
  real 모드에서도 HTTP 를 보내지 않고 OwnerSimulator(mock)로 흉내 낸다 (응답의 simulated=True).
"""

import asyncio
import time
from typing import Any

import httpx
from pydantic import ValidationError

from app.yumi.client import NearbyQuery, NotFound, PlaceNotFound, YumiError
from app.yumi.mock import MockYumiClient
from app.yumi.models import (
    LiveStatus,
    LiveStatusKind,
    Place,
    Region,
    Reservation,
    ReservationRequest,
)

# 식당 상세에 쓰는 등급 — 사진(media)은 8토큰이라 받지 않는다
DETAIL_FIELDS = "core,contact_hours,quality,edge"
MAX_RETRY_AFTER = 5.0  # 초. 429 를 받으면 이만큼까지만 기다렸다가 한 번 더 시도한다
# 실제로 재 보니 추천순(discovery) 검색은 10초를 넘기기도 한다
TIMEOUT_SECONDS = 20

Params = dict[str, str | float]


def _encode(value: str | float) -> str | float:
    # 유미는 불리언 필터를 "true" 문자열로 받는다
    if isinstance(value, bool):
        return "true" if value else "false"
    return value


def _parse_place(raw: dict[str, Any]) -> Place | None:
    """모양이 예상과 다른 매장 하나 때문에 검색 전체가 실패하지 않게, 그 매장만 건너뛴다."""
    try:
        return Place.model_validate(raw)
    except ValidationError:
        return None


class RealYumiClient:
    def __init__(
        self,
        api_key: str,
        base_url: str,
        cache_seconds: float = 600,
        max_concurrency: int = 4,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        if not api_key:
            raise YumiError(401, "YUMI_API_KEY 가 비어 있어요 (.env 확인)")
        # 키는 매 요청 헤더에 붙는다 — 주소(?api_key=)에 넣으면 로그에 남아 새기 쉽다
        self._http = httpx.AsyncClient(
            base_url=base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=TIMEOUT_SECONDS,
            transport=transport,
        )
        self._cache_seconds = cache_seconds
        self._cache: dict[
            tuple[str, tuple[tuple[str, Any], ...]], tuple[float, Any]
        ] = {}
        # 악보 1번에 검색이 십여 개 동시에 나간다 — 한꺼번에 몰리지 않게 동시 개수를 묶는다
        self._limit = asyncio.Semaphore(max_concurrency)
        # 사장님께 가는 기능은 흉내만 낸다
        self._owner = MockYumiClient(accept_any_place=True)

    async def _send(self, path: str, params: Params) -> httpx.Response:
        # 시간 초과는 한 번 더 시도하고, 그래도 안 되면 YumiError 로 알린다
        for attempt in range(2):
            try:
                return await self._http.get(path, params=params)
            except httpx.TimeoutException as exc:
                if attempt == 1:
                    raise YumiError(504, "시간 초과") from exc
            except httpx.HTTPError as exc:
                raise YumiError(502, str(exc)) from exc
        raise AssertionError("unreachable")

    async def _get(self, path: str, params: Params) -> Any:
        key = (path, tuple(sorted(params.items())))
        cached = self._cache.get(key)
        if cached and time.monotonic() - cached[0] < self._cache_seconds:
            return cached[1]

        async with self._limit:
            response = await self._send(path, params)
            if response.status_code == 429:
                wait = float(response.headers.get("Retry-After", "1"))
                # 하루 한도를 다 쓰면 Retry-After 가 몇 시간이다 — 기다리지 않고 바로 알린다
                if wait > MAX_RETRY_AFTER:
                    raise YumiError(429, "하루 한도를 다 썼어요")
                await asyncio.sleep(wait)
                response = await self._send(path, params)

        if response.status_code == 404:
            raise NotFound(path)
        if response.status_code >= 400:
            raise YumiError(response.status_code, response.text[:200])
        try:
            data = response.json()["data"]
        except (ValueError, KeyError, TypeError) as error:
            # 봉투 모양이 달라도 500 이 아니라 유미 오류로 — 결과 화면은 저장본으로 대신한다
            raise YumiError(502, "유미 응답 모양이 예상과 달라요") from error
        self._cache[key] = (time.monotonic(), data)
        return data

    async def resolve_region(self, dong: str) -> list[Region]:
        data = await self._get("/api/v1/regions", {"dong": dong})
        return [Region.model_validate(raw) for raw in data]

    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        params: Params = {
            "lat": query.lat,
            "lng": query.lng,
            "radius": query.radius,
            "sort": query.sort,
            "fields": query.fields,
            "page_size": query.page_size,
        }
        params |= {name: _encode(value) for name, value in query.filters.items()}
        data = await self._get("/api/v1/places/nearby", params)
        if not isinstance(data, list):
            raise YumiError(502, "유미 응답 모양이 예상과 달라요")
        return [place for raw in data if (place := _parse_place(raw))]

    async def get_place(self, place_id: str) -> Place:
        try:
            data = await self._get(
                f"/api/v1/places/{place_id}", {"fields": DETAIL_FIELDS}
            )
        except NotFound as exc:
            raise PlaceNotFound(place_id) from exc
        return Place.model_validate(data)

    # ── 사장님께 가는 기능 — 실제로 보내지 않는다 ─────────────────────────────

    async def ask_live_status(
        self,
        place_id: str,
        kind: LiveStatusKind,
        topic: str,
        question: str | None = None,
    ) -> LiveStatus:
        return await self._owner.ask_live_status(place_id, kind, topic, question)

    async def get_live_status(self, query_id: str, wait: int = 0) -> LiveStatus:
        return await self._owner.get_live_status(query_id, wait)

    async def simulate_seat_ask(self, place_id: str, topic: str) -> LiveStatus:
        return await self._owner.simulate_seat_ask(place_id, topic)

    async def request_reservation(self, request: ReservationRequest) -> Reservation:
        return await self._owner.request_reservation(request)

    async def get_reservation(self, reservation_id: str, wait: int = 0) -> Reservation:
        return await self._owner.get_reservation(reservation_id, wait)
