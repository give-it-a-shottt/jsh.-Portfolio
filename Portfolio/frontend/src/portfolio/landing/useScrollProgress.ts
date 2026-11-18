import { useState, type RefObject } from 'react'
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from 'motion/react'

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>['offset']>

/**
 * 요소가 화면을 지나가는 정도(0 → 1). 움직임은 시간이 아니라 이 값에 묶여서, 위로 올리면 되감긴다.
 * 움직임 줄이기 설정이면 늘 1(다 펼쳐진 상태)을 돌려준다 — 완료 기준 3.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset): MotionValue<number> {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset })
  const done = useMotionValue(1)
  return reduce ? done : scrollYProgress
}

/** 진행값이 넘은 기준점 개수 — 칸 채우기 · 메모 붙이기처럼 한 단계씩 바뀌는 그림에 쓴다 */
export function useStep(progress: MotionValue<number>, thresholds: number[]) {
  const count = (value: number) => thresholds.filter((t) => value >= t).length
  const [step, setStep] = useState(() => count(progress.get()))
  useMotionValueEvent(progress, 'change', (value) => setStep(count(value)))
  return step
}
