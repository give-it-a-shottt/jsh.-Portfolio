"""영업시간 계산 — 결과 카드의 상태 배지 · "다음 변화 시점" 한 줄 · 영업시간 막대.

시각은 모두 '그날 0시부터 몇 분'으로 다룬다. 새벽까지 여는 곳은 닫는 시각에 1440 을 더한다
(18:00~02:00 → 1080~1560). 그래서 새벽 1시에는 전날 영업 구간도 함께 본다.
"""

from dataclasses import dataclass
from typing import Literal

from app.yumi.models import BusinessHours, Place

DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
DAY = 1440
# 마감까지 이만큼 남으면 '마감 임박'으로 본다 (분)
CLOSING_SOON = 60

StatusKind = Literal["open", "closing", "opens", "closed"]


def to_minutes(hhmm: str) -> int:
    hours, minutes = hhmm.split(":")
    return int(hours) * 60 + int(minutes)


def clock(minutes: int) -> str:
    """분 → 'HH:MM'. 자정 정각 마감만 24:00 으로 남긴다."""
    if minutes == DAY:
        return "24:00"
    minutes %= DAY
    return f"{minutes // 60:02d}:{minutes % 60:02d}"


def duration(minutes: int) -> str:
    hours, rest = divmod(minutes, 60)
    if hours and rest:
        return f"{hours}시간 {rest}분"
    return f"{hours}시간" if hours else f"{rest}분"


@dataclass(frozen=True)
class Segment:
    start: int
    end: int  # start 보다 크다. 새벽 마감이면 1440 을 넘는다
    last_order: int | None = None


def _day_hours(place: Place, day: str) -> BusinessHours | None:
    return next((h for h in place.business_hours if h.day == day), None)


def segments(place: Place, day: str) -> list[Segment]:
    """그날 영업 구간. 브레이크가 있으면 여러 개다."""
    hours = _day_hours(place, day)
    if hours is None or hours.closed:
        return []
    raw = [(s.open, s.close, s.last_order) for s in hours.segments]
    if not raw and hours.open and hours.close:
        raw = [(hours.open, hours.close, hours.last_order)]
    result = []
    for open_, close, last_order in raw:
        start, end = to_minutes(open_), to_minutes(close)
        if end <= start:
            end += DAY
        lo = to_minutes(last_order) if last_order else None
        if lo is not None and lo < start:
            lo += DAY
        result.append(Segment(start, end, lo))
    # 마지막 구간에만 라스트오더가 붙어 오는 곳이 있다
    if result and result[-1].last_order is None and hours.last_order:
        lo = to_minutes(hours.last_order)
        last = result[-1]
        if lo < last.start:
            lo += DAY
        result[-1] = Segment(last.start, last.end, lo)
    return sorted(result, key=lambda s: s.start)


def _previous(day: str) -> str:
    return DAYS[(DAYS.index(day) - 1) % 7]


def current_segment(place: Place, day: str, at: int) -> Segment | None:
    """at 에 열려 있는 구간. 새벽이면 전날 밤부터 이어진 구간일 수 있다."""
    for seg in segments(place, day):
        if seg.start <= at < seg.end:
            return seg
    for seg in segments(place, _previous(day)):
        if seg.start - DAY <= at < seg.end - DAY:
            lo = seg.last_order - DAY if seg.last_order is not None else None
            return Segment(seg.start - DAY, seg.end - DAY, lo)
    return None


def is_open(place: Place, day: str, at: int) -> bool:
    return current_segment(place, day, at) is not None


def next_opening(place: Place, day: str, at: int) -> int | None:
    """오늘 at 뒤에 처음 여는 시각. 없으면 None."""
    return next((s.start for s in segments(place, day) if s.start > at), None)


def hour(minutes: int) -> str:
    """표에 쓰는 짧은 시각 — 정각이면 '21시', 아니면 '21:30'."""
    if minutes % 60:
        return clock(minutes)
    return "24시" if minutes == DAY else f"{minutes // 60 % 24}시"


@dataclass(frozen=True)
class Status:
    kind: StatusKind
    label: str  # 상태 배지 — '영업 중', '40분 남음', '17:00 열어요'
    next_change: str  # 카드의 '다음 변화 시점' 한 줄
    short: str  # 표로 비교의 '지금' 칸 — '21시까지', '15시 쉼'


def status_at(place: Place, day: str, at: int) -> Status:
    seg = current_segment(place, day, at)
    if seg is not None:
        left = seg.end - at
        later = [s for s in segments(place, day) if s.start >= seg.end]
        if seg.last_order is not None and at >= seg.last_order:
            # 문은 열려 있어도 주문을 받지 않는다 — 가 봐야 실패하니 마감 임박과 같게 알린다
            return Status(
                "closing",
                "주문 마감",
                f"라스트오더 끝 · {clock(seg.end)} 마감",
                "주문 마감",
            )
        if left <= CLOSING_SOON:
            lo = f" · 라스트오더 {clock(seg.last_order)}" if seg.last_order else ""
            return Status(
                "closing",
                f"{duration(left)} 남음",
                f"{clock(seg.end)} 마감{lo}",
                f"{duration(left)} 남음",
            )
        if later:
            # 브레이크가 실제로 실패하는 이유라서 남은 시간보다 먼저 알린다
            return Status(
                "open",
                "영업 중",
                f"{clock(seg.end)} 브레이크 전까지 {duration(left)}",
                f"{hour(seg.end)} 쉼",
            )
        return Status(
            "open",
            "영업 중",
            f"{clock(seg.end)}까지 쉬는 시간 없이 열어요",
            f"{hour(seg.end)}까지",
        )

    opening = next_opening(place, day, at)
    if opening is not None:
        again = "다시 " if any(s.end <= at for s in segments(place, day)) else ""
        return Status(
            "opens",
            f"{clock(opening)} 열어요",
            f"{duration(opening - at)} 뒤 {again}열어요",
            f"{hour(opening)} 열어요",
        )
    return Status("closed", "영업 끝", "오늘 영업이 끝났어요", "영업 끝")
