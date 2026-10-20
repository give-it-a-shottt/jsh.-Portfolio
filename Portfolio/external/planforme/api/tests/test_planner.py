"""IA 04 · 계산 로직 페이지의 예시를 그대로 테스트로 옮겼다."""

from datetime import date

import planner

WEEKDAYS = {0, 1, 2, 3, 4}
EVERYDAY = set(range(7))


def test_valid_days_weekdays_only():
    # 10/19(월) ~ 10/30(금), 평일만 → D = 10
    days = planner.valid_days(date(2026, 10, 19), date(2026, 10, 30), WEEKDAYS)
    assert len(days) == 10


def test_book_split_ceil_and_last_day_smaller():
    # 100p를 3일 → 34p / 34p / 32p
    assert planner.split_amount(100, 3) == [34, 34, 32]


def test_book_schedule_ranges():
    days = [date(2026, 10, 19), date(2026, 10, 20), date(2026, 10, 21)]
    items = planner.build_unit_schedule(1, 100, days)
    assert [(i.target_start, i.target_end) for i in items] == [(1, 34), (35, 68), (69, 100)]


def test_lecture_daily_count_and_minutes():
    # 45강 · D = 15 · 30분 → 하루 3강 (약 90분)
    v = planner.daily_of(45, 15)
    assert v == 3
    assert v * 30 == 90


def test_routine_total_count():
    # 2주 · 매일 → 총 14회
    days = planner.valid_days(date(2026, 10, 19), date(2026, 11, 1), EVERYDAY)
    assert len(planner.build_routine_schedule(days)) == 14


def test_replan_daily():
    # 남은 215p · 남은 8일 → 하루 27p
    assert planner.daily_of(215, 8) == 27


def test_zero_amount_days_are_skipped():
    # 5p를 4일 → 2/2/1/0 → 마지막 날은 할 일을 만들지 않는다
    days = planner.valid_days(date(2026, 10, 19), date(2026, 10, 22), EVERYDAY)
    assert len(planner.build_unit_schedule(1, 5, days)) == 3


def test_overload_extension():
    # 45강을 8일(매일), 30분 → 하루 6강(180분) 과부하 → 1주 늘리면 하루 3강
    start, end = date(2026, 10, 17), date(2026, 10, 24)
    assert planner.daily_of(45, len(planner.valid_days(start, end, EVERYDAY))) == 6
    assert planner.overload_extension(45, start, end, EVERYDAY, 30) == (1, 3)
