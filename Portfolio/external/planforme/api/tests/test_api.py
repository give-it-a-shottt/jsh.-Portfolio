"""플로우 A(플랜 생성 → 오늘 할 일)와 플로우 B(진행량 입력 → 재계산)를 API로 확인한다."""

from datetime import timedelta

from fastapi.testclient import TestClient

from main import app
from timeutil import today_kst

EVERYDAY = list(range(7))


def _book(client, pages=100, days=10, **extra):
    today = today_kst()
    body = {
        "type": "book",
        "title": "모던 자바스크립트 Deep Dive",
        "start_date": today.isoformat(),
        "end_date": (today + timedelta(days=days - 1)).isoformat(),
        "weekdays": EVERYDAY,
        "current_page": 1,
        "last_page": pages,
        **extra,
    }
    return client.post("/plans", json=body)


def test_preview_and_validation():
    with TestClient(app) as client:
        today = today_kst()
        body = {
            "type": "lecture",
            "title": "React 완벽 가이드",
            "start_date": today.isoformat(),
            "end_date": (today + timedelta(days=7)).isoformat(),
            "weekdays": EVERYDAY,
            "total_lectures": 45,
            "avg_minutes": 30,
        }
        res = client.post("/plans/preview", json=body)
        assert res.status_code == 200
        data = res.json()
        assert data["valid_days"] == 8
        assert data["daily_amount"] == 6
        assert data["overload"] is True
        assert data["extend_weeks"] == 1 and data["extend_daily"] == 3

        bad = {**body, "end_date": (today - timedelta(days=1)).isoformat()}
        assert client.post("/plans/preview", json=bad).status_code == 422


def test_flow_create_complete_replan():
    with TestClient(app) as client:
        res = _book(client, pages=100, days=10)
        assert res.status_code == 201
        plan = res.json()
        assert plan["daily_amount"] == 10 and plan["total_amount"] == 100

        today = client.get("/today").json()
        task = next(t for t in today["tasks"] if t["plan_id"] == plan["id"])
        assert (task["target_start"], task["target_end"]) == (1, 10)

        # 목표(10p)보다 덜 읽음 → 5p
        res = client.post(f"/tasks/{task['id']}/complete", json={"actual_end": 5})
        assert res.status_code == 200
        done = res.json()
        assert done["diff"] == -5
        sugg = done["suggestion"]
        assert sugg["remaining_amount"] == 95 and sugg["remaining_days"] == 9
        assert sugg["new_daily"] == 11

        # 재계산 → 내일부터 6p부터 다시 나눈다
        res = client.post(f"/plans/{plan['id']}/replan")
        assert res.status_code == 200
        assert res.json()["daily_amount"] == 11
        detail = client.get(f"/plans/{plan['id']}").json()
        assert detail["progress"] == 5

        tomorrow = (today_kst() + timedelta(days=1)).isoformat()
        nxt = [t for t in client.get("/tasks", params={"date": tomorrow}).json() if t["plan_id"] == plan["id"]]
        assert nxt[0]["target_start"] == 6


def test_finish_marks_plan_done_and_delete():
    with TestClient(app) as client:
        plan = _book(client, pages=20, days=2).json()
        task = next(t for t in client.get("/today").json()["tasks"] if t["plan_id"] == plan["id"])
        client.post(f"/tasks/{task['id']}/complete", json={"actual_end": 20})
        assert client.get(f"/plans/{plan['id']}").json()["status"] == "done"

        assert client.delete(f"/plans/{plan['id']}").status_code == 204
        assert client.get(f"/plans/{plan['id']}").status_code == 404


def test_overdue_cleared_after_replan():
    with TestClient(app) as client:
        start = today_kst() - timedelta(days=3)
        plan = client.post(
            "/plans",
            json={
                "type": "lecture",
                "title": "밀린 강의",
                "start_date": start.isoformat(),
                "end_date": (start + timedelta(days=13)).isoformat(),
                "weekdays": EVERYDAY,
                "total_lectures": 28,
                "avg_minutes": 20,
            },
        ).json()
        overdue_ids = lambda: {o["plan_id"] for o in client.get("/today").json()["overdue"]}  # noqa: E731
        assert plan["id"] in overdue_ids()

        assert client.post(f"/plans/{plan['id']}/replan").status_code == 200
        assert plan["id"] not in overdue_ids()


def test_insights_endpoints():
    with TestClient(app) as client:
        today = today_kst()
        assert client.get("/stats", params={"period": "week"}).status_code == 200
        assert client.get("/stats", params={"period": "month"}).status_code == 200
        assert client.get("/notifications").status_code == 200
        res = client.get("/calendar", params={"year": today.year, "month": today.month})
        assert res.status_code == 200
