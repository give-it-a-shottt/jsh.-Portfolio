import { useState, type RefObject } from 'react'
import { EASE_OUT_POINTS } from '../motion'
import { cubicBezier, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, type MotionValue } from 'motion/react'

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>['offset']>

/**
 * 스크롤을 그대로 묶으면 휠 한 칸(약 100px)마다 그림이 계단처럼 튄다 — 스프링으로 살짝 늦게 따라가게 한다.
 * stiffness 를 올리면 더 빨리 붙고, damping 을 내리면 끝에서 출렁인다.
 */
export const SCROLL_SPRING = { stiffness: 140, damping: 28, mass: 0.6, restDelta: 0.0005 }

/** 끝으로 갈수록 느려지는 곡선 — 피그마 모션의 등장 이징(EASE_OUT)을 스크롤 변환용 함수로 바꾼 것 */
export const easeOutCurve = cubicBezier(...EASE_OUT_POINTS)

/**
 * 요소가 화면을 지나가는 정도(0 → 1, 스프링으로 부드럽게). 움직임은 시간이 아니라 이 값에 묶여서, 위로 올리면 되감긴다.
 * 움직임 줄이기 설정이면 늘 1(다 펼쳐진 상태)을 돌려준다 — 완료 기준 3.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset): MotionValue<number> {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset })
  const smooth = useSpring(scrollYProgress, SCROLL_SPRING)
  const done = useMotionValue(1)
  return reduce ? done : smooth
}

/** 진행값이 넘은 기준점 개수 — 칸 채우기 · 메모 붙이기처럼 한 단계씩 바뀌는 그림에 쓴다 */
export function useStep(progress: MotionValue<number>, thresholds: number[]) {
  const count = (value: number) => thresholds.filter((t) => value >= t).length
  const [step, setStep] = useState(() => count(progress.get()))
  useMotionValueEvent(progress, 'change', (value) => setStep(count(value)))
  return step
}
