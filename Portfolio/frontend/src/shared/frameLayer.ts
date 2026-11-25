import { createContext, useContext } from 'react'

// 바텀시트처럼 화면 위에 뜨는 것은 MobileFrame 틀 안에 띄워야 둥근 모서리 밖으로 삐져나오지 않는다
export const FrameLayerContext = createContext<HTMLElement | null>(null)

/** MobileFrame 틀 요소 - 틀 밖에서 쓰면 null */
export function useFrameLayer() {
  return useContext(FrameLayerContext)
}
