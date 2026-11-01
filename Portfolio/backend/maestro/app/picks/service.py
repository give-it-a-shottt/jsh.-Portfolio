"""후보 3곳 고르기 — 홈의 [3곳 찾기] 한 번에 결과 화면 전체를 만든다.

유미 요청은 동네마다 검색 1번(추천순 100곳, edge 등급)이고 6시간 동안 다시 쓴다.
영업 여부 · 상황 조건 · 순위는 모두 받은 데이터 안에서 계산해서, 시각이나 조건을 바꿔도 요청이 늘지 않는다.
유미가 실패하면(한도 · 장애 · 시간 초과) 저장해 둔 실제 데이터(fixtures/snapshot.json)로 대신 보여준다.

고르는 순서 (maestro-design.md User Flow A)
  폐업 의심 · 식당 아닌 곳 제외 → 지금 영업 중 → 맞은 조건 수 → 지도 앱 확인 수 → 거리
"""

import asyncio
import json
import time
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from itertools import pairwise
from pathlib import Path

from app.picks import hours
from app.picks.conditions import CONDITIONS, ConditionKey, matched
from app.picks.schemas import (
    ConditionOut,
    DongKey,
    DongOut,
    EvidenceOut,
    HoursOut,
    Pick,
    PicksOut,
    PlaceCard,
    PlaceDetailOut,
    RelaxOut,
    SegmentOut,
    Source,
    StatusOut,
)
from app.yumi.client import NearbyQuery, PlaceNotFound, YumiClient, YumiError
from app.yumi.models import LatLng, Place

KST = timezone(timedelta(hours=9))
PICKS = 3
BAR_END = 26 * 60  # 영업시간 막대 축의 끝 — 다음 날 02:00
# 동네 4곳 — 유미 상권 중심 좌표 (2026-11-01 /api/v1/regions)
DONGS: dict[DongKey, DongOut] = {
    "euljiro": DongOut(
        key="euljiro", label="을지로", center=LatLng(lat=37.5662, lng=126.991)
    ),
    "seongsu": DongOut(
        key="seongsu", label="성수", center=LatLng(lat=37.5445, lng=127.056)
    ),
    "ikseon": DongOut(
        key="ikseon", label="익선동", center=LatLng(lat=37.5726, lng=126.9905)
    ),
    "yeonnam": DongOut(
        key="yeonnam", label="연남", center=LatLng(lat=37.561, lng=126.9248)
    ),
}
# '지금'에 열린 곳이 3곳 미만이면 이 중 가장 가까운 시각으로 바꾼다 (새벽 · 오후에 면접관이 빈 화면만 보지 않게)
DEMO_TIMES = ["12:40", "19:30", "22:00"]

SEARCH_RADIUS = 600  # m
SEARCH_FIELDS = "core,contact_hours,quality,edge"  # 상세까지 한 번에 — 상세 화면에서 다시 부르지 않는다
SEARCH_PAGE_SIZE = 100
CACHE_SECONDS = 6 * 60 * 60  # 영업시간 · 근거는 하루 안에 거의 바뀌지 않는다

# 유미 분위기 값 → 화면 글자 (2026-11-01 실제 응답에 나온 10가지)
ATMOSPHERE = {
    "cozy": "아늑함",
    "quiet": "조용함",
    "traditional": "노포",
    "trendy": "트렌디",
    "clean": "깔끔함",
    "spacious": "넓음",
    "lively": "활기참",
    "view": "전망",
    "work_study": "작업하기 좋음",
    "rainy_mood": "비 오는 날",
}

# 저장본이 있으니 유미를 오래 기다리지 않는다. 추천순 검색은 10초를 넘기기도 해서 15초까지만
LIVE_TIMEOUT_SECONDS = 15
# 유미가 실패한 동네는 이만큼 다시 부르지 않고 저장본으로 — 장애 · 한도 중에 요청마다 기다리지 않게
FAIL_SECONDS = 10 * 60

SNAPSHOT = Path(__file__).parent.parent / "yumi" / "fixtures" / "snapshot.json"
_cache: dict[DongKey, tuple[float, list[Place]]] = {}
_failed: dict[DongKey, float] = {}
# 캐시가 빈 동네에 요청이 한꺼번에 와도 유미 검색은 한 번만 나가게 동네마다 잠근다
_locks: dict[DongKey, asyncio.Lock] = {}


@lru_cache
def _snapshot() -> dict[str, list[Place]]:
    raw = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    return {
        dong: [Place.model_validate(p) for p in places]
        for dong, places in raw["dongs"].items()
    }


def clear_cache() -> None:
    _cache.clear()
    _failed.clear()


def nearby_query(dong: DongKey) -> NearbyQuery:
    """동네 검색 조건 — 결과 화면과 저장본(scripts/snapshot.py)이 같은 조건으로 받는다."""
    center = DONGS[dong].center
    return NearbyQuery(
        lat=center.lat,
        lng=center.lng,
        radius=SEARCH_RADIUS,
        sort="discovery",
        fields=SEARCH_FIELDS,
        page_size=SEARCH_PAGE_SIZE,
    )


async def load_places(
    yumi: YumiClient | None, dong: DongKey
) -> tuple[list[Place], Source]:
    """동네 매장 100곳. 유미를 못 부르거나(yumi=None) 유미가 실패하면 저장본을 쓴다."""
    if yumi is not None:
        async with _locks.setdefault(dong, asyncio.Lock()):
            places = await _live_places(yumi, dong)
        if places:
            return places, "live"
    return _snapshot().get(dong, []), "snapshot"


async def _live_places(yumi: YumiClient, dong: DongKey) -> list[Place]:
    now = time.monotonic()
    cached = _cache.get(dong)
    if cached and now - cached[0] < CACHE_SECONDS:
        return cached[1]
    if dong in _failed and now - _failed[dong] < FAIL_SECONDS:
        return []
    try:
        places = await asyncio.wait_for(
            yumi.search_nearby(nearby_query(dong)), LIVE_TIMEOUT_SECONDS
        )
    except (YumiError, TimeoutError):
        places = []
    if places:
        _cache[dong] = (now, places)
        _failed.pop(dong, None)
    else:
        _failed[dong] = now
    return places


def resolve_time(at: str, day: str | None) -> tuple[str, int]:
    """'now' | 'HH:MM' → (요일, 분). 요일을 안 주면 오늘(한국 시간)."""
    now = datetime.now(KST)
    today = hours.DAYS[now.weekday()]
    if at == "now":
        return day or today, now.hour * 60 + now.minute
    return day or today, hours.to_minutes(at)


def _candidate(place: Place) -> bool:
    """폐업 신호가 있거나 식당이 아닌 곳(카페 · 바)은 뺀다 — 갔는데 문 닫았으면 안 되니까."""
    closed = place.possibly_closed or place.closure_signal is not None
    return not closed and place.category in (None, "restaurant")


def _checked_on(place: Place) -> str | None:
    if place.last_seen_at is None:
        return None
    seen = place.last_seen_at.astimezone(KST)
    return f"{seen.month}/{seen.day}"


def _evidence(place: Place) -> EvidenceOut:
    items: list[str] = []
    if place.source_count >= 2:
        items.append(f"지도 앱 {place.source_count}곳에 다 나와요")
    if place.reputation:
        # '3개 지도 소스에서 …'는 위 문장과 같은 말이라 뺀다
        items += [b for b in place.reputation.basis if "지도 소스" not in b]
    if place.legacy:
        items.append("백년가게 인증을 받은 곳이에요")
    if place.service_attributes.get("waiting_expected"):
        items.append("줄 서는 곳으로 알려져 있어요")
    else:
        items.append("줄 서는 곳으로 알려지지 않았어요")
    line = items[0] if items else "유미가 확인한 곳이에요"
    return EvidenceOut(
        line=line,
        checked_on=_checked_on(place),
        source_count=place.source_count,
        items=items[:4],
    )


def _hours_out(place: Place, day: str) -> HoursOut:
    segs = hours.segments(place, day)
    last_order = next(
        (s.last_order for s in reversed(segs) if s.last_order is not None), None
    )
    # 막대 축이 다음 날 02:00 까지라, 다음 날 0시에 새로 시작하는 구간(24시간 영업 등)도 이어 그린다
    tomorrow = hours.DAYS[(hours.DAYS.index(day) + 1) % 7]
    tail = [s for s in hours.segments(place, tomorrow) if s.start < BAR_END - hours.DAY]
    return HoursOut(
        segments=[SegmentOut(start=s.start, end=s.end) for s in segs]
        + [SegmentOut(start=s.start + hours.DAY, end=s.end + hours.DAY) for s in tail],
        last_order=last_order,
    )


def _card(place: Place) -> PlaceCard:
    return PlaceCard(
        id=place.id,
        name=place.name,
        initial=place.name[:1],
        category_label=place.category_label,
        location=place.location,
        distance_m=place.distance_m,
        station=place.nearest_station,
        price_avg=place.price.avg if place.price else None,
        ai_summary=place.ai_summary,
        waiting_expected=bool(place.service_attributes.get("waiting_expected")),
        atmosphere=[ATMOSPHERE[a] for a in place.atmosphere if a in ATMOSPHERE],
    )


def to_pick(place: Place, day: str, at: int, keys: list[ConditionKey]) -> Pick:
    status = hours.status_at(place, day, at)
    hit = matched(place, keys)
    return Pick(
        place=_card(place),
        status=StatusOut(
            kind=status.kind,
            label=status.label,
            next_change=status.next_change,
            short=status.short,
        ),
        hours=_hours_out(place, day),
        evidence=_evidence(place),
        matched=hit,
        unmatched=[k for k in keys if k not in hit],
    )


def _rank_key(place: Place, keys: list[ConditionKey]) -> tuple[int, int, int]:
    return (-len(matched(place, keys)), -place.source_count, place.distance_m or 0)


def condition_list() -> list[ConditionOut]:
    return [
        ConditionOut(key=c.key, label=c.label, hint=c.hint) for c in CONDITIONS.values()
    ]


def _open_places(places: list[Place], day: str, at: int) -> list[Place]:
    return [p for p in places if _candidate(p) and hours.is_open(p, day, at)]


def _nearest_demo_time(places: list[Place], day: str, at: int) -> int | None:
    """열린 곳이 3곳 이상인 시연 시각 중 at 에 가장 가까운 것."""

    def gap(t: int) -> int:
        d = abs(t - at)
        return min(d, hours.DAY - d)

    options = [hours.to_minutes(t) for t in DEMO_TIMES]
    good = [t for t in options if len(_open_places(places, day, t)) >= PICKS]
    return min(good, key=gap) if good else None


def build_picks(
    places: list[Place],
    source: Source,
    dong: DongKey,
    day: str,
    at: int,
    keys: list[ConditionKey],
    auto_switch: bool,
) -> PicksOut:
    switched_from = None
    opened = _open_places(places, day, at)
    if auto_switch and len(opened) < PICKS:
        demo = _nearest_demo_time(places, day, at)
        if demo is not None:
            switched_from, at = hours.clock(at), demo
            opened = _open_places(places, day, at)

    relax: list[RelaxOut] = []
    if not opened:
        # 지금 열린 곳 없음 → 오늘 가장 빨리 여는 3곳
        later = [p for p in places if _candidate(p) and hours.next_opening(p, day, at)]
        later.sort(key=lambda p: (hours.next_opening(p, day, at), *_rank_key(p, keys)))
        state, chosen = "none", later[:PICKS]
    else:
        full = [p for p in opened if len(matched(p, keys)) == len(keys)]
        if len(full) >= PICKS:
            state = "ok"
            chosen = sorted(full, key=lambda p: _rank_key(p, keys))[:PICKS]
        else:
            state = "few"
            # 조건이 다 맞는 곳이 하나라도 있으면 그곳만, 하나도 없으면 가장 많이 맞는 3곳(안 맞은 조건은 흐리게)
            pool = full or opened
            chosen = sorted(pool, key=lambda p: _rank_key(p, keys))[:PICKS]
            for key in keys:
                rest = [k for k in keys if k != key]
                more = sum(
                    1 for p in opened if len(matched(p, rest)) == len(rest)
                ) - len(full)
                if more > 0:
                    relax.append(
                        RelaxOut(key=key, label=CONDITIONS[key].label, more=more)
                    )

    return PicksOut(
        dong=DONGS[dong],
        day=day,
        at=hours.clock(at),
        switched_from=switched_from,
        source=source,
        state=state,
        open_count=len(opened),
        picks=[to_pick(p, day, at, keys) for p in chosen],
        relax=relax,
        conditions=condition_list(),
    )


def _day_text(place: Place, day: str) -> str:
    """'11:00 – 21:00 · 쉬는 시간 없음' / '11:00 – 21:00 · 브레이크 15:00 – 17:00' / '휴무'."""
    segs = hours.segments(place, day)
    if not segs:
        return "휴무"
    span = f"{hours.clock(segs[0].start)} – {hours.clock(segs[-1].end)}"
    if len(segs) == 1:
        return f"{span} · 쉬는 시간 없음"
    breaks = ", ".join(
        f"{hours.clock(a.end)} – {hours.clock(b.start)}" for a, b in pairwise(segs)
    )
    return f"{span} · 브레이크 {breaks}"


def hours_text(place: Place, day: str) -> str:
    """요일마다 같으면 '매일 …', 다르면 오늘 것만 '오늘 …'."""
    texts = {_day_text(place, d) for d in hours.DAYS}
    if len(texts) == 1:
        return f"매일 {texts.pop()}"
    return f"오늘 {_day_text(place, day)}"


def build_detail(
    place: Place,
    source: Source,
    dong: DongKey,
    day: str,
    at: int,
    keys: list[ConditionKey],
) -> PlaceDetailOut:
    return PlaceDetailOut(
        dong=DONGS[dong],
        at=hours.clock(at),
        source=source,
        pick=to_pick(place, day, at, keys),
        address=place.address.road if place.address else None,
        phone=place.phone,
        menu=place.menu_summary.items if place.menu_summary else [],
        hours_text=hours_text(place, day),
        conditions=condition_list(),
    )


def find_place(places: list[Place], dong: DongKey, place_id: str) -> Place:
    """결과에서 누른 매장. 검색 결과에 없으면(캐시가 바뀐 경우) 저장본에서 찾는다."""
    for place in [*places, *_snapshot().get(dong, [])]:
        if place.id == place_id:
            return place
    raise PlaceNotFound(place_id)
