# F-001 FLASEEK 리뉴얼 시안 실제 화면 (#/flaseek)

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 구현은 끝났고, 리뷰를 진행 중이에요.
무엇을: 피그마로 그린 FLASEEK 자사몰 리뉴얼 시안을 **실제로 눌러 볼 수 있는 웹 화면**으로 만들었어요. 메인 → 상품 리스트 → 상품 상세, 로그인까지 있고 PC·모바일을 한 벌로 지원해요. 서버 없이 동작하고, 결제 같은 기능은 "시안이라 연결하지 않았어요"라고 안내해요.
왜: 디자인만이 아니라 퍼블리싱 역량도 보여 주려고요(사용자 구술).

## 설계 의도 (사용자 작성 — 코드 작성 전에 채움)
- 이 기능이 해결하는 문제 (사용자 구술): 퍼블리싱 부분을 조금 강조하고 싶었다.
- 완료 기준 (사용자 구술)
  1. PC·모바일 4화면이 시안과 같다.
  2. 메인 → 리스트 → 상세 흐름이 실제로 동작한다.
  3. 그 동작이 IA·유저플로우에 맞는다.
- 비교 기준 자료: 시안은 `Portfolio/frontend/src/portfolio/assets/design/flaseek/pc-0{1..4}-*.webp`, `mo-0{1..6}-*.webp`, IA·유저플로우는 같은 폴더의 `plan-01-board.webp`(기획 보드)예요.
- 화면·컴포넌트: (사용자 구술 없음)
- API: (사용자 구술 없음)
- 데이터: (사용자 구술 없음)

## 결과 (AI 작성 — 구현 후)
- 커밋: `8ccdb6c` 구현 → `e5533bf` 슬라이더 드래그·상세 탭 밑줄·찜/배지 색 수정 → `91300fe` 채운 하트 80% 축소
- 바뀐 파일
  - 새로 만든 파일: `Portfolio/frontend/src/projects/flaseek/` 전체(`FlaseekApp`, `routes`, `store`, `data`, `layout`, `ui`, `BeforeAfterSlider`, `pages/{Main,List,Detail,Login}Page`, `assets/*`)
  - 수정한 파일: `App.tsx`(lazy 라우트 한 줄), `index.css`(`flaseek-*` 컬러·그림자 토큰), `portfolio/DesignCaseDetail.tsx`(디자인 사례 이미지 라이트박스), `portfolio/data.ts`(사례에 '실제 화면 보기' 링크)
  - 같은 커밋에 섞인 F-001 밖 변경: `projects/accio/home/EventCarousel.tsx`, `projects/accio/ui/primitives.tsx`(e5533bf, Accio 기획전 카운터 순서 수정 — 리뷰 R1·R6에서 발견)
- 실제 구조
  - 라우팅: `FlaseekApp`이 `path`로 4개 화면을 고르고, `params.toString()`을 `key`로 줘서 조건이 바뀌면 화면 상태를 다시 시작해요.
  - 상태: `store.ts`에 장바구니 수·찜·토스트를 `useSyncExternalStore` 모듈 스토어로 둬요. 새로고침하면 사라져요.
  - 데이터: `data.ts`의 상품 12개, 카테고리, 두께, 세트 옵션, 리뷰. 사진은 `products.webp` 한 장을 `crop`으로 잘라 써요.
  - 디자인: 핑크 3역할 토큰(`flaseek`·`flaseek-text`·`flaseek-pink`), 공통 neutral 토큰
- 설계 의도와 다른 점 (리뷰 R6 기준)
  - 완료 기준 1 (시안과 같다): 부분 충족. 상세 화면이 상품 2 값으로 고정돼 있고, 더보기 단위(8 ↔ 시안 PC 12·MO 6)와 모바일 타입 선택 모양이 시안과 달라요.
  - 완료 기준 2 (흐름 동작): 충족. 다만 런드리백 진입점은 상품 0개 화면으로 가요.
  - 완료 기준 3 (IA·유저플로우): 부분 충족. 구매 → 로그인 분기, 정렬 항목, 컬러 선택이 기획 보드와 달라요.
  - 의도 밖 변경: 디자인 사례 라이트박스(모든 Design 사례에 적용되는 공통 변경)

## 리뷰
- [06_CodeReview/F-001-flaseek-renewal/SUMMARY.md](../06_CodeReview/F-001-flaseek-renewal/SUMMARY.md) — 최종 상태: [주의] (위험 0 · 주의 18 · 수용 3, 거절 15)

## 면접 예상 질문
1. 서버 없이 장바구니 수·찜 같은 상태를 화면 여러 곳에서 함께 쓰는데, 어떻게 관리했고 왜 상태 관리 라이브러리 대신 `useSyncExternalStore` 모듈 스토어를 골랐나요?
2. 브랜드 핑크(#FA78A8) 위 흰 글자는 대비가 2.53 : 1이었어요. 브랜드 색을 지키면서 접근성 기준을 어떻게 맞췄나요? 리뷰에서 나온 예외(장바구니 배지)는 어떻게 처리하나요?
3. 상품 사진을 캡처 한 장에서 `crop` 좌표로 잘라 쓴 이유는 무엇이고, 리뷰에서 나온 트레이드오프(425KB 중 13.7%만 사용)를 알고도 유지할 건가요, 바꿀 건가요?
- 답 (사용자 작성)

최종 수정: 2026-10-25 · 관련: D-001
