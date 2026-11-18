import { Component, type ReactNode } from 'react'

interface LandingBoundaryProps {
  /** 랜딩을 못 그렸을 때 — 홈을 보여 준다 */
  onFail: () => void
  children: ReactNode
}

// 자소서형 랜딩(F-014)만 감싸는 오류 경계. 첫 방문자가 처음 보는 화면이라,
// 랜딩 코드 조각을 못 받거나(오프라인 · 배포 직후 조각 불일치) 그리다 실패해도 빈 화면 대신 홈으로 넘긴다.
export default class LandingBoundary extends Component<LandingBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFail()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
