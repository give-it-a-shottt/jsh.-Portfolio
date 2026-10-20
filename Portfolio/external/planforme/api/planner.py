"""계산 로직 (IA 04 · 계산 로직). DB와 무관한 순수 함수만 둔다."""

from dataclasses import dataclass
from datetime import date, timedelta
from math import ceil

OVERLOAD_MINUTES = 180


def valid_days(start: date, end: date, weekdays: set[int], exclude: set[date] | None = None) -> list[date]:
    """유효 학습 일수 D: 기간 중 선택한 요일의 날짜 목록."""
    exclude = exclude or set()
    days: list[date] = []
    cur = start
    while cur <= end:
        if cur.weekday() in weekdays and cur not in exclude:
            days.append(cur)
        cur += timedelta(days=1)
    return days


def split_amount(total: int, day_count: int) -> list[int]:
    """올림(total ÷ D)씩 앞에서부터 배분하고, 나머지는 마지막 날에 적게. 100p / 3일 → [34, 34, 32]"""
    if day_count <= 0:
        return []
    daily = ceil(total / day_count) if total > 0 else 0
    result: list[int] = []
    remaining = total
    for _ in range(day_count):
        amount = min(daily, remaining)
        result.append(amount)
        remaining -= amount
    return result


@dataclass
class ScheduleItem:
    date: date
    target_start: int | None
    target_end: int | None
    amount: int


def build_unit_schedule(first_unit: int, total: int, days: list[date]) -> list[ScheduleItem]:
    """책/강의: first_unit부터 total만큼을 days에 나눠 범위를 만든다. 0이 배정된 날은 건너뛴다."""
    items: list[ScheduleItem] = []
    cursor = first_unit
    for d, amount in zip(days, split_amount(total, len(days))):
        if amount <= 0:
            continue
        items.append(ScheduleItem(d, cursor, cursor + amount - 1, amount))
        cursor += amount
    return items


def build_routine_schedule(days: list[date]) -> list[ScheduleItem]:
    """일반: 선택한 요일마다 같은 할 일 1회. 총 수행 횟수 = D"""
    return [ScheduleItem(d, None, None, 1) for d in days]


def daily_of(total: int, day_count: int) -> int:
    return ceil(total / day_count) if day_count > 0 and total > 0 else 0


def overload_extension(total: int, start: date, end: date, weekdays: set[int], avg_minutes: int) -> tuple[int, int] | None:
    """강의 과부하일 때, 하루 180분 미만이 되려면 종료일을 몇 주 늘려야 하는지 (주 수, 새 하루 강의 수)."""
    for weeks in range(1, 13):
        new_end = end + timedelta(weeks=weeks)
        d = len(valid_days(start, new_end, weekdays))
        v = daily_of(total, d)
        if v * avg_minutes < OVERLOAD_MINUTES:
            return weeks, v
    return None
