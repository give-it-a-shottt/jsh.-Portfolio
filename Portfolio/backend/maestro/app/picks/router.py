from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query

from app.picks import service
from app.picks.conditions import ConditionKey
from app.picks.schemas import DongKey, PicksOut, PlaceDetailOut, SeatAsk
from app.yumi.client import YumiClient
from app.yumi.deps import get_live_yumi_client, get_yumi_client
from app.yumi.models import LiveStatus

router = APIRouter(prefix="/api/picks", tags=["picks"])

Yumi = Annotated[YumiClient, Depends(get_yumi_client)]
# 유미를 부를 수 없으면(mock 모드 · 키 없음) None — 결과 · 상세는 저장본으로 대신한다
LiveYumi = Annotated[YumiClient | None, Depends(get_live_yumi_client)]
PlaceId = Annotated[str, Path(pattern=r"^[A-Za-z0-9_-]{1,64}$")]
At = Annotated[
    str,
    Query(
        pattern=r"^(now|([01]\d|2[0-3]):[0-5]\d)$",
        description="'now' 또는 'HH:MM' (시연 시각)",
    ),
]
Day = Annotated[
    str | None,
    Query(
        pattern=r"^(mon|tue|wed|thu|fri|sat|sun)$",
        description="요일. 비우면 오늘(한국 시간)",
    ),
]
Conditions = Annotated[
    list[ConditionKey], Query(alias="s", description="상황 칩 — ?s=rain&s=solo")
]


@router.get("")
async def find_picks(
    dong: DongKey,
    yumi: LiveYumi,
    at: At = "now",
    day: Day = None,
    s: Conditions = [],  # noqa: B006 — FastAPI 쿼리 기본값이라 매번 새로 만든다
) -> PicksOut:
    """[3곳 찾기] — 동네 · 시각 · 상황으로 후보 3곳과 결과 화면 상태(ok / few / none)를 만든다."""
    places, source = await service.load_places(yumi, dong)
    resolved_day, minutes = service.resolve_time(at, day)
    return service.build_picks(
        places,
        source,
        dong,
        resolved_day,
        minutes,
        list(dict.fromkeys(s)),
        auto_switch=at == "now",
    )


@router.get("/{dong}/places/{place_id}")
async def place_detail(
    dong: DongKey,
    place_id: PlaceId,
    yumi: LiveYumi,
    at: At = "now",
    day: Day = None,
    s: Conditions = [],  # noqa: B006
) -> PlaceDetailOut:
    """식당 상세 — 결과 검색에 상세 등급까지 받아 두어서 유미를 다시 부르지 않는다."""
    places, source = await service.load_places(yumi, dong)
    place = service.find_place(places, dong, place_id)
    resolved_day, minutes = service.resolve_time(at, day)
    return service.build_detail(
        place, source, dong, resolved_day, minutes, list(dict.fromkeys(s))
    )


@router.post("/places/{place_id}/seat-ask")
async def ask_seat(place_id: PlaceId, ask: SeatAsk, yumi: Yumi) -> LiveStatus:
    """자리 물어보기 — 실제 사장님께 보내지 않는다. 답은 GET /api/live-status/{queryId} 로 받는다."""
    when = "지금" if ask.when == "now" else "30분 뒤"
    return await yumi.simulate_seat_ask(place_id, f"{ask.people}명 · {when}")
