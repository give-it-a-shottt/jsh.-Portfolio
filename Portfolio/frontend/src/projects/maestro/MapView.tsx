import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { LatLng } from './types'

export interface MapPlace {
  id: string
  name: string
  initial: string
  location: LatLng
}

const PIN_BASE =
  'flex items-center justify-center rounded-full border-2 border-white bg-mr-pin font-semibold text-white shadow-mr-1'

// Map Pin — 순위처럼 보이지 않게 숫자 대신 식당 이름 첫 글자. 터치 영역 44, 선택하면 40으로 키운다.
// 핀은 읽지 않는다 — 같은 식당을 목록 카드가 이름으로 알려 준다.
function pinIcon(initial: string, selected: boolean) {
  const size = selected ? 'size-10 text-16' : 'size-8 text-13'
  return L.divIcon({
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `<span aria-hidden="true" class="flex size-11 items-center justify-center"><span class="${PIN_BASE} ${size}">${initial}</span></span>`,
  })
}

// 무료 타일(OpenStreetMap). 색은 손대지 않는다 — 라벤더로 칠한 2안은 핀 대비가 떨어져 탈락했다.
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

/**
 * Leaflet 지도 — 후보 핀과 지도 이동. 핀을 누르면 onSelect 로 목록 카드를 강조한다.
 * 지도 이동은 setView(300ms 이하)만 쓰고 flyTo 는 쓰지 않는다. 움직임 줄이기를 켜면 바로 옮긴다.
 */
export default function MapView({
  places,
  center,
  selectedId = null,
  onSelect,
  padding = { top: 20, bottom: 20 },
  zoomControl = false,
  className = '',
}: {
  places: MapPlace[]
  center: LatLng
  selectedId?: string | null
  onSelect?: (id: string) => void
  /** 지도 위에 겹친 칩 · 시트만큼 핀을 안쪽으로 둔다 */
  padding?: { top: number; bottom: number; right?: number }
  zoomControl?: boolean
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef(new Map<string, L.Marker>())
  const [tileError, setTileError] = useState(false)
  const reduceMotion = useReducedMotion()
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  })

  // 지도는 한 번만 만든다
  useEffect(() => {
    if (!box.current) return
    const created = L.map(box.current, { zoomControl: false, attributionControl: true, scrollWheelZoom: zoomControl })
    // 확대 버튼은 PC 에서만, 위 왼쪽 조건 칩과 겹치지 않게 오른쪽 아래에
    if (zoomControl) L.control.zoom({ position: 'bottomright' }).addTo(created)
    created.setView([center.lat, center.lng], 16)
    // 타일 한두 장 실패는 흔하다 — 한 장도 못 받았을 때만 안내한다. 목록은 그대로 쓸 수 있다
    let loaded = false
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 })
      .on('tileload', () => {
        loaded = true
        setTileError(false)
      })
      .on('tileerror', () => !loaded && setTileError(true))
      .addTo(created)
    map.current = created
    // 지도 상자 크기가 바뀌면(시트 펼침 · 창 크기) 타일을 다시 맞춘다
    const observer = new ResizeObserver(() => created.invalidateSize())
    observer.observe(box.current)
    const placed = markers.current
    return () => {
      observer.disconnect()
      created.remove()
      map.current = null
      placed.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 처음 만들 때만 쓰는 값
  }, [])

  // 후보가 바뀌면 핀을 다시 놓고 세 곳이 다 보이게 맞춘다
  const placesKey = places.map((p) => p.id).join(',')
  useEffect(() => {
    const current = map.current
    if (!current) return
    markers.current.forEach((marker) => marker.remove())
    markers.current.clear()
    for (const place of places) {
      const marker = L.marker([place.location.lat, place.location.lng], {
        icon: pinIcon(place.initial, false),
        keyboard: false,
        title: place.name,
      })
        .on('click', () => onSelectRef.current?.(place.id))
        .addTo(current)
      markers.current.set(place.id, marker)
    }
    const options = {
      paddingTopLeft: [32, padding.top] as L.PointTuple,
      paddingBottomRight: [padding.right ?? 32, padding.bottom] as L.PointTuple,
      maxZoom: 17,
      animate: false,
    }
    if (places.length > 1) current.fitBounds(L.latLngBounds(places.map((p) => [p.location.lat, p.location.lng])), options)
    else if (places.length === 1) current.setView([places[0].location.lat, places[0].location.lng], 17, { animate: false })
    else current.setView([center.lat, center.lng], 16, { animate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 후보 목록(id) · 비켜 둘 폭이 바뀔 때만
  }, [placesKey, center.lat, center.lng, padding.right])

  // 선택된 핀만 키우고 가운데로 옮긴다
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      const place = places.find((p) => p.id === id)
      if (place) marker.setIcon(pinIcon(place.initial, id === selectedId)).setZIndexOffset(id === selectedId ? 1000 : 0)
    })
    // 칩 · 시트 · PC 상세 패널에 가려지면 그만큼만 옮긴다 (이미 보이면 그대로)
    const selected = selectedId ? markers.current.get(selectedId) : undefined
    if (selected && map.current)
      map.current.panInside(selected.getLatLng(), {
        paddingTopLeft: [32, padding.top],
        paddingBottomRight: [padding.right ?? 32, padding.bottom],
        animate: !reduceMotion,
        duration: 0.3,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 선택 · 비켜 둘 폭이 바뀔 때만
  }, [selectedId, placesKey, padding.right])

  return (
    <div className={`relative isolate overflow-hidden bg-mr-fill max-lg:[&_.leaflet-control-zoom]:hidden ${className}`}>
      <div ref={box} className="absolute inset-0" />
      {tileError && (
        <p role="status" className="absolute inset-x-5 top-1/2 z-[500] -translate-y-1/2 rounded-card-sm bg-mr-fill/95 py-4 text-center text-14 text-mr-sub">
          지도를 불러오지 못했어요
        </p>
      )}
    </div>
  )
}
