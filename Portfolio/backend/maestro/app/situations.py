"""당일 모드의 상황(변수) 6개 → 매장을 고르는 조건.

유미 하루 한도가 70요청이라, 상황마다 검색하지 않는다. 끼니마다 넓게 한 번 검색하고
(추천순 100곳, edge 등급까지), 그 결과 안에서 상황별 조건으로 고른다 - situation.fits().
  1) filters: 유미 필터 이름 그대로 쓴 조건 (app/yumi/filters.py 가 매장 데이터로 판정)
  2) radius: 검색 중심에서 이 거리 안
  3) accept: 필터로 표현하기 어려운 조건 (예: 가격 - 유미에 가격 필터가 없다)

쓸 수 있는 필터 (전체 목록은 GET /api/v1/meta, mock 은 app/yumi/mock.py 의 SUPPORTED_FILTERS)
  subtype      쉼표 = 하나라도.  gukbap_soup(국밥·곰탕), noodles, salad_healthy, korean, korean_bbq,
               chinese, japanese, italian, coffee, dessert, bakery, tea, traditional_tea …
  atmosphere   soft 필터 - 맞는 곳을 위로 올릴 뿐 빼지는 않는다. 꼭 맞아야 하면 accept 로 한 번 더 거른다
  serves       쉼표 = 전부.      coffee, alcohol, dessert, vegetarian, vegan
  dietary      쉼표 = 전부.      vegan_options, vegetarian_options, fully_vegan
  parking / reservable / private_room …   True 를 붙이면 확인된 곳만
매장에 있는 값: place.price (level 1~4, avg 원), place.distance_m, place.service_attributes[...]
  실제 데이터: 1만원대 국밥집이 level 2 다. 그래서 '저렴'은 평균 가격으로 본다.
  실제 데이터: 인기 국밥집은 service_attributes.waiting_expected=True 다 - 웨이팅 상황에서 뺀다.
기준은 tests/test_situations.py - 상황을 바꾸면 테스트도 같이 바꾼다.
"""

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Literal

from app.yumi.filters import matches
from app.yumi.models import Place

SituationKey = Literal["stuffy", "rain", "mood", "waiting", "budget", "tired"]

# 변주 카드에 보여줄 정보(영업시간·분위기·요약·검증 근거)가 edge 등급까지라 그만큼 받는다.
# 요청 1번 값 = 고른 등급 중 가장 비싼 것 → 4토큰. 사진(media, 8토큰)은 받지 않는다.
VARIATION_FIELDS = "core,contact_hours,quality,edge"
# 끼니마다 한 번 검색하는 범위 - 상황별 반경 중 가장 넓은 것
SEARCH_RADIUS = 1000
SEARCH_PAGE_SIZE = 100  # 유미 최대. 요금은 요청 단위라 많이 받아도 같다

# 카페 시간대 끼니는 카페끼리 대안을 찾는다
CAFE_SUBTYPES = "coffee,dessert,bakery,tea,traditional_tea,juice_fruit,brunch"
# 카페에서 속이 더부룩하면 커피 대신 차
CAFE_LIGHT_SUBTYPES = "tea,traditional_tea,juice_fruit"

CHEAP_AVG_PRICE = 12_000  # 원


def _accept_all(place: Place) -> bool:
    return True


def _is_cheap(place: Place) -> bool:
    price = place.price
    if price is None:
        return False
    if price.avg is not None:
        return price.avg <= CHEAP_AVG_PRICE
    return price.level is not None and price.level <= 1


def _is_calm(place: Place) -> bool:
    return bool({"quiet", "cozy"} & set(place.atmosphere))


def _no_queue(place: Place) -> bool:
    return not place.service_attributes.get("waiting_expected")


@dataclass(frozen=True)
class Situation:
    key: SituationKey
    emoji: str
    label: str
    reason: str  # 변주 결과 화면의 한 줄 - 어떤 곳으로 골랐는지
    filters: dict[str, str | bool] = field(default_factory=dict)
    radius: int = 1000
    accept: Callable[[Place], bool] = _accept_all

    def fits(self, place: Place, cafe: bool = False) -> bool:
        """이 상황의 대안이 될 수 있는 매장인가."""
        filters = dict(self.filters)
        if cafe:
            # 카페 끼니: 이미 카페만 검색했다. 속이 더부룩하면 커피 대신 차
            filters.pop("subtype", None)
            if self.key == "stuffy":
                filters["subtype"] = CAFE_LIGHT_SUBTYPES
        near = place.distance_m is None or place.distance_m <= self.radius
        return near and matches(place, filters) and self.accept(place)


SITUATIONS: dict[SituationKey, Situation] = {
    situation.key: situation
    for situation in [
        Situation(
            "stuffy",
            "😮‍💨",
            "속이 더부룩해",
            "담백하고 소화가 편한 곳으로 골랐어요",
            filters={"subtype": "gukbap_soup,noodles,salad_healthy"},
        ),
        Situation(
            "rain",
            "🌧️",
            "비 와",
            "비를 덜 맞게 아주 가까운 곳으로 골랐어요",
            radius=300,
        ),
        Situation(
            "mood",
            "🤗",
            "기분 별로야",
            "조용하고 아늑한 곳으로 골랐어요",
            filters={"atmosphere": "quiet,cozy"},
            accept=_is_calm,
        ),
        Situation(
            "waiting",
            "⏳",
            "웨이팅 너무 길어",
            "예약되고 줄이 길지 않은 곳으로 골랐어요",
            filters={"reservable": True},
            accept=_no_queue,
        ),
        Situation(
            "budget",
            "💸",
            "예산 초과했어",
            "1만원 초반으로 먹을 수 있는 곳으로 골랐어요",
            accept=_is_cheap,
        ),
        Situation(
            "tired",
            "🥱",
            "일행이 지쳤어",
            "룸이 있어 편히 쉬어 갈 수 있는 곳으로 골랐어요",
            filters={"private_room": True},
        ),
    ]
}
