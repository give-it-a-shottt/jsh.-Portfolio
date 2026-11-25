import type { Easing } from 'motion/react'

/** Figma 모션에서 쓰는 등장 이징 */
export const EASE_OUT: Easing = [0.22, 1, 0.36, 1]

/**
 * 스크롤을 그대로 묶으면 휠 한 칸(약 100px)마다 그림이 계단처럼 튄다 - 스프링으로 살짝 늦게 따라가게 한다.
 * stiffness 를 올리면 더 빨리 붙고, damping 을 내리면 끝에서 출렁인다.
 */
export const SCROLL_SPRING = { stiffness: 140, damping: 28, mass: 0.6, restDelta: 0.0005 }
