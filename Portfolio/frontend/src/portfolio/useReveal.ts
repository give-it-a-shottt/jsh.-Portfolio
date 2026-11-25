import { useReducedMotion } from 'motion/react'
import { EASE_OUT } from './motion'

/**
 * 스크롤해서 화면에 들어올 때 한 번만 떠오르는 모션 값(F-018). order 만큼 늦게 시작해 왼쪽부터 차례로 올라온다.
 * 움직임 줄이기 설정이면 빈 값 - 처음부터 다 보인다.
 */
export default function useReveal() {
  const reduceMotion = useReducedMotion()
  return (order = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '0px 0px -8% 0px' },
          transition: { duration: 0.55, delay: order * 0.06, ease: EASE_OUT },
        }
}
