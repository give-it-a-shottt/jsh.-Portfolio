import { lazy, Suspense, useCallback, useEffect, useLayoutEffect } from 'react'
import { CASES } from './data'
import DesignCaseDetail from './DesignCaseDetail'
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

interface PortfolioAppProps {
  /** '/' = 홈, '/search' = 결과, '/case' = 사례 상세, '/project' = 프로젝트 페이지, '/study' = Study 홈(slug 없음) · 공부 노트 상세 */
  path: '/' | '/search' | '/case' | '/project' | '/study'
  params: URLSearchParams
  /** path 가 '/case' · '/project' · '/study' 일 때 보여줄 사례·프로젝트·노트 */
  slug?: string
}

// 검색형 포트폴리오 - 홈 → 결과 → 사례 상세. 검색어와 탭은 주소에 남겨 공유·뒤로가기가 되게 한다.
export default function PortfolioApp({ path, params, slug = '' }: PortfolioAppProps) {
  const query = params.get('q') ?? ''
  const tab = readTab(params.get('tab'))
  const isResults = path === '/search'
  // 상세 화면에서는 그 사례의 분류를 헤더 바로가기에 표시한다
  const caseItem = path === '/case' ? CASES.find((item) => item.slug === slug) : undefined

  const search = useCallback((nextQuery: string) => goTo(searchHref(nextQuery)), [])

  // 포트폴리오 테마(포커스 테두리 · 호버 전환 · 옅은 글자)는 포트폴리오에만 - 프로젝트로 나가면 뗀다. 그리기 전에 붙인다.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = 'portfolio'
    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [])

  // 전역 '/' 단축키 - 입력 중이 아닐 때 검색창으로 포커스
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

  return (
    <div className="flex min-h-svh flex-col bg-default">
      <PortfolioHeader search={{ query: isResults ? query : '', onSearch: search }} activeTab={path === '/study' ? 'study' : 'main'} />
      {path === '/project' ? (
        <Suspense fallback={null}>
          {/* key - 다음 프로젝트 · 다음 노트로 넘어갈 때도 새 화면처럼 떠오르게 한다 */}
          <ProjectPage key={slug} slug={slug} />
        </Suspense>
      ) : path === '/study' ? (
        slug ? (
          <StudyDetail key={slug} slug={slug} />
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
