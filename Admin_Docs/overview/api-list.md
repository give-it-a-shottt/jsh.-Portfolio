# API 목록

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 코드를 읽고 쓴 초안이에요. 실제 호출과 맞는지는 F-005 리뷰(R6 3자 비교)에서 확인해요.
무엇을: 화면과 서버가 주고받는 요청은 **마에스트로에만** 있어요. 마에스트로 화면은 우리 서버만 부르고, 우리 서버가 헤이유미 API를 대신 불러요. 그래서 API 키가 브라우저로 나가지 않아요. Accio API에는 "살아 있니?"를 묻는 헬스 체크만 있고, FLASEEK과 포트폴리오는 서버를 부르지 않아요.
왜: 키는 서버에만 두고, 에러 모양을 하나로 맞춰서 화면이 똑같은 방식으로 처리하게 하려고요.

## 개발자 상세

### 마에스트로 API (`Portfolio/backend/maestro`, 프론트 호출부 `src/projects/maestro/api.ts`)
| 메서드 | 경로 | 요청 | 응답 | 프론트 함수 |
|---|---|---|---|---|
| GET | `/health` | – | 상태 | `wakeServer()` |
| GET | `/api/regions?dong=` | dong(1자 이상) | `Region[]` | – |
| GET | `/api/situations` | – | `SituationOut[]` (상황 타일 6개) | – |
| POST | `/api/score` | `{ meals: MealIn[1..5] }` (at, dong, people 1~20, mainPlaceId?) | `Score { situations, meals: MealScore[] }` | `createScore()` |
| GET | `/api/places/{id}` | – | `Place` | `getPlace()` |
| POST | `/api/places/{id}/live-status` | `{ kind: item·wait·seats, topic, question? }` | `LiveStatus` | `askWaitTime()` |
| GET | `/api/live-status/{queryId}?wait=0..25` | – | `LiveStatus` (pending이면 다시 물음) | `waitForAnswer()` |
| POST | `/api/places/{id}/reservations` | `{ reservationTime, guestCount, guestPhone, guestName?, note? }` | `Reservation` | – |
| GET | `/api/reservations/{id}?wait=0..25` | – | `Reservation` | – |

- 필드는 camelCase예요(`CamelModel`).
- **에러 형식**: `{"detail": {"code", "message"}}`로 통일해요(`core/errors.py`). 404 `not_found` · 422 `not_available`/`region_not_found` · 429 `yumi_quota_exceeded` · 502 `yumi_error`. 프론트 `ApiError(code, message)`가 이 모양을 읽어요. 연결 실패는 `offline`, 그 밖은 `unknown`이에요.
- CORS 허용 주소는 환경변수 `CORS_ORIGINS`로 정해요.

### Accio API (`Portfolio/backend/accio`)
| 메서드 | 경로 | 응답 |
|---|---|---|
| GET | `/health` | `{ status, environment }` |
| GET | `/health/db` | DB에 `SELECT 1`을 보내요. 실패하면 503 `database unavailable` |

최종 수정: 2026-10-25 · 관련: D-002, F-005
