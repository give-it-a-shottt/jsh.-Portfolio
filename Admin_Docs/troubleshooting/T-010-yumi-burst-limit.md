# T-010 유미 저장본을 받다가 "Rate limit exceeded" — 하루 한도 말고 짧은 구간 한도

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과]
무엇이 문제였나: 헤이유미 기본 무료 API는 하루 70요청까지예요. 그런데 동네 4곳의 저장본을 받으려고 연달아 부르니, 70번에 한참 못 미쳤는데도 "Rate limit exceeded"가 났어요.
어떻게 해결했나: 하루 한도와 별개로 **짧은 시간에 10번**까지라는 한도가 하나 더 있었어요. 저장본 스크립트가 12초 간격으로 부르게 해서 해결했어요.

## 개발자 상세

### 증상 (2026-11-01, F-010 `scripts/snapshot.py`)
```
{"success": false, "error": "Rate limit exceeded"}
X-Ratelimit-Limit: 10
Retry-After: 9
```
- 하루 한도를 넘겼을 때(429 `Daily quota exceeded`, 몇 시간 뒤 초기화)와는 응답이 달랐어요. `Retry-After`가 9초뿐이었어요.

### 원인
- 유미에는 한도가 두 개 있어요: 하루 70요청, 그리고 짧은 구간 10요청. 저장본을 받는 동안 검색과 재시도가 몰려 짧은 구간 한도에 걸렸어요.

### 해결
- [scripts/snapshot.py](../../Portfolio/backend/maestro/scripts/snapshot.py) `GAP_SECONDS = 12` — 동네 사이에 12초를 쉬어요(9초 + 여유).
- 실제 서비스 경로는 원래 대비가 있어요: [real.py](../../Portfolio/backend/maestro/app/yumi/real.py)는 429의 `Retry-After`가 5초(`MAX_RETRY_AFTER`) 이하면 기다렸다가 한 번 더 시도하고, 더 길면 바로 `YumiError(429)`를 내요. 결과 화면(`/api/picks`)은 그 오류를 받으면 저장본으로 대신 보여 주고, 그 동네는 10분 동안 유미를 다시 부르지 않아요.
- 동네마다 6시간 캐시라 평소 호출은 하루 몇 번뿐이에요.

### 재발 방지
- 백엔드 [README](../../Portfolio/backend/maestro/README.md) "유미 사용 원칙"에 두 한도를 함께 적었어요.
- 여러 번 부르는 스크립트는 간격을 두고, 실제 유미를 부르는 일은 꼭 필요할 때만 해요(개발 · 테스트는 mock).

### 관련
[F-010](../features/F-010-maestro-renewal/feature.md) · [D-002](../decisions/D-002-mock-real-client.md)

최종 수정: 2026-11-01
