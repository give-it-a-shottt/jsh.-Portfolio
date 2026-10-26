# START HERE

## 한눈에 보기 (코드 몰라도 OK)

상태: [주의] 세팅을 마쳤어요. Overview는 사용자 확인을 받았고, D-002·D-003은 아직 확인 전이에요.

**이 서비스는 무엇이고 누구를 위한 것인지** (사용자 구술, 요청에 따라 문장만 정리)

- 무엇: 나를 소개하는 사이트
- 누구를 위해: 나의 성장을 위해, 그리고 서류·면접에서 나를 보여 주기 위해

**지금 상태**

- 공개 중: 검색형 포트폴리오, 마에스트로, Accio 리디자인, FLASEEK 시안, Accio v1 원본, 개인 디자인 시스템 사례
- 리뷰: F-001 FLASEEK 리뷰 완료([주의], 판정 완료). F-002~F-005는 백로그예요.

**읽는 순서** (면접 전에는 이것만 읽어도 돼요)

1. 이 문서
2. [01_Overview/service-map.md](01_Overview/service-map.md) — 무엇이 어디 있는지
3. [02_Design/screens-flow.md](02_Design/screens-flow.md) — 화면 흐름
4. [04_Features](04_Features/) 최신 3개 — F-001부터

## 개발자 상세

### 기술 스택

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Motion
- Backend: Python, FastAPI, uv, pytest, Ruff, (Accio) SQLAlchemy async
- Infra(검수 범위 밖): Vercel(프론트), Render(마에스트로 API), Supabase(Accio DB), GitHub Actions(DB 깨우기)

### 실행 (비밀값은 `.env.example`을 보고 직접 넣어요)

```bash
cd Portfolio/frontend && npm install && npm run dev      # 프론트
npm run build && npm run lint                            # 검사
cd Portfolio/backend/maestro && uv sync && uv run fastapi dev app/main.py --port 8001
uv run pytest                                            # 백엔드 테스트
```

### 폴더 지도

```
Admin_Docs/          이 문서들
Portfolio/frontend/  Vite 앱 하나 (portfolio/, projects/{accio,maestro,flaseek}/, public/accio-v1/)
Portfolio/backend/   maestro/, accio/ (FastAPI)
Portfolio/external/  PlanForMe 사례 코드 사본 (범위 밖)
add_/                Accio 팀 원본, git 제외 (범위 밖)
MyDesign*.md         디자인 시스템 기준 문서
```

### 주요 결정

| 번호                                                    | 결정                              | 상태                                   |
| ------------------------------------------------------- | --------------------------------- | -------------------------------------- |
| [D-001](03_Decisions/D-001-single-vite-hash-routing.md) | Vite 앱 하나 + 해시 라우팅 + lazy | 확인 완료 · Accio·마에스트로 분리 예정 |
| [D-002](03_Decisions/D-002-mock-real-client.md)         | 외부 API mock ↔ real 교체 구조    | 확인 필요                              |
| [D-003](03_Decisions/D-003-accio-v1-static-build.md)    | 팀 원본은 정적 빌드만 보존        | 확인 필요                              |

### 기능

| 번호                                           | 기능                | 리뷰      |
| ---------------------------------------------- | ------------------- | --------- |
| [F-001](04_Features/F-001-flaseek-renewal.md)  | FLASEEK 리뉴얼 시안 | [주의] 판정 완료 |
| [F-002](04_Features/F-002-accio-redesign.md)   | Accio 리디자인      | 백로그    |
| [F-003](04_Features/F-003-portfolio-search.md) | 검색형 포트폴리오   | 백로그    |
| [F-004](04_Features/F-004-study-notes.md)      | Study 노트          | 백로그    |
| [F-005](04_Features/F-005-maestro.md)          | 마에스트로          | 백로그    |
| [F-006](04_Features/F-006-design-system-case.md) | 개인 디자인 시스템 사례 | 설계 의도 대기 |

최종 수정: 2026-10-26 · 관련: D-001~D-003, F-001~F-006
