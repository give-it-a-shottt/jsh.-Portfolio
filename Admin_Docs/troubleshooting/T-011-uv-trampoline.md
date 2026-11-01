# T-011 Git Bash에서 `uv run pytest`가 안 됨 — uv trampoline 오류

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과]
무엇이 문제였나: Windows의 Git Bash에서 `uv run pytest`나 `uv run fastapi ...`를 치면 테스트나 서버가 뜨기도 전에 오류가 났어요.
어떻게 해결했나: 실행 파일 대신 파이썬 모듈로 부르게 바꿨어요. `uv run python -m pytest`, `uv run python -m uvicorn app.main:app --port 8001`.

## 개발자 상세

### 증상 (2026-11-01, F-010)
```
error: uv trampoline failed to canonicalize script path
```
- `uv run ruff check`는 됐고, `pytest` · `fastapi`처럼 가상환경의 `Scripts/*.exe` 런처를 거치는 명령만 실패했어요.

### 원인 (추정)
- uv가 Windows에서 만드는 런처(trampoline)가 스크립트 경로를 실제 경로로 바꾸는 단계에서 실패해요. 폴더 이름의 점(`jsh.-Portfolio`)이나 Git Bash의 경로 변환(`/c/...`)이 영향을 주는 것으로 보이지만 확인하지는 못했어요.

### 해결
- 런처를 거치지 않고 파이썬이 모듈을 직접 실행하게 해요.
  - 테스트: `uv run python -m pytest -q`
  - 서버: `uv run python -m uvicorn app.main:app --port 8001`
- PowerShell이나 다른 경로에서는 원래 명령도 될 수 있어서, 문서에는 두 방법을 함께 적었어요.

### 재발 방지
- [START_HERE](../START_HERE.md) 실행 명령과 백엔드 [README](../../Portfolio/backend/maestro/README.md)에 대체 명령을 한 줄씩 적었어요.

### 관련
[F-010](../features/F-010-maestro-renewal/feature.md)

최종 수정: 2026-11-01
