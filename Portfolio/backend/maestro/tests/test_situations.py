"""3단계 채점표 - app/situations.py 를 채우면 통과한다.

기준이 기획과 다르면 테스트를 고쳐도 된다. 테스트도 기획의 일부다.
실행: uv run pytest tests/test_situations.py -v
"""

import asyncio

import pytest

from app.situations import (
    CAFE_SUBTYPES,
    SEARCH_PAGE_SIZE,
    SEARCH_RADIUS,
    SITUATIONS,
    Situation,
)
from app.yumi.client import NearbyQuery
from app.yumi.mock import MockYumiClient
from app.yumi.models import LatLng, Place

# 테스트 이름에 한글을 쓰면 깨져 보여서 영문 키를 쓴다
AREAS = {
    "euljiro": LatLng(lat=37.5663, lng=126.9917),  # 을지로
    "seongsu": LatLng(lat=37.5446, lng=127.0557),  # 성수
}
yumi = MockYumiClient()


def search(center: LatLng, **filters) -> list[Place]:
    """악보 만들기처럼 끼니마다 한 번 넓게 검색한다."""
    query = NearbyQuery(
        lat=center.lat,
        lng=center.lng,
        radius=SEARCH_RADIUS,
        page_size=SEARCH_PAGE_SIZE,
        filters={"open_at": "now", **filters},
    )
    return asyncio.run(yumi.search_nearby(query))


def candidates(situation: Situation, center: LatLng) -> list[Place]:
    return [place for place in search(center) if situation.fits(place)]


# 상황마다 "고른 곳이 모두 이래야 한다"
EXPECTED = {
    "stuffy": lambda p: (
        p.service_attributes["venue_subtype"]
        in {"gukbap_soup", "noodles", "salad_healthy"}
    ),
    "rain": lambda p: p.distance_m <= 300,
    "mood": lambda p: bool({"quiet", "cozy"} & set(p.atmosphere)),
    "waiting": lambda p: (
        p.service_attributes["reservable"]
        and not p.service_attributes.get("waiting_expected")
    ),
    "budget": lambda p: p.price.avg <= 12_000,
    "tired": lambda p: p.service_attributes["private_room"],
}


def test_every_situation_is_defined():
    assert set(SITUATIONS) == set(EXPECTED)


@pytest.mark.parametrize("area", AREAS)
@pytest.mark.parametrize("key", EXPECTED)
def test_situation_finds_three_fitting_places(key, area):
    places = candidates(SITUATIONS[key], AREAS[area])

    # 대안 3곳을 보여줘야 하니 3곳 이상
    assert len(places) >= 3, f"{area}에서 {len(places)}곳뿐이에요"
    misfits = [p.name for p in places if not EXPECTED[key](p)]
    assert not misfits, f"상황과 맞지 않는 곳: {misfits}"


def test_cafe_meal_looks_for_cafes():
    cafes = search(AREAS["euljiro"], subtype=CAFE_SUBTYPES)
    places = [p for p in cafes if SITUATIONS["mood"].fits(p, cafe=True)]

    assert places
    assert all(
        p.service_attributes["venue_subtype"] in {"coffee", "traditional_tea"}
        for p in places
    )
