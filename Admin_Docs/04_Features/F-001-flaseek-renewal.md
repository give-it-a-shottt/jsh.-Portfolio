# F-001 FLASEEK 리뉴얼 시안 실제 화면 (#/flaseek)

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 구현은 끝났고, 설계 의도를 받은 뒤 리뷰할 예정이에요.
무엇을: 피그마로 그린 FLASEEK 자사몰 리뉴얼 시안을 **실제로 눌러 볼 수 있는 웹 화면**으로 만들었어요. 메인 → 상품 리스트 → 상품 상세, 로그인까지 있고 PC·모바일을 한 벌로 지원해요. 서버 없이 동작하고, 결제 같은 기능은 "시안이라 연결하지 않았어요"라고 안내해요.
왜: ❓ (설계 의도를 받은 뒤 채워요)

## 설계 의도 (사용자 작성 — 코드 작성 전에 채움)
- 이 기능이 해결하는 문제:
- 완료 기준(무엇이 되면 끝인지):
- 화면·컴포넌트:
- API: 없음 (서버 호출 없음) — ❓ 확인
- 데이터:

## 결과 (AI 작성 — 구현 후)
- 커밋: `8ccdb6c` 구현 → `e5533bf` 슬라이더 드래그·상세 탭 밑줄·찜/배지 색 수정 → `91300fe` 채운 하트 80% 축소
- 바뀐 파일
  - 새로 만든 파일: `Portfolio/frontend/src/projects/flaseek/` 전체(`FlaseekApp`, `routes`, `store`, `data`, `layout`, `ui`, `BeforeAfterSlider`, `pages/{Main,List,Detail,Login}Page`, `assets/*`)
  - 수정한 파일: `App.tsx`(lazy 라우트 한 줄), `index.css`(`flaseek-*` 컬러·그림자 토큰), `portfolio/DesignCaseDetail.tsx`(디자인 사례 이미지 라이트박스), `portfolio/data.ts`(사례에 '실제 화면 보기' 링크)
- 실제 구조
  - 라우팅: `FlaseekApp`이 `path`로 4개 화면을 고르고, `params.toString()`을 `key`로 줘서 조건이 바뀌면 화면 상태를 다시 시작해요.
  - 상태: `store.ts`에 장바구니 수·찜·토스트를 `useSyncExternalStore` 모듈 스토어로 둬요. 새로고침하면 사라져요.
  - 데이터: `data.ts`의 상품 12개, 카테고리, 두께, 세트 옵션, 리뷰. 사진은 `products.webp` 한 장을 `crop`으로 잘라 써요.
  - 디자인: 핑크 3역할 토큰(`flaseek`·`flaseek-text`·`flaseek-pink`), 공통 neutral 토큰
- 설계 의도와 다른 점: ❓ (설계 의도를 받은 뒤 비교해요)

## 리뷰
- [06_CodeReview/F-001-flaseek-renewal/SUMMARY.md](../06_CodeReview/F-001-flaseek-renewal/SUMMARY.md) — 최종 상태: (리뷰 전)

## 면접 예상 질문
- (리뷰 후 AI 작성)
- 답 (사용자 작성)

최종 수정: 2026-10-25 · 관련: D-001
