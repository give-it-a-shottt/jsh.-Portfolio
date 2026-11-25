from typing import Annotated

from fastapi import APIRouter, Depends

from app.score.schemas import Score, ScoreRequest, SituationOut
from app.score.service import build_score, situation_list
from app.yumi.client import YumiClient
from app.yumi.deps import get_yumi_client

router = APIRouter(prefix="/api", tags=["score"])


@router.get("/situations")
async def list_situations() -> list[SituationOut]:
    """당일 모드의 상황 타일 6개."""
    return situation_list()


@router.post("/score")
async def create_score(
    request: ScoreRequest,
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
) -> Score:
    """'지휘 시작' - 끼니별 메인 식당과 상황별 대안 3곳을 한 번에 만든다."""
    return await build_score(yumi, request)
