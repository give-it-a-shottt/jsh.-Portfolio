"""리뉴얼 결과 화면 — 영업시간 · 후보 고르기 · 저장본 대체 · 자리 묻기.

영업시간 · 고르기 규칙은 직접 만든 매장으로, 동네별 개수는 저장본(실제 유미 데이터)으로 확인한다.
"""

import asyncio

import pytest

from app.core.config import Settings, get_settings
from app.main import app
from app.picks import hours, service
from app.picks.service import DEMO_TIMES, DONGS, build_picks
from app.yumi import mock
from app.yumi.client import NearbyQuery, YumiError
from app.yumi.deps import get_yumi_client
from app.yumi.mock import MockYumiClient, seat_answer
from app.yumi.models import Place

DAY = "mon"


def place(pid: str, *segments: tuple[str, str], **extra) -> Place:
    """월요일 영업 구간만 있는 식당. segments = (open, close) …"""
    data = {
        "id": pid,
        "name": f"{pid} 식당",
        "category": "restaurant",
        "location": {"lat": 37.566, "lng": 126.991},
        "sourceCount": 3,
        "businessHours": [
            {
                "day": DAY,
                "open": segments[0][0],
                "close": segments[-1][1],
                "segments": [{"open": o, "close": c} for o, c in segments],
            }
        ],
    }
    return Place.model_validate(data | extra)


def at(hhmm: str) -> int:
    return hours.to_minutes(hhmm)


# ── 영업시간 ──────────────────────────────────────────────────────────


def test_break_time_is_announced_before_remaining_hours():
    lunch_dinner = place("a", ("11:00", "15:00"), ("17:00", "21:00"))

    status = hours.status_at(lunch_dinner, DAY, at("12:40"))

    assert status.kind == "open"
    assert status.next_change == "15:00 브레이크 전까지 2시간 20분"


def test_during_break_it_says_when_it_reopens():
    lunch_dinner = place("a", ("11:00", "15:00"), ("17:00", "21:00"))

    status = hours.status_at(lunch_dinner, DAY, at("16:00"))

    assert status.kind == "opens"
    assert status.label == "17:00 열어요"
    assert status.next_change == "1시간 뒤 다시 열어요"
    assert status.short == "17시 열어요"


def test_last_hour_is_closing_soon():
    status = hours.status_at(place("a", ("11:00", "21:00")), DAY, at("20:20"))

    assert status.kind == "closing"
    assert status.label == "40분 남음"


def test_past_last_order_counts_as_closing():
    pub = place("a", ("17:00", "02:00"))
    pub.business_hours[0].segments[0].last_order = "01:00"

    status = hours.status_at(pub, DAY, at("23:00"))
    assert status.kind == "open"
    assert status.next_change == "02:00까지 쉬는 시간 없이 열어요"

    late = hours.status_at(pub, "tue", at("01:10"))  # 화요일 새벽 = 월요일 밤 영업
    assert late.label == "주문 마감"


def test_overnight_segment_crosses_midnight():
    pub = place("a", ("18:00", "02:00"))

    assert hours.segments(pub, DAY)[0] == hours.Segment(1080, 1560)
    assert hours.is_open(pub, "tue", at("01:30"))
    assert not hours.is_open(pub, "tue", at("02:30"))


# ── 고르기 ────────────────────────────────────────────────────────────


def picks(places, keys=(), when="12:40", auto=False):
    return build_picks(
        list(places), "snapshot", "euljiro", DAY, at(when), list(keys), auto
    )


def test_closed_and_non_restaurants_are_never_picked():
    places = [
        place("open1", ("10:00", "22:00")),
        place("open2", ("10:00", "22:00")),
        place("gone", ("10:00", "22:00"), possiblyClosed=True),
        place("cafe", ("10:00", "22:00"), category="cafe"),
        place("open3", ("10:00", "22:00")),
    ]

    result = picks(places)

    assert result.state == "ok"
    assert [p.place.id for p in result.picks] == ["open1", "open2", "open3"]


def test_more_map_sources_rank_higher():
    places = [
        place("two", ("10:00", "22:00"), sourceCount=2),
        place("five", ("10:00", "22:00"), sourceCount=5),
        place("three", ("10:00", "22:00"), sourceCount=3),
    ]

    assert [p.place.id for p in picks(places).picks] == ["five", "three", "two"]


def test_few_matches_offer_dropping_a_condition():
    solo = {"recommendedFor": ["solo_dining"]}
    places = [
        place("solo-quiet", ("10:00", "22:00"), atmosphere=["quiet"], **solo),
        place("solo1", ("10:00", "22:00"), **solo),
        place("solo2", ("10:00", "22:00"), **solo),
        place("plain", ("10:00", "22:00")),
    ]

    result = picks(places, keys=["solo", "quiet"])

    assert result.state == "few"
    assert [p.place.id for p in result.picks] == ["solo-quiet"]
    # '조용히'를 빼면 혼밥만 맞는 2곳이 더 나온다
    assert [(r.key, r.more) for r in result.relax] == [("quiet", 2)]


def test_no_full_match_shows_best_partial_with_unmatched():
    places = [place(f"p{i}", ("10:00", "22:00")) for i in range(3)]

    result = picks(places, keys=["solo"])

    assert result.state == "few"
    assert len(result.picks) == 3
    assert result.picks[0].unmatched == ["solo"]


def test_nothing_open_shows_the_earliest_openers():
    places = [
        place("late", ("20:00", "23:00")),
        place("soon", ("17:00", "22:00")),
        place("mid", ("18:00", "22:00")),
        place("done", ("08:00", "11:00")),
    ]

    result = picks(places, when="16:00")

    assert result.state == "none"
    assert [p.place.id for p in result.picks] == ["soon", "mid", "late"]
    assert result.picks[0].status.label == "17:00 열어요"


def test_now_switches_to_the_nearest_demo_time_when_too_few_are_open():
    places = [place(f"p{i}", ("18:00", "23:00")) for i in range(3)]

    result = picks(places, when="04:00", auto=True)

    # 새벽 4시에서 가장 가까운 시연 시각은 (자정을 넘어 거꾸로) 22:00
    assert result.switched_from == "04:00"
    assert result.at == "22:00"
    assert result.state == "ok"


# ── 저장본(실제 유미 데이터) ─────────────────────────────────────────────


@pytest.mark.parametrize("dong", list(DONGS))
@pytest.mark.parametrize("day", hours.DAYS)
def test_snapshot_has_three_open_places_at_every_demo_time(dong, day):
    places = service._snapshot()[dong]

    for demo in DEMO_TIMES:
        result = build_picks(places, "snapshot", dong, day, at(demo), [], False)
        assert result.state == "ok", (dong, day, demo)


# ── API · 유미가 실패할 때 ─────────────────────────────────────────────


class BrokenYumi(MockYumiClient):
    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        raise YumiError(429, "하루 한도를 다 썼어요")


class LiveYumi(MockYumiClient):
    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        return [place(f"live{i}", ("00:00", "24:00")) for i in range(3)]


@pytest.fixture
def real_mode(client):
    service.clear_cache()
    app.dependency_overrides[get_settings] = lambda: Settings(
        yumi_mode="real", yumi_api_key="test-key"
    )
    yield client
    service.clear_cache()


def test_real_mode_uses_live_yumi_data(real_mode):
    app.dependency_overrides[get_yumi_client] = LiveYumi

    body = real_mode.get(
        "/api/picks", params={"dong": "euljiro", "at": "12:40", "day": DAY}
    ).json()

    assert body["source"] == "live"
    assert body["picks"][0]["place"]["id"] == "live0"


def test_yumi_failure_falls_back_to_the_snapshot(real_mode):
    app.dependency_overrides[get_yumi_client] = BrokenYumi

    response = real_mode.get("/api/picks", params={"dong": "euljiro", "at": "12:40"})

    assert response.status_code == 200
    assert response.json()["source"] == "snapshot"
    assert response.json()["state"] == "ok"


def test_mock_mode_never_calls_yumi(client):
    app.dependency_overrides[get_yumi_client] = BrokenYumi

    body = client.get(
        "/api/picks", params={"dong": "seongsu", "at": "19:30", "s": ["solo", "budget"]}
    ).json()

    assert body["source"] == "snapshot"
    assert body["conditions"][0]["label"] == "비 와"
    assert all(
        set(p["matched"]) | set(p["unmatched"]) == {"solo", "budget"}
        for p in body["picks"]
    )


def test_bad_inputs_are_422(client):
    assert client.get("/api/picks", params={"dong": "gangnam"}).status_code == 422
    assert (
        client.get("/api/picks", params={"dong": "euljiro", "at": "25:00"}).status_code
        == 422
    )
    assert (
        client.get("/api/picks", params={"dong": "euljiro", "s": "snow"}).status_code
        == 422
    )


def test_place_detail_comes_from_the_same_search(client):
    first = client.get("/api/picks", params={"dong": "ikseon", "at": "19:30"}).json()[
        "picks"
    ][0]

    detail = client.get(
        f"/api/picks/ikseon/places/{first['place']['id']}", params={"at": "19:30"}
    ).json()

    assert detail["pick"]["place"]["name"] == first["place"]["name"]
    assert detail["hoursText"].startswith(("매일", "오늘"))
    assert detail["pick"]["evidence"]["items"]


def test_unknown_place_is_404(client):
    assert client.get("/api/picks/ikseon/places/nope").status_code == 404


def test_seat_ask_answer_is_fixed_per_place(client):
    pid = "1041090663"
    asked = client.post(
        f"/api/picks/places/{pid}/seat-ask", json={"people": 3, "when": "30min"}
    ).json()
    assert asked["status"] == "pending"
    assert asked["topic"] == "3명 · 30분 뒤"
    assert asked["simulated"] is True

    answered = client.get(
        f"/api/live-status/{asked['queryId']}", params={"wait": 1}
    ).json()

    assert answered["status"] == seat_answer(pid)[0]


class CountingBrokenYumi(MockYumiClient):
    calls = 0

    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        CountingBrokenYumi.calls += 1
        raise YumiError(502, "유미 장애")


class SlowYumi(MockYumiClient):
    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        await asyncio.sleep(1)
        return [place("slow", ("00:00", "24:00"))]


def test_real_mode_without_key_uses_the_snapshot(client):
    """배포에서 키를 빠뜨려도 502 가 아니라 저장본 — 자리 묻기 흉내도 그대로 된다."""
    service.clear_cache()
    app.dependency_overrides.pop(get_yumi_client)
    # .env 의 키를 읽지 않게 빈 값으로 못 박는다 (실제 유미를 부르면 안 된다)
    app.dependency_overrides[get_settings] = lambda: Settings(
        yumi_mode="real", yumi_api_key=""
    )

    picks = client.get("/api/picks", params={"dong": "euljiro", "at": "12:40"})
    asked = client.post("/api/picks/places/1041090663/seat-ask", json={})

    assert picks.status_code == 200
    assert picks.json()["source"] == "snapshot"
    assert asked.status_code == 200


def test_yumi_failure_is_remembered_for_a_while(real_mode):
    CountingBrokenYumi.calls = 0
    app.dependency_overrides[get_yumi_client] = CountingBrokenYumi

    for _ in range(3):
        body = real_mode.get("/api/picks", params={"dong": "seongsu"}).json()
        assert body["source"] == "snapshot"

    assert CountingBrokenYumi.calls == 1


def test_slow_yumi_falls_back_to_the_snapshot(real_mode, monkeypatch):
    monkeypatch.setattr(service, "LIVE_TIMEOUT_SECONDS", 0.05)
    app.dependency_overrides[get_yumi_client] = SlowYumi

    body = real_mode.get("/api/picks", params={"dong": "yeonnam"}).json()

    assert body["source"] == "snapshot"


def test_seat_ask_rejects_bad_inputs(client):
    url = "/api/picks/places/1041090663/seat-ask"
    assert client.post(url, json={"people": 0}).status_code == 422
    assert client.post(url, json={"people": 11}).status_code == 422
    assert client.post(url, json={"when": "tomorrow"}).status_code == 422
    too_long = "a" * 65
    assert (
        client.post(f"/api/picks/places/{too_long}/seat-ask", json={}).status_code
        == 422
    )


def test_unknown_seat_answer_is_404(client):
    assert client.get("/api/live-status/mock-q-nope").status_code == 404


def test_old_seat_questions_are_forgotten(monkeypatch):
    monkeypatch.setattr(mock, "MAX_QUERIES", 2)
    yumi = MockYumiClient()

    first = asyncio.run(yumi.simulate_seat_ask("a", "2명 · 지금"))
    for pid in ("b", "c"):
        asyncio.run(yumi.simulate_seat_ask(pid, "2명 · 지금"))

    with pytest.raises(Exception, match=first.query_id):
        asyncio.run(yumi.get_live_status(first.query_id))
