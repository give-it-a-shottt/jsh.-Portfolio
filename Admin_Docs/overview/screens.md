# 화면 목록과 흐름 (IA · 유저플로우 · 라우팅)

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 전체 지도는 사용자 확인 완료(2026-10-25). 화면별 흐름은 FLASEEK만 정리했어요.
무엇을: **검색하듯 둘러보는 포트폴리오**예요. 첫 화면은 검색창이고, 키워드를 넣으면 작업 사례(Front·Back·Design)와 공부 노트(Study)가 중요한 순서대로 결과처럼 나와요. 사례 안에서 프로젝트를 바로 실행해 볼 수 있어요.
비유: 백화점 안내 데스크(검색창)에 물으면 매장(사례)을 알려 주고, 몇몇 매장은 들어가서 직접 체험(실행 화면)할 수 있는 구조예요.
왜: 이력서 링크 하나로 "무엇을 했고 어떻게 생각했는지"를 바로 찾아보고 직접 눌러 보게 하려고요.

### 전체 지도
```
           ┌──────────── 포트폴리오 (#/) ────────────┐
           │ 검색 홈 → 검색 결과(탭) → 사례 상세 / 노트 상세 │
           └──────┬─────────┬──────────┬────────────┘
                  │ 실행해 보기 링크
     ┌────────────┼─────────┼──────────┬──────────────┬─────────────┐
  마에스트로     Accio      FLASEEK     Accio v1 원본    techlearn
  #/maestro    #/accio    #/flaseek   /accio-v1/      #/techlearn
  (해커톤)     (팀→리디자인) (리뉴얼 시안) (팀 원본 정적 빌드) (강의 플랫폼 시안)
     │            │
  마에스트로 API  Accio API (지금은 헬스 체크만)
```

### FLASEEK 흐름
**메인 → 상품 리스트 → 상품 상세**가 핵심 흐름이고, 로그인은 따로 있어요. 결제·회원가입·간편 로그인처럼 시안에 없는 기능을 누르면 "시안이라 연결하지 않았어요" 토스트가 떠요. 시안이 "보이기만 하는 그림"이 아니라 실제로 눌러 보며 판단할 수 있는 화면이 되게 하려고요.

```
메인 #/flaseek
 ├─ 카테고리 카드 ───────▶ 리스트 ?cat=legwear|shapewear|set|laundry
 ├─ 두께 카드 ──────────▶ 리스트 ?thick=see-through|premium|napping
 ├─ BEST·더보기 ────────▶ 리스트 (전체)
 └─ 헤더 검색 ──────────▶ 리스트 ?q=검색어
리스트 #/flaseek/list   (탭·칩·필터·정렬, 8개씩 더보기)
 └─ 상품 카드 ──────────▶ 상세 #/flaseek/detail?id=N
상세   세트 칩(1·3·5·7매) · 타입 고르기 · 앵커 탭 · 접는 본문 · 리뷰 요약
 ├─ 장바구니 담기 → 헤더 수 +1, 토스트
 └─ 구매하기 → "시안이라 결제는 연결하지 않았어요"
로그인 #/flaseek/login   (헤더에서 진입. 모든 버튼은 시안 안내 토스트)
```

## 개발자 상세

### 서비스별 주소
| 서비스 | 주소 | 무엇 | 서버 | 코드 |
|---|---|---|---|---|
| 포트폴리오 | `#/`, `#/search?q=`, `#/case/{slug}`, `#/study/{slug}` | 검색형 포트폴리오. 사례·노트 데이터는 코드 안의 정적 데이터 | 없음 | `Portfolio/frontend/src/portfolio/` |
| 마에스트로 | `#/maestro/…` | 틀어진 일정의 플랜 B를 짜 주는 서비스 (YUMITHON 2026) | 마에스트로 API(헤이유미 API 중계, mock/real) | `src/projects/maestro/`, `backend/maestro/` |
| Accio | `#/accio/…` | AI 자연어 검색 쇼핑몰. 팀 프로젝트를 Figma 리디자인으로 다시 만든 화면 | 프론트만 동작(목 데이터). 백엔드는 뼈대 | `src/projects/accio/`, `backend/accio/` |
| FLASEEK | `#/flaseek/…` | 보정속옷·압박스타킹 자사몰 리뉴얼 시안. 메인·리스트·상세·로그인 | 없음(정적 데이터, 이번 방문 동안만 상태 유지) | `src/projects/flaseek/` |
| techlearn | `#/techlearn/…` | 강의 플랫폼 시안. 홈 → 강의 목록 → 상세 → 포인트 수강신청 ([F-008](../features/F-008-techlearn/feature.md)) | 없음(목업 데이터, 포인트·수강 기록은 이번 방문 동안만) | `src/projects/techlearn/` |
| Accio v1 | `/accio-v1/` | 팀 프로젝트 원본 프론트를 정적 빌드로 보존. 목 모드로만 동작 | 없음 | `public/accio-v1/` (빌드 결과만) |

- 💡 프론트는 **Vite 앱 하나**예요. 프로젝트마다 주소의 `#` 뒤 첫 마디로 나뉘어요. 자세한 내용은 [architecture.md](architecture.md), [D-001](../decisions/D-001-single-vite-hash-routing.md)에 있어요.
- 앞으로(사용자 확인): remind·PlanForMe 디자인 페이지를 같은 방식으로 추가할 수 있어요. Accio와 마에스트로는 별도 서비스로 분리하고, 이 지도에는 디자인 사례와 링크만 남아요([D-001](../decisions/D-001-single-vite-hash-routing.md)).
- 사례 데이터: `portfolio/data.ts`(목록), `portfolio/caseStories.ts`(Front·Back 상세 글), `portfolio/caseDetails.ts`(Front·Back 코드), `portfolio/noteData/`(공부 노트)

### FLASEEK 화면
| 화면 | 주소 | 파일 | PC (lg 이상) | MO |
|---|---|---|---|---|
| 메인 | `#/flaseek` | `pages/MainPage.tsx` | 히어로 슬라이더 + 카피 나란히 | 슬라이더 위, 카피 아래. 카테고리·두께는 가로 스크롤 |
| 리스트 | `#/flaseek/list?cat|q|thick` | `pages/ListPage.tsx` | 카드 4열, `FilterBox` | 카드 2열, `FilterSheet` 바텀시트(결과 수 표시) |
| 상세 | `#/flaseek/detail?id=` | `pages/DetailPage.tsx` | 상단 고정 구매바 | 하단 56px 고정 구매바, 세트 칩 2×2 |
| 로그인 | `#/flaseek/login` | `pages/LoginPage.tsx` | 가운데 384px 한 열 | 간편 로그인 아래 크게 |

- 라우팅: `FlaseekApp.tsx`가 `path`로 화면을 고르고, `params.toString()`을 `key`로 줘서 조건이 바뀌면 화면 상태를 처음부터 다시 시작해요.
- 피그마 기준 폭: PC 1440 · MO 390. 반응형 한 벌로 구현했어요.

### 포트폴리오 · Accio · 마에스트로 화면별 흐름
- (빈 템플릿) IA·유저플로우는 planning-advisory-panel 결과가 생기면 옮겨 와요.

최종 수정: 2026-10-29 · 관련: D-001, F-001~F-005, F-007

### techlearn 흐름
```
홈 #/techlearn  (히어로 검색 · 분야 · 인기 강좌 · 로드맵 · 후기)
 └─ 검색 / 강의 탐색 / 카드 ──▶ 강의 목록 #/techlearn/courses?tab=&q=
                                  └─ 강의 카드 ──▶ 강의 상세 #/techlearn/course/{id}
                                                   └─ 수강신청 하기 ──▶ 확인 모달 ──▶ 처리 중 ──▶ 토스트(201·400·409·500)
```
- 홈의 인기 강좌(원화 가격)는 홍보용 카드라 강의 목록으로 보내요. 포인트로 신청하는 강의는 목록의 8개예요.
- 아직 없는 화면(내 강의 09, 장바구니 05, 결제 07, 로그인 06, 404·500 10·11)은 다음 단계예요. '내 강의로 이동'은 지금 강의 목록으로 가요.

