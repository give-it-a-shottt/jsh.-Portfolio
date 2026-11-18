import { Fragment, memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion, MotionConfig, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { CONTACT_EMAIL, GITHUB_URL, GITHUB_USER } from '../profile'
import LandingStage from './LandingStages'
import { CHAPTERS, CLOSING, HERO_LINE, QUOTE, type LandingChapter } from './landingContent'
import { markLandingSeen } from './landingSeen'
import { easeOutCurve, SCROLL_SPRING, useScrollProgress } from './useScrollProgress'

interface CoverLandingProps {
  /** 건너뛰기 · '포트폴리오 보러 가기' — 홈으로 */
  onDone: () => void
}

// 자소서형 랜딩(F-014) — 첫 방문 때 홈보다 먼저 보여 주는 긴 스크롤 페이지.
// PPT처럼 보이지 않게: 스냅 · 장면 전환 없이 한 줄로 흐르고, 움직임은 스크롤 위치에 묶인다(피그마 'Motion 규칙').
// 수법은 세 가지만 — ① 문장 하이라이트 ② 글 옆에 붙는 무대(PC) ③ 왼쪽 진행선(PC) / 위 진행 막대(모바일).
export default function CoverLanding({ onDone }: CoverLandingProps) {
  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: heroRaw } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroSmooth = useSpring(heroRaw, SCROLL_SPRING)
  const { scrollYProgress: pageRaw } = useScroll()
  const pageProgress = useSpring(pageRaw, SCROLL_SPRING)
  const still = useMotionValue(0)
  // 움직임 줄이기면 첫 문장은 제자리에 그대로 둔다. 위에 붙는 한 줄은 나타나기만 하는 것이라 그대로 쓴다.
  const heroP = reduce ? still : heroSmooth
  // 첫 문장은 스크롤보다 느리게 위로 밀려나며(깊이감) 천천히 옅어진다 — 크기는 바꾸지 않는다(글자가 줄면 어색함)
  const headY = useTransform(heroP, [0, 1], [0, -140], { ease: easeOutCurve })
  const headOpacity = useTransform(heroP, [0.1, 0.8], [1, 0], { ease: easeOutCurve })
  const hintOpacity = useTransform(heroP, [0, 0.25], [1, 0])
  const docked = useTransform(heroSmooth, [0.7, 0.95], [0, 1])
  const [active, setActive] = useState(-1)

  // 탭마다 한 번(Q-007) — 화면에 뜬 순간 '봤음'으로 기록해서, 새로고침하거나 링크로 나갔다 와도 다시 띄우지 않는다
  useEffect(() => {
    markLandingSeen()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-default">
        {/* 위에 붙는 줄 — 첫 화면에서는 건너뛰기만, 지나가면 첫 문장이 한 줄로 붙는다 */}
        <div className="fixed inset-x-0 top-0 z-30">
          <motion.div aria-hidden="true" style={{ opacity: docked }} className="absolute inset-0 border-b border-light bg-default" />
          <div className="relative mx-auto flex h-14 max-w-300 items-center justify-between gap-4 px-5 sm:px-10 lg:box-content lg:px-30">
            <motion.p aria-hidden="true" style={{ opacity: docked }} className="truncate text-14 font-semibold text-main lg:text-16">
              {HERO_LINE}
            </motion.p>
            <button type="button" onClick={onDone} className="shrink-0 rounded-button px-1 py-2 text-14 font-semibold text-sub-weak hover:text-main lg:text-16">
              건너뛰기 →
            </button>
          </div>
          <motion.div aria-hidden="true" style={{ scaleX: pageProgress, opacity: docked }} className="h-0.5 origin-left bg-portfolio lg:hidden" />
        </div>

        <ProgressRail active={active} opacity={docked} />

        <main>
          {/* 00 첫 화면 */}
          <section ref={heroRef} className="relative mx-auto flex min-h-svh max-w-300 flex-col px-5 pt-14 pb-8 sm:px-10 lg:box-content lg:px-30 lg:pb-12">
            <p lang="en" className="absolute top-0 left-5 flex h-14 items-center text-20 font-semibold text-main sm:left-10 lg:left-30 lg:text-24">
              jsh.
            </p>
            <div className="flex flex-1 items-center">
              <motion.h1
                style={{ y: headY, opacity: headOpacity }}
                className="text-[44px] leading-[1.25] font-semibold tracking-[-0.03em] break-keep text-main lg:text-[88px] lg:leading-[1.2]"
              >
                귀찮은 일을
                <br />
                그냥 두지
                <br className="lg:hidden" /> 못하는
                <br className="hidden lg:inline" /> 편입니다.
              </motion.h1>
            </div>
            <motion.p style={{ opacity: hintOpacity }} className="flex items-center gap-3 text-13 text-sub-weak lg:text-14">
              <span aria-hidden="true" className="h-8 w-0.5 bg-portfolio lg:h-10" />
              스크롤해서 읽기
            </motion.p>
          </section>

          {CHAPTERS.map((chapter, i) => (
            <Fragment key={chapter.id}>
              <ChapterSection chapter={chapter} index={i} onActive={setActive} />
              {/* 03 지금 다음에는 성공 기준 문장을 따로 크게 */}
              {chapter.id === 'now' && <QuoteSection />}
            </Fragment>
          ))}

          <ClosingSection onDone={onDone} />
        </main>
      </div>
    </MotionConfig>
  )
}

// ---------- 왼쪽 진행선 (PC) ----------
/** 해시 라우팅이라 '#landing-…' 로 주소를 바꾸면 다른 화면으로 해석된다 — 주소는 그대로 두고 그 장으로 스크롤만 */
function scrollToChapter(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault()
  document.getElementById(`landing-${id}`)?.scrollIntoView({ behavior: 'smooth' })
}

function ProgressRail({ active, opacity }: { active: number; opacity: MotionValue<number> }) {
  return (
    <motion.nav aria-label="자기소개 목차" style={{ opacity }} className="fixed top-1/2 left-6 z-20 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col gap-4">
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <a href={`#landing-${c.id}`} onClick={(e) => scrollToChapter(e, c.id)} aria-current={i === active ? 'step' : undefined} className="flex items-center gap-2 py-0.5">
              <span className={`h-7 w-0.5 rounded-full transition-colors duration-200 ${i === active ? 'bg-portfolio' : 'bg-regular'}`} />
              <span className={`text-12 font-semibold transition-colors duration-200 ${i === active ? 'text-portfolio' : 'text-disabled'}`}>{c.short}</span>
            </a>
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}

// ---------- 장 라벨 (피그마 ChapterLabel Size=MO / PC) ----------
function ChapterLabel({ num, label, id }: { num: string; label: string; id?: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2 lg:gap-3">
      <span lang="en" className="text-14 font-semibold text-portfolio lg:text-18">
        {num}
      </span>
      <span aria-hidden="true" className="text-14 font-semibold text-portfolio lg:text-18">
        –
      </span>
      <span className="text-16 font-semibold break-keep text-sub lg:text-24 lg:text-main">{label}</span>
    </h2>
  )
}

// ---------- 문장 하이라이트: 화면 아래에서 올라오며 회색 → 진한 글자 ----------
function Sentence({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const p = useScrollProgress(ref, ['start 0.92', 'start 0.62'])
  const opacity = useTransform(p, [0, 1], [0.28, 1], { ease: easeOutCurve })
  // 진해지면서 살짝 떠오른다 — 같은 자리에서 색만 바뀌면 딱딱해 보인다
  const y = useTransform(p, [0, 1], [10, 0], { ease: easeOutCurve })
  return (
    <motion.p ref={ref} style={{ opacity, y }} className={className}>
      {text}
    </motion.p>
  )
}

// ---------- 각 장: 왼쪽 글 + 오른쪽 무대(PC는 글 옆, 글이 길면 무대가 붙어 따라옴 · 모바일은 글 아래) ----------
// 지금 읽는 장(active)이 바뀌면 CoverLanding 이 다시 그려진다 — 장 · 성공 기준 · 마무리는 받는 값이 늘 같아서 memo 로 건너뛴다.
// (안 그러면 장 경계를 넘을 때마다 여섯 장과 무대 그림을 전부 다시 그려 멈칫한다 — 측정: CPU 4배 감속에서 70ms 프레임)
const ChapterSection = memo(function ChapterSection({ chapter, index, onActive }: { chapter: LandingChapter; index: number; onActive: (i: number) => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // 무대 윗부분이 보이기 시작할 때 시작해서, 다 보인 뒤 위로 올라갈 때 끝 — 구간을 넓게 잡아 휠 한 칸에 조금씩만 변하게 (PC · 모바일 같은 기준)
  const stageP = useScrollProgress(stageRef, ['start 0.8', 'end 0.7'])
  const inView = useInView(sectionRef, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  const labelId = `landing-${chapter.id}-title`

  return (
    <section ref={sectionRef} id={`landing-${chapter.id}`} aria-labelledby={labelId} className="scroll-mt-14 px-5 pt-24 pb-8 sm:px-10 lg:px-30 lg:py-40">
      <div className="mx-auto max-w-300 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,600px)] lg:justify-between lg:gap-20">
        <div className="flex flex-col gap-6 lg:gap-8">
          <ChapterLabel num={chapter.num} label={chapter.label} id={labelId} />
          <div className="flex flex-col gap-3">
            {chapter.sentences.map((s) => (
              <Sentence key={s} text={s} className="text-16 font-medium break-keep text-main lg:text-20" />
            ))}
          </div>
        </div>
        <div className="mt-8 lg:mt-0">
          <div ref={stageRef} className="lg:sticky lg:top-[calc(50vh-280px)]">
            <LandingStage kind={chapter.stage} p={stageP} />
          </div>
        </div>
      </div>
    </section>
  )
})

// ---------- 03-b 성공 기준: 단어 단위로 진해지고 'AI 없이'만 파랗게 ----------
const QuoteSection = memo(function QuoteSection() {
  const ref = useRef<HTMLElement>(null)
  const p = useScrollProgress(ref, ['start 0.8', 'end 0.65'])
  const total = QUOTE.lines.flat().length
  // 줄마다 앞 줄 단어 수만큼 순번을 밀어서, 단어가 앞에서부터 차례로 진해지게 한다
  const lineStart = QUOTE.lines.map((_, li) => QUOTE.lines.slice(0, li).flat().length)
  return (
    <section ref={ref} aria-label="성공 기준" className="bg-light px-5 py-18 sm:px-10 lg:px-30 lg:py-35">
      <div className="mx-auto flex max-w-300 flex-col gap-4 lg:gap-6">
        <p className="text-16 font-semibold break-keep text-sub-weak lg:text-24">{QUOTE.lead}</p>
        <p className="text-28 font-semibold break-keep text-main lg:text-56">
          {QUOTE.lines.map((line, li) => (
            <span key={li} className="block">
              {line.map((w, wi) => (
                <Word key={`${li}-${w}`} word={w} p={p} index={lineStart[li] + wi} total={total} accent={QUOTE.accent.includes(w)} />
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
})

/** 한 단어가 진해지는 데 쓰는 진행 구간. 시작점은 0 ~ (1 - WORD_SPAN) 사이에 나눠 놓아서 마지막 단어도 1 안에서 끝난다 */
const WORD_SPAN = 0.3

function Word({ word, p, index, total, accent }: { word: string; p: MotionValue<number>; index: number; total: number; accent: boolean }) {
  // 단어마다 구간을 조금씩 겹쳐서, 한 단어씩 딱딱 켜지지 않고 물결처럼 이어지게
  const start = (index / total) * (1 - WORD_SPAN)
  const opacity = useTransform(p, [start, start + WORD_SPAN], [0.2, 1], { ease: easeOutCurve })
  return (
    <>
      <motion.span style={{ opacity }} className={accent ? 'text-portfolio' : undefined}>
        {word}
      </motion.span>{' '}
    </>
  )
}

// ---------- 06 마무리: 그림 없이 문장 하이라이트만 ----------
const ClosingSection = memo(function ClosingSection({ onDone }: { onDone: () => void }) {
  return (
    <section aria-labelledby="landing-closing-title" className="px-5 pt-30 pb-12 sm:px-10 lg:px-30 lg:pt-50 lg:pb-30">
      <div className="mx-auto flex max-w-300 flex-col gap-7 lg:gap-10">
        <ChapterLabel num={CLOSING.num} label={CLOSING.label} id="landing-closing-title" />
        <div className="flex flex-col gap-3 lg:gap-4">
          {CLOSING.sentences.map((s) => (
            <Sentence key={s} text={s} className="text-18 font-semibold break-keep text-sub lg:text-28" />
          ))}
          <Sentence text={CLOSING.last} className="max-w-240 text-24 font-semibold break-keep text-main lg:text-36" />
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
          <button type="button" onClick={onDone} className="flex h-14 items-center justify-center rounded-card-sm bg-portfolio px-7 text-16 font-semibold text-white hover:bg-portfolio-strong">
            포트폴리오 보러 가기 →
          </button>
          <a href={`mailto:${CONTACT_EMAIL}`} lang="en" className="flex h-14 items-center justify-center rounded-card-sm border border-regular bg-default px-7 text-16 font-semibold text-sub hover:bg-light">
            {CONTACT_EMAIL}
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex h-14 items-center justify-center rounded-card-sm border border-regular bg-default px-7 text-16 font-semibold text-sub hover:bg-light">
            GitHub ↗
          </a>
        </div>
        <div className="flex items-center justify-between pt-16 lg:pt-30">
          <span lang="en" className="text-18 font-semibold text-main lg:text-20">
            jsh.
          </span>
          <span lang="en" className="text-12 font-medium text-sub-weak lg:text-14">
            github.com/{GITHUB_USER}
          </span>
        </div>
      </div>
    </section>
  )
})
