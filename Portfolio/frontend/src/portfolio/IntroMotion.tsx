import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { LOGO_LAYOUT_ID } from './PortfolioHeader'
import './IntroMotion.css'

// 잔디(커밋 그래프) 20×7 칸이 채워졌다가 'JSH' 로 모이고, 에디터가 열리며 print("Hello, jsh. world") 를 친다.
// 출력의 'jsh.' 가 인트로가 끝날 때 헤더 로고 자리로 날아간다(LOGO_LAYOUT_ID).
const COLS = 20
const ROWS = 7
const LEVELS = ['var(--g0)', 'var(--g1)', 'var(--g2)', 'var(--g3)', 'var(--g4)']
const FONT: Record<string, string[]> = {
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
}
const CODE_PARTS: [text: string, className: string][] = [
  ['print(', ''],
  ['"Hello, jsh. world"', 's'],
  [')', ''],
]
const TOTAL = CODE_PARTS.reduce((sum, [text]) => sum + text.length, 0)
/** 각 조각이 시작하는 글자 위치 */
const PART_STARTS = CODE_PARTS.map((_, i) => CODE_PARTS.slice(0, i).reduce((sum, [text]) => sum + text.length, 0))

// 단계별 시간(ms) — 원본 타이밍. 합쳐서 약 6.6초 뒤 로고로 넘어가고, 아무 입력으로나 건너뛸 수 있다
const TIMING = {
  start: 250,
  /** 칸이 왼쪽부터 채워지는 간격(열마다) + 흩뿌림 */
  fillStep: 42,
  fillJitter: 140,
  fillHold: 1250,
  /** JSH 로 모일 때 열마다 늦추는 간격 */
  alignStep: 14,
  alignHold: 1300,
  editorOpen: 900,
  /** 한 글자 치는 시간 = typeMin + 0~typeJitter */
  typeMin: 38,
  typeJitter: 55,
  beforeOutput: 280,
  outputHold: 900,
}

// 5칸 글자 3개 + 간격 = 17칸, 왼쪽 2칸부터 배치
const LETTER_CELLS = new Set<number>()
;['J', 'S', 'H'].forEach((letter, i) => {
  const x0 = 2 + i * 6
  FONT[letter].forEach((row, r) =>
    [...row].forEach((c, k) => {
      if (c === '#') LETTER_CELLS.add(r * COLS + x0 + k)
    }),
  )
})

/** 이 중 하나라도 일어나면 기다리지 않고 바로 검색 화면으로 넘어간다 */
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** 같은 칸에 팝 애니메이션을 다시 걸려면 클래스를 뗐다가 레이아웃을 한 번 읽고 다시 붙인다 */
function pop(cell: HTMLElement) {
  cell.classList.remove('pop')
  void cell.offsetWidth
  cell.classList.add('pop')
}

interface IntroMotionProps {
  /** 모션이 끝나거나 사용자가 클릭·키·스크롤·건너뛰기를 하면 불린다 */
  onDone: () => void
}

// 첫 방문 인트로. 한 세션에 한 번, 움직임 줄이기 설정이면 아예 띄우지 않는다(PortfolioApp 에서 판단).
export default function IntroMotion({ onDone }: IntroMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [typed, setTyped] = useState(0)
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    SKIP_EVENTS.forEach((type) => window.addEventListener(type, onDone, { passive: true }))
    return () => SKIP_EVENTS.forEach((type) => window.removeEventListener(type, onDone))
  }, [onDone])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    let alive = true
    const timers: number[] = []
    const cells = [...grid.children] as HTMLElement[]

    void (async () => {
      await sleep(TIMING.start)
      if (!alive) return

      // 1. 잔디 채우기
      cells.forEach((cell, i) => {
        const delay = (i % COLS) * TIMING.fillStep + Math.random() * TIMING.fillJitter
        timers.push(
          window.setTimeout(() => {
            cell.style.background = LEVELS[1 + Math.floor(Math.random() * 4)]
            pop(cell)
          }, delay),
        )
      })
      await sleep(TIMING.fillHold)
      if (!alive) return

      // 2. JSH 로 모으기
      cells.forEach((cell, i) => {
        const on = LETTER_CELLS.has(i)
        cell.style.transitionDelay = `${(i % COLS) * TIMING.alignStep}ms`
        cell.style.background = on ? LEVELS[4] : LEVELS[0]
        cell.classList.toggle('lit', on)
        cell.classList.toggle('dim', !on)
        if (on) pop(cell)
      })
      await sleep(TIMING.alignHold)
      if (!alive) return

      // 3. 에디터 열기
      setEditorOpen(true)
      await sleep(TIMING.editorOpen)

      // 4. 타이핑 → 출력
      for (let n = 1; n <= TOTAL; n++) {
        if (!alive) return
        setTyped(n)
        await sleep(TIMING.typeMin + Math.random() * TIMING.typeJitter)
      }
      await sleep(TIMING.beforeOutput)
      if (!alive) return
      setShowOutput(true)
      await sleep(TIMING.outputHold)
      if (alive) onDone()
    })()

    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  // 친 글자 수만큼 코드 조각을 자른다 — 조각마다 앞 조각들의 글자 수(PART_STARTS)를 빼고 남는 만큼
  const codeSpans = CODE_PARTS.map(([text, className], i) => {
    const part = text.slice(0, Math.max(0, typed - PART_STARTS[i]))
    return part ? (
      <span key={i} className={className}>
        {part}
      </span>
    ) : null
  })

  return (
    <div className="intro">
      <h1 className="sr-only">jsh. 포트폴리오</h1>
      <div className="intro__stage" aria-hidden="true">
        {/* 에디터가 덮으면 잔디를 숨긴다 — 빛나는 칸의 그림자가 에디터 밖으로 번지지 않게 */}
        <div className={`intro__grid ${editorOpen ? 'covered' : ''}`} ref={gridRef}>
          {Array.from({ length: COLS * ROWS }, (_, i) => (
            <div key={i} className="intro__cell" />
          ))}
        </div>
        <div className={`intro__editor ${editorOpen ? 'open' : ''}`}>
          <div className="intro__dots">
            <i />
            <i />
            <i />
          </div>
          <div className="intro__code" lang="en">
            {codeSpans}
            {editorOpen && <span className="intro__caret" />}
          </div>
          {/* 'jsh.' 는 처음부터 그려 두어(보이지만 않게), 언제 건너뛰어도 로고가 이 자리에서 날아간다 */}
          <div className={`intro__out ${showOutput ? 'show' : ''}`} lang="en">
            Hello,{' '}
            <motion.span layoutId={LOGO_LAYOUT_ID} className="inline-block">
              jsh.
            </motion.span>{' '}
            world
          </div>
        </div>
      </div>
      <button type="button" className="intro__skip" onClick={onDone}>
        건너뛰기
      </button>
    </div>
  )
}
