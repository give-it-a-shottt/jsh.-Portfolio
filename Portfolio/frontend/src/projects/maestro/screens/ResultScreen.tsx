import { useEffect } from 'react'
import { EmptyState, ErrorInline, GnbPc, GnbSub, ResultCard, Segment, SkeletonCards, Tag, Toast } from '../components'
import { buttonClass } from '../styles'
import { conditionLabels, mealOf, waitingShort, wonShort } from '../format'
import MapView from '../MapView'
import { CONDITIONS, DONGS, maestroHref, type Query } from '../routes'
import { queryKey, useMaestro } from '../store'
import type { ConditionKey, Pick, Picks } from '../types'
import PlaceDetailBody from './PlaceDetailBody'

const VIEWS = [
  { value: 'list' as const, label: '목록' },
  { value: 'table' as const, label: '표로 비교' },
]

// RES_01_001~004 — 지도 + 후보 3곳. MO 는 위 지도 + 아래 시트, PC 는 목록 4칸 + 지도 8칸.
// PC 에서 카드를 누르면(placeId) 지도 위 오른쪽 패널로 상세를 연다.
export default function ResultScreen({ query, placeId }: { query: Query; placeId?: string }) {
  const result = useMaestro((state) => state.result)
  const loadPicks = useMaestro((state) => state.loadPicks)
  const selectedId = useMaestro((state) => state.selectedId)
  const select = useMaestro((state) => state.select)
  const view = useMaestro((state) => state.view)
  const setView = useMaestro((state) => state.setView)

  const key = queryKey(query)
  useEffect(() => {
    loadPicks(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 조건(key)이 바뀔 때만 부른다
  }, [key])

  const current = result?.key === key ? result : { key, status: 'loading' as const }
  const data = current.status === 'ready' ? current.data : null
  const dongLabel = data?.dong.label ?? DONGS.find((d) => d.key === query.dong)?.label ?? ''
  const at = data?.at ?? (query.t === 'now' ? '' : `${query.t.slice(0, 2)}:${query.t.slice(2)}`)
  const title = [at, dongLabel, at && mealOf(at)].filter(Boolean).join(' ')
  const homeHref = maestroHref('', query)
  const highlighted = placeId ?? selectedId
  // 열린 곳이 없으면 지도에 핀을 두지 않는다 (나중에 여는 곳이라 지금 갈 곳이 아니다)
  const pins = data && data.state !== 'none' ? data.picks.map((p) => p.place) : []
  const center = data?.dong.center ?? { lat: 37.5662, lng: 126.991 }

  const content = (() => {
    if (current.status === 'loading') return <SkeletonCards />
    if (current.status === 'error')
      return (
        <div className="flex flex-col gap-3">
          <ErrorInline message="후보를 불러오지 못했어요" onRetry={() => loadPicks(query, { force: true })} />
          <p className="text-13 text-mr-sub">고른 조건은 그대로 두었어요</p>
        </div>
      )
    const picks = current.data
    return view === 'table' ? (
      <CompareTable data={picks} query={query} />
    ) : (
      <PickList data={picks} query={query} highlighted={highlighted} />
    )
  })()

  const chips = (
    <div className="flex flex-wrap gap-2">
      {query.s.map((key) => (
        <Tag key={key} label={CONDITIONS.find((c) => c.key === key)?.label ?? key} selected href={homeHref} />
      ))}
      <Tag label="+ 조건 바꾸기" href={homeHref} />
    </div>
  )

  return (
    <div className="min-h-svh bg-mr-screen">
      <GnbSub title={title || '후보 찾는 중'} backHref={homeHref} className="sticky top-0 z-30 lg:hidden" />
      <div className="hidden lg:block">
        <GnbPc context={title} homeHref={homeHref} />
      </div>

      <div className="flex flex-col lg:mx-auto lg:w-full lg:max-w-[1200px] lg:px-6 xl:px-0 lg:flex-row lg:items-start lg:gap-6 lg:pt-8 lg:pb-8">
        {/* 지도 — MO 는 위 248(표로 비교는 시트를 펼쳐 140), PC 는 오른쪽 8칸 */}
        <div
          className={`relative transition-[height] duration-300 ease-out motion-reduce:transition-none lg:sticky lg:top-8 lg:order-2 lg:h-[764px] lg:flex-1 lg:overflow-hidden lg:rounded-card ${
            view === 'table' ? 'h-[140px]' : 'h-[248px]'
          }`}
        >
          <MapView
            places={pins}
            center={center}
            selectedId={highlighted}
            onSelect={select}
            // MO 는 위 조건 칩 · 아래 시트, PC 는 오른쪽 상세 패널만큼 핀을 비켜 둔다
            padding={{ top: 64, bottom: 40, right: placeId ? 480 : 32 }}
            zoomControl
            className="size-full"
          />
          <div className="absolute top-3 left-5 z-10 lg:hidden">{chips}</div>
          {placeId && (
            <aside
              aria-label="식당 상세"
              className="absolute top-4 right-4 bottom-4 z-10 hidden w-[432px] overflow-y-auto rounded-card bg-white px-6 pt-6 shadow-mr-panel lg:block"
            >
              <PlaceDetailBody id={placeId} query={query} layout="panel" />
            </aside>
          )}
        </div>

        {/* 결과 시트 — MO 는 지도에 20 겹친 2단 시트, PC 는 왼쪽 목록 4칸 */}
        <section
          aria-label="후보"
          className="relative z-10 -mt-5 min-h-[calc(100svh-284px)] rounded-t-mr-sheet bg-white pb-10 shadow-mr-sheet lg:order-1 lg:mt-0 lg:min-h-0 lg:w-96 lg:shrink-0 lg:rounded-none lg:bg-transparent lg:pb-0 lg:shadow-none"
        >
          <div className="flex h-3 justify-center pt-2 lg:hidden">
            <span className="h-1 w-9 rounded-full bg-mr-line-regular" />
          </div>
          <div className="hidden pb-4 lg:block">{chips}</div>
          <div className="px-5 py-3 lg:p-0 lg:pb-4">
            <Segment items={VIEWS} value={view} onChange={setView} label="보기 방식" />
          </div>
          <div className="flex flex-col gap-3 px-5 lg:gap-4 lg:px-0">{content}</div>
        </section>
      </div>
      <Toast className="bottom-8" />
    </div>
  )
}

/** 'none' 상태의 안내 — 가장 빨리 여는 곳 기준 */
function emptyBody(first: Pick | undefined) {
  if (!first) return '오늘은 더 여는 곳이 없어요'
  const time = first.status.label.replace(' 열어요', '')
  return first.status.nextChange.includes('다시') ? `브레이크 타임이에요. ${time}에 다시 여는 곳이에요` : `${time}부터 여는 곳을 먼저 보여 드려요`
}

function PickList({ data, query, highlighted }: { data: Picks; query: Query; highlighted: string | null }) {
  const labels = conditionLabels(data.conditions)
  const without = (key: ConditionKey) => ({ ...query, s: query.s.filter((k) => k !== key) })
  return (
    <>
      {data.switchedFrom && (
        <p className="text-13 text-mr-sub">
          지금({data.switchedFrom})은 문 연 곳이 적어 {data.at} 기준으로 찾았어요
        </p>
      )}
      {data.state === 'none' && <EmptyState title="지금 열린 곳이 없어요" body={emptyBody(data.picks[0])} />}
      {data.state === 'none' && !data.picks.length && (
        <div className="flex justify-center">
          <Tag label="시연 시각 바꾸기" href={maestroHref('', query)} />
        </div>
      )}
      {data.state === 'few' && (
        <div className="flex flex-col gap-2">
          <p className="text-14 text-mr-sub">
            {data.picks.some((p) => !p.unmatched.length)
              ? `조건이 다 맞는 곳은 ${data.picks.length}곳이에요`
              : '조건이 다 맞는 곳이 없어서 가장 많이 맞는 곳을 보여 드려요'}
          </p>
          {data.relax.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.relax.map((r) => (
                <Tag key={r.key} label={`'${r.label}' 빼면 ${r.more}곳 더`} href={maestroHref('/picks', without(r.key))} />
              ))}
            </div>
          )}
        </div>
      )}
      <ul className="flex flex-col gap-3 lg:gap-4">
        {data.picks.map((pick, index) => (
          <li key={pick.place.id}>
            <ResultCard
              pick={pick}
              at={data.at}
              href={maestroHref(`/place/${pick.place.id}`, query)}
              labels={labels}
              selected={pick.place.id === highlighted}
              animate={index === 0}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

/** RES_01_002 표로 비교 — 3곳을 같은 줄에서. 열마다 [여기로] */
function CompareTable({ data, query }: { data: Picks; query: Query }) {
  const labels = conditionLabels(data.conditions)
  const rows: { label: string; cell: (pick: Pick) => string }[] = [
    { label: '지금', cell: (p) => p.status.short },
    { label: '거리', cell: (p) => (p.place.station ? `${p.place.station.walkMin}분` : '-') },
    { label: '웨이팅', cell: (p) => waitingShort(p.place) },
    { label: '가격대', cell: (p) => (p.place.priceAvg ? wonShort(p.place.priceAvg) : '-') },
    { label: '분위기', cell: (p) => p.place.atmosphere[0] ?? '-' },
    { label: '맞은 조건', cell: (p) => p.matched.map((k) => labels.get(k)).join(' ') || '-' },
    { label: '근거', cell: (p) => (p.evidence.sourceCount >= 2 ? `지도 ${p.evidence.sourceCount}곳` : '유미 확인') },
  ]
  if (!data.picks.length) return <EmptyState title="지금 열린 곳이 없어요" body={emptyBody(undefined)} />
  return (
    <>
      <div className="overflow-hidden rounded-card-sm border border-mr-line">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">후보 {data.picks.length}곳 비교</caption>
          <colgroup>
            <col className="w-[71px]" />
          </colgroup>
          <thead>
            <tr>
              <td className="h-10 border-b border-mr-line bg-mr-fill" />
              {data.picks.map((p) => (
                <th key={p.place.id} scope="col" className="h-10 truncate border-b border-mr-line bg-mr-fill px-3 text-13 font-semibold text-mr-sub">
                  {p.place.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="border-b border-mr-line bg-mr-fill px-3 text-13 font-semibold text-mr-sub">
                  {row.label}
                </th>
                {data.picks.map((p) => (
                  <td key={p.place.id} className="h-12 border-b border-mr-line bg-white px-3 text-14 text-mr-main">
                    {row.cell(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="h-12 bg-mr-fill" />
              {data.picks.map((p) => (
                <td key={p.place.id} className="h-12 bg-white text-center">
                  <a
                    href={maestroHref(`/place/${p.place.id}`, query)}
                    aria-label={`${p.place.name}로 가기`}
                    className={`${buttonClass('primary', 'S')} mx-auto w-fit`}
                  >
                    여기로
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {/* 함께 고르기(투표)는 구현 2차 — 자리만 보여 준다 */}
      <button type="button" disabled className={`${buttonClass('secondary', 'L')} w-full`}>
        함께 고르기 · 투표 링크 만들기
      </button>
      <p className="-mt-1 text-12 text-mr-sub">투표는 다음 버전에서 열려요</p>
    </>
  )
}
