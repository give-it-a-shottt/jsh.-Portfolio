"""악보 만들기 - '지휘 시작'을 누르면 끼니마다 상황 6개의 대안을 한 번에 찾아 둔다.

당일 모드에서 버튼을 누르는 순간 바로 보여주려고 미리 다 찾는다(발표 킬러 장면).
유미 하루 한도가 70요청이라 끼니마다 검색은 한 번만 하고(추천순 100곳),
메인과 상황 6개는 그 결과 안에서 고른다.
유미 요청 수 = 끼니마다 검색 1 (+ 처음 보는 동네 1, + 메인을 직접 고른 경우 1).
"""

import asyncio
from datetime import time

from app.score.schemas import (
    MealIn,
    MealKind,
    MealScore,
    Score,
    ScoreRequest,
    SituationOut,
)
from app.situations import (
    CAFE_SUBTYPES,
    SEARCH_PAGE_SIZE,
    SEARCH_RADIUS,
    SITUATIONS,
    VARIATION_FIELDS,
    Situation,
)
from app.yumi.client import NearbyQuery, YumiClient
from app.yumi.models import LatLng, Place

VARIATIONS_PER_SITUATION = 3
# 이보다 낮으면 뒤로 미룬다 (빼지는 않는다 - 후보가 모자랄 수 있어서)
MIN_CONFIDENCE = 0.6
MIN_FRESHNESS = 0.5


class RegionNotFound(Exception):
    """유미가 모르는 동네 이름."""


def _trustworthy(place: Place) -> bool:
    """폐업 신호가 있는 곳은 대안에서 뺀다 - 갔는데 문 닫았으면 안 되니까."""
    return not place.possibly_closed and place.closure_signal is None


def _rank(places: list[Place]) -> list[Place]:
    """API 순서를 지키되, 교차검증(confidence)·최근성(freshness)이 낮은 곳은 뒤로 보낸다."""

    def doubt(place: Place) -> int:
        stale = (place.freshness_score or 0) < MIN_FRESHNESS
        return (place.confidence < MIN_CONFIDENCE) + stale

    return sorted(places, key=doubt)  # sorted 는 같은 값끼리 원래 순서를 지킨다


def _open_at(meal: MealIn) -> str:
    return meal.at.strftime("%Y-%m-%dT%H:%M")


def meal_kind(meal: MealIn) -> MealKind:
    """끼니 시각 → 종류. 점심과 저녁 사이(14:30~17:00)는 카페로 본다."""
    at = meal.at.time()
    if at < time(10, 30):
        return "breakfast"
    if at < time(14, 30):
        return "lunch"
    if at < time(17, 0):
        return "cafe"
    if at < time(21, 30):
        return "dinner"
    return "late_night"


def _variations(
    situation: Situation, places: list[Place], exclude: set[str], cafe: bool
) -> list[Place]:
    picked = [
        place
        for place in places
        if place.id not in exclude
        and _trustworthy(place)
        and situation.fits(place, cafe)
    ]
    return _rank(picked)[:VARIATIONS_PER_SITUATION]


async def _search(
    yumi: YumiClient, center: LatLng, open_at: str, cafe: bool
) -> list[Place]:
    """끼니 하나에 검색 한 번 - 그 시각에 여는 곳을 추천순으로 넓게 받는다."""
    filters: dict[str, str | bool] = {"open_at": open_at}
    if cafe:
        filters["subtype"] = CAFE_SUBTYPES
    return await yumi.search_nearby(
        NearbyQuery(
            lat=center.lat,
            lng=center.lng,
            radius=SEARCH_RADIUS,
            sort="discovery",
            filters=filters,
            fields=VARIATION_FIELDS,
            page_size=SEARCH_PAGE_SIZE,
        )
    )


async def _score_meal(yumi: YumiClient, meal: MealIn) -> MealScore:
    regions = await yumi.resolve_region(meal.dong)
    if not regions:
        raise RegionNotFound(meal.dong)
    # 이름이 같은 동네가 여럿이면 매장이 가장 많은 곳으로 본다
    region = max(regions, key=lambda r: r.place_count)
    kind = meal_kind(meal)
    cafe = kind == "cafe"

    places = await _search(yumi, region.center, _open_at(meal), cafe)
    if meal.main_place_id:
        main: Place | None = await yumi.get_place(meal.main_place_id)
    else:
        # 비워 두면 추천 1순위를 메인으로
        main = next((place for place in places if _trustworthy(place)), None)

    exclude = {main.id} if main else set()
    variations = {
        key: _variations(situation, places, exclude, cafe)
        for key, situation in SITUATIONS.items()
    }
    return MealScore(
        at=meal.at,
        kind=kind,
        dong=meal.dong,
        people=meal.people,
        region=region,
        main=main,
        variations=variations,
    )


def situation_list() -> list[SituationOut]:
    return [
        SituationOut(key=s.key, emoji=s.emoji, label=s.label, reason=s.reason)
        for s in SITUATIONS.values()
    ]


async def build_score(yumi: YumiClient, request: ScoreRequest) -> Score:
    meals = await asyncio.gather(*(_score_meal(yumi, meal) for meal in request.meals))
    return Score(situations=situation_list(), meals=list(meals))
