import { useEffect, useState } from 'react'
import { BottomBar, EvidenceBlock, ErrorInline, GnbSub, HelpTip, Icon, InfoRow, SkeletonCards, StatusBadge, NowBar, Toast } from '../components'
import { buttonClass } from '../styles'
import { directionsUrl, menuName, priceText, stationLong, topic } from '../format'
import { usePlace } from '../hooks'
import helpIcon from '../icons/help.svg'
import locationIcon from '../icons/location.svg'
import MapView from '../MapView'
import { goTo, maestroHref, type Query } from '../routes'
import { queryKey, useMaestro } from '../store'
import type { PlaceDetail } from '../types'
import SeatSheet from './SeatSheet'

// PLC_01_001 — 식당 상세. MO 는 한 화면(layout='page'), PC 는 결과 지도 위 오른쪽 패널(layout='panel').
export default function PlaceDetailBody({ id, query, layout }: { id: string; query: Query; layout: 'page' | 'panel' }) {
  const { state, retry } = usePlace(id, query)
  const picksHref = maestroHref('/picks', query)
  const page = layout === 'page'

  // PC 패널은 Esc 로 닫는다 (결과 목록으로)
  useEffect(() => {
    if (page) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && goTo(picksHref)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, picksHref])

  const name = state.status === 'ready' ? state.data.pick.place.name : ''
  return (
    <div className={page ? 'min-h-svh bg-mr-screen' : ''}>
      {page && <GnbSub title={name || '식당 상세'} backHref={picksHref} className="sticky top-0 z-30" />}
      <div className={page ? 'px-5 pt-4 pb-[160px]' : ''}>
        {state.status === 'loading' && <SkeletonCards />}
        {state.status === 'error' && <ErrorInline message={state.message} onRetry={retry} />}
        {state.status === 'ready' && <Detail key={state.data.pick.place.id} detail={state.data} query={query} page={page} />}
      </div>
      {page && <Toast className="bottom-[136px]" />}
    </div>
  )
}

function Detail({ detail, query, page }: { detail: PlaceDetail; query: Query; page: boolean }) {
  const { pick } = detail
  const { place, status } = pick
  const [sheetOpen, setSheetOpen] = useState(false)
  // 자리가 있다는 답을 받으면 [길 찾기]가 주 행동이 된다
  const [seatOk, setSeatOk] = useState(false)
  const result = useMaestro((state) => state.result)
  const showToast = useMaestro((state) => state.showToast)
  const station = stationLong(place)
  const canAsk = status.kind === 'open' || status.kind === 'closing'
  const picksHref = maestroHref('/picks', query)

  // 자리가 없으면 결과의 다음 후보로 넘긴다 (결과를 거치지 않고 들어왔으면 결과로)
  const goNext = () => {
    const picks = result?.key === queryKey(query) && result.status === 'ready' ? result.data.picks : []
    const index = picks.findIndex((p) => p.place.id === place.id)
    const next = index >= 0 ? picks[index + 1] : undefined
    setSheetOpen(false)
    if (next) {
      showToast(`${place.name}${topic(place.name)} 지금 자리가 없대요. 다음 후보예요`)
      goTo(maestroHref(`/place/${next.place.id}`, query))
    } else {
      showToast('남은 후보가 없어요. 조건을 줄여 다시 찾아볼까요?')
      goTo(picksHref)
    }
  }

  const size = page ? 'XL' : 'L'
  const directions = (
    <a href={directionsUrl(place)} target="_blank" rel="noopener noreferrer" className={`${buttonClass(seatOk ? 'primary' : 'secondary', size)} flex-1`}>
      길 찾기
    </a>
  )
  const actions = canAsk ? (
    <>
      {directions}
      <button type="button" onClick={() => setSheetOpen(true)} className={`${buttonClass(seatOk ? 'secondary' : 'primary', size)} flex-1`}>
        자리 물어보기
      </button>
    </>
  ) : (
    <>
      <a href={picksHref} className={`${buttonClass('secondary', size)} flex-1`}>
        다른 후보 보기
      </a>
      <button type="button" disabled className={`${buttonClass('primary', size)} flex-1`}>
        자리 물어보기
      </button>
    </>
  )
  // 마감 1시간 이내면 '21:00 마감 · 라스트오더 20:30', 문을 닫았으면 묻지 못하는 이유를 버튼 위에
  const notice =
    status.kind === 'closing' ? (
      <p className="text-13 font-medium text-mr-red">{status.nextChange}</p>
    ) : !canAsk ? (
      <p className="text-13 text-mr-sub">{status.label} · 지금은 자리를 물어볼 수 없어요</p>
    ) : null

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2 rounded-card border border-mr-line bg-white p-5">
        {place.categoryLabel && <p className="text-14 font-medium text-mr-sub">{place.categoryLabel}</p>}
        <div className="flex items-center gap-2">
          <h2 className="min-w-0 flex-1 text-24 font-semibold text-mr-main">{place.name}</h2>
          <StatusBadge status={status} size="M" />
        </div>
        <NowBar hours={pick.hours} at={detail.at} />
        <p className="text-15 text-mr-main">{status.nextChange}</p>
        {station && (
          <p className="flex items-center gap-1 text-14 text-mr-sub">
            <Icon src={locationIcon} size={16} />
            {station}
          </p>
        )}
      </section>

      <EvidenceBlock pick={pick} />

      {place.aiSummary && (
        <section className="flex flex-col gap-2 rounded-card border border-mr-line bg-white p-5">
          <div className="flex h-6 items-center gap-1">
            <h2 className="text-16 font-semibold text-mr-main">한 줄 요약</h2>
            <HelpTip label="한 줄 요약은 어떻게 만들었나요" icon={helpIcon}>
              유미가 여러 지도 앱의 리뷰를 모아 AI 로 요약한 문장이에요. 별점 대신 어떤 곳인지만 알려 드려요.
            </HelpTip>
          </div>
          <p className="text-15 text-mr-main">{place.aiSummary}</p>
          <p className="text-13 text-mr-weak">AI가 리뷰를 모아 쓴 요약이에요</p>
        </section>
      )}

      <dl className="flex flex-col rounded-card border border-mr-line bg-white p-5">
        <InfoRow label="영업시간" value={detail.hoursText} />
        {detail.menu.length > 0 && <InfoRow label="메뉴" value={detail.menu.slice(0, 3).map(menuName).join(' · ')} />}
        <InfoRow label="가격대" value={priceText(place.priceAvg)} />
        {place.atmosphere.length > 0 && <InfoRow label="분위기" value={place.atmosphere.join(', ')} />}
        {detail.phone && <InfoRow label="전화" value={<a href={`tel:${detail.phone}`}>{detail.phone}</a>} />}
      </dl>

      {/* MO 만 작은 지도 — PC 는 뒤의 큰 지도에 이미 핀이 있다 */}
      {page && <MapView places={[place]} center={place.location} className="h-40 rounded-card" />}

      {page ? (
        <BottomBar>
          <div className="flex w-full flex-col gap-2">
            {notice}
            <div className="flex gap-2">{actions}</div>
          </div>
        </BottomBar>
      ) : (
        <div className="sticky bottom-0 -mx-6 flex flex-col gap-2 bg-white px-6 pt-4 pb-6">
          {notice}
          <div className="flex gap-2">{actions}</div>
        </div>
      )}

      {sheetOpen && (
        <SeatSheet
          pick={pick}
          phone={detail.phone}
          onClose={() => setSheetOpen(false)}
          onAvailable={() => setSeatOk(true)}
          onNext={goNext}
        />
      )}
    </div>
  )
}
