import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { CASES, type DesignVariant } from './data'
import { ChevronRightIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import { DESIGN_DEMOS } from './demos'
import { searchHref } from './routes'

const DESIGN_LIST_HREF = searchHref('', 'design')

function BackLink() {
  return (
    <a href={DESIGN_LIST_HREF} className="flex w-fit items-center gap-1 text-14 font-medium text-sub hover:text-main">
      <ChevronRightIcon size={16} className="rotate-180" />
      <span>
        <span lang="en">Design</span> 사례 목록
      </span>
    </a>
  )
}

/** 카드 사이 간격(gap-6) — 화살표로 카드 한 장씩 넘길 때 쓴다 */
const CARD_GAP = 24

/** 데스크톱 카드는 윗부분만 보여서 원본을 열 수 있다고 알려 준다 */
const OPEN_HINT = ' 누르면 원본 크기로 열려요.'

interface ScreenSectionProps {
  id: string
  title: string
  description: string
  items: DesignVariant[]
  device?: 'mobile' | 'desktop'
  /** 최종 배지를 달 위치. 시안 비교에만 쓴다 */
  finalIndex?: number
}

/**
 * 제목 + 화면 여러 장의 가로 목록. 넘치는 만큼만 가로로 넘긴다.
 * 휴대폰 화면은 통째로, 세로로 긴 데스크톱 화면은 윗부분만 보여주고 누르면 원본을 새 탭으로 연다.
 */
function ScreenSection({ id, title, description, items, device = 'mobile', finalIndex }: ScreenSectionProps) {
  const isDesktop = device === 'desktop'
  const trackRef = useRef<HTMLOListElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: true })
  const reduceMotion = useReducedMotion()

  // 지금 맨 앞·맨 끝인지 — 둘 다면 넘칠 게 없어서 화살표를 숨긴다
  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setEdges({
      atStart: track.scrollLeft <= 1,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(track)
    return () => observer.disconnect()
  }, [updateEdges])

  // 마우스로는 옆으로 밀 수 없어서 화살표로 카드 한 장씩 넘긴다
  const move = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    if (!track || !card) return
    track.scrollBy({ left: direction * (card.offsetWidth + CARD_GAP), behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const overflows = !(edges.atStart && edges.atEnd)

  return (
    <section aria-labelledby={id} className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id={id} className="text-20 font-semibold text-main">
            {title}
          </h2>
          <p className="mt-1 text-14 break-keep text-sub">{description}</p>
        </div>
        {/* 화살표는 마우스를 쓰는 화면에만 — 휴대폰은 손가락으로 민다 */}
        {overflows && (
          <div className="hidden shrink-0 gap-2 pointer-fine:flex">
            <ScrollArrow direction="prev" label={title} disabled={edges.atStart} onClick={() => move(-1)} />
            <ScrollArrow direction="next" label={title} disabled={edges.atEnd} onClick={() => move(1)} />
          </div>
        )}
      </div>
      <ol
        ref={trackRef}
        onScroll={updateEdges}
        className="scrollbar-none -mx-5 mt-6 flex snap-x scroll-px-5 gap-6 overflow-x-auto px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {items.map((item, index) => {
          const isFinal = index === finalIndex
          const image = (
            <img
              src={item.image}
              alt={`${item.label} 화면`}
              width={item.width ?? 400}
              height={item.height ?? 860}
              loading="lazy"
              className={`w-full rounded-thumb border ${isFinal ? 'border-black' : 'border-regular'} ${
                isDesktop ? 'aspect-4/3 object-cover object-top-left' : 'h-auto'
              }`}
            />
          )
          return (
            <li key={item.label} className={`shrink-0 snap-start ${isDesktop ? 'w-[min(80vw,480px)]' : 'w-60 sm:w-70'}`}>
              <figure className="flex flex-col gap-3">
                {isDesktop ? (
                  <a href={item.image} target="_blank" rel="noopener" aria-label={`${item.label} 화면 원본 크기로 보기`}>
                    {image}
                  </a>
                ) : (
                  image
                )}
                <figcaption className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-15 font-semibold text-main">
                    {item.label}
                    {isFinal && (
                      <span className="rounded-badge bg-main px-2 py-0.5 text-12 font-semibold text-white">최종</span>
                    )}
                  </span>
                  <span className="text-14 break-keep text-sub">{item.note}</span>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

interface ScrollArrowProps {
  direction: 'prev' | 'next'
  /** 어느 목록의 화살표인지 — 화면 읽기 프로그램에 함께 읽어 준다 */
  label: string
  disabled: boolean
  onClick: () => void
}

function ScrollArrow({ direction, label, disabled, onClick }: ScrollArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${label} ${direction === 'prev' ? '이전' : '다음'} 화면`}
      className="flex size-10 items-center justify-center rounded-full border border-regular text-main hover:bg-light disabled:cursor-default disabled:text-sub-weak disabled:hover:bg-transparent"
    >
      <ChevronRightIcon size={18} className={direction === 'prev' ? 'rotate-180' : undefined} />
    </button>
  )
}

interface DesignCaseDetailProps {
  slug: string
}

// Design 사례 상세 — 문제 정의 → 시안 비교 또는 화면 구성(가로 나열) → 디자인 시스템 → 대표 화면 실제 동작.
export default function DesignCaseDetail({ slug }: DesignCaseDetailProps) {
  const item = CASES.find((candidate) => candidate.slug === slug && candidate.design)

  if (!item?.design) {
    return (
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-2 px-5 pt-16 pb-20 sm:px-10">
        <h1 className="text-20 font-semibold break-keep text-main">사례를 찾을 수 없어요.</h1>
        <p className="text-14 text-sub">주소가 바뀌었거나 아직 올리지 않은 사례예요.</p>
        <div className="mt-4">
          <BackLink />
        </div>
      </main>
    )
  }

  const { app, device, problem, variants, finalIndex, screens, system, systemHeading, demo } = item.design
  const Demo = DESIGN_DEMOS[item.slug]

  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col px-5 pt-6 pb-20 sm:px-10">
      <BackLink />

      <header className="mt-8 flex flex-col">
        <CaseMeta item={item} />
        <h1 className="mt-3 text-24 font-semibold break-keep text-main sm:text-32">{item.title}</h1>
        <p className="mt-3 max-w-180 text-16 break-keep text-sub">{item.description}</p>
        <dl className="mt-6 flex max-w-180 flex-col gap-4 rounded-card bg-light p-6">
          {[
            { term: '서비스', detail: app },
            { term: '문제', detail: problem },
          ].map(({ term, detail }) => (
            <div key={term} className="flex flex-col gap-1 sm:flex-row sm:gap-8">
              <dt className="w-12 shrink-0 text-14 font-semibold text-main">{term}</dt>
              <dd className="text-14 break-keep text-sub">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex flex-wrap gap-2 text-13 text-sub-weak">
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        {item.links && (
          <p className="mt-4 flex flex-wrap gap-3">
            {item.links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                className="flex w-fit items-center gap-1 rounded-full border border-regular px-4 py-2 text-14 font-medium text-main hover:bg-light"
              >
                {label} ↗
              </a>
            ))}
          </p>
        )}
      </header>

      {variants && (
        <ScreenSection
          id="variants-title"
          title="시안 비교"
          description="왼쪽부터 순서대로 고쳐 나간 과정이에요."
          items={variants}
          device={device}
          finalIndex={finalIndex}
        />
      )}

      {screens && (
        <ScreenSection
          id="screens-title"
          title="화면 구성"
          description={`주요 화면을 사용 흐름 순서로 모았어요.${device === 'desktop' ? OPEN_HINT : ''}`}
          items={screens}
          device={device}
        />
      )}

      {system && (
        <ScreenSection
          id="system-title"
          title={systemHeading?.title ?? '디자인 시스템'}
          description={`${systemHeading?.description ?? '화면 전체에 쓴 색·글꼴·간격·컴포넌트 규칙이에요.'}${OPEN_HINT}`}
          items={system}
          // 가이드는 시안 종류와 상관없이 넓고 긴 문서라 데스크톱 카드로 보여준다
          device="desktop"
        />
      )}

      {Demo && demo && (
        <section aria-labelledby="demo-title" className="mt-16 flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex min-w-60 flex-[1_1_280px] flex-col gap-2 lg:pt-10">
            <h2 id="demo-title" className="text-20 font-semibold text-main">
              {demo.title}
            </h2>
            <p className="text-14 break-keep text-sub">{demo.note}</p>
            {demo.caveat && <p className="text-13 break-keep text-sub-weak">{demo.caveat}</p>}
          </div>
          {/* 휴대폰 틀 — 400px 시안 폭을 넘지 않고, 좁은 화면에서는 줄어든다 */}
          <div className="w-full max-w-100 overflow-hidden rounded-[32px] border-[6px] border-black">
            <Demo />
          </div>
        </section>
      )}

      <a
        href={DESIGN_LIST_HREF}
        className="mt-16 flex w-fit items-center gap-1 rounded-full border border-regular px-5 py-3 text-14 font-medium text-main hover:bg-light"
      >
        <span>
          다른 <span lang="en">Design</span> 사례 보기
        </span>
        <ChevronRightIcon size={16} />
      </a>
    </main>
  )
}
