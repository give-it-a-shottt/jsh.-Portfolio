from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.score.service import RegionNotFound
from app.yumi.client import NotAvailable, NotFound, YumiError

# 유미·서비스 예외 → 프론트가 받을 응답. 형태는 {"detail": {"code", "message"}} 로 맞춘다.


def _error(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code, content={"detail": {"code": code, "message": message}}
    )


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFound)
    async def not_found(_: Request, exc: NotFound) -> JSONResponse:
        return _error(status.HTTP_404_NOT_FOUND, "not_found", "찾을 수 없어요")

    @app.exception_handler(NotAvailable)
    async def not_available(_: Request, exc: NotAvailable) -> JSONResponse:
        # 파트너가 아닌 매장 - 다시 시도하지 말고 전화로 안내한다
        return _error(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            exc.code,
            "이 매장은 앱으로 문의·예약을 받지 않아요. 전화로 확인해 주세요.",
        )

    @app.exception_handler(YumiError)
    async def yumi_error(_: Request, exc: YumiError) -> JSONResponse:
        # 키 문제·한도 초과·유미 서버 오류 - 발표 중이면 YUMI_MODE=mock 으로 바꿔 버틴다
        if exc.status_code == 429:
            return _error(
                status.HTTP_429_TOO_MANY_REQUESTS,
                "yumi_quota_exceeded",
                "오늘 유미 사용 한도를 다 썼어요. YUMI_MODE=mock 으로 바꿔 주세요.",
            )
        return _error(
            status.HTTP_502_BAD_GATEWAY,
            "yumi_error",
            f"유미 API 응답이 올바르지 않아요 ({exc.status_code})",
        )

    @app.exception_handler(RegionNotFound)
    async def region_not_found(_: Request, exc: RegionNotFound) -> JSONResponse:
        return _error(
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            "region_not_found",
            f"'{exc}' 동네를 찾지 못했어요",
        )
