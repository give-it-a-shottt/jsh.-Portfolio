import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { CASES } from './data'
import DesignCaseDetail from './DesignCaseDetail'
import { EASE_OUT } from './motion'
import PortfolioHeader from './PortfolioHeader'
import IntroMotion from './IntroMotion'
import { goTo, readTab, searchHref, type ResultTab } from './routes'
import { SEARCH_INPUT_ID } from './SearchBox'
import SearchHome from './SearchHome'
import SearchResults from './SearchResults'

// Front·Back 상세는 코드 원문과 하이라이터를 함께 받아서, 열 때만 받는다
const EngineeringCaseDetail = lazy(() => import('./EngineeringCaseDetail'))

const INTRO_SEEN_KEY = 'jsh-intro-seen'

// 같은 세션에서 이미 봤거나, 움직임 줄이기 설정이면 인트로를 건너뛴다. 저장소를 못 쓰면 매번 보여준다.
function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    // 기록하지 못하면 다음 방문에 인트로를 한 번 더 보여줄 뿐이다
  }
}

interface PortfolioAppProps {
  /** '/' = 검색 홈, '/search' = 결과, '/case' = 사례 상세 */
  path: '/' | '/search' | '/case'
  params: URLSearchParams
  /** path 가 '/case' 일 때 보여줄 사례 */
  slug?: string
}

// 검색형 포트폴리오 — 인트로(첫 방문) → 검색 홈 → 결과 → 사례 상세. 검색어와 탭은 주소에 남겨 공유·뒤로가기가 되게 한다.
export default function PortfolioApp({ path, params, slug = '' }: PortfolioAppProps) {
  // 결과·상세 주소로 바로 들어온 경우에는 인트로를 보여주지 않는다
  const [introPlaying, setIntroPlaying] = useState(() => path === '/' && shouldPlayIntro())
  const query = params.get('q') ?? ''
  const tab = readTab(params.get('tab'))
  const isResults = path === '/search'
  // 상세 화면에서는 그 사례의 분류를 헤더 바로가기에 표시한다
  const caseItem = path === '/case' ? CASES.find((item) => item.slug === slug) : undefined

  const finishIntro = useCallback(() => {
    markIntroSeen()
    setIntroPlaying(false)
  }, [])

  const search = useCallback((nextQuery: string) => goTo(searchHref(nextQuery)), [])

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
    if (introPlaying) return
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key !== '/' || target.closest('input, textarea, [contenteditable="true"]')) return
      e.preventDefault()
      document.getElementById(SEARCH_INPUT_ID)?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [introPlaying])

  return (
    // 인트로 출력의 'jsh.' 와 헤더 로고가 같은 layoutId 로 이어지도록 한 그룹에 둔다
    <LayoutGroup>
      <AnimatePresence>
        {introPlaying && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="fixed inset-0 z-30 overflow-y-auto"
          >
            <IntroMotion onDone={finishIntro} />
          </motion.div>
        )}
      </AnimatePresence>

      {!introPlaying && (
        <div className="flex min-h-svh flex-col bg-default">
          <PortfolioHeader
            search={isResults ? { query, onSearch: search } : undefined}
            activeTab={isResults ? tab : caseItem ? (caseItem.type.toLowerCase() as ResultTab) : 'all'}
          />
          {caseItem && !caseItem.design ? (
            <Suspense fallback={null}>
              <EngineeringCaseDetail slug={slug} />
            </Suspense>
          ) : path === '/case' ? (
            // Design 사례, 또는 없는 사례의 안내
            <DesignCaseDetail slug={slug} />
          ) : isResults ? (
            <SearchResults query={query} tab={tab} />
          ) : (
            <SearchHome onSearch={search} />
          )}
        </div>
      )}
    </LayoutGroup>
  )
}
