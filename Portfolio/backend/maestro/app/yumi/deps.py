from functools import lru_cache
from typing import Annotated

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.yumi.client import YumiClient
from app.yumi.mock import MockYumiClient
from app.yumi.real import RealYumiClient


@lru_cache
def _mock_client() -> MockYumiClient:
    # 실시간 문의·예약 기록을 요청 사이에 이어 가려고 하나만 만들어 같이 쓴다
    return MockYumiClient()


@lru_cache
def _real_client(api_key: str, base_url: str) -> RealYumiClient:
    # 캐시·동시 요청 제한을 요청 사이에 나눠 쓰려고 하나만 만든다
    return RealYumiClient(api_key, base_url)


def get_yumi_client(
    settings: Annotated[Settings, Depends(get_settings)],
) -> YumiClient:
    """라우터가 Depends 로 받는 유미 클라이언트. YUMI_MODE 하나로 mock ↔ real 이 바뀐다.

    real 인데 키가 비어 있으면(배포에서 키를 빠뜨린 경우) 모든 요청이 502 가 되지 않게 mock 으로 둔다.
    """
    if settings.yumi_mode == "mock" or not settings.yumi_api_key:
        return _mock_client()
    return _real_client(settings.yumi_api_key, settings.yumi_base_url)


def get_live_yumi_client(
    settings: Annotated[Settings, Depends(get_settings)],
    yumi: Annotated[YumiClient, Depends(get_yumi_client)],
) -> YumiClient | None:
    """저장본으로 대신할 수 있는 화면(picks)용 — 실제 유미를 부를 수 있을 때만 클라이언트를 준다.

    mock 모드거나 키가 없으면 None 이고, 그때 picks 는 저장본(실제 데이터)을 쓴다.
    """
    if settings.yumi_mode == "mock" or not settings.yumi_api_key:
        return None
    return yumi
