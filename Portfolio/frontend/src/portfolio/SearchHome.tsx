import { motion, useReducedMotion } from 'motion/react'
import { CASES, PROJECTS, TYPE_DOT_CLASS, type CaseType } from './data'
import { EASE_OUT } from './motion'
import { NOTES, noteHref } from './notes'
import { rankCases } from './rank'
import { searchHref, type ResultTab } from './routes'
import SearchBox from './SearchBox'

interface RecentRow {
  key: string
  kind: '사례' | '공부'
  href?: string
  date: string
  /** 날짜 옆 출처 — 사례는 서비스 이름(없으면 첫 태그), 노트는 강의 묶음 */
  source: string
  title: string
}

const KIND_BADGE_CLASS: Record<RecentRow['kind'], string> = {
  사례: 'bg-portfolio-soft text-portfolio',
  공부: 'bg-study-soft text-study-strong',
}

const RECENT_PER_AREA = 3
const AREAS: CaseType[] = ['Design', 'Front', 'Back']

// 홈 '최근 기록' — 분야마다 3줄. 사례는 날짜가 월 단위라 최신순으로 섞으면 노트에 밀려서,
// 중요도 1위(rank.ts) 사례 하나를 맨 위에 두고 나머지를 최신 노트로 채운다. 노트가 모자라면 사례로 채운다.
const RECENT = AREAS.map((area) => {
  const cases = rankCases(CASES.filter((item) => item.type === area))
  const notes = NOTES.filter((note) => note.area === area)
  const noteCount = Math.min(notes.length, RECENT_PER_AREA - 1)
  const rows: RecentRow[] = [
    ...cases.slice(0, RECENT_PER_AREA - noteCount).map((item) => ({
      key: item.slug,
      kind: '사례' as const,
      href: item.href,
      date: item.date,
      source: item.design?.app.split(' — ')[0] ?? item.tags[0],
      title: item.title,
    })),
    ...notes.slice(0, noteCount).map((note) => ({
      key: note.slug,
      kind: '공부' as const,
      href: noteHref(note.slug),
      date: note.date,
      source: note.course,
      title: note.title,
    })),
  ]
  return { area, total: cases.length + notes.length, rows }
})

interface SearchHomeProps {
  onSearch: (query: string) => void
  /** 인트로의 자기소개 영상을 다시 튼다 */
  onReplayIntro: () => void
}

// 검색 홈 — 구글처럼 가운데 검색창 하나, 스크롤하면 분야별 최근 기록. 인트로가 걷히면 위에서부터 차례로 떠오른다.
// 제목은 확장(C) 스케일 C-2 → C-3 → 시안의 40px.
export default function SearchHome({ onSearch, onReplayIntro }: SearchHomeProps) {
  const reduceMotion = useReducedMotion()
  const rise = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.15 + order * 0.08, ease: EASE_OUT },
        }
  // 아래 카드 영역은 스크롤해서 화면에 들어올 때 한 번만 같은 방식으로 떠오른다. 한 줄(3장) 안에서만 살짝 차례를 둔다.
  const reveal = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.5, delay: order * 0.06, ease: EASE_OUT },
        }

  return (
    <main className="flex flex-1 flex-col items-center px-5 pt-[16vh] pb-24 sm:px-10">
      <div className="flex w-full max-w-180 flex-col items-center text-center">
        <motion.p {...rise(0)} className="flex flex-wrap items-center justify-center gap-3">
          <span lang="en" className="rounded-full border border-regular px-3 py-1 text-13 font-medium tracking-normal text-sub">
            Portfolio Search
          </span>
          <span className="text-13 text-sub-weak">문제 해결 사례 · 공부 기록 아카이브</span>
          <button
            type="button"
            onClick={onReplayIntro}
            className="text-13 font-medium text-portfolio hover:underline underline-offset-4"
          >
            <span aria-hidden="true">▶</span> 자기소개 영상 (1분)
          </button>
        </motion.p>
        <motion.h1 {...rise(1)} className="mt-4 text-28 font-semibold break-keep text-main sm:text-32 lg:text-40">
          어떤 문제가 궁금하세요?
        </motion.h1>
        <motion.p {...rise(2)} className="mt-3 text-16 break-keep text-sub sm:text-18">
          실제 업무에서 마주칠 문제를 풀고, 그 과정에서 공부한 내용까지 함께 기록했습니다.
        </motion.p>

        {/* 자동완성 목록이 아래 프로젝트 칩 위로 펼쳐지도록 쌓임 순서를 올린다 */}
        <motion.div {...rise(3)} className="relative z-10 mt-10 w-full text-left">
          <SearchBox size="lg" glow onSearch={onSearch} />
        </motion.div>

        <motion.div {...rise(4)} className="mt-8 flex flex-col items-center gap-3">
          <h2 id="projects-title" className="text-13 font-medium text-sub-weak">
            진행 중인 프로젝트
          </h2>
          {/* 칩 4개가 PC 한 줄에 들어가게 위 720 폭보다 넓게 연다 */}
          <ul aria-labelledby="projects-title" className="flex flex-wrap justify-center gap-2 lg:w-200">
            {PROJECTS.map(({ name, summary, href }) => {
              const chip = (
                <>
                  {/* 초록 점 = 진행 중 */}
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-status-success" />
                  <span className="font-medium text-main">{name}</span>
                  <span className="text-sub-weak">{summary}</span>
                </>
              )
              const chipClass = 'flex items-center gap-2 rounded-full border border-regular bg-default px-4 py-2 text-14'
              return (
                <li key={name}>
                  {href ? (
                    <a href={href} className={`${chipClass} hover:border-black hover:bg-light`}>
                      {chip}
                    </a>
                  ) : (
                    // 아직 화면이 없는 프로젝트 — 누르지 않는 이름표
                    <span className={chipClass}>
                      {chip}
                      <span className="sr-only">(화면 준비 중)</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>

      {/* 분야별 최근 기록 — 12컬럼 4+4+4 → 모바일 1단 */}
      <section aria-labelledby="recent-title" className="mt-20 w-full max-w-300">
        <motion.div {...reveal(0)} className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="flex flex-col gap-3">
            <h2 id="recent-title" className="text-24 font-semibold text-main sm:text-28">
              최근 기록
            </h2>
            <p className="text-15 break-keep text-sub">분야별로 최신 글 3개씩 모았어요. 사례와 공부 노트가 함께 있어요.</p>
          </div>
          <a href={searchHref()} className="text-14 font-medium text-sub hover:text-main hover:underline underline-offset-4">
            전체 보기 →
          </a>
        </motion.div>
        <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {RECENT.map(({ area, total, rows }, i) => (
            <motion.section key={area} aria-labelledby={`recent-${area}`} {...reveal(i)}>
              <div className="flex items-center justify-between border-b border-black pb-4">
                <h3 id={`recent-${area}`} className="flex items-center gap-2">
                  <span aria-hidden="true" className={`size-2 rounded-full ${TYPE_DOT_CLASS[area]}`} />
                  <span lang="en" className="text-18 font-semibold text-main">
                    {area}
                  </span>
                  <span className="text-14 text-sub-weak">
                    {total}
                    <span className="sr-only">개</span>
                  </span>
                </h3>
                <a
                  href={searchHref('', area.toLowerCase() as ResultTab)}
                  className="text-14 font-medium text-sub hover:text-main hover:underline underline-offset-4"
                >
                  더보기 →<span className="sr-only"> ({area} 전체)</span>
                </a>
              </div>
              <ul>
                {rows.map((row) => (
                  <li key={row.key} className="border-b border-light">
                    <a href={row.href} className="group flex flex-col gap-2 py-5">
                      <p className="flex items-center gap-2 text-12 text-sub-weak">
                        <span className={`rounded-badge px-1.5 py-px font-medium ${KIND_BADGE_CLASS[row.kind]}`}>
                          {row.kind}
                        </span>
                        <span className="truncate">
                          {row.date} · {row.source}
                        </span>
                      </p>
                      <h4 className="line-clamp-2 text-16 font-semibold break-keep text-main group-hover:text-portfolio">
                        {row.title}
                      </h4>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </section>
    </main>
  )
}
