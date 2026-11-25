import { memo, useCallback, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import useMediaQuery from '../../shared/hooks/useMediaQuery'
import { SCROLL_SPRING } from '../motion'
import { ButtonLink } from '../ProjectParts'
import { serviceLink, showcaseStats, type ShowcaseProject } from '../projects'
import RoleChips from '../RoleChips'
import { projectHref } from '../routes'
import useReveal from '../useReveal'
import ShowcaseShots from './ShowcaseShots'
import { activeIndex, stripPosition, textOffset, textOpacity } from './showcaseMotion'
import { scrollToShowcase, showcaseAnchor } from './scrollToShowcase'

// 메인 프로젝트 섹션(F-018 · D-009) - 프로젝트당 스크롤 한 화면. 왼쪽 글은 제자리에서 바뀌고, 오른쪽 화면은 위로 밀려 올라간다.
// 멈춤(스냅)은 쓰지 않는다 - 모든 움직임이 스크롤 위치에 묶여서, 휠을 멈추면 그 자리에 서고 위로 올리면 되감긴다.
// 좁거나 낮은 화면, 움직임 줄이기 설정이면 붙잡지 않고 아래로 펼친다(Stacked).

const PINNED = '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'

// 회색 판이 시작하는 곳 · 글이 시작하는 곳 - 1440 에서 600 · 136, 1920 에서 840 · 376 (본문 1200 폭과 맞춘다)
const PANEL_LEFT = 'max(41.667%, 50% - 120px)'
const TEXT_LEFT = 'max(88px, 50% - 584px)'
const TEXT_WIDTH = `min(412px, calc(${PANEL_LEFT} - ${TEXT_LEFT} - 40px))`
const RAIL_LEFT = 'max(24px, calc(50% - 672px))'

/** 번호 · 이름 · 한 줄 · 설명 · 역할 · 숫자 두 개 · 버튼 */
function ShowcaseText({ project, index, total }: { project: ShowcaseProject; index: number; total: number }) {
  const service = serviceLink(project)
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <p className="text-18 font-semibold tabular-nums text-sub-weak">
        <span className="text-portfolio">{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
      </p>
      <div className="flex flex-col gap-2">
        <h3 className="text-32 font-semibold break-keep text-main lg:text-40 xl:text-48">{project.name}</h3>
        <p className="text-18 font-semibold break-keep text-main lg:text-20">{project.showcase.tagline}</p>
      </div>
      <p className="text-15 break-keep text-sub lg:text-16">{project.card.desc}</p>
      <RoleChips roles={project.roles} size="md" />
      <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-regular pt-5 lg:pt-6">
        {showcaseStats(project).map(({ value, label }) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="text-13 font-medium break-keep text-sub-weak">{label}</dt>
            <dd className="text-24 font-semibold tracking-normal whitespace-nowrap text-main xl:text-28">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        <ButtonLink href={projectHref(project.slug)} label="프로젝트 보기" primary size="lg" />
        {service && <ButtonLink href={service.href} label={service.label} size="lg" />}
      </div>
    </div>
  )
}

// ---------- 붙잡는 화면 (PC) ----------
interface PinnedTextProps {
  project: ShowcaseProject
  index: number
  total: number
  position: MotionValue<number>
  active: boolean
  /** 키보드로 다른 프로젝트의 버튼에 오면 그 프로젝트로 스크롤한다 */
  onFocusHidden: (slug: string) => void
}

// 지금 프로젝트가 바뀌면 부모가 다시 그려진다 - 바뀐 두 개(active)만 다시 그리게 memo
const PinnedText = memo(function PinnedText({ project, index, total, position, active, onFocusHidden }: PinnedTextProps) {
  const opacity = useTransform(position, (x) => textOpacity(x - index))
  const y = useTransform(position, (x) => textOffset(x - index))
  return (
    <motion.article
      style={{ opacity, y, left: TEXT_LEFT, width: TEXT_WIDTH }}
      // 겹쳐 있는 다른 글의 버튼이 눌리지 않게 - 안 보이는 글도 문서에는 있어서 키보드 · 화면 읽기로 닿는다
      className={`absolute top-1/2 ${active ? '' : 'pointer-events-none'}`}
      onFocus={() => {
        if (!active) onFocusHidden(project.slug)
      }}
    >
      <div className="-translate-y-1/2">
        <ShowcaseText project={project} index={index} total={total} />
      </div>
    </motion.article>
  )
})

function Pinned({ projects }: { projects: ShowcaseProject[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const count = projects.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING)
  const position = useTransform(smooth, (p) => p * (count - 1))
  // 띠 하나가 판 높이와 같아서, 프로젝트 하나 = 100%
  const stripY = useTransform(position, (x) => `${-100 * stripPosition(x)}%`)
  const [active, setActive] = useState(0)
  useMotionValueEvent(position, 'change', (x) => setActive(activeIndex(x, count)))
  // 판 밖에 있는 화면은 lazy 로 두면 올라오는 순간에야 받는다 - 섹션이 가까워지면 다 받아 둔다
  const near = useInView(ref, { once: true, margin: '800px 0px' })
  const jump = useCallback((slug: string) => scrollToShowcase(slug, 'auto'), [])

  return (
    <div ref={ref} className="relative" style={{ height: `${count * 100}svh` }}>
      {/* 목차 · 현재 위치 점이 스크롤해 갈 자리 */}
      {projects.map((p, i) => (
        <span key={p.slug} id={showcaseAnchor(p.slug)} aria-hidden="true" className="absolute left-0 h-px w-px" style={{ top: `${i * 100}svh` }} />
      ))}
      <div className="sticky top-0 h-svh overflow-hidden bg-default">
        <div className="absolute inset-y-0 right-0 overflow-hidden bg-regular" style={{ left: PANEL_LEFT }}>
          <motion.div style={{ y: stripY }} className="absolute inset-0">
            {projects.map((p, i) => (
              <div key={p.slug} className="absolute inset-x-0 flex h-full items-center justify-center" style={{ top: `${i * 100}%` }}>
                <ShowcaseShots project={p} eager={near} />
              </div>
            ))}
          </motion.div>
        </div>

        {projects.map((p, i) => (
          <PinnedText key={p.slug} project={p} index={i} total={count} position={position} active={i === active} onFocusHidden={jump} />
        ))}

        <nav aria-label="대표 프로젝트" className="absolute top-1/2 -translate-y-1/2" style={{ left: RAIL_LEFT }}>
          <ol className="flex flex-col gap-3">
            {projects.map((p, i) => {
              const on = i === active
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => scrollToShowcase(p.slug)}
                    aria-label={`${p.name} 보기`}
                    aria-current={on ? 'true' : undefined}
                    className={`group flex items-center gap-2 py-1 text-13 font-semibold tabular-nums ${on ? 'text-portfolio' : 'text-sub-weak hover:text-main'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full transition-[background-color,scale] duration-300 ${on ? 'scale-125 bg-portfolio' : 'bg-icon-disabled/50 group-hover:bg-icon-sub-weak'}`}
                    />
                    {String(i + 1).padStart(2, '0')}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}

// ---------- 펼친 화면 (모바일 · 낮은 화면 · 움직임 줄이기) ----------
function Stacked({ projects }: { projects: ShowcaseProject[] }) {
  const reveal = useReveal()
  return (
    <div className="flex flex-col gap-18 lg:gap-0">
      {projects.map((p, i) => (
        <article key={p.slug} id={showcaseAnchor(p.slug)} className="flex flex-col gap-7 lg:relative lg:min-h-155 lg:flex-row lg:items-center">
          <div
            className="flex aspect-[390/320] items-center justify-center overflow-hidden bg-regular lg:absolute lg:inset-y-0 lg:right-0 lg:left-(--panel-left) lg:aspect-auto"
            style={{ '--panel-left': PANEL_LEFT } as CSSProperties}
          >
            <ShowcaseShots project={p} />
          </div>
          <motion.div
            {...reveal()}
            className="px-5 sm:px-10 lg:relative lg:ml-(--text-left) lg:w-(--text-width) lg:px-0 lg:py-12"
            style={{ '--text-left': TEXT_LEFT, '--text-width': TEXT_WIDTH } as CSSProperties}
          >
            <ShowcaseText project={p} index={i} total={projects.length} />
          </motion.div>
        </article>
      ))}
    </div>
  )
}

export default function ProjectShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const pinned = useMediaQuery(PINNED)
  if (projects.length === 0) return null
  return (
    <section aria-labelledby="showcase-title">
      <h2 id="showcase-title" className="sr-only">
        대표 프로젝트
      </h2>
      {pinned ? <Pinned projects={projects} /> : <Stacked projects={projects} />}
    </section>
  )
}
