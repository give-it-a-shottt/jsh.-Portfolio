"""real 클라이언트 — 가짜 유미 서버(httpx.MockTransport)로 확인한다. 실제 네트워크는 쓰지 않는다."""

import asyncio
from datetime import datetime, timedelta, timezone

import httpx
import pytest

from app.yumi.client import NearbyQuery, PlaceNotFound, YumiError
from app.yumi.models import ReservationRequest
from app.yumi.real import RealYumiClient

KST = timezone(timedelta(hours=9))

PLACE = {
    "id": "1319831936",
    "name": "청와옥 을지로3가직영점",
    "location": {"lat": 37.566, "lng": 126.990},
    "distanceM": 83,
    "reputation": {"cross_source_confirmed": True, "recently_active": True},
}


class FakeYumi:
    """요청을 기록하고, 정해 둔 응답을 돌려주는 가짜 유미."""

    def __init__(self, responses: list[httpx.Response] | None = None) -> None:
        self.requests: list[httpx.Request] = []
        self.responses = responses or []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        if self.responses:
            return self.responses.pop(0)
        return httpx.Response(200, json={"success": True, "data": [PLACE], "meta": {}})


def client(fake: FakeYumi) -> RealYumiClient:
    return RealYumiClient(
        "hmp_test", "https://api.test", transport=httpx.MockTransport(fake)
    )


def nearby(**filters):
    return NearbyQuery(lat=37.5662, lng=126.991, filters=filters, fields="core")


def test_search_sends_key_in_header_and_unwraps_data():
    fake = FakeYumi()

    [place] = asyncio.run(client(fake).search_nearby(nearby(reservable=True)))

    request = fake.requests[0]
    assert request.headers["Authorization"] == "Bearer hmp_test"
    assert "hmp_test" not in str(request.url)  # 키는 주소에 넣지 않는다
    assert request.url.params["reservable"] == "true"
    assert place.name == "청와옥 을지로3가직영점"
    assert place.reputation.cross_source_confirmed


def test_same_search_is_cached():
    fake = FakeYumi()
    yumi = client(fake)

    async def twice():
        await yumi.search_nearby(nearby(subtype="noodles"))
        await yumi.search_nearby(nearby(subtype="noodles"))

    asyncio.run(twice())

    assert len(fake.requests) == 1


def test_rate_limit_waits_and_retries_once():
    fake = FakeYumi([httpx.Response(429, headers={"Retry-After": "0"})])

    places = asyncio.run(client(fake).search_nearby(nearby()))

    assert len(fake.requests) == 2
    assert places


def test_missing_place_is_not_found():
    fake = FakeYumi([httpx.Response(404, json={"success": False})])

    with pytest.raises(PlaceNotFound):
        asyncio.run(client(fake).get_place("nope"))


def test_bad_key_is_reported():
    fake = FakeYumi([httpx.Response(401, json={"success": False})])

    with pytest.raises(YumiError):
        asyncio.run(client(fake).search_nearby(nearby()))


def test_empty_key_is_refused():
    with pytest.raises(YumiError):
        RealYumiClient("", "https://api.test")


def test_owner_calls_never_reach_yumi():
    """실시간 문의·예약은 실제 사장님께 보내지 않는다 — HTTP 요청이 0개여야 한다."""
    fake = FakeYumi()
    yumi = client(fake)

    async def ask_and_book():
        asked = await yumi.ask_live_status("1319831936", "wait", "wait")
        booked = await yumi.request_reservation(
            ReservationRequest(
                place_id="1319831936",
                reservation_time=datetime(2026, 10, 17, 18, tzinfo=KST),
                guest_count=2,
                guest_phone="010-0000-0000",
            )
        )
        return asked, booked

    asked, booked = asyncio.run(ask_and_book())

    assert fake.requests == []
    assert asked.simulated and booked.simulated


def test_timeout_is_retried_then_reported():
    def always_slow(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("slow", request=request)

    yumi = RealYumiClient(
        "hmp_test", "https://api.test", transport=httpx.MockTransport(always_slow)
    )

    with pytest.raises(YumiError) as exc:
        asyncio.run(yumi.search_nearby(nearby()))
    assert exc.value.status_code == 504


def test_null_lists_and_odd_places_are_tolerated():
    odd = {"id": "x", "name": "좌표 없는 곳"}  # location 이 없어 모델에 맞지 않는다
    loose = {**PLACE, "atmosphere": None, "serviceAttributes": None}
    fake = FakeYumi([httpx.Response(200, json={"success": True, "data": [loose, odd]})])

    [place] = asyncio.run(client(fake).search_nearby(nearby()))

    assert place.atmosphere == []
    assert place.service_attributes == {}


def test_daily_quota_is_not_waited_for():
    fake = FakeYumi([httpx.Response(429, headers={"Retry-After": "54803"})])

    with pytest.raises(YumiError) as exc:
        asyncio.run(client(fake).search_nearby(nearby()))

    assert exc.value.status_code == 429
    assert len(fake.requests) == 1  # 몇 시간을 기다리거나 다시 보내지 않는다


@pytest.mark.parametrize(
    "response",
    [
        httpx.Response(200, text="<html>점검 중</html>"),
        httpx.Response(200, json={"success": True}),
        httpx.Response(200, json={"success": True, "data": {"items": []}}),
    ],
)
def test_unexpected_body_is_a_yumi_error(response):
    """봉투 모양이 달라도 500 이 아니라 YumiError — 결과 화면이 저장본으로 대신할 수 있게."""
    with pytest.raises(YumiError):
        asyncio.run(client(FakeYumi([response])).search_nearby(nearby()))
