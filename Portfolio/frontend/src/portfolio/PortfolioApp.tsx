import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { CASES } from './data'
import DesignCaseDetail from './DesignCaseDetail'
import LandingBoundary from './landing/LandingBoundary'
import { shouldShowLanding } from './landing/landingSeen'
import PortfolioFooter from './PortfolioFooter'
import PortfolioHeader from './PortfolioHeader'
import { goTo, readTab, searchHref } from './routes'
import { SEARCH_INPUT_ID } from './SearchBox'
import HomePage from './HomePage'
import SearchResults from './SearchResults'
import StudyDetail from './StudyDetail'
import StudyHome from './StudyHome'

// Front·Back 상세는 코드 원문과 하이라이터를 함께 받아서, 열 때만 받는다
const EngineeringCaseDetail = lazy(() => import('./EngineeringCaseDetail'))
// 프로젝트 페이지(F-011)도 들어갈 때 받는다
const ProjectPage = lazy(() => import('./ProjectPage'))
// 자소서형 랜딩(F-014)은 첫 방문 때만 쓰여서, 다시 오는 사람은 받지 않게 나눈다
const CoverLanding = lazy(() => import('./landing/CoverLanding'))

interface PortfolioAppProps {
  /** '/' = 홈, '/search' = 결과, '/case' = 사례 상세, '/project' = 프로젝트 페이지, '/study' = Study 홈(slug 없음) · 공부 노트 상세 */
  path: '/' | '/search' | '/case' | '/project' | '/study'
  params: URLSearchParams
  /** path 가 '/case' · '/project' · '/study' 일 때 보여줄 사례·프로젝트·노트 */
  slug?: string
}

// 검색형 포트폴리오 — (첫 방문) 자소서 랜딩 → 홈 → 결과 → 사례 상세. 검색어와 탭은 주소에 남겨 공유·뒤로가기가 되게 한다.
export default function PortfolioApp({ path, params, slug = '' }: PortfolioAppProps) {
  // 자소서형 랜딩(F-014)은 홈 주소로 처음 들어왔을 때만, 탭마다 한 번(Q-007). 결과 · 상세 주소로 바로 들어오면 띄우지 않는다.
  const [landingPending, setLandingPending] = useState(() => path === '/' && shouldShowLanding())
  // PortfolioApp 은 주소가 바뀌어도 그대로 살아 있다. 랜딩이 떠 있다가 다른 주소로 나가면(링크 · 주소창)
  // 홈으로 돌아와도 다시 띄우지 않는다 — 이전 주소를 기억해 두고 그리는 중에 맞춘다(effect 없이).
  const [prevPath, setPrevPath] = useState(path)
  if (path !== prevPath) {
    setPrevPath(path)
    if (landingPending) setLandingPending(false)
  }
  const showLanding = landingPending && path === '/'
  const query = params.get('q') ?? ''
  const tab = readTab(params.get('tab'))
  const isResults = path === '/search'
  // 상세 화면에서는 그 사례의 분류를 헤더 바로가기에 표시한다
  const caseItem = path === '/case' ? CASES.find((item) => item.slug === slug) : undefined

  const search = useCallback((nextQuery: string) => goTo(searchHref(nextQuery)), [])

  // 건너뛰기 · '포트폴리오 보러 가기' · 랜딩을 못 그렸을 때 — 홈 맨 위로. '봤음' 기록은 랜딩이 뜰 때 이미 했다.
  const finishLanding = useCallback(() => {
    setLandingPending(false)
    window.scrollTo(0, 0)
  }, [])

  // Ivory 테마는 포트폴리오에만 — <html> 에 붙여 스크롤 끝 배경까지 맞추고, 프로젝트로 나가면 뗀다.
  // 그리기 전에 붙여야 흰 화면이 한 번 비치지 않는다.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = 'ivory'
    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [])

  // 전역 '/' 단축키 — 입력 중이 아닐 때 검색창으로 포커스
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key !== '/' || target.closest('input, textarea, [contenteditable="true"]')) return
      e.preventDefault()
      document.getElementById(SEARCH_INPUT_ID)?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (showLanding)
    return (
      <LandingBoundary onFail={finishLanding}>
        <Suspense fallback={<div className="min-h-svh bg-default" />}>
          <CoverLanding onDone={finishLanding} />
        </Suspense>
      </LandingBoundary>
    )

  return (
    <div className="flex min-h-svh flex-col bg-default">
      <PortfolioHeader search={{ query: isResults ? query : '', onSearch: search }} activeTab={path === '/study' ? 'study' : 'main'} />
      {path === '/project' ? (
        <Suspense fallback={null}>
          <ProjectPage slug={slug} />
        </Suspense>
      ) : path === '/study' ? (
        slug ? (
          <StudyDetail slug={slug} />
        ) : (
          <StudyHome area={params.get('area')} course={params.get('course')} />
        )
      ) : caseItem && !caseItem.design ? (
        <Suspense fallback={null}>
          <EngineeringCaseDetail slug={slug} />
        </Suspense>
      ) : path === '/case' ? (
        // Design 사례, 또는 없는 사례의 안내
        <DesignCaseDetail slug={slug} />
      ) : isResults ? (
        <SearchResults query={query} tab={tab} />
      ) : (
        <HomePage />
      )}
      <PortfolioFooter />
    </div>
  )
}
