# API 목록

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] F-010(마에스트로 리뉴얼) 리뷰(R4 3자 비교)에서 경로 · 필드가 맞는 걸 확인했어요(2026-11-01).
무엇을: 화면과 서버가 주고받는 요청은 **마에스트로에만** 있어요. 마에스트로 화면은 우리 서버만 부르고, 우리 서버가 헤이유미 API를 대신 불러요. 그래서 API 키가 브라우저로 나가지 않아요. Accio API에는 "살아 있니?"를 묻는 헬스 체크만 있고, FLASEEK과 포트폴리오는 서버를 부르지 않아요.
왜: 키는 서버에만 두고, 에러 모양을 하나로 맞춰서 화면이 똑같은 방식으로 처리하게 하려고요.

## 개발자 상세

### 마에스트로 API (`Portfolio/backend/maestro`, 프론트 호출부 `src/projects/maestro/api.ts`)
| 메서드 | 경로 | 요청 | 응답 | 프론트 함수 |
|---|---|---|---|---|
| GET | `/health` | – | 상태(mock / real) | `wakeServer()` |
| GET | `/api/picks?dong=&at=&day=&s=` | dong(euljiro·seongsu·ikseon·yeonnam), at(`now` 또는 `HH:MM`), day(mon~sun, 비우면 오늘), s(상황 칩, 여러 번) | `PicksOut { dong, day, at, switchedFrom, source, state(ok·few·none), openCount, picks[] … }` | `getPicks()` |
| GET | `/api/picks/{dong}/places/{id}?at=&day=&s=` | 위와 같은 조건 | `PlaceDetailOut` (상태 배지 · 막대 · 근거 · 메뉴 · 영업시간) | `getPlace()` |
| POST | `/api/picks/places/{id}/seat-ask` | `{ people: 1~10, when: now·30min }`, id는 64자 이하 영문 · 숫자 · `_` · `-` | `LiveStatus` (흉내 낸 답, 실제 사장님께 안 보냄) | `askSeat()` |
| GET | `/api/live-status/{queryId}?wait=0..25` | – | `LiveStatus` (pending이면 다시 물음) | `waitForSeat()` |

- 💡 `source`는 `live`(방금 유미에서 받음) · `snapshot`(저장해 둔 실제 데이터) 둘 중 하나예요. mock 모드는 유미를 부르지 않고 늘 `snapshot`이에요. 열린 곳이 적어 시연 시각을 바꿨으면 `switchedFrom`에 원래 시각이 와요.
- 입력 검증 실패(잘못된 dong · at · 인원 등)는 FastAPI 기본 422 모양(`{"detail": [...]}`)이에요. 프론트는 `unknown`으로 처리해요.
- 예전 화면(F-005)용 API — `/api/regions` · `/api/situations` · `/api/score` · `/api/places/{id}` · `/api/places/{id}/live-status` · 예약 2개 — 는 백엔드에 남아 있지만 새 화면은 부르지 않아요.

- 필드는 camelCase예요(`CamelModel`).
- **에러 형식**: `{"detail": {"code", "message"}}`로 통일해요(`core/errors.py`). 404 `not_found` · 422 `not_available`/`region_not_found` · 429 `yumi_quota_exceeded` · 502 `yumi_error`. 프론트 `ApiError(code, message)`가 이 모양을 읽어요. 연결 실패는 `offline`, 그 밖은 `unknown`이에요.
- CORS 허용 주소는 환경변수 `CORS_ORIGINS`로 정해요.

### Accio API (`Portfolio/backend/accio`)
| 메서드 | 경로 | 응답 |
|---|---|---|
| GET | `/health` | `{ status, environment }` |
| GET | `/health/db` | DB에 `SELECT 1`을 보내요. 실패하면 503 `database unavailable` |

최종 수정: 2026-11-01 · 관련: D-002, F-005, F-010
