# F-011 포트폴리오 개편 — 탭 Design · Fullstack · Study, 홈 대표 프로젝트, 프로젝트 페이지

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] 2차 리뷰 (2026-11-05). 설계 의도 첫 문장 · 홈 첫 문장 · 역할 값은 사용자 확인을 기다려요.
무엇을: 탭을 Front · Back · Design · Study 네 개에서 **Design · Fullstack · Study** 세 개로 줄이고, 홈에 "먼저 볼 프로젝트" 4개를 두고, 프로젝트마다 한 페이지(`#/project/{slug}`)에서 화면 · 구조 · 숫자 · 결정 · 막힌 것을 보여 줘요. 사이트 안의 Accio 앱(`#/accio`)은 지우고 배포 주소로 링크만 걸어요.
왜: 면접관이 처음 들어왔을 때 무엇부터 봐야 할지 몰랐어요.

## 설계 의도 (사용자 확인 — 코드 작성 전에 채움, 문장 정리사 사용)
- 이 기능이 해결하는 문제: (사용자 확인 대기) 초안 — 면접관이 처음 들어왔을 때 무엇부터 봐야 할지 바로 알 수 있게, 홈에서 대표 프로젝트 4개를 먼저 보여 준다. 프로젝트마다 어떤 프로젝트이고 무엇을 했는지를 한 페이지에서 설명한다. 작업을 기술별로 나누지 않고 프로젝트 단위로 묶는다.
- 정한 것 (사용자 확인, 2026-11-05)
  - 지원 직무는 디자인 · 개발 반반 → 탭 순서 Design · Fullstack · Study.
  - Fullstack 탭에는 백엔드가 없는 시안도 두고, 카드마다 실제로 맡은 부분만 역할 칩(Design · Front · Back · DB)으로 표시한다.
  - 먼저 볼 프로젝트: remind · Accio · 마에스트로 · PlanForMe.
  - Accio는 사이트 안 앱을 지우고 배포 주소(accio-two.vercel.app)로 링크만. `/accio-v1/` 팀 원본은 남긴다.
  - 화면 기준: 피그마 jsh 파일 Page 3의 `Home · PC 1440`, `Project · Accio · PC 1440`. 다른 프로젝트 페이지는 같은 틀을 쓴다(따로 그리지 않음).
- API · 데이터: 없음 — 코드 안 정적 데이터.

## 결과 (AI 작성 — 구현 후)
- 탭: `routes.ts`의 `ResultTab`을 `all · design · fullstack · study`로 바꿨어요. 예전 `?tab=front|back` 주소는 `readTab()`이 `fullstack`으로 읽어요. 사례 분류(`CaseType` Front · Back · Design)는 그대로 두고, `caseTab()`이 Front · Back을 Fullstack 한 탭으로 묶어요.
- 역할 칩: `PortfolioCase.roles?`(Design · Front · Back · DB)를 더했고, 없으면 분류 하나로 보여 줘요(`caseRoles()`). 결과 목록 · 사례 상세의 `CaseMeta`가 분류 배지 대신 `RoleChips`를 그려요. 색 토큰은 `index.css`의 `role-*`.
- 홈(`SearchHome.tsx`): 소개(7칸) + 검색 카드(5칸) → 먼저 볼 프로젝트 2×2 → 탭 안내 3칸 + 진행 중 칩. 예전 '최근 기록'은 뺐어요.
- 프로젝트 페이지(`ProjectPage.tsx`, `#/project/{slug}`, lazy): 화면 | 구조 → 정보 띠 → 숫자 4개 → 목차 + 본문(왜 · 결정 · 정확도 · 막힌 것 · 화면 · 다음 단계) → 다음 프로젝트. 데이터는 `projects.ts` 한 곳이고, 칸이 비면 그 섹션과 목차 줄을 그리지 않아요. 마에스트로 · PlanForMe의 '막힌 것'은 기존 사례(`data.ts`)를 그대로 끌어와 사례 상세로 이어요.
- Accio: `projects/accio/` 폴더와 `App.tsx` 라우트를 지웠어요. 예전 `#/accio/…` 주소는 `#/project/accio`로 보내요. 사례 링크는 배포 주소(`ACCIO_LIVE`)로, `/accio-v1/`은 그대로예요. 지운 코드를 보여 주던 사례 코드 예시(useCart.ts) 한 칸도 뺐어요.
- 설계 의도와 다른 점
  - 헤더는 피그마의 밑줄형 메뉴 + 검색창 대신 기존 알약형 바로가기를 그대로 두고 라벨만 바꿨어요.
  - 사이트 색은 기존 Ivory 테마 그대로예요(피그마 시안은 Light).
  - 홈 첫 문장은 피그마 시안의 "화면에서 구조까지, 하나의 경험으로."를 그대로 썼어요 — 사용자 확인 필요.
  - remind 역할 칩(Design · Front)과 Accio 정보 띠(역할 · 기간)는 기록에서 추정한 값이라 사용자 확인 필요.
  - `backend/accio/` 뼈대와 GitHub Actions의 Supabase 깨우기는 이번 범위에서 건드리지 않았어요.
  - 예전 주소 호환(`?tab=front|back` → fullstack, `#/accio/…` → `#/project/accio`)은 '정한 것'에 없던 AI 판단이에요 — 사용자 확인 필요.
- 1차 리뷰 뒤 고친 것(주의 5개): `readTab()`이 `Object.hasOwn`으로 예전 탭을 찾아 `?tab=constructor` 같은 주소가 새지 않아요. 프로젝트 페이지의 '왜 만들었나'는 `designProblem()`이 사례에서 꺼내고 없으면 오류를 내요. 배포 주소는 `data.ts` 상수(`ACCIO_LIVE` · `PLANFORME_LIVE` · `REMIND_LIVE`)를 사례와 함께 써요. Accio 역할이 두 곳에서 다른 건 일부러예요(사례 = 2025 팀 프로젝트에서 맡은 부분, 프로젝트 = 혼자 다시 만든 쪽 — 사용자 확인 필요). 테스트 러너 대신 `npm run check`(checks/run.mjs, 50개)로 주소 해석 · 프로젝트 데이터 갈림길을 확인해요. 결정 문서 [D-005](../../decisions/D-005-accio-separate-service.md)를 썼어요.

## 리뷰
- [review/SUMMARY.md](review/SUMMARY.md) — 2차(2026-11-05) R1 · R3 · R4: [통과] 지적 없음. 1차(R1~R5) 주의 5개를 고쳤고 제안 11개는 남아 있어요. 최종 판정의 거절 · 다음에 고칠 것은 사용자 확인 대기.

## 면접 예상 질문
- 사례(작업 조각)와 프로젝트 페이지를 왜 따로 두었고, 둘의 데이터가 어긋나지 않게 하려면 어떻게 해야 하나요?
- 해시 라우팅에서 목차 링크를 `#섹션`으로 걸지 않고 버튼 + scrollIntoView로 만든 이유는 무엇인가요?
- 예전 주소(`?tab=front`, `#/accio/…`)를 깨지 않게 하려고 어떤 처리를 했고, 그 처리에 어떤 함정이 있었나요?
- 답 (사용자 확인 — 문장 정리사 사용)

최종 수정: 2026-11-05 · 관련: D-001, D-005, F-003, F-004, F-007
