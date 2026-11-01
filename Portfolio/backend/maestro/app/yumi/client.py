from typing import Literal, Protocol

from pydantic import BaseModel

from app.yumi.models import (
    LiveStatus,
    LiveStatusKind,
    Place,
    Region,
    Reservation,
    ReservationRequest,
)


class NearbyQuery(BaseModel):
    """GET /api/v1/places/nearby 에 보낼 값."""

    lat: float
    lng: float
    radius: int = 1000  # m, 최대 5000
    # distance: 가까운 순 / discovery: 반경 안에서 추천 순
    sort: Literal["distance", "discovery"] = "distance"
    # 유미 쿼리 파라미터 이름 그대로 (atmosphere="quiet,cozy", reservable=True …)
    filters: dict[str, str | bool] = {}
    # 받을 데이터 등급. 요청 1번 값 = 고른 등급 중 가장 비싼 것 (core 1 / quality 2 / edge 4 토큰)
    fields: str = "core"
    page_size: int = 20


class NotFound(Exception):
    """유미 404 — 매장·문의·예약이 없다."""


class PlaceNotFound(NotFound):
    """그런 매장이 없다."""


class YumiError(Exception):
    """유미 API 가 예상 밖으로 실패했다 (키 문제, 서버 오류, 한도 초과, 시간 초과)."""

    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(f"{status_code} {message}")
        self.status_code = status_code


class NotAvailable(Exception):
    """유미 422 — 파트너가 아닌 매장이라 실시간 문의·예약을 못 한다. 다시 시도하지 말고 전화로 안내한다."""

    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code  # live_status_not_available / reservation_not_available


class YumiClient(Protocol):
    """mock 과 real 이 똑같이 갖춰야 하는 기능.

    나머지 코드는 이 인터페이스만 보고 짜서, mock ↔ real 을 바꿔도 고칠 곳이 없다.
    """

    async def resolve_region(self, dong: str) -> list[Region]:
        """동네 이름 → 후보 지역(코드·중심 좌표). 같은 이름이 여러 곳일 수 있다."""
        ...

    async def search_nearby(self, query: NearbyQuery) -> list[Place]:
        """좌표 주변 매장 검색."""
        ...

    async def get_place(self, place_id: str) -> Place:
        """매장 한 곳의 상세. 없으면 PlaceNotFound."""
        ...

    async def ask_live_status(
        self,
        place_id: str,
        kind: LiveStatusKind,
        topic: str,
        question: str | None = None,
    ) -> LiveStatus:
        """사장님께 지금 상황을 묻는다 (웨이팅·자리·메뉴). 파트너가 아니면 NotAvailable."""
        ...

    async def get_live_status(self, query_id: str, wait: int = 0) -> LiveStatus:
        """문의 결과. wait 초 동안 답을 기다렸다가 돌려준다 (롱폴링, 최대 25)."""
        ...

    async def simulate_seat_ask(self, place_id: str, topic: str) -> LiveStatus:
        """체험용 자리 묻기 — 실제 사장님께 보내지 않고 식당마다 고정된 답을 흉내 낸다. 결과는 get_live_status."""
        ...

    async def request_reservation(self, request: ReservationRequest) -> Reservation:
        """예약 요청. 파트너가 아니면 NotAvailable."""
        ...

    async def get_reservation(self, reservation_id: str, wait: int = 0) -> Reservation:
        """예약 상태. wait 초 동안 확정을 기다렸다가 돌려준다 (롱폴링, 최대 25)."""
        ...
