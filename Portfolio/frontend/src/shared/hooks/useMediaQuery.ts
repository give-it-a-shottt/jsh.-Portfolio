import { useCallback, useSyncExternalStore } from 'react'

/** 미디어 쿼리가 지금 맞는지 - 창 크기나 움직임 줄이기 설정이 바뀌면 따라 바뀐다 */
export default function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
