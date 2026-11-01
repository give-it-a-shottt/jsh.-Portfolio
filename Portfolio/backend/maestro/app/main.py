from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.health.router import router as health_router
from app.picks.router import router as picks_router
from app.places.router import router as places_router
from app.regions.router import router as regions_router
from app.score.router import router as score_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name)
    # 프론트(다른 주소)에서 오는 요청을 허락한다
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health_router)
    app.include_router(regions_router)
    app.include_router(score_router)
    app.include_router(places_router)
    app.include_router(picks_router)
    register_error_handlers(app)
    return app


app = create_app()
