from typing import Literal

from pydantic import Field

from app.core.schemas import CamelModel
from app.picks.conditions import ConditionKey
from app.picks.hours import StatusKind
from app.yumi.models import LatLng, NearestStation

DongKey = Literal["euljiro", "seongsu", "ikseon", "yeonnam"]
Source = Literal["live", "snapshot"]


class DongOut(CamelModel):
    key: DongKey
    label: str
    center: LatLng


class ConditionOut(CamelModel):
    key: ConditionKey
    label: str
    hint: str


class StatusOut(CamelModel):
    kind: StatusKind  # open / closing(마감 임박) / opens(나중에 엶) / closed
    label: str  # 상태 배지 — '영업 중', '40분 남음', '17:00에 열어요'
    next_change: str  # '15:00 브레이크 전까지 2시간'
    short: str  # 표로 비교의 '지금' 칸 — '21시까지', '15시 쉼'


class SegmentOut(CamelModel):
    start: int  # 그날 0시부터 몇 분. 새벽 마감이면 1440 을 넘는다
    end: int


class HoursOut(CamelModel):
    """영업시간 막대 — 3곳 모두 같은 축(10:00~02:00)에 그린다."""

    segments: list[SegmentOut]
    last_order: int | None


class EvidenceOut(CamelModel):
    """별점 대신 날짜가 붙은 근거."""

    line: str  # 카드에 보이는 한 줄 — '지도 앱 3곳에 다 나와요'
    checked_on: str | None  # 유미가 마지막으로 확인한 날 — '10/21'
    source_count: int
    items: list[str]  # 상세의 '믿을 이유' 체크리스트


class PlaceCard(CamelModel):
    id: str
    name: str
    initial: str  # 지도 핀에 쓰는 첫 글자
    category_label: str | None
    location: LatLng
    distance_m: int | None
    station: NearestStation | None
    price_avg: int | None
    ai_summary: str | None
    waiting_expected: bool  # 줄 서는 곳으로 알려졌는지 — 표의 '웨이팅' 칸
    atmosphere: list[str]  # 한글 분위기 — '아늑함', '노포'


class Pick(CamelModel):
    place: PlaceCard
    status: StatusOut
    hours: HoursOut
    evidence: EvidenceOut
    matched: list[ConditionKey]
    unmatched: list[ConditionKey]


class RelaxOut(CamelModel):
    """'비 와' 조건을 빼면 N곳 더."""

    key: ConditionKey
    label: str
    more: int


class PicksOut(CamelModel):
    dong: DongOut
    day: str  # mon … sun
    at: str  # 실제로 찾은 시각 'HH:MM'
    switched_from: (
        str | None
    )  # '지금'에 열린 곳이 모자라 시연 시각으로 바꿨으면 원래 시각
    source: Source  # live: 방금 유미에서 받음 / snapshot: 저장해 둔 실제 데이터
    state: Literal[
        "ok", "few", "none"
    ]  # 3곳 다 맞음 / 조건 맞는 곳이 3곳 미만 / 열린 곳 없음
    open_count: int
    picks: list[Pick]
    relax: list[RelaxOut]
    conditions: list[ConditionOut]  # 칩 6개 — 라벨 · 툴팁을 서버 한 곳에서 정한다


class PlaceDetailOut(CamelModel):
    dong: DongOut
    at: str
    source: Source
    pick: Pick
    address: str | None
    phone: str | None
    menu: list[str]
    hours_text: str  # '매일 11:00 – 21:00 · 쉬는 시간 없음'
    conditions: list[ConditionOut]


class SeatAsk(CamelModel):
    people: int = Field(2, ge=1, le=10)  # 화면의 인원 스테퍼와 같은 범위
    when: Literal["now", "30min"] = "now"
