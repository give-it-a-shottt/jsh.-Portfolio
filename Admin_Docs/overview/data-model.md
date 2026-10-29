# 데이터 모델

## 한눈에 보기 (코드 몰라도 OK)

상태: [통과] 사용자 확인 완료 (2026-10-25)
무엇을: 지금은 **진짜 DB에 저장하는 데이터가 없어요.** 데이터는 세 종류예요.

1. 포트폴리오 사례와 노트, Accio·FLASEEK 상품은 코드 안에 직접 적은 목록이에요. 인쇄된 카탈로그 같은 거예요.
2. 장바구니 수, 찜 같은 화면 상태는 브라우저 메모리에만 있어서 새로고침하면 사라져요.
3. 마에스트로의 식당·동네 정보는 헤이유미 API에서 받아요. 키가 없으면 미리 저장한 가짜 JSON에서 받아요.

왜: 포트폴리오와 시안은 저장할 사용자 데이터가 없어요. 무료 서버와 무료 DB를 줄이면 데모가 멈출 일도 줄어요.

## 개발자 상세

### 1) 프론트 정적 데이터

| 데이터                | 파일                                                    | 핵심 타입                                                                                                                                                  |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사례 목록             | `portfolio/data.ts`                                     | `PortfolioCase { slug, type: Front·Back·Design, level, title, keywords, design?: DesignCase }`                                                             |
| 사례 상세 글(Front·Back) | `portfolio/caseStories.ts`                           | `CaseStory { problem, points, result? }`. 검색이 본문까지 찾도록 첫 화면에서 받아요                                                                        |
| 사례 상세 코드(Front·Back) | `portfolio/caseDetails.ts`                         | `CaseDetail { stack, code, team? }`, `CodeSample`, `TeamProject`. 상세를 열 때만 받아요                                                                     |
| 공부 노트             | `portfolio/notes.ts`, `noteData/{front,back,design}.ts` | `StudyNote`. `appliedCases()`로 사례와 연결                                                                                                                |
| 검색 순위             | `portfolio/rank.ts`                                     | `Level 1~4`, `rankCases()`                                                                                                                                 |
| 자동완성              | `portfolio/suggest.ts`                                  | `getAllSuggestions(value)` → `Suggestion { text, type, segments }`. 초성·치는 도중 글자·한영 자판                     |
| 검색                  | `portfolio/search.ts`, `searchText.ts`, `synonyms.ts`, `hangul.ts` | `search(query)` → `{ cases, notes, corrections }`. 역색인 + BM25 + 동의어·오타 고치기([F-007](../features/F-007-search-algorithm/feature.md))                          |
| FLASEEK 상품          | `projects/flaseek/data.ts`                              | `Product { id, name, discount, price, original, perPiece?, rating, reviews, tags(≤2), crop, categories[], thickness?/skin?/pressure?/season?, setCount? }` |
| Accio 상품·AI 응답    | `projects/accio/data/{catalog,detail,aiEngine}.ts`      | 목 데이터                                                                                                                                                  |

- 💡 FLASEEK 상품 사진은 스프라이트 한 장(`assets/products.webp`, 260px 칸 4×4)을 `crop` 좌표로 잘라서 써요. 파일 수를 줄이려고 한 장으로 두되, 처음에는 캡처 원본(425KB)을 통째로 받아서 쓰는 영역이 14%뿐이었어요. 그래서 쓰는 칸 15개만 다시 모아 132KB로 줄였어요(F-001 fix-01).

### 2) 화면 상태 (메모리, 새로고침 시 초기화)

- FLASEEK `store.ts`: 장바구니 수(시작값 2), 찜(`Set<id>`), 토스트(3초 뒤 닫힘). 모두 `useSyncExternalStore` 기반이에요.
- 마에스트로 `store.ts`: 화면 간 공유 상태

### 3) 백엔드 모델

- 마에스트로: DB가 없어요. `yumi/models.py`의 Pydantic 모델(`Region`, `Place`, `LiveStatus`, `Reservation` 등)이 헤이유미 응답을 camelCase로 감싸요. mock은 `yumi/fixtures/{places,regions}.json`을 써요.
- Accio: `core/db.py`에 async SQLAlchemy 엔진과 `get_db`만 있어요(접속 정보는 환경변수 `DATABASE_URL`). **테이블·마이그레이션은 아직 없어요.**

### 앞으로의 계획 (사용자 확인)

- Accio 백엔드는 실제 테이블로 키워요. AI가 응답하는 AI 이커머스, AI가 실시간으로 추천하는 여행 코스 등을 만드는 게 가장 큰 도전이에요.
- 그때는 Accio와 마에스트로를 이 레포에서 분리하고, 이 문서에는 링크만 남겨요([D-001](../decisions/D-001-single-vite-hash-routing.md) 예정된 변화).

최종 수정: 2026-10-26 · 관련: F-001, F-002, F-005, F-007
