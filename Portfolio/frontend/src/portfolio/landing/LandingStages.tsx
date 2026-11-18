import type { ReactNode } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useTransform, type MotionValue } from 'motion/react'
import { EASE_OUT } from '../motion'
import type { StageKind } from './landingContent'
import { easeOutCurve, useStep } from './useScrollProgress'

// 자소서형 랜딩(F-014)의 오른쪽 무대. 모두 장식이라 화면 읽기 도구에서는 숨기고(aria-hidden), 내용은 왼쪽 글이 전한다.
// p = 이 장의 진행값(0 → 1). 피그마 'Motion — 장면별 상태'의 시작 · 중간 · 끝이 p 0 · 0.5 · 1 쯤이다.

/** 칸 · 메모 · 카드가 '등장'할 때만 쓰는 전환 (Motion 규칙 7) — 0.2초는 '뿅' 하고 튀어 보여서 늘렸다 */
const APPEAR = { duration: 0.45, ease: EASE_OUT }

export default function LandingStage({ kind, p }: { kind: StageKind; p: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="relative overflow-hidden rounded-card bg-light p-3 sm:p-6 lg:flex lg:h-140 lg:items-center lg:justify-center lg:p-12">
      {kind === 'schedule' && <ScheduleStage p={p} />}
      {kind === 'code' && <CodeStage p={p} />}
      {kind === 'reviewers' && <ReviewerStage p={p} />}
      {kind === 'didim' && <DidimStage p={p} />}
      {kind === 'design' && <DesignStage p={p} />}
    </div>
  )
}

// ---------- 01 근무표: 한 칸씩 손으로 → 60% 지점에서 표 전체가 한 번에 ----------
const DAYS = ['월', '화', '수', '목', '금', '토', '일']
/** 근무자 이름 대신 쓰는 글자 — 줄마다 한 칸씩 밀려 돌아간다 */
const SHIFT_NAMES = 'ABCDEF'
const SHIFTS = SHIFT_NAMES.length
/** 손으로 채우는 칸 수. 그다음 기준점(0.6)에서 나머지가 한 번에 채워진다 */
const HAND_CELLS = 10
const SCHEDULE_STEPS = [...Array.from({ length: HAND_CELLS }, (_, i) => 0.1 + i * 0.045), 0.6]
/** 이번 주(위 네 줄)는 파랗게, 다음 주(아래 두 줄)는 회색으로 미리 채워진다 */
const THIS_WEEK_ROWS = 4
/**
 * 자동으로 채워질 때 칸마다 두는 시간차(ms). 한꺼번에 바뀌면 '확' 튀어 보여서,
 * 왼쪽 위에서 오른쪽 아래로 (줄 + 칸) × 이 값만큼 늦게 — 표 전체가 약 1초 동안 물결처럼 채워진다
 */
const WAVE_MS = 45

function ScheduleStage({ p }: { p: MotionValue<number> }) {
  const step = useStep(p, SCHEDULE_STEPS)
  const auto = step > HAND_CELLS
  return (
    <div className="w-full overflow-hidden rounded-card-sm border border-regular bg-default lg:w-fit">
      <div className="flex items-center justify-between gap-2 bg-regular px-2.5 py-2 lg:px-4 lg:py-3">
        <span lang="en" className="text-13 font-semibold text-sub lg:text-14">
          근무표.xlsm
        </span>
        <span className={`rounded-thumb-sm bg-portfolio-soft px-3 py-1.5 text-13 font-semibold text-portfolio transition-opacity duration-500 ease-out lg:text-15 ${auto ? 'opacity-100' : 'opacity-30'}`}>
          자동으로 채우기
        </span>
      </div>
      <div className="grid grid-cols-[50px_repeat(7,minmax(0,1fr))] lg:grid-cols-[88px_repeat(7,56px)]">
        <span className="h-9 border border-light bg-light lg:h-13" />
        {DAYS.map((d) => (
          <span key={d} className="flex h-9 items-center justify-center border border-light bg-light text-11 font-semibold text-sub-weak lg:h-13 lg:text-13">
            {d}
          </span>
        ))}
        {Array.from({ length: SHIFTS }, (_, r) => (
          <ScheduleRow key={r} row={r} step={step} auto={auto} />
        ))}
      </div>
    </div>
  )
}

function ScheduleRow({ row, step, auto }: { row: number; step: number; auto: boolean }) {
  const thisWeek = row < THIS_WEEK_ROWS
  return (
    <>
      <span className="flex h-9 items-center justify-center border border-light bg-light text-11 font-semibold text-sub-weak lg:h-13 lg:text-13">
        근무 {row + 1}
      </span>
      {DAYS.map((d, c) => {
        const index = row * DAYS.length + c
        const byHand = thisWeek && index < HAND_CELLS
        const filled = thisWeek ? auto || index < step : auto
        // 손으로 채운 칸은 이미 채워져 있으니 바로, 자동으로 채워지는 칸만 물결 시간차를 둔다(되감을 때는 한 번에 비운다)
        const delay = auto && !byHand ? `${(row + c) * WAVE_MS}ms` : '0ms'
        return (
          <span
            key={d}
            lang="en"
            style={{ transitionDelay: delay }}
            className={`flex h-9 items-center justify-center border border-light text-13 font-medium transition-colors duration-500 ease-out motion-reduce:transition-none lg:h-13 lg:text-15 ${
              filled && thisWeek ? 'bg-portfolio-soft text-portfolio' : 'bg-default text-disabled'
            }`}
          >
            {/* 글자도 갑자기 생기지 않게 — 늘 그려 두고 투명도 · 위치만 바꾼다 */}
            <span
              style={{ transitionDelay: delay }}
              className={`transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none ${filled ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
            >
              {SHIFT_NAMES[(row + c) % SHIFT_NAMES.length]}
            </span>
          </span>
        )
      })}
    </>
  )
}

// ---------- 02 코드: 흐린 코드 → '왜?' 메모가 하나씩 붙으며 선명해짐 ----------
const CODE_LINES = ["const res = await fetch('/api/search', {", "  method: 'POST',", '  body: JSON.stringify({ q }),', '})', 'const items = await res.json()', 'setResults(items)']
const MEMOS = ['왜 이 구조?', '왜 POST?', '왜 여기서 상태를?']

function CodeStage({ p }: { p: MotionValue<number> }) {
  const blur = useTransform(p, [0.1, 0.7], [8, 0], { ease: easeOutCurve })
  const filter = useMotionTemplate`blur(${blur}px)`
  const opacity = useTransform(p, [0.1, 0.7], [0.4, 1], { ease: easeOutCurve })
  const memos = useStep(p, [0.35, 0.5, 0.65])
  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-start">
      <motion.pre style={{ filter, opacity }} className="overflow-x-auto rounded-card bg-main p-4.5 text-12 leading-[1.6] text-white lg:p-7 lg:text-14">
        <code lang="en">{CODE_LINES.join('\n')}</code>
      </motion.pre>
      <div className="relative z-10 flex flex-wrap gap-2 lg:-ml-8 lg:flex-col lg:gap-4 lg:pt-3">
        {MEMOS.map((m, i) => (
          <motion.span
            key={m}
            initial={false}
            animate={{ opacity: i < memos ? 1 : 0, y: i < memos ? 0 : 8 }}
            transition={APPEAR}
            className="w-fit rounded-thumb-sm bg-portfolio-soft px-3.5 py-2 text-13 font-semibold text-portfolio lg:text-15"
          >
            {m}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ---------- 03 리뷰어 네 명: 한 자리에 겹쳐 있다가 2×2로 펼쳐짐 ----------
const REVIEWERS = [
  { code: 'R1', name: '구조 · 가독성', sx: 1, sy: 1, rot: -2 },
  { code: 'R2', name: '보안 · 성능', sx: -1, sy: 1, rot: 2 },
  { code: 'R3', name: '예외 처리 · 테스트', sx: 1, sy: -1, rot: 2 },
  { code: 'R4', name: '설계 의도 · API', sx: -1, sy: -1, rot: -2 },
]
const LOOP = ['지적 없음', '이유 쓰기', '다시 확인']
/** 카드 안 목록 — 리뷰어마다 같다 */
const CARD_CHECKS = ['지적', '이유', '다시 확인']
/** 격자 간격(gap-3 = 12px)의 절반 — 겹쳐 있을 때 네 장이 정확히 가운데서 만난다 */
const HALF_GAP_PX = 6
/** 카드가 펼쳐지는 진행 구간과, 한 장씩 늦게 출발하는 간격 — 마지막(4번째) 카드는 0.5 + 3 × 0.05 = 0.65 에 다 펼쳐진다 */
const SPREAD_START = 0.1
const SPREAD_END = 0.5
const CARD_STAGGER = 0.05
/** 아래 '지적 없음 → 이유 쓰기 → 다시 확인'은 마지막 카드가 거의 펼쳐질 즈음(0.6)부터 하나씩 켜진다 */
const LOOP_STEPS = [0.6, 0.67, 0.74]

function ReviewerStage({ p }: { p: MotionValue<number> }) {
  const loop = useStep(p, LOOP_STEPS)
  return (
    <div className="flex w-full flex-col items-center gap-5 lg:w-125">
      <div className="grid w-full grid-cols-2 gap-3">
        {REVIEWERS.map((r, i) => (
          <ReviewerCard key={r.code} {...r} p={p} order={i} />
        ))}
      </div>
      <div className="flex items-center gap-1.5 lg:gap-2.5">
        {LOOP.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5 lg:gap-2.5">
            {i > 0 && <span className="text-13 font-semibold text-disabled">→</span>}
            <motion.span
              initial={false}
              animate={{ opacity: i < loop ? 1 : 0.25 }}
              transition={APPEAR}
              className={`rounded-full px-3 py-2 text-13 font-semibold lg:px-4 lg:py-2.5 lg:text-15 ${i === LOOP.length - 1 ? 'bg-portfolio-soft text-portfolio' : 'bg-default text-sub'}`}
            >
              {s}
            </motion.span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ReviewerCard({ code, name, sx, sy, rot, p, order }: (typeof REVIEWERS)[number] & { p: MotionValue<number>; order: number }) {
  // 네 장이 한꺼번에 움직이면 기계적이라, 한 장씩 조금 늦게 출발한다
  const spread = useTransform(p, [SPREAD_START + order * CARD_STAGGER, SPREAD_END + order * CARD_STAGGER], [0, 1], { ease: easeOutCurve })
  // 펼쳐지기 전에는 네 장이 격자 가운데에 겹쳐 있다 — 카드 크기의 절반 + 간격의 절반만큼 안쪽으로 당긴다
  const x = useTransform(spread, (v) => `calc(${(1 - v) * sx * 50}% + ${(1 - v) * sx * HALF_GAP_PX}px)`)
  const y = useTransform(spread, (v) => `calc(${(1 - v) * sy * 50}% + ${(1 - v) * sy * HALF_GAP_PX}px)`)
  const rotate = useTransform(spread, (v) => v * rot)
  return (
    <motion.div style={{ x, y, rotate }} className="flex flex-col gap-2.5 rounded-card border border-regular bg-default p-4 shadow-[0_8px_24px_rgb(28_26_22/0.08)] lg:p-6">
      <span lang="en" className="text-13 font-semibold text-portfolio">
        {code}
      </span>
      <span className="text-18 font-semibold break-keep text-main lg:text-20">{name}</span>
      <ul className="flex flex-col gap-2 pt-1.5">
        {CARD_CHECKS.map((c) => (
          <li key={c} className="flex items-center gap-2 text-14 font-medium text-sub-weak">
            <span className="size-1.5 rounded-full bg-portfolio" />
            {c}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ---------- 04 디딤: 남은 횟수가 줄고, 쓰는 사람 · 운영하는 사람이 가운데로 모임 ----------
/** '오늘 남은 첨삭' 숫자는 예시 — 시작 5회 → 끝 3회 */
const DIDIM_START = 5

function DidimStage({ p }: { p: MotionValue<number> }) {
  const used = useStep(p, [0.3, 0.6])
  const middle = useTransform(p, [0.2, 0.7], [0.3, 1], { ease: easeOutCurve })
  const line = useTransform(p, [0.2, 0.7], [96, 36], { ease: easeOutCurve })
  return (
    <div className="flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:gap-9">
      <div className="flex w-full flex-col gap-3 rounded-card border border-regular bg-default p-5 lg:w-75 lg:gap-3.5 lg:p-6">
        <span className="text-18 font-semibold text-main lg:text-20">디딤</span>
        <span className="text-13 font-medium text-sub-weak lg:text-14">자기소개서 첨삭</span>
        {[100, 92, 96, 70].map((w) => (
          <span key={w} className="h-2 rounded-full bg-regular" style={{ width: `${w}%` }} />
        ))}
        <span className="flex items-center justify-between rounded-thumb bg-portfolio-soft px-3.5 py-2.5">
          <span className="text-14 font-semibold text-sub">오늘 남은 첨삭</span>
          {/* 숫자가 바뀔 때 위에서 내려오며 바뀐다 — 그냥 바꾸면 깜빡여 보인다 */}
          <span className="relative h-6.5 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={DIDIM_START - used}
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 14, opacity: 0 }}
                transition={APPEAR}
                className="block text-18 font-semibold text-portfolio"
              >
                {DIDIM_START - used}회
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
        <span className="flex h-14 items-center justify-center rounded-card-sm bg-portfolio text-16 font-semibold text-white">첨삭 받기</span>
      </div>
      {/* PC: 세로로 모임 */}
      <div className="hidden flex-col items-center lg:flex">
        <Pill>쓰는 사람</Pill>
        <motion.span style={{ height: line }} className="w-0 border-l border-regular" />
        <motion.span style={{ opacity: middle }}>
          <Pill accent>하루 호출 횟수</Pill>
        </motion.span>
        <motion.span style={{ height: line }} className="w-0 border-l border-regular" />
        <Pill>운영하는 사람</Pill>
      </div>
      {/* 모바일: 가로 한 줄 */}
      <div className="flex items-center gap-1.5 lg:hidden">
        <Pill>쓰는 사람</Pill>
        <span className="h-0 w-3 border-t border-regular" />
        <motion.span style={{ opacity: middle }}>
          <Pill accent>하루 호출 횟수</Pill>
        </motion.span>
        <span className="h-0 w-3 border-t border-regular" />
        <Pill>운영하는 사람</Pill>
      </div>
    </div>
  )
}

function Pill({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <span className={`block rounded-full px-3 py-2 text-13 font-semibold whitespace-nowrap lg:px-4 lg:py-2.5 lg:text-15 ${accent ? 'bg-portfolio-soft text-portfolio' : 'bg-default text-sub'}`}>
      {children}
    </span>
  )
}

// ---------- 05 디자인: 색 · 글꼴 조각이 모여 화면 한 장 → 옆에 날짜별 노트가 쌓임 ----------
const DESIGN_STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
const SWATCHES = ['bg-main', 'bg-portfolio', 'bg-portfolio-soft', 'bg-regular', 'bg-default']
/** 노트 날짜는 예시 */
const NOTES = [
  { date: '11.16', rot: -4 },
  { date: '11.17', rot: 0 },
  { date: '11.18', rot: 4 },
]

function Appear({ on, className, children }: { on: boolean; className?: string; children?: ReactNode }) {
  return (
    <motion.div initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }} transition={APPEAR} className={className}>
      {children}
    </motion.div>
  )
}

function DesignStage({ p }: { p: MotionValue<number> }) {
  const step = useStep(p, DESIGN_STEPS)
  return (
    <div className="relative w-full lg:w-125">
      <Appear on={step >= 1} className="flex items-center gap-2 lg:gap-2.5">
        {SWATCHES.map((s) => (
          <span key={s} className={`size-7 rounded-full border border-regular lg:size-9 ${s}`} />
        ))}
        <span lang="en" className="pl-1 text-24 font-semibold text-main lg:text-28">
          Aa
        </span>
      </Appear>
      <div className="mt-5 flex w-[58%] flex-col gap-2.5 rounded-card-sm border border-regular bg-default p-3 lg:mt-6 lg:w-75 lg:gap-3 lg:p-4">
        <Appear on={step >= 2} className="h-2.5 rounded-xs bg-main lg:h-3" />
        <Appear on={step >= 3} className="h-16 rounded-thumb-sm bg-portfolio-soft lg:h-24" />
        <Appear on={step >= 4} className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-16 rounded-thumb-sm bg-regular lg:h-25" />
          ))}
        </Appear>
        <Appear on={step >= 5} className="h-6 w-2/5 rounded-thumb-sm bg-portfolio lg:h-8" />
      </div>
      {NOTES.map((n, i) => (
        <Appear key={n.date} on={step >= 6 + i} className="absolute top-14 left-[54%] lg:top-20 lg:left-[60%]">
          <span
            className="block w-28 rounded-thumb border border-regular bg-default p-3 lg:w-50 lg:p-5"
            style={{ transform: `translate(${i * 8}px, ${i * 22}px) rotate(${n.rot}deg)` }}
          >
            <span lang="en" className="block text-11 font-semibold text-sub-weak lg:text-13">
              {n.date}
            </span>
            <span className="mt-2 block h-2 w-3/5 rounded-xs bg-main lg:h-3" />
            {[80, 70, 75, 45, 65].map((w, k) => (
              <span key={k} className="mt-2 block h-1.5 rounded-xs bg-regular lg:h-2" style={{ width: `${w}%` }} />
            ))}
          </span>
        </Appear>
      ))}
    </div>
  )
}
