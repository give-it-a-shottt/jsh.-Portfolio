# 아키텍처

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] 사용자 확인 완료 (2026-10-25)
무엇을: 화면은 **한 건물 안의 여러 매장**처럼 동작해요. 건물(Vite 앱)은 하나이고, 주소의 `#/maestro`, `#/accio`, `#/flaseek`가 각 매장 입구예요. 매장 안의 코드는 손님이 들어올 때 꺼내요(lazy). 서버가 필요한 매장은 마에스트로 하나뿐이고, 마에스트로의 화면 → 마에스트로 API → 헤이유미 API(또는 가짜 데이터) 순서로 흘러요.
왜: 프로젝트가 늘어나도 포트폴리오 첫 화면이 무거워지지 않고, 배포는 하나로 끝나게 하려고요.

```
브라우저 ── Vercel(정적 파일) ── index.html + JS 묶음
   │
   ├─ App.tsx  주소(#/...)를 보고 어느 앱을 띄울지 고름
   │    ├─ PortfolioApp (처음부터 받음)
   │    ├─ MaestroApp ─ lazy ── fetch ──▶ 마에스트로 API (Render, FastAPI)
   │    │                                   └─ YumiClient: mock(JSON) | real(헤이유미 API)
   │    ├─ AccioApp   ─ lazy (목 데이터만)       Accio API (FastAPI+SQLAlchemy, /health 뿐)
   │    └─ FlaseekApp ─ lazy (정적 데이터만)
   └─ /accio-v1/  팀 원본 정적 빌드 (App.tsx 를 거치지 않음)
```

## 개발자 상세

### 프론트 라우팅
- `Portfolio/frontend/src/App.tsx`: `useHashRoute()`로 해시를 읽고, `subPath(path, BASE)`로 프로젝트 base 아래면 그 뒤 경로를 넘겨요. 프로젝트 앱 3개는 `lazy(() => import(...))`와 `Suspense fallback={null}`로 받아요.
- 각 프로젝트는 `projects/<이름>/routes.ts`에 `*_BASE`와 `*Href()`를 두고, 자기 안에서 `path`로 화면을 고르는 같은 패턴을 써요. 예: `FlaseekApp.tsx`
- 해시가 바뀌면 `window.scrollTo(0, 0)`을 불러요. 해시 라우팅은 화면을 바꿔도 스크롤이 남기 때문이에요.

### 프론트 폴더
```
Portfolio/frontend/src/
├─ App.tsx, main.tsx, index.css   진입·라우팅·디자인 토큰(@theme)
├─ shared/                        여러 프로젝트가 같이 쓰는 것 (useHashRoute, MobileFrame, icons)
├─ portfolio/                     검색형 포트폴리오 (data.ts, caseDetails.ts, notes.ts, rank.ts, Search*, *Detail)
└─ projects/
   ├─ accio/     (ai, data, home, my, pages, seller, ui, hooks, utils)
   ├─ maestro/   (api.ts, store.ts, screens/, types.ts)
   └─ flaseek/   (FlaseekApp, routes, store, data, layout, ui, BeforeAfterSlider, pages/)
```
- 상태 관리 패턴: 라이브러리 없이 `useSyncExternalStore`와 모듈 단위 작은 스토어를 써요(`flaseek/store.ts`, `maestro/store.ts`).

### 백엔드
```
Portfolio/backend/maestro/app/
├─ main.py         create_app(): CORS → 라우터 4개 → 에러 핸들러
├─ core/           config(환경변수), errors({"detail":{code,message}} 통일), schemas(CamelModel)
├─ health/ regions/ places/ score/   라우터 (score 는 service.py 에 로직 분리)
└─ yumi/           YumiClient 인터페이스 + mock.py / real.py, deps.py(YUMI_MODE 로 교체)
Portfolio/backend/accio/app/  main.py, core/(config, db: async SQLAlchemy 엔진), health/
```
- 의존 방향: 라우터 → (service) → `YumiClient`(Depends 주입). 라우터는 클라이언트 구현을 몰라요([D-002](../03_Decisions/D-002-mock-real-client.md)).
- 테스트: `backend/*/tests/`(pytest). 프론트에는 테스트 러너가 없어요(`package.json`에 test 스크립트 없음).

### 실행
- 프론트: `cd Portfolio/frontend && npm install && npm run dev`. 검사는 `npm run build`(tsc + vite), `npm run lint`
- 마에스트로 API: `cd Portfolio/backend/maestro && uv sync && uv run fastapi dev app/main.py --port 8001` (`.env.example`을 복사해서 써요. 기본은 mock)

최종 수정: 2026-10-25 · 관련: D-001, D-002, D-003
