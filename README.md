# jsh.

검색하듯 둘러보는 포트폴리오.

**https://accio-project-one.vercel.app/**

모든 작업을 Front · Back · Design 사례로 싣고, 검색창에 키워드를 넣으면 중요한 사례부터 결과처럼 보여줍니다. Front · Back 사례는 문제 → 해결 → 실제 코드 순으로, Design 사례는 시안과 디자인 시스템 화면으로 정리했습니다. 프로젝트는 사이트 안에서 바로 실행해 볼 수 있습니다.

| 프로젝트 | 주소 |
| --- | --- |
| 마에스트로 | [`#/maestro`](https://accio-project-one.vercel.app/#/maestro) |
| Accio | [`#/accio`](https://accio-project-one.vercel.app/#/accio) |
| Accio v1 원본 (팀 프로젝트, 목 모드) | [`/accio-v1/`](https://accio-project-one.vercel.app/accio-v1/) |

## 사례

| 분류 | 사례 |
| --- | --- |
| **Front** | 마에스트로 — 틀어진 일정의 플랜 B 지휘자 (YUMITHON 2026) |
| | Accio — AI 자연어 검색 쇼핑몰 (팀 프로젝트) |
| | 검색형 포트폴리오 — 이 사이트 |
| | 잠든 무료 서버가 깨는 1분 동안 안내 띄우기 |
| | 서버가 닫힌 팀 프로젝트 원본을 정적 빌드로 살려 두기 |
| | 플랜 등록 후 다시 열면 지난 화면이 남던 문제 — Next 16 화면 보관 (PlanForMe) |
| | 날짜를 바꾸면 이전 날짜의 할 일이 잠깐 보이던 문제 (PlanForMe) |
| **Back** | 하루 70요청 한도 안에서 끼니마다 대안 18곳 미리 찾기 |
| | API 키 없이도 도는 mock ↔ real 클라이언트 교체 구조 |
| | 실제 사장님께 알림이 가지 않게 문의·예약 흉내 내기 |
| | 느리고 한도 있는 외부 API를 실측해 맞춘 호출 계층 |
| | 폐업 의심 매장은 빼고, 오래된 정보는 뒤로 보내기 |
| | 무료 서버·DB 위에서 데모 서비스 유지하기 |
| | 재계산해도 “밀린 분량” 배너가 남던 문제 — 기록은 두고 기준 시점만 저장 (PlanForMe) |
| | 하루 할당량 계산을 순수 함수로 — 기획서 예시가 곧 테스트 (PlanForMe) |
| | 키 없이도 열려 있던 배포 API 막기 (PlanForMe) |
| | UTC 서버에서도 ‘오늘’을 한국 날짜로 (PlanForMe) |
| **Design** | GAMEPROBE — 발로란트 전적·공략 웹 서비스 설계 |
| | remind — 노션 학습노트 복습 퀴즈 앱 설계 |
| | PlanForMe — 하루 할당량을 계산해 주는 플래너 앱 설계 |
| | 숙박 예약 앱 로그인 화면 3안 개선 |

사례 목록과 상세 내용은 [`data.ts`](Portfolio/frontend/src/portfolio/data.ts)와 [`caseDetails.ts`](Portfolio/frontend/src/portfolio/caseDetails.ts)에 있습니다.

## 기술 스택

- **Frontend** — React 19, TypeScript, Vite, Tailwind CSS 4, Motion
- **Backend** — Python, FastAPI, uv, pytest, Ruff
- **Infra** — Vercel(프론트), Render(마에스트로 API), Supabase(Accio DB), GitHub Actions

## 폴더 구조

```
Portfolio/
├─ frontend/                  하나의 Vite 앱
│  ├─ src/portfolio/          검색형 포트폴리오 (입구 '#/', '#/search', '#/case/…')
│  ├─ src/projects/accio/     Accio 쇼핑몰 ('#/accio')  — 프로젝트 소개는 이 폴더 README
│  ├─ src/projects/maestro/   마에스트로 ('#/maestro')
│  └─ public/accio-v1/        Accio 팀 프로젝트 원본 정적 빌드 ('/accio-v1/')
└─ backend/
   ├─ accio/                  Accio API (FastAPI · SQLAlchemy, 지금은 헬스 체크만 있는 뼈대)
   └─ maestro/                마에스트로 API (FastAPI, 헤이유미 API 중계)
└─ external/planforme/        PlanForMe 저장소에서 사례 코드로 보여주는 파일만 복사
render.yaml                   Render 배포 설정
.github/workflows/            Supabase DB 깨우기
```

프로젝트는 해시 라우팅으로 나뉘고, 각 프로젝트 코드는 들어갈 때 받습니다(lazy). 새 프로젝트는 `src/projects/<이름>/`을 만들고 [`App.tsx`](Portfolio/frontend/src/App.tsx)에 라우트를 한 줄 더합니다.

## 로컬 실행

```bash
# 프론트
cd Portfolio/frontend
npm install
npm run dev

# 마에스트로 API (키 없이 mock 모드로 동작)
cd Portfolio/backend/maestro
uv sync
cp .env.example .env
uv run fastapi dev app/main.py --port 8001
```

프론트는 `VITE_MAESTRO_API_URL`이 없으면 `http://localhost:8001`의 마에스트로 API를 부릅니다. API 목록과 테스트 방법은 [마에스트로 API README](Portfolio/backend/maestro/README.md)에 있습니다.
