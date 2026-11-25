"""유미 검색 필터를 매장 데이터로 판정한다.

두 군데서 쓴다.
  - mock: 유미 API 가 필터로 거르는 동작을 흉내 낸다
  - 악보 만들기: 끼니마다 넓게 한 번 검색한 결과를 상황 6개로 나눌 때 (요청을 아끼려고)
"""

import math

from app.yumi.models import LatLng, Place

# 마에스트로가 쓰는 필터. 여기 없는 이름을 쓰면 오타일 수 있어서 바로 알려준다.
# (실제 유미 API 에는 더 많은 필터가 있다 - GET /api/v1/meta)
SUPPORTED_FILTERS = {
    "keyword",
    "subtype",
    "atmosphere",
    "serves",
    "dietary",
    "parking",
    "reservable",
    "private_room",
    "open_at",
}


def distance_m(a: LatLng, b: LatLng) -> float:
    """두 좌표 사이 거리(m) - 하버사인 공식."""
    lat1, lat2 = math.radians(a.lat), math.radians(b.lat)
    d_lat = lat2 - lat1
    d_lng = math.radians(b.lng - a.lng)
    h = (
        math.sin(d_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(d_lng / 2) ** 2
    )
    return 2 * 6_371_000 * math.asin(math.sqrt(h))


def _split(value: str | bool) -> list[str]:
    return [v.strip() for v in str(value).split(",") if v.strip()]


def matches(place: Place, filters: dict[str, str | bool]) -> bool:
    attrs = place.service_attributes
    for name, value in filters.items():
        if name not in SUPPORTED_FILTERS:
            raise ValueError(
                f"모르는 필터예요: {name!r} (지원: {sorted(SUPPORTED_FILTERS)})"
            )
        if name == "keyword":
            menu = place.menu_summary.items if place.menu_summary else []
            text = " ".join([place.name, place.ai_summary or "", *menu])
            if str(value) not in text:
                return False
        elif name == "subtype":
            # 쉼표 = 하나라도 맞으면 (OR)
            if attrs.get("venue_subtype") not in _split(value):
                return False
        elif name == "atmosphere":
            # 쉼표 = 하나라도 맞으면. 실제 API 에서는 soft(순위만 올림)지만 여기서는 꼭 맞아야 한다
            if not set(_split(value)) & set(place.atmosphere):
                return False
        elif name == "serves":
            # 쉼표 = 전부 있어야 (AND)
            if not set(_split(value)) <= set(attrs.get("serves", [])):
                return False
        elif name == "dietary":
            dietary = attrs.get("dietary", {})
            if not all(dietary.get(key) for key in _split(value)):
                return False
        elif name == "open_at":
            # 시각은 따지지 않고 '지금 영업 중'으로만 본다 (실제 API 는 그 시각 영업시간으로 거른다)
            if place.open_now and place.open_now.open is False:
                return False
        elif value is True and attrs.get(name) is not True:
            # parking / reservable / private_room - true 를 붙이면 확인된 곳만
            return False
    return True
