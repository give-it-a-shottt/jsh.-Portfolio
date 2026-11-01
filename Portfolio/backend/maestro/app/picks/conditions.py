"""홈의 상황 칩 6개 → 매장이 그 조건에 맞는지.

2026-11-01 실제 유미 응답(동네 4곳 × 추천순 100곳)에 있는 값으로 판정한다.
  recommendedFor   solo_dining, date, group_dining …
  atmosphere       quiet, cozy, trendy, traditional …
  serviceAttributes.waiting_expected / venue_subtype
  price.avg        1인 평균 가격(원)
  nearestStation   가장 가까운 역과 도보 분
기준은 tests/test_picks.py — 조건을 바꾸면 테스트도 같이 바꾼다.
"""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal

from app.yumi.models import Place

ConditionKey = Literal["rain", "solo", "quiet", "nowait", "light", "budget"]

RAIN_WALK_MIN = 3  # 분. 역에서 이만큼 안이면 비를 덜 맞는다
LIGHT_SUBTYPES = {
    "noodles",
    "bunsik",
    "salad_healthy",
    "sandwich_deli",
    "gukbap_soup",
    "jjigae",
    "lunchbox",
    "brunch",
    "bakery",
}
LIGHT_AVG_PRICE = 12_000  # 원
BUDGET_AVG_PRICE = 20_000  # 원


def _near_station(place: Place) -> bool:
    station = place.nearest_station
    return station is not None and station.walk_min <= RAIN_WALK_MIN


def _solo(place: Place) -> bool:
    return "solo_dining" in place.recommended_for


def _quiet(place: Place) -> bool:
    return bool({"quiet", "cozy"} & set(place.atmosphere))


def _no_wait(place: Place) -> bool:
    return not place.service_attributes.get("waiting_expected")


def _avg_price(place: Place) -> int | None:
    return place.price.avg if place.price else None


def _light(place: Place) -> bool:
    if place.service_attributes.get("venue_subtype") in LIGHT_SUBTYPES:
        return True
    avg = _avg_price(place)
    return avg is not None and avg <= LIGHT_AVG_PRICE


def _budget(place: Place) -> bool:
    avg = _avg_price(place)
    return avg is not None and avg <= BUDGET_AVG_PRICE


@dataclass(frozen=True)
class Condition:
    key: ConditionKey
    label: str
    hint: str  # (?) 툴팁 — 무엇을 보고 맞다고 했는지
    test: Callable[[Place], bool]


CONDITIONS: dict[ConditionKey, Condition] = {
    c.key: c
    for c in [
        Condition(
            "rain", "비 와", f"역에서 걸어서 {RAIN_WALK_MIN}분 안이에요", _near_station
        ),
        Condition("solo", "혼밥", "혼밥하기 좋다는 리뷰가 많아요", _solo),
        Condition("quiet", "조용히", "조용하거나 아늑한 분위기예요", _quiet),
        Condition(
            "nowait", "웨이팅 싫어", "줄 서는 곳으로 알려지지 않았어요", _no_wait
        ),
        Condition(
            "light",
            "가볍게",
            "면 · 국밥 · 분식처럼 가볍거나 1만 2천 원 이하예요",
            _light,
        ),
        Condition("budget", "1인 2만 원 이하", "1인 평균 2만 원 이하예요", _budget),
    ]
}


def matched(place: Place, keys: list[ConditionKey]) -> list[ConditionKey]:
    return [key for key in keys if CONDITIONS[key].test(place)]
