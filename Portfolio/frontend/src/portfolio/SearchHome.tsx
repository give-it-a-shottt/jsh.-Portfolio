import { motion, useReducedMotion } from 'motion/react'
import { CASES, KEYWORDS } from './data'
import { EASE_OUT } from './motion'
import { rankCases } from './rank'
import RecordCard from './RecordCard'
import { searchHref } from './routes'
import SearchBox from './SearchBox'

// 홈 아래 카드 — 날짜가 월 단위라 최신순은 거의 다 같아서, 중요도 순(rank.ts)으로 6개를 고른다
const FEATURED = rankCases(CASES).slice(0, 6)

// 키워드 칩 앞 점 — Back 은 포인트 파랑, Front 는 회색, Design 은 주황
const TYPE_DOT_CLASS = {
  Back: 'bg-portfolio',
  Front: 'bg-icon-disabled',
  Design: 'bg-accent',
}

interface SearchHomeProps {
  onSearch: (query: string) => void
}

// 검색 홈 — 구글처럼 가운데 검색창 하나, 스크롤하면 대표 사례 카드. 인트로가 걷히면 위에서부터 차례로 떠오른다.
// 제목은 확장(C) 스케일 C-2 → C-3 → 시안의 40px.
export default function SearchHome({ onSearch }: SearchHomeProps) {
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
          <span className="text-13 text-sub-weak">문제 해결 사례 아카이브</span>
        </motion.p>
        <motion.h1 {...rise(1)} className="mt-4 text-28 font-semibold break-keep text-main sm:text-32 lg:text-40">
          어떤 문제가 궁금하세요?
        </motion.h1>
        <motion.p {...rise(2)} className="mt-4 text-16 break-keep text-sub sm:text-18">
          실제 업무에서 마주칠 문제를 가상으로 만들고, 어떻게 해결했는지 기록했습니다.
        </motion.p>

        {/* 자동완성 목록이 아래 키워드 칩 위로 펼쳐지도록 쌓임 순서를 올린다 */}
        <motion.div {...rise(3)} className="relative z-10 mt-10 w-full text-left">
          <SearchBox size="lg" glow onSearch={onSearch} />
        </motion.div>

        <motion.div {...rise(4)} className="mt-8 flex flex-col items-center gap-3">
          <p className="text-13 font-medium text-sub-weak">추천 키워드</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {KEYWORDS.map(({ label, type }) => (
              <li key={label}>
                <a
                  href={searchHref(label)}
                  className="flex items-center gap-2 rounded-full border border-regular bg-default px-4 py-2 text-14 font-medium text-main hover:border-black hover:bg-light"
                >
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${TYPE_DOT_CLASS[type]}`} />
                  {label}
                  <span className="sr-only">({type})</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* 첫 화면은 검색창만 보이게 충분히 띄운다. 12컬럼 4+4+4 → 태블릿 2단 → 모바일 1단 */}
      <section aria-labelledby="featured-title" className="mt-30 w-full max-w-300">
        <motion.div {...reveal(0)} className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="flex flex-col gap-1">
            <h2 id="featured-title" className="text-24 font-semibold text-main">
              먼저 보면 좋은 사례
            </h2>
            <p className="text-14 break-keep text-sub">결과가 분명한 작업부터 6개를 골랐어요.</p>
          </div>
          <a href={searchHref()} className="text-14 font-medium text-portfolio hover:underline underline-offset-4">
            전체 사례 보기 →
          </a>
        </motion.div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {FEATURED.map((item, i) => (
            <motion.li key={item.slug} {...reveal(i % 3)}>
              <RecordCard item={item} />
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  )
}
