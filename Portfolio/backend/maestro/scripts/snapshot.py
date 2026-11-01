"""실제 유미 데이터 저장본(app/yumi/fixtures/snapshot.json)을 새로 받는다.

유미가 한도 · 장애로 실패할 때와 mock 모드에서 이 저장본으로 결과를 보여준다.
동네 4곳 × 추천순 100곳 = 요청 4번. 짧은 구간 한도(10번)에 걸리지 않게 요청 사이를 띄운다.

    uv run python scripts/snapshot.py                 # 유미에서 받기 (.env 의 YUMI_API_KEY)
    uv run python scripts/snapshot.py --from DIR      # 이미 받아 둔 DIR/{dong}.json 으로 만들기
"""

import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path

from app.core.config import get_settings
from app.picks.service import DONGS, KST, SNAPSHOT, nearby_query
from app.yumi.models import Place
from app.yumi.real import RealYumiClient

GAP_SECONDS = 12


def _trim(raw: list[dict]) -> list[dict]:
    """모델에 있는 필드만 남긴다 — 파일이 작아지고, 화면에 안 쓰는 값을 저장소에 두지 않는다."""
    return [
        Place.model_validate(p).model_dump(
            by_alias=True, mode="json", exclude_none=True
        )
        for p in raw
    ]


async def _fetch() -> dict[str, list[dict]]:
    settings = get_settings()
    yumi = RealYumiClient(settings.yumi_api_key, settings.yumi_base_url)
    result = {}
    for i, key in enumerate(DONGS):
        if i:
            await asyncio.sleep(GAP_SECONDS)
        places = await yumi.search_nearby(nearby_query(key))
        result[key] = [
            p.model_dump(by_alias=True, mode="json", exclude_none=True) for p in places
        ]
        print(key, len(places))
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--from", dest="source", type=Path)
    args = parser.parse_args()
    if args.source:
        dongs = {
            key: _trim(
                json.loads((args.source / f"{key}.json").read_text(encoding="utf-8"))
            )
            for key in DONGS
        }
    else:
        dongs = asyncio.run(_fetch())
    data = {
        "fetchedAt": datetime.now(KST).isoformat(timespec="seconds"),
        "dongs": dongs,
    }
    SNAPSHOT.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"saved {SNAPSHOT} ({sum(map(len, dongs.values()))} places)")


if __name__ == "__main__":
    main()
