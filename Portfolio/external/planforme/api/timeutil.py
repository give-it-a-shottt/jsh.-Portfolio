from datetime import date, datetime
from zoneinfo import ZoneInfo

KST = ZoneInfo("Asia/Seoul")


def now_kst() -> datetime:
    # Vercel 서버는 UTC라서 "오늘"을 항상 한국 시간 기준으로 계산한다
    return datetime.now(KST).replace(tzinfo=None)


def today_kst() -> date:
    return now_kst().date()
