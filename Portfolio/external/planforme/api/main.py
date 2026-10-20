import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401  테이블 등록용
from db import Base, engine
from routers import insights, plans, tasks


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    yield


def require_api_key(x_api_key: str | None = Header(default=None)):
    # API_KEY 환경변수가 있을 때만 검사한다 (로컬 개발은 비워 두면 통과)
    expected = os.getenv("API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(401, "API 키가 올바르지 않아요")


app = FastAPI(title="PlanForMe API", lifespan=lifespan)

# 프론트 주소만 허용. 쉼표로 여러 개 가능 (예: http://localhost:3000,https://planforme.vercel.app)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (plans.router, tasks.router, insights.router):
    app.include_router(router, dependencies=[Depends(require_api_key)])


@app.get("/health")
def health():
    return {"status": "ok"}
