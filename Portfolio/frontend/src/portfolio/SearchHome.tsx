import { motion, useReducedMotion } from 'motion/react'
import { KEYWORDS, PROJECTS } from './data'
import { EASE_OUT } from './motion'
import { studyHref } from './notes'
import { FEATURED_SLUGS, findProject, type Project } from './projects'
import { ProjectCover } from './ProjectParts'
import RoleChips from './RoleChips'
import { isExternal, projectHref, searchHref } from './routes'
import SearchBox from './SearchBox'

const FEATURED = FEATURED_SLUGS.map(findProject).filter(Boolean) as Project[]

/** 탭 안내 — 작업을 세 탭으로 나눈 이유를 한 줄씩(F-011) */
const TAB_GUIDE = [
  { en: 'Design', title: '화면을 설계한 과정', body: '리뉴얼 시안, 3안 비교, 디자인 시스템까지 왜 이렇게 그렸는지 근거와 함께 보여 줘요.', href: searchHref('', 'design') },
  { en: 'Fullstack', title: '직접 만들어 배포한 서비스', body: '카드마다 Design · Front · Back · DB 중 실제로 맡은 부분을 표시했어요. 문제 해결 기록도 여기 있어요.', href: searchHref('', 'fullstack') },
  { en: 'Study', title: '매일 공부한 기록', body: '강의 · 코딩테스트 · 디자인 툴을 공부하며 정리한 노트를 모았어요.', href: studyHref() },
]

function FeaturedCard({ project }: { project: Project }) {
  const live = project.links[project.links.length - 1]
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-light bg-default shadow-[0_1px_2px_rgb(45_42_37/0.06)] hover:shadow-[0_2px_4px_rgb(45_42_37/0.08)]">
      <ProjectCover cover={project.cover} name={project.name} rounded="rounded-none" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <RoleChips roles={project.roles} />
        <div className="flex flex-col gap-2">
          <h3 className="text-20 font-semibold break-keep text-main">
            <a href={projectHref(project.slug)} className="after:absolute after:inset-0 group-hover:text-portfolio">
              {project.card.title}
            </a>
          </h3>
          <p className="text-14 break-keep text-sub">{project.card.desc}</p>
        </div>
        <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-light pt-4">
          {project.card.metrics.map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse gap-1">
              <dt className="text-12 break-keep text-sub-weak">{label}</dt>
              <dd className="text-16 font-semibold tracking-normal break-keep text-main sm:text-18">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="flex items-center justify-between text-14">
          <span aria-hidden="true" className="font-semibold text-main">
            프로젝트 보기 →
          </span>
          {/* 카드 전체를 덮는 제목 링크(after:inset-0) 위로 올려야 눌린다 */}
          <a
            href={live.href}
            {...(isExternal(live.href) ? { target: '_blank', rel: 'noopener' } : {})}
            className="relative z-10 text-13 font-medium text-sub hover:text-main hover:underline underline-offset-4"
          >
            {live.label} ↗<span className="sr-only"> ({project.name})</span>
          </a>
        </p>
      </div>
    </article>
  )
}

interface SearchHomeProps {
  onSearch: (query: string) => void
  /** 인트로의 자기소개 영상을 다시 튼다 */
  onReplayIntro: () => void
}

// 홈(F-011) — 피그마 jsh Page 3 「Home · PC 1440」.
// 히어로(소개 7칸 + 검색 5칸) → 먼저 볼 프로젝트 2×2 → 탭 안내 3칸 + 진행 중인 프로젝트.
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
  // 아래 영역은 스크롤해서 화면에 들어올 때 한 번만 떠오른다
  const reveal = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.5, delay: order * 0.06, ease: EASE_OUT },
        }

  const scrollToFeatured = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('featured')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* 히어로 — 소개(7) | 검색(5) */}
      <section className="px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto grid w-full max-w-300 grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <motion.p {...rise(0)} lang="en" className="text-16 font-medium tracking-normal text-portfolio sm:text-18">
              Design · Fullstack
            </motion.p>
            <motion.h1 {...rise(1)} className="text-32 font-semibold break-keep text-main sm:text-40 lg:text-48">
              화면에서 구조까지,
              <br />
              하나의 경험으로.
            </motion.h1>
            <motion.p {...rise(2)} className="text-16 break-keep text-sub sm:text-20">
              실제 업무에서 마주칠 문제를 풀고, 그 과정에서 공부한 내용까지 함께 기록했습니다.
            </motion.p>
            <motion.div {...rise(3)} className="flex flex-wrap gap-2 pt-3">
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex h-12 items-center gap-1.5 rounded-button border border-black bg-default px-5 text-16 font-semibold text-main hover:bg-light"
              >
                <span aria-hidden="true">▶</span> 자기소개 영상 (1분)
              </button>
              <button
                type="button"
                onClick={scrollToFeatured}
                className="inline-flex h-12 items-center rounded-button bg-portfolio px-5 text-16 font-semibold text-white hover:bg-portfolio-strong"
              >
                먼저 볼 프로젝트
              </button>
            </motion.div>
          </div>

          {/* 자동완성 목록이 아래 섹션 위로 펼쳐지도록 쌓임 순서를 올린다 */}
          <motion.div {...rise(4)} className="relative z-10 flex flex-col gap-4 rounded-card bg-light p-6 sm:p-8 lg:col-span-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-18 font-semibold text-main">찾는 게 있다면 검색해 보세요</h2>
              <p className="text-14 break-keep text-sub">문제 해결 사례와 공부 노트를 중요한 순서대로 보여 줘요.</p>
            </div>
            <SearchBox size="md" onSearch={onSearch} />
            <h3 className="text-13 font-medium text-sub">추천 검색어</h3>
            <ul className="flex flex-wrap gap-2">
              {KEYWORDS.slice(0, 6).map(({ label }) => (
                <li key={label}>
                  <a
                    href={searchHref(label)}
                    className="block rounded-full border border-regular bg-default px-3 py-1.5 text-13 font-medium text-main hover:border-black"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 먼저 볼 프로젝트 — 2 × 2 */}
      <section id="featured" aria-labelledby="featured-title" className="scroll-mt-4 bg-light px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-7">
          <motion.div {...reveal(0)} className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="flex flex-col gap-2">
              <h2 id="featured-title" className="text-24 font-semibold text-main sm:text-32">
                먼저 볼 프로젝트
              </h2>
              <p className="text-15 break-keep text-sub sm:text-16">
                프로젝트마다 무엇을 만들었고, 어떤 문제를 어떻게 풀었는지 한 페이지에 정리했어요.
              </p>
            </div>
            <a href={searchHref()} className="text-14 font-medium text-main hover:underline underline-offset-4">
              전체 작업 보기 →
            </a>
          </motion.div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FEATURED.map((project, i) => (
              <motion.li key={project.slug} {...reveal(i % 2)} className="flex">
                <FeaturedCard project={project} />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 탭 안내 + 진행 중 */}
      <section aria-labelledby="tabs-title" className="px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-7">
          <motion.div {...reveal(0)} className="flex flex-col gap-2">
            <h2 id="tabs-title" className="text-24 font-semibold text-main sm:text-32">
              어디서부터 볼까요
            </h2>
            <p className="text-15 text-sub sm:text-16">작업은 세 개의 탭으로 나눴어요.</p>
          </motion.div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TAB_GUIDE.map(({ en, title, body, href }, i) => (
              <motion.li key={en} {...reveal(i)} className="flex">
                <a href={href} className="group flex w-full flex-col gap-3 rounded-card border border-regular bg-default p-6 hover:border-black">
                  <span lang="en" className="text-14 font-semibold tracking-normal text-portfolio">
                    {en}
                  </span>
                  <span className="text-20 font-semibold break-keep text-main">{title}</span>
                  <span className="text-14 break-keep text-sub">{body}</span>
                  <span className="mt-auto pt-1 text-14 font-medium text-main group-hover:underline underline-offset-4">
                    <span lang="en">{en}</span> 탭으로 →
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <h3 id="projects-title" className="text-14 font-medium text-sub">
              진행 중인 프로젝트
            </h3>
            <ul aria-labelledby="projects-title" className="flex flex-wrap gap-2">
              {PROJECTS.map(({ name, summary, href }) => {
                const chip = (
                  <>
                    {/* 초록 점 = 진행 중 */}
                    <span aria-hidden="true" className="size-2 rounded-full bg-status-success" />
                    <span lang="en" className="font-semibold text-main">
                      {name}
                    </span>
                    <span className="text-sub">{summary}</span>
                  </>
                )
                const chipClass = 'flex items-center gap-2 rounded-full border border-regular bg-default py-2 pr-4 pl-3 text-14'
                return (
                  <li key={name}>
                    {href ? (
                      // 따로 배포한 서비스(techlearn)는 다른 바깥 링크처럼 새 탭 + ↗ 로 연다
                      <a
                        href={href}
                        {...(isExternal(href) ? { target: '_blank', rel: 'noopener' } : {})}
                        className={`${chipClass} hover:border-black`}
                      >
                        {chip}
                        {isExternal(href) && (
                          <>
                            <span aria-hidden="true" className="text-sub">↗</span>
                            <span className="sr-only">(새 탭)</span>
                          </>
                        )}
                      </a>
                    ) : (
                      <span className={chipClass}>
                        {chip}
                        <span className="sr-only">(화면 준비 중)</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
