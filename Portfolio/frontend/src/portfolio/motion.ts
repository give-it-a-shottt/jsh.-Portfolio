import type { Easing } from 'motion/react'

/** Figma 모션에서 쓰는 등장 이징의 베지어 점 — 전환(EASE_OUT)과 스크롤 변환(landing 의 easeOutCurve)이 같이 쓴다 */
export const EASE_OUT_POINTS = [0.22, 1, 0.36, 1] as const

/** Figma 모션에서 쓰는 등장 이징 */
export const EASE_OUT: Easing = [...EASE_OUT_POINTS]

