from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.core.schemas import CamelModel
from app.yumi.client import YumiClient
from app.yumi.deps import get_yumi_client
from app.yumi.models import (
    LiveStatus,
    LiveStatusKind,
    Place,
    Reservation,
    ReservationRequest,
)

router = APIRouter(prefix="/api", tags=["places"])

# 롱폴링 대기 시간(초). 유미 최대 25초. 서버리스 시간 제한에 걸리지 않게 기본은 짧게 두고 여러 번 묻는다
WaitSeconds = Annotated[int, Query(ge=0, le=25, description="답을 기다릴 최대 초")]


class LiveStatusAsk(CamelModel):
    kind: LiveStatusKind  # item(메뉴·재고) / wait(대기) / seats(지금 자리)
    topic: str  # 문장이 아닌 짧은 주제 (예: 'wait', '2명', '전복죽')
    question: str | None = None  # 손님이 한 말 그대로 (사장님 참고용)


class ReservationAsk(CamelModel):
    reservation_time: datetime
    guest_count: int
    guest_phone: str
    guest_name: str | None = None
    note: str | None = None


@router.get("/places/{place_id}")
async def get_place(
    place_id: str,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
) -> Place:
    """식당 상세."""
    return await yumi.get_place(place_id)


@router.post("/places/{place_id}/live-status")
async def ask_live_status(
    place_id: str,
    ask: LiveStatusAsk,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
) -> LiveStatus:
    """실시간 문의 - 파트너 매장 사장님께 지금 웨이팅·자리·메뉴를 묻는다. 답은 GET 으로 받는다."""
    return await yumi.ask_live_status(place_id, ask.kind, ask.topic, ask.question)


@router.get("/live-status/{query_id}")
async def get_live_status(
    query_id: str,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
    wait: WaitSeconds = 10,
) -> LiveStatus:
    """문의 결과. pending 이면 프론트가 다시 묻는다."""
    return await yumi.get_live_status(query_id, wait)


@router.post("/places/{place_id}/reservations")
async def request_reservation(
    place_id: str,
    ask: ReservationAsk,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
) -> Reservation:
    """예약 요청 - 사장님이 승인하면 확정. 결과는 GET 으로 받는다."""
    request = ReservationRequest(place_id=place_id, **ask.model_dump())
    return await yumi.request_reservation(request)


@router.get("/reservations/{reservation_id}")
async def get_reservation(
    reservation_id: str,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
    wait: WaitSeconds = 10,
) -> Reservation:
    """예약 상태. pending 이면 프론트가 다시 묻는다."""
    return await yumi.get_reservation(reservation_id, wait)
