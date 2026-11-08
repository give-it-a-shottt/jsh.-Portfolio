# F-013 첫 화면을 프로젝트 중심 긴 페이지로 · Main / Study

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] 2차 리뷰 통과 · 1차 판정 완료(2026-11-08). 검색 결과 탭은 Q-006으로 남았어요.
무엇을: 첫 화면을 스크롤 한 번으로 나를 다 보는 긴 페이지로 바꿔요. 프로젝트 8개를 작은 카드로 모두 보여 주고, GitHub · 연락처 · 스킬도 첫 화면에 둬요. 검색은 헤더로 작게 남기고, 탭은 Main / Study 두 개로 줄여요. 이력서 한 장에 프로젝트 목록과 연락처가 같이 있는 것과 같아요.
왜: 검색을 안 쓰는 사람이 많을 것 같고, 서비스 하나의 디자인 · 프론트 · 백엔드가 흩어져 있어서예요.

## 설계 의도 (사용자 확인 — 코드 작성 전에 채움, 문장 정리사 사용)
- 이 기능이 해결하는 문제: 사람들이 검색을 안 쓸 확률이 높은데 첫 화면에서 검색의 비중이 크다. '먼저 볼 프로젝트' 카드가 지금도 너무 커서 새 프로젝트를 추가하기 부담스럽다. 프론트 · 디자인 · 백엔드에 나눠 적은 내용이 서비스를 소개할 때 한 번에 보이지 않는다. (사용자 확인, 2026-11-08)
- 완료 기준(무엇이 되면 끝인지): (사용자 확인, 2026-11-08)
  1. 첫 화면에서 백엔드가 있든 없든, 디자인만 한 것도 프로젝트 단위로 모두 보인다(AI 수면 · 미니 인프런 · 게임프루브 포함). 카드는 지금보다 작다.
  2. 첫 화면에 GitHub, 연락처, 스킬도 보인다.
  3. 검색은 남기고 헤더로 작아진다.
  4. 프로젝트 페이지 한 장에서 그 서비스의 디자인 · 프론트 · 백엔드 내용을 다 볼 수 있다.
  5. Design · Fullstack 탭을 합쳐 Main / Study 두 개로 한다.
  6. 디자인은 피그마 공개 링크로 와서 볼 수 있다.
- 화면: 홈 `#/`(SearchHome.tsx), 헤더(PortfolioHeader.tsx), 프로젝트 페이지 `#/project/{slug}`(ProjectPage.tsx), 검색 결과 탭(SearchResults.tsx). (AI 기재 — 완료 기준에서 정리)
- API: GitHub 표시 방법을 정한 뒤 적어요.
- 데이터: 프로젝트 목록 `projects.ts`가 4개 → 8개. 카드는 이 목록에서 자동으로 그려서, 프로젝트를 추가할 때 데이터 한 줄이면 되게 해요. (AI 기재 — "추가할 때마다 뭔가 하는 게 이상하다"에서 정리)

### 이미 정한 것 (사용자 결정, 2026-11-08)
- 첫 화면 프로젝트 카드는 8개: Accio · 마에스트로 · PlanForMe · remind · 미니 인프런(techlearn) · AI 수면(Nightly) · 게임프루브 · FLASEEK. 개인 디자인 시스템 · 로그인 유지 · 비밀번호 찾기 · 검색형 포트폴리오는 카드로 올리지 않아요.
- 검색은 남겨요.
- 디자인은 피그마 공개 링크(보기 전용, 복사 · 내보내기 끔)로 보여 줘요.

### 피그마 공개 링크 (보기 전용, 공유 추적 값 `t=`는 뺌)
| 프로젝트 | 링크 |
|---|---|
| Accio | https://www.figma.com/design/rDAy4sMyRqyF3lQ4baGLq2/ACCIO?node-id=464-2 |
| 마에스트로 | https://www.figma.com/design/Tec5SHtst0FxyN5P1bm4UT/%EB%A7%88%EC%97%90%EC%8A%A4%ED%8A%B8%EB%A1%9C?node-id=66-113 |
| PlanForMe | https://www.figma.com/design/yHn20tfa3RyUmmRYaRTYcl/PlanForMe?node-id=0-1 |
| remind | https://www.figma.com/design/F9bo9j2bIabfqRtZW87ua2/remind?node-id=0-1 |
| 미니 인프런(techlearn) | https://www.figma.com/design/WLnNcSmrkE1zDS9lFPpg9p/techlearn-%EB%94%94%EC%9E%90%EC%9D%B8?node-id=28-2 |
| AI 수면(Nightly) | https://www.figma.com/design/LByldIr3d9DfRfnAxblB32/AI-%EC%88%98%EB%A9%B4?node-id=0-1 |
| 게임프루브 | https://www.figma.com/design/zMbn8YMcz2YgxuEatTZGlj/gameprobe?node-id=0-1 |
| FLASEEK | https://www.figma.com/design/Cv5stZORnc3A75SSvywqat/Untitled?node-id=0-1 (파일 이름 "Untitled" → 바꾸면 주소도 갱신) |

## 결과 (AI 작성 — 구현 후)
- 첫 화면: `SearchHome.tsx` → `HomePage.tsx`로 이름을 바꾸고 다시 짰어요. 소개(글 + 한눈에: 프로젝트 수 · 공부 노트 수 · GitHub 기여 수 · 이메일 · GitHub) → 프로젝트 8개(작은 카드, 1 · 2 · 4열) → 스킬 5묶음 → GitHub(잔디 + 대표 레포 6개) → 공부 기록(Study로). 아래쪽 연락처 섹션과 GitHub 섹션의 'GitHub 프로필' 버튼은 맨 위 '한눈에' 칸과 겹쳐서 뺐어요(사용자 결정, 2026-11-08) — 연락처는 '한눈에' 칸 한 곳이에요.
- 스킬: 사용자 확인으로 Illustrator · Pydantic을 뺐어요(2026-11-08). Pydantic은 FastAPI와 겹쳐요. '어디서부터 볼까요' 3칸과 '진행 중인 프로젝트' 칩(`data.ts` `PROJECTS`)은 지웠어요.
- 프로젝트 데이터(`projects.ts`): 미니 인프런 · Nightly · GAMEPROBE · FLASEEK 4개를 더했어요. 홈 카드는 `PROJECT_LIST` 순서 그대로라, 프로젝트를 하나 넣으면 카드 · 프로젝트 페이지 · '다음 프로젝트'가 같이 생겨요(`FEATURED_SLUGS` 삭제). 카드 숫자 3개(`card.metrics`)는 화면에서 빠져서 데이터도 지웠어요.
- 프로젝트 페이지(`ProjectPage.tsx`): '왜 만들었나' 다음에 '디자인' 섹션을 넣었어요. 같은 서비스의 Design 사례 시안 최대 6장(아래 '화면'과 겹치는 그림은 뺌) + '디자인 과정 전체 보기' + '피그마에서 보기 ↗'. 구조 패널 · 숫자가 없는 프로젝트(GAMEPROBE)는 그 칸을 그리지 않아요. 위치 표시에서 'Fullstack'을 뺐어요.
- 헤더(`PortfolioHeader.tsx`): 모든 화면에 40px 작은 검색창(`SearchBox` `sm`) + Main(`#/`) / Study(`#/study`) 두 탭.
- GitHub 잔디: 바깥 이미지 서비스(ghchart)가 응답하지 않아, `npm run github:sync`(`scripts/github-sync.mjs`)가 github.com 공개 잔디 페이지를 받아 `githubContributions.json`에 저장하고 `GitHubHeatmap.tsx`가 그려요. 받기에 실패하면 기존 파일을 그대로 둬요. 스킬 · 레포 · 연락처는 `profile.ts`.
- 새 이미지: 미니 인프런(배포 사이트 홈 · 로그인)과 Nightly(홈 · 대시보드 · 코치) 화면을 1440px로 찍어 webp로 넣었어요. 미니 인프런 강의 목록 · 상세는 배포 API가 3분 넘게 응답하지 않아 못 찍었어요.
- 2차 수정(리뷰 수용): 대표 레포 · 잔디 저장본 검사 6개(check 188개), 홈 카드 이미지 lazy, `DESIGN_PREVIEW_MAX`, sync가 기여 수를 0으로 잘못 읽으면 저장 거부.
- 확인(1차 시점): `npm run check` 182/182(프로젝트 slug 중복 · 피그마 링크 · 디자인 섹션 시안 · 미니 인프런 링크 추가), lint · build 통과, `search:eval` MRR 0.94(변화 없음), Playwright로 홈(1440 · 390) · 프로젝트 페이지 3개 · Study 가로 스크롤 없음, 콘솔 오류 0.
- 설계 의도와 다른 점
  - 검색 결과 화면의 탭(전체 · Design · Fullstack · Study)은 그대로 뒀어요. 헤더 탭만 Main / Study로 합쳤어요 — [Q-006](../../OPEN_QUESTIONS.md).

## 리뷰
- [review/SUMMARY.md](review/SUMMARY.md): 1차(2026-11-08) [주의] 위험 0 · 주의 3 · 제안 9 → 수용분 수정 → 2차 R1 · R3 [통과] 제안 1(회차 안 해결). 판정 완료(사용자 확인).

## 열린 질문
- Q-006

## 면접 예상 질문
- 구현 후 작성

최종 수정: 2026-11-08 · 관련: F-003, F-007, F-011
