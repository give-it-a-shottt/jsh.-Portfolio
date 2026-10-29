import { lazy, Suspense, useEffect } from "react";
import PortfolioApp from "./portfolio/PortfolioApp";
import { ACCIO_BASE, LEGACY_ROUTES } from "./projects/accio/routes";
import { MAESTRO_BASE } from "./projects/maestro/routes";
import { FLASEEK_BASE } from "./projects/flaseek/routes";
import { TECHLEARN_BASE } from "./projects/techlearn/routes";
import { NIGHTLY_BASE } from "./projects/nightly/routes";
import useHashRoute from "./shared/hooks/useHashRoute";

// 프로젝트는 들어갈 때 코드를 받는다 — 프로젝트가 늘어도 포트폴리오 첫 화면은 자기 코드만 받는다.
// 새 프로젝트: projects/<이름>/ 를 만들고 아래에 lazy 한 줄 + 라우트 한 줄을 더한다.
const AccioApp = lazy(() => import("./projects/accio/AccioApp"));
const MaestroApp = lazy(() => import("./projects/maestro/MaestroApp"));
const FlaseekApp = lazy(() => import("./projects/flaseek/FlaseekApp"));
const TechlearnApp = lazy(() => import("./projects/techlearn/TechlearnApp"));
const NightlyApp = lazy(() => import("./projects/nightly/NightlyApp"));

/** '/accio', '/accio/list' 처럼 base 아래 경로면 base 뒤 경로('/', '/list')를, 아니면 null */
function subPath(path: string, base: string) {
  if (path === base) return "/";
  return path.startsWith(`${base}/`) ? path.slice(base.length) : null;
}

function App() {
  const route = useHashRoute();

  // 해시 라우팅은 페이지를 바꿔도 스크롤이 유지되므로 맨 위로 올린다
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  // 입구는 검색형 포트폴리오('#/', '#/search?q=…', '#/case/…', '#/study/…'). 각 프로젝트는 '#/<프로젝트>/…' 아래에 있다.
  const [path, search = ""] = route.split("?");
  const params = new URLSearchParams(search);

  const accioPath = subPath(path, ACCIO_BASE) ?? LEGACY_ROUTES[path];
  if (accioPath)
    return (
      <Suspense fallback={null}>
        <AccioApp path={accioPath} params={params} />
      </Suspense>
    );

  const maestroPath = subPath(path, MAESTRO_BASE);
  if (maestroPath)
    return (
      <Suspense fallback={null}>
        <MaestroApp path={maestroPath} params={params} />
      </Suspense>
    );

  const flaseekPath = subPath(path, FLASEEK_BASE);
  if (flaseekPath)
    return (
      <Suspense fallback={null}>
        <FlaseekApp path={flaseekPath} params={params} />
      </Suspense>
    );

  const techlearnPath = subPath(path, TECHLEARN_BASE);
  if (techlearnPath)
    return (
      <Suspense fallback={null}>
        <TechlearnApp path={techlearnPath} params={params} />
      </Suspense>
    );

  const nightlyPath = subPath(path, NIGHTLY_BASE);
  if (nightlyPath)
    return (
      <Suspense fallback={null}>
        <NightlyApp path={nightlyPath} params={params} />
      </Suspense>
    );

  if (path === "/search") return <PortfolioApp path="/search" params={params} />;
  // 사례 상세 '#/case/{slug}'
  if (path.startsWith("/case/"))
    return <PortfolioApp path="/case" params={params} slug={path.slice("/case/".length)} />;
  // 공부 노트 상세 '#/study/{slug}'
  if (path.startsWith("/study/"))
    return <PortfolioApp path="/study" params={params} slug={path.slice("/study/".length)} />;

  // 그 밖의 주소는 포트폴리오 홈으로 보낸다
  return <PortfolioApp path="/" params={params} />;
}

export default App;
