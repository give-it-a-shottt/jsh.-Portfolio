import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { FrameLayerContext } from './frameLayer'

interface MobileFrameProps {
  children: ReactNode
  /** 피그마 프레임 폭 (375~400) */
  width?: number
  /** 피그마 프레임 높이 */
  height?: number
}

// 모바일 시안(375~400px)을 보여주는 틀.
// 휴대폰(sm 미만)에서는 화면을 꽉 채우고 페이지가 스크롤된다.
// 넓은 화면에서는 가운데에 위아래가 둥근 휴대폰 크기로 띄우고, 스크롤은 틀 안에서만 된다.
export default function MobileFrame({ children, width = 375, height = 812 }: MobileFrameProps) {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null)
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null)
  const size = { '--frame-w': `${width}px`, '--frame-h': `${height}px` } as CSSProperties

  // 해시 주소가 바뀌면 틀 안 스크롤도 맨 위로 (페이지 스크롤은 App 이 올린다)
  useEffect(() => {
    if (!scroller) return
    const toTop = () => scroller.scrollTo(0, 0)
    window.addEventListener('hashchange', toTop)
    return () => window.removeEventListener('hashchange', toTop)
  }, [scroller])

  return (
    <div className="min-h-svh bg-light sm:flex sm:items-center sm:justify-center sm:py-6">
      {/* 둥근 모서리용 overflow 는 넓은 화면에서만 - 휴대폰에서 걸면 sticky 버튼이 화면 아래에 붙지 않는다 */}
      <div
        ref={setFrame}
        style={size}
        className="relative flex min-h-svh w-full flex-col bg-white sm:h-[min(var(--frame-h),calc(100svh-48px))] sm:min-h-0 sm:w-(--frame-w) sm:overflow-hidden sm:rounded-[30px] sm:shadow-[0_8px_40px_rgba(17,17,17,0.12)]"
      >
        <div ref={setScroller} className="scrollbar-none flex flex-1 flex-col sm:overflow-y-auto">
          <FrameLayerContext.Provider value={frame}>{children}</FrameLayerContext.Provider>
        </div>
      </div>
    </div>
  )
}
