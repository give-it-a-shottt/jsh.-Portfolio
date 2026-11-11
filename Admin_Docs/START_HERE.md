# START HERE

## 한눈에 보기 (코드 몰라도 OK)

상태: [통과] 새 구조로 옮겼어요(2026-10-29). Overview · D-002 · D-003 · 피그마 링크 모두 사용자 확인(2026-11-08).

**이 서비스는 무엇이고 누구를 위한 것인지** (사용자 확인)

- 무엇: 나를 소개하는 사이트
- 누구를 위해: 나의 성장을 위해, 그리고 서류·면접에서 나를 보여 주기 위해

**지금 상태**

- 공개 중: 검색형 포트폴리오(프로젝트 페이지 4개 포함), 마에스트로(리뉴얼), Accio(따로 배포 · 링크만), FLASEEK 시안, Accio v1 원본, 개인 디자인 시스템 사례, techlearn(미니 인프런으로 따로 배포 · 링크만), Nightly 수면 코칭 시안(홈 · 대시보드 · AI 코치)
- 리뷰: F-001·F-006·F-009·F-010 판정 완료([주의]). F-004 8차 · F-008 · F-011 · F-012는 판정 일부 대기, F-007은 리뷰 전, F-002·F-003·F-005는 백로그예요.
- 진행: 됨 9 · 일부 4 · 다음 0, 열린 질문 0개 ([STATUS.md](STATUS.md), 사용자 확인 완료)

**읽는 순서** (면접 전에는 이것만 읽어도 돼요)

1. 이 문서
2. [STATUS.md](STATUS.md) — 지금 어디까지 왔고, 어떻게 확인했나
3. [overview/architecture.md](overview/architecture.md) — 화면 → 서버 → DB 흐름
4. [overview/screens.md](overview/screens.md) — 무엇이 어디 있고, 화면이 어떻게 이어지는지
5. [features](features/) 최신 3개 — F-012, F-011, F-008
6. [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) — 아직 결정 못 한 것

**폴더 역할**

| 폴더·파일 | 답하는 질문 |
|---|---|
| [STATUS.md](STATUS.md) | 지금 어디까지 왔고, 어떻게 확인했나 |
| [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | 아직 결정 못 한 게 뭔가 |
| [overview](overview/) | 지금 어떻게 생겼나 |
| [decisions](decisions/) | 왜 이렇게 했나 |
| [features](features/) | 무엇을 만들었고, 리뷰 결과는 어땠나 |
| [troubleshooting](troubleshooting/INDEX.md) | 뭐가 막혔고 어떻게 풀었나 |
| [_system](_system/rules.md) | 규칙·용어·리뷰어 기준 (참고용) |

## 개발자 상세

### 기술 스택

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Motion, (마에스트로) Zustand · Leaflet
- Backend: Python, FastAPI, uv, pytest, Ruff, (Accio) SQLAlchemy async
- Infra(검수 범위 밖): Vercel(프론트), Render(마에스트로 API), Supabase(Accio DB), GitHub Actions(DB 깨우기)

### 실행 (비밀값은 `.env.example`을 보고 직접 넣어요)

```bash
cd Portfolio/frontend && npm install && npm run dev      # 프론트
npm run build && npm run lint                            # 검사
npm run search:eval                                      # 검색 채점 (F-007)
npm run check                                            # 주소 해석 · 프로젝트 데이터 확인 (F-011)
cd Portfolio/backend/maestro && uv sync && uv run fastapi dev app/main.py --port 8001
uv run pytest                                            # 백엔드 테스트
# Git Bash에서 uv trampoline 오류가 나면: uv run python -m uvicorn app.main:app --port 8001 / uv run python -m pytest
```

### 폴더 지도

```
Admin_Docs/          이 문서들
  START_HERE.md      한 장 요약
  STATUS.md          기능별 [됨] · [일부] · [다음]과 확인 방법
  OPEN_QUESTIONS.md  아직 결정 못 한 질문 Q-00X
  overview/          architecture · data-model · api-list · screens · design-link
  decisions/         D-00X (결정 1개 = 파일 1개)
  features/          REVIEW_LOG.md, F-00X-제목/ (feature.md + review/)
  troubleshooting/   INDEX.md, T-00X
  _system/           rules · glossary · reviewers/R1~R4 (디자인은 리뷰하지 않음)
Portfolio/frontend/  Vite 앱 하나 (portfolio/, projects/{accio,maestro,flaseek}/, public/accio-v1/)
Portfolio/backend/   maestro/, accio/ (FastAPI)
Portfolio/external/  PlanForMe 사례 코드 사본 (범위 밖)
add_/                Accio 팀 원본, git 제외 (범위 밖)
MyDesign*.md         디자인 시스템 기준 문서 (위치는 overview/design-link.md)
CLAUDE.md            Claude Code가 매번 읽는 Admin_Docs 핵심 규칙·리뷰 범위
```

### 주요 결정

| 번호 | 결정 | 상태 |
|---|---|---|
| [D-001](decisions/D-001-single-vite-hash-routing.md) | Vite 앱 하나 + 해시 라우팅 + lazy | 확인 완료 · Accio·마에스트로 분리 예정 |
| [D-002](decisions/D-002-mock-real-client.md) | 외부 API mock ↔ real 교체 구조 | 확인 완료 |
| [D-003](decisions/D-003-accio-v1-static-build.md) | 팀 원본은 정적 빌드만 보존 | 확인 완료 |
| [D-004](decisions/D-004-notion-notes-semi-auto.md) | 노션 노트는 터미널 한마디로 반자동 옮기기 | 확인 완료 |
| [D-005](decisions/D-005-accio-separate-service.md) | Accio를 포트폴리오 밖 서비스로 분리하고 링크만 | 확인 완료 |
| [D-006](decisions/D-006-techlearn-mini-inflearn-link.md) | techlearn 시안을 지우고 미니 인프런 배포 사이트로 링크만 | 확인 완료 |
| [D-007](decisions/D-007-main-study-landing.md) | 첫 화면 긴 페이지 · 헤더 Main / Study · 피그마 공개 링크 | 확인 완료 |

### 기능

| 번호 | 기능 | 리뷰 |
|---|---|---|
| [F-001](features/F-001-flaseek-renewal/feature.md) | FLASEEK 리뉴얼 시안 | [주의] 판정 완료 |
| [F-002](features/F-002-accio-redesign/feature.md) | Accio 리디자인 | 백로그 |
| [F-003](features/F-003-portfolio-search/feature.md) | 검색형 포트폴리오 | 백로그 |
| [F-004](features/F-004-study-notes/feature.md) | Study 노트 (노션형 홈 · 문서형 상세 · 결과 Study 탭 → Study 홈) | [통과] 7차 · 판정 완료 |
| [F-005](features/F-005-maestro/feature.md) | 마에스트로 | 백로그 |
| [F-006](features/F-006-design-system-case/feature.md) | 개인 디자인 시스템 사례 | [주의] 판정 완료 |
| [F-007](features/F-007-search-algorithm/feature.md) | 검색 알고리즘 개선 (S0~S6) | 리뷰 전 |
| [F-008](features/F-008-techlearn/feature.md) | techlearn 강의 플랫폼 — 시안을 지우고 미니 인프런 배포 사이트로 링크 (2차, 2026-11-08) | [주의] 1차 판정 완료 · 2차 리뷰 |
| [F-009](features/F-009-nightly/feature.md) | Nightly 수면 코칭 시안 (홈 · 수면 대시보드 · AI 코치) | [주의] 판정 완료 |
| [F-010](features/F-010-maestro-renewal/feature.md) | 마에스트로 리뉴얼 (지금 열린 식당 3곳 · Zustand · 유미 real + 저장본) | [주의] 판정 완료 |
| [F-011](features/F-011-portfolio-restructure/feature.md) | 포트폴리오 개편 (탭 Design · Fullstack · Study · 홈 대표 4개 · 프로젝트 페이지 · Accio 링크만) | [통과] 2차 · 판정 일부 대기 |
| [F-013](features/F-013-landing-main/feature.md) | 첫 화면을 프로젝트 중심 긴 페이지로 (카드 8개 · GitHub · 연락처 · 스킬 · 헤더 검색 · Main / Study) | [통과] 2차 · 판정 완료 |

최종 수정: 2026-11-08 · 관련: D-001~D-006, F-001~F-012, Q-001~Q-006
