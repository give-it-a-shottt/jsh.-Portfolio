from datetime import datetime
from typing import Annotated, Any, Literal

from pydantic import BeforeValidator, Field

from app.core.schemas import CamelModel

# 헤이유미 응답 중 마에스트로가 쓰는 필드만 옮긴 모델.
# 2026-10-07 실제 응답(을지로 nearby, fields=core,contact_hours,quality,edge)과 맞춰 봤다.
# 안쪽 키가 snake_case 로 오는 것(reputation, serviceAttributes)도 있어서 populate_by_name 으로 둘 다 받는다.


class YumiModel(CamelModel):
    """유미 응답 모델의 기반 — camelCase ↔ snake_case."""


def _none_to(empty: type[list] | type[dict]) -> BeforeValidator:
    # 실제 응답은 비어 있는 목록·사전을 null 로 보내기도 한다 (예: atmosphere: null)
    return BeforeValidator(lambda value: empty() if value is None else value)


Strings = Annotated[list[str], _none_to(list), Field(default_factory=list)]
Attributes = Annotated[dict[str, Any], _none_to(dict), Field(default_factory=dict)]
Scores = Annotated[dict[str, float], _none_to(dict), Field(default_factory=dict)]


class LatLng(YumiModel):
    lat: float
    lng: float


class Region(YumiModel):
    # '을지로', '성수'처럼 상권·역 이름이면 코드·동은 빈 값이고 kind='district', radiusM 이 온다
    region_code: str = ""
    sido: str = ""
    sigungu: str = ""
    dong: str = ""
    full_name: str
    center: LatLng
    place_count: int = 0
    kind: str | None = None
    radius_m: int | None = None


class Address(YumiModel):
    road: str | None = None


class OpenNow(YumiModel):
    open: bool | None = None
    reason: str | None = None


class Price(YumiModel):
    # level: 1(저렴) ~ 4(비쌈)
    level: int | None = None
    avg: int | None = None


class MenuSummary(YumiModel):
    count: int = 0
    items: Strings


class NearestStation(YumiModel):
    station: str
    walk_min: int


class HoursSegment(YumiModel):
    """하루 영업을 브레이크로 나눈 한 구간. close 가 open 보다 이르면 다음 날 새벽에 닫는다."""

    open: str
    close: str
    last_order: str | None = None


class BusinessHours(YumiModel):
    day: str  # mon … sun
    open: str | None = None
    close: str | None = None
    closed: bool = False
    last_order: str | None = None
    # 2026-11-01 실제 응답: 브레이크가 있으면 segments 가 여러 개로 온다 (없으면 open~close 하나)
    segments: Annotated[list[HoursSegment], _none_to(list), Field(default_factory=list)]


class Reputation(YumiModel):
    """교차검증·최근 활동 근거 — 화면의 검증 배지로 쓴다."""

    cross_source_confirmed: bool = False  # 여러 지도 소스에서 같은 곳으로 확인됨
    recently_active: bool = False  # 최근까지 리뷰 활동
    regulars_favorite: bool = False  # 단골 언급이 잦음
    basis: Strings  # 근거 문장


class Place(YumiModel):
    # core 등급
    id: str
    name: str
    category: str | None = None  # restaurant / cafe / bar
    category_label: str | None = None
    location: LatLng
    address: Address | None = None
    confidence: float = 0
    possibly_closed: bool = False
    source_count: int = 0  # 같은 곳으로 확인된 지도 소스 수 — "지도 앱 3곳에 다 나와요"
    last_seen_at: datetime | None = None  # 유미가 마지막으로 확인한 때 — 근거의 날짜
    distance_m: int | None = None  # nearby 검색에서만 온다
    # contact_hours 등급
    phone: str | None = None
    yumi_reservable: bool = False  # 유미 파트너 — 앱으로 실시간 문의·예약이 된다
    reservation_channels: Strings
    business_hours: Annotated[
        list[BusinessHours], _none_to(list), Field(default_factory=list)
    ]
    # quality 등급
    open_now: OpenNow | None = None
    closure_signal: Any = None
    review_count: int | None = None
    freshness_score: float | None = None
    price: Price | None = None
    menu_summary: MenuSummary | None = None
    nearest_station: NearestStation | None = None
    # edge 등급 — serviceAttributes 안쪽 키는 snake_case(venue_subtype …) 그대로 온다
    recommended_for: Strings  # solo_dining, date, group_dining …
    service_attributes: Attributes
    atmosphere: Strings
    atmosphere_scores: Scores
    ai_summary: str | None = None
    reputation: Reputation | None = None
    legacy: Any = None  # 백년가게(노포) 인증이면 값이 있다


# ── 확인·예약 (유미 파트너 매장만) ──────────────────────────────────────
# 응답 필드 이름은 문서 설명에서 옮긴 것이라, real 연결 때 실제 응답과 맞춰 본다.

LiveStatusKind = Literal["item", "wait", "seats"]


class LiveStatus(YumiModel):
    """실시간 문의 — 사장님이 앱에서 한 번 눌러 답한다 (5분 안)."""

    query_id: str
    place_id: str
    kind: LiveStatusKind
    topic: str
    # pending → available / limited / unavailable / soon / not_offered / no_response
    status: str
    note: str | None = None  # 사장님 메모 (예: '20분')
    verified_at: datetime | None = None
    reused: bool = False  # 같은 질문의 최근 답을 다시 쓴 경우
    blocked: str | None = None  # 'closed_now' — 영업시간 밖이라 묻지 않음
    simulated: bool = False  # 마에스트로가 흉내 낸 답 — 실제 사장님께 보내지 않았다


class ReservationRequest(YumiModel):
    place_id: str
    reservation_time: datetime  # 미래 시각, +09:00
    guest_count: int
    guest_phone: str
    guest_name: str | None = None
    note: str | None = None
    idempotency_key: str | None = (
        None  # 같은 요청을 다시 보내도 예약이 두 번 생기지 않게
    )


class Reservation(YumiModel):
    """예약 요청 — pending → confirmed / cancelled / expired."""

    reservation_id: str
    place_id: str
    reservation_time: datetime
    guest_count: int
    status: str
    simulated: bool = False  # 마에스트로가 흉내 낸 예약 — 실제 매장에 보내지 않았다
