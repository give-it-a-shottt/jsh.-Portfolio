from datetime import datetime
from typing import Literal

from pydantic import Field

from app.core.schemas import CamelModel
from app.situations import SituationKey
from app.yumi.models import Place, Region


class MealIn(CamelModel):
    """일정 입력의 끼니 한 줄 - '토 12:00 을지로 2명'."""

    at: datetime  # 끼니 시각, 한국 시간 (예: 2026-10-17T12:00)
    dong: str = Field(min_length=1)
    people: int = Field(default=2, ge=1, le=20)
    # 비워 두면 그 동네 추천 1순위를 메인으로 고른다
    main_place_id: str | None = None


class ScoreRequest(CamelModel):
    meals: list[MealIn] = Field(min_length=1, max_length=5)


# 끼니 시각으로 정한다 - 악보 타임라인의 LUNCH / CAFE / DINNER
MealKind = Literal["breakfast", "lunch", "cafe", "dinner", "late_night"]


class SituationOut(CamelModel):
    key: SituationKey
    emoji: str
    label: str
    reason: str


class MealScore(CamelModel):
    at: datetime
    kind: MealKind
    dong: str
    people: int
    region: Region
    main: Place | None
    # 상황마다 대안 3곳 (조건에 맞는 곳이 적으면 그보다 적을 수 있다)
    variations: dict[SituationKey, list[Place]]


class Score(CamelModel):
    """악보 - 끼니별 메인 식당 + 상황별 변주."""

    situations: list[SituationOut]
    meals: list[MealScore]
