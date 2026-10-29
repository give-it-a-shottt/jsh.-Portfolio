import { useEffect, useRef, useState } from 'react'
import heroImage from '../assets/hero-msa.jpg'
import arrowLeft from '../assets/icon-arrow-left-sm.svg'
import arrowRightSm from '../assets/icon-arrow-right-sm.svg'
import arrowRightWhite from '../assets/icon-arrow-right-white.svg'
import checkCircle from '../assets/icon-check-circle.svg'
import arrowRightNavy from '../assets/icon-arrow-right-navy.svg'
import chevronRight from '../assets/icon-chevron-right.svg'
import playCircle from '../assets/icon-play-circle.svg'
import searchHero from '../assets/icon-search-hero.svg'
import starNavy from '../assets/icon-star-navy.svg'
import starReview from '../assets/icon-star-review.svg'
import timerIcon from '../assets/icon-timer.svg'
import { CourseCard, Footer, Header, SectionTitle } from '../components'
import { useCourseSearch } from '../hooks'
import { CATEGORIES, COURSES, REVIEWS, ROADMAPS, TRACKS, TRENDING, type Review, type Roadmap, type Track } from '../data'
import { techlearnHref } from '../routes'

// 01 메인 홈 — 히어로(검색) → 분야 → 실시간 인기 강좌 → 얼리버드 배너 → 로드맵 → 수강 후기
// scrollTo 는 헤더 '로드맵'처럼 홈의 특정 칸으로 바로 내려갈 때 쓰는 칸 id(?to=roadmap).
export default function HomeScreen({ scrollTo }: { scrollTo: string | null }) {
  // App 이 주소가 바뀔 때 맨 위로 올리므로, 그다음 프레임에 내려간다
  useEffect(() => {
    if (!scrollTo) return
    const id = requestAnimationFrame(() => document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' }))
    return () => cancelAnimationFrame(id)
  }, [scrollTo])

  return (
    <div className="min-h-svh bg-tl-bg font-sans text-tl-ink">
      <Header />
      <main>
        <Hero />
        <Categories />
        <BestCourses />
        <EarlyBird />
        <Roadmaps />
        <Reviews />
      </main>
      <Footer />
    </div>
  )
}

function Hero() {
  const { query, setQuery, submit } = useCourseSearch()
  return (
    <section aria-labelledby="tl-hero-title" className="relative overflow-hidden px-4 py-8 sm:px-10 lg:px-18 lg:py-12">
      {/* 은은한 네이비 빛 두 덩이 — 장식 */}
      <div aria-hidden="true" className="absolute -top-24 -left-20 size-96 rounded-md bg-tl/10 blur-[32px]" />
      <div aria-hidden="true" className="absolute top-full -right-28 size-125 -translate-y-1/2 rounded-md bg-tl/10 blur-[50px]" />

      <div className="relative mx-auto grid max-w-284 grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="flex flex-col items-start lg:col-span-7">
          <p className="mb-4 flex items-center gap-1 rounded-md bg-tl/15 px-3 py-1.5 text-13 font-medium text-tl">
            <span aria-hidden="true" className="size-2 rounded-md bg-tl" />
            2025 실무 지향 커리큘럼 개편
          </p>
          <h1 id="tl-hero-title" className="mb-4 text-28 font-semibold break-keep sm:text-40">
            성장 기회의 평등,
            <br />
            <span className="text-tl">개발부터 AI까지</span> 실무를 배웁니다
          </h1>
          <p className="mb-6 max-w-144 text-14 font-semibold break-keep text-tl-sub sm:text-16">
            현업 테크 리드가 검증한 실전 프로젝트와 1:1 코드 리뷰로 혼자서도 흔들림 없이 주니어에서 시니어까지 완주하세요.
          </p>
          <form
            role="search"
            onSubmit={submit}
            className="mb-4 flex w-full max-w-144 items-center gap-1 rounded-sm bg-white p-1 focus-within:ring-2 focus-within:ring-tl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          >
            <img src={searchHero} alt="" width={30} height={18} className="shrink-0" />
            <label htmlFor="tl-hero-search" className="sr-only">
              배우고 싶은 기술 검색
            </label>
            <input
              id="tl-hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="배우고 싶은 기술 스택, 프레임워크 검색..."
              className="h-12 min-w-0 flex-1 px-2 text-14 text-tl-ink outline-none placeholder:text-tl-weak"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-1 rounded-xs bg-tl px-4 text-15 font-medium text-white sm:px-6"
            >
              탐색하기
              <img src={arrowRightWhite} alt="" width={12} height={12} className="hidden sm:block" />
            </button>
          </form>
          <p className="flex flex-wrap items-center gap-1 text-11 font-semibold">
            <span lang="en" className="pr-1 text-tl-weak uppercase">
              Trending:
            </span>
            {TRENDING.map((tag) => (
              <a
                key={tag}
                href={techlearnHref('/courses', { q: tag })}
                lang="en"
                className="rounded-tl-chip bg-tl-chip px-2.5 py-1 text-tl-ink hover:bg-tl-line"
              >
                #{tag}
              </a>
            ))}
          </p>
        </div>

        <TrendCard />
      </div>
    </section>
  )
}

function TrendCard() {
  return (
    <aside
      aria-label="실시간 급상승 1위 로드맵"
      className="flex flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] lg:col-span-5"
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-13 font-medium">
          <span aria-hidden="true" className="relative size-3">
            <span className="absolute inset-0 animate-ping rounded-md bg-tl opacity-75 motion-reduce:animate-none" />
            <span className="relative block size-3 rounded-md bg-tl" />
          </span>
          실시간 급상승 1위 로드맵
        </p>
        <span lang="en" className="rounded-md bg-tl-hot-soft px-2 py-0.5 text-11 font-semibold text-tl-hot">
          HOT LIVE
        </span>
      </div>
      <div className="relative h-48 overflow-hidden rounded-sm">
        <img src={heroImage} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-tl-dark/80 via-tl-dark/20 to-tl-dark/0 p-4">
          <div className="flex flex-col items-start gap-[5px]">
            <span className="rounded-tl-tag bg-tl px-2 py-px text-11 font-semibold text-white">마감 임박 32% OFF</span>
            <p className="text-16 font-semibold break-keep text-white sm:text-18">대규모 트래픽 처리를 위한 MSA 아키텍처</p>
          </div>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 rounded-xs bg-tl-bg p-3 text-center">
        <div>
          <dt className="text-11 text-tl-weak">실시간 수강</dt>
          <dd className="text-18 font-semibold">1,428명</dd>
        </div>
        <div>
          <dt className="text-11 text-tl-weak">만족도 평점</dt>
          <dd className="flex items-center justify-center gap-0.5 text-18 font-semibold text-tl">
            <img src={starNavy} alt="" width={15} height={14.25} />
            4.98
          </dd>
        </div>
        <div>
          <dt className="text-11 text-tl-weak">취업·이직률</dt>
          <dd className="text-18 font-semibold">94.2%</dd>
        </div>
      </dl>
      <a
        href={techlearnHref('/courses')}
        className="flex items-center justify-center gap-2 rounded-xs bg-tl-dark py-3 text-13 font-medium text-white hover:bg-tl-ink"
      >
        <img src={playCircle} alt="" width={15} height={15} />
        1회차 무료 강의 바로 시청
      </a>
    </aside>
  )
}

function Categories() {
  return (
    <section aria-labelledby="tl-categories-title" className="bg-white px-4 sm:px-10">
      <div className="mx-auto flex max-w-300 flex-col gap-6 py-8 sm:p-8">
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="Categories" title="전문 분야별 퀵 내비게이션" id="tl-categories-title" />
          <a href={techlearnHref('/courses')} className="hidden items-center gap-1 text-13 text-tl-sub hover:text-tl sm:flex">
            전체 분야 보기
            <img src={chevronRight} alt="" width={5.55} height={9} />
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <a
                href={techlearnHref('/courses')}
                className="flex h-full flex-col items-start rounded-sm bg-white p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-tl-line/60 hover:ring-tl sm:p-6"
              >
                <span className="mb-4 flex size-12 items-center justify-center rounded-sm bg-tl-chip">
                  <img src={category.icon} alt="" width={category.iconSize.width} height={category.iconSize.height} />
                </span>
                <span className="pb-1 text-16 font-semibold sm:text-18">{category.name}</span>
                <span className="text-13 text-tl-sub">{category.summary}</span>
                <span className="mt-auto pt-4">
                  <span className="flex items-center gap-1 text-11 font-semibold text-tl">
                    {category.count}개 강좌
                    <img src={arrowRightNavy} alt="" width={9.33} height={9.33} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BestCourses() {
  const [track, setTrack] = useState<Track>('all')
  const courses = track === 'all' ? COURSES : COURSES.filter((course) => course.track === track)

  return (
    <section aria-labelledby="tl-best-title" className="bg-white px-4 sm:px-10">
      <div className="mx-auto flex max-w-300 flex-col gap-6 py-8 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2">
              <span lang="en" className="rounded-tl-tag bg-tl px-2 py-0.5 text-11 font-semibold text-white">
                REALTIME
              </span>
              <span className="text-13 text-tl-weak">실시간 수강 데이터 집계 기준</span>
            </p>
            <h2 id="tl-best-title" className="text-24 font-semibold sm:text-32">
              실시간 인기 BEST 강좌
            </h2>
          </div>
          <div role="tablist" aria-label="분야" className="flex gap-1 overflow-x-auto pb-1">
            {TRACKS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={track === id}
                onClick={() => setTrack(id)}
                className={`shrink-0 rounded-xs px-3 py-1.5 text-13 font-medium ${track === id ? 'bg-tl-ink text-white' : 'bg-tl-chip text-tl-ink hover:bg-tl-line'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* 모바일은 옆으로 넘겨 보고, PC 는 4칸 */}
        <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {courses.map((course) => (
            <li key={course.id} className="w-64 shrink-0 snap-start sm:w-auto">
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function EarlyBird() {
  const perks = ['OpenAI Assistants API 완전 정복', 'Slack, Notion 연동 사내 AI 봇 배포', '실시간 코드 리뷰 및 질의응답 보장']
  return (
    <section aria-labelledby="tl-earlybird-title" className="px-4 py-8 sm:px-10 lg:px-18 lg:py-12">
      <div className="relative mx-auto max-w-284 overflow-hidden rounded-lg bg-tl-dark p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] sm:p-10">
        <div aria-hidden="true" className="absolute -right-16 -bottom-16 size-80 rounded-md bg-tl/20 blur-[32px]" />
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-2 lg:col-span-7">
            <p className="flex items-center gap-2 rounded-tl-tag bg-tl/30 px-3 py-1 text-11 font-medium text-tl-lavender">
              <img src={timerIcon} alt="" width={12} height={14} />
              얼리버드 선착순 100명 특별 혜택 마감 4시간 전
            </p>
            <h2 id="tl-earlybird-title" className="pt-2 text-24 font-semibold break-keep text-white sm:text-32">
              2025 신규 런칭:
              <br />
              <span className="font-medium text-tl-lavender">프로덕션 레디 AI Agent & 자동화 워크플로우</span>
            </h2>
            <p className="max-w-128 text-14 font-medium break-keep text-tl-on-dark">
              기초 문법을 넘어 실제 사내 업무를 대체하는 지능형 에이전트 구축. 실무 템플릿 12종 및 GitHub 프라이빗 레포지토리 평생 액세스 권한 제공.
            </p>
            <div className="flex w-full flex-col gap-4 pt-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <p className="flex flex-col rounded-xs bg-white/10 px-4 py-2 backdrop-blur-[4px]">
                <span className="text-12 font-medium text-tl-on-dark">얼리버드 특가</span>
                <span className="text-22 font-semibold">
                  <span className="text-tl-lavender">₩77,000 </span>
                  <s className="text-tl-weak">
                    <span className="sr-only">정가 </span>₩154,000
                  </s>
                </span>
              </p>
              <a
                href={techlearnHref('/courses')}
                className="flex h-12 items-center justify-center rounded-xs bg-tl px-6 text-15 font-medium text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-tl/90"
              >
                지금 얼리버드로 수강 신청
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-sm bg-white p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:col-span-5">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-tl/20 px-2.5 py-1 text-11 font-medium text-tl">런칭 신작</span>
              <span className="text-11 font-semibold text-tl-weak">남은 수량: 14석</span>
            </div>
            <ul className="flex flex-col gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 rounded-tl-tag bg-tl-bg p-2 text-13 font-semibold">
                  <img src={checkCircle} alt="" width={16.67} height={16.67} />
                  {perk}
                </li>
              ))}
            </ul>
            <p className="flex items-center justify-between pt-4 text-11">
              <span className="text-tl-weak">수강 기한: 무제한 평생 소장</span>
              <span className="font-medium text-tl">수료증 발급 가능</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const ROADMAP_TONE = {
  navy: { badge: 'bg-tl/20 text-tl', step: 'bg-tl text-white' },
  indigo: { badge: 'bg-tl-indigo-soft text-tl-indigo-ink', step: 'bg-tl-step text-white' },
} satisfies Record<Roadmap['tone'], { badge: string; step: string }>

function Roadmaps() {
  return (
    <section id="roadmap" aria-labelledby="tl-roadmap-title" className="scroll-mt-16 bg-white px-4 sm:px-10">
      <div className="mx-auto flex max-w-300 flex-col items-center gap-10 py-8 sm:p-8">
        <div className="flex max-w-168 flex-col items-center gap-[5px] pt-[3px] text-center">
          <p lang="en" className="text-13 font-semibold text-tl uppercase">
            Roadmap Guide
          </p>
          <h2 id="tl-roadmap-title" className="text-24 font-semibold sm:text-32">
            개발자 맞춤 커리어 로드맵
          </h2>
          <p className="pt-[3px] text-14 break-keep text-tl-sub">
            무엇부터 시작할지 막막한 분들을 위해 시니어 엔지니어가 직접 설계한 추천 학습 경로입니다.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {ROADMAPS.map((roadmap) => {
            const tone = ROADMAP_TONE[roadmap.tone]
            return (
              <article
                key={roadmap.title}
                className="flex flex-col justify-between gap-6 rounded-lg bg-white p-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] ring-1 ring-tl-line/60"
              >
                <div className="flex flex-col gap-2">
                  <p className="flex items-center justify-between gap-2">
                    <span className={`rounded-md px-3 py-1 text-11 font-medium ${tone.badge}`}>{roadmap.track}</span>
                    <span className="text-11 font-semibold text-tl-weak">{roadmap.meta}</span>
                  </p>
                  <h3 className="pt-2 text-20 font-semibold sm:text-22">{roadmap.title}</h3>
                  <p className="text-13 break-keep text-tl-sub">{roadmap.description}</p>
                  <ol className="relative flex flex-col gap-4 pt-4 pl-6">
                    <span aria-hidden="true" className="absolute top-6 bottom-2 left-2.5 w-0.5 bg-tl-line" />
                    {roadmap.steps.map((step, i) => (
                      <li key={step.title} className="relative">
                        <span
                          aria-hidden="true"
                          className={`absolute top-0 -left-6 flex size-5 items-center justify-center rounded-md text-12 font-semibold ${i < roadmap.activeSteps ? tone.step : 'bg-tl-line text-tl-sub'}`}
                        >
                          {i + 1}
                        </span>
                        <p className="text-13 font-semibold">{step.title}</p>
                        <p className="text-13 text-tl-weak">{step.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <a
                  href={techlearnHref('/courses')}
                  className="rounded-xs bg-tl-chip py-3 text-center text-13 font-medium hover:bg-tl-line"
                >
                  {roadmap.cta}
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const AVATAR_TONE: Record<Review['tone'], string> = {
  navy: 'bg-tl/20 text-tl',
  indigo: 'bg-tl-indigo-soft text-tl-indigo-ink',
  gray: 'bg-tl-on-dark text-tl-ink',
}

// 후기 슬라이더 — 브라우저 스크롤바 대신 점 표시(지금 위치는 긴 막대). 점과 화살표는 카드 한 장씩 옮긴다.
// 넓은 화면은 카드가 거의 다 보여 끝까지 조금만 밀리므로, 점 개수는 실제로 멈출 수 있는 자리 수만큼만 둔다.
function Reviews() {
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [stops, setStops] = useState(REVIEWS.length)

  /** 카드 한 장 + 사이 간격, 끝까지 밀 수 있는 거리 — 카드 폭이 화면마다 달라서 그때그때 잰다 */
  const measure = () => {
    const list = listRef.current
    const card = list?.querySelector('li')
    if (!list || !card) return null
    const step = card.offsetWidth + parseFloat(getComputedStyle(list).columnGap || '0')
    return { list, step, max: list.scrollWidth - list.clientWidth }
  }

  // 화면 폭이 바뀌면 멈출 수 있는 자리 수를 다시 센다. 다 보이면(max 0) 점을 숨긴다
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      const m = measure()
      if (!m) return
      const extra = m.max % m.step > 2 ? 1 : 0
      setStops(m.max <= 2 ? 1 : Math.min(REVIEWS.length, Math.floor(m.max / m.step) + 1 + extra))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  const goTo = (index: number) => {
    const m = measure()
    if (!m) return
    const next = Math.max(0, Math.min(stops - 1, index))
    m.list.scrollTo({ left: Math.min(next * m.step, m.max), behavior: 'smooth' })
  }

  // 끝까지 밀었으면 마지막 점을 켠다
  const onScroll = () => {
    const m = measure()
    if (!m) return
    const atEnd = m.list.scrollLeft >= m.max - 2
    setActive(atEnd ? stops - 1 : Math.min(stops - 1, Math.round(m.list.scrollLeft / m.step)))
  }

  return (
    <section aria-labelledby="tl-reviews-title" className="bg-tl-bg-alt px-4 py-8 sm:px-10 sm:py-12">
      <div className="mx-auto flex max-w-300 flex-col gap-6 sm:px-8">
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="Success Stories" title="수강생 생생 리뷰 & 취업 성공기" id="tl-reviews-title" />
          <div className="hidden gap-1 sm:flex">
            <button type="button" aria-label="이전 후기" onClick={() => goTo(active - 1)} className="flex size-10 items-center justify-center rounded-xs bg-tl-bg hover:bg-tl-line">
              <img src={arrowLeft} alt="" width={13.33} height={13.33} />
            </button>
            <button type="button" aria-label="다음 후기" onClick={() => goTo(active + 1)} className="flex size-10 items-center justify-center rounded-xs bg-tl-bg hover:bg-tl-line">
              <img src={arrowRightSm} alt="" width={13.33} height={13.33} />
            </button>
          </div>
        </div>
        <ul
          ref={listRef}
          onScroll={onScroll}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {REVIEWS.map((review) => (
            <li
              key={review.name}
              className="flex w-[300px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-sm bg-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:w-95"
            >
              <div className="flex flex-col gap-2 p-6 pb-4">
                <p className="flex gap-1" role="img" aria-label="별점 5점">
                  {Array.from({ length: 5 }, (_, i) => (
                    <img key={i} src={starReview} alt="" width={15} height={14.25} />
                  ))}
                </p>
                <h3 className="text-18 font-semibold break-keep">{review.title}</h3>
                <p className="text-13 break-keep text-tl-sub">{review.body}</p>
              </div>
              <p className="flex items-center gap-3 bg-tl-bg/30 px-4 pt-2 pb-4">
                <span aria-hidden="true" className={`flex size-10 items-center justify-center rounded-md text-14 font-medium ${AVATAR_TONE[review.tone]}`}>
                  {review.name.slice(0, 2)}
                </span>
                <span className="flex flex-col">
                  <span className="text-13 font-medium">{review.name} 님</span>
                  <span className="text-11 text-tl-weak">{review.role}</span>
                </span>
              </p>
            </li>
          ))}
        </ul>
        {stops > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: stops }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번째 후기 보기`}
                aria-current={active === i ? 'true' : undefined}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === i ? 'w-8 bg-tl' : 'w-2 bg-tl-weak/40 hover:bg-tl-weak'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

