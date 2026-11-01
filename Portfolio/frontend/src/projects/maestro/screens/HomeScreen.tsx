import { useEffect, useState } from 'react'
import { getPicks } from '../api'
import { BottomBar, GnbPc, Icon, Logo, Tag } from '../components'
import { buttonClass } from '../styles'
import { clockOf, mealOf, nowClock } from '../format'
import downIcon from '../icons/down.svg'
import nowMarker from '../icons/now-marker.svg'
import timeIcon from '../icons/time.svg'
import { CONDITIONS, DEMO_TIMES, DONGS, goTo, maestroHref, readQuery } from '../routes'
import { useMaestro } from '../store'
import type { ConditionKey, DongKey, Picks } from '../types'

// HOM_01_001 — 동네 · 상황 고르기. 기본 경로는 [3곳 찾기] 한 번(상황은 골라도 되고 안 골라도 된다)
export default function HomeScreen({ params }: { params: URLSearchParams }) {
  const lastDong = useMaestro((state) => state.lastDong)
  const setLastDong = useMaestro((state) => state.setLastDong)
  // 결과에서 [+ 조건 바꾸기]로 돌아오면 고른 조건을 그대로 둔다
  const [initial] = useState(() => readQuery(params, lastDong))
  const [t, setT] = useState(initial.t)
  const [dong, setDong] = useState<DongKey>(initial.dong)
  const [conditions, setConditions] = useState<ConditionKey[]>(initial.s)
  const [now] = useState(nowClock)
  const [count, setCount] = useState<{ key: string; data: Picks | null } | null>(null)

  // '지금 12:40, 을지로에 14곳이 열려 있어요' — 조건 없이 같은 API 로 센다. 잠든 서버도 이때 깨운다
  const countKey = `${t}|${dong}`
  useEffect(() => {
    let alive = true
    getPicks({ t, dong, s: [] })
      .then((data) => alive && setCount({ key: countKey, data }))
      .catch(() => alive && setCount({ key: countKey, data: null }))
    return () => {
      alive = false
    }
  }, [countKey, t, dong])

  const dongLabel = DONGS.find((d) => d.key === dong)?.label ?? ''
  const counted = count?.key === countKey ? count.data : undefined
  const nowLine = (() => {
    const when = t === 'now' ? `지금 ${now}` : clockOf(t)
    if (counted === undefined) return `${when}, ${dongLabel}에서 열린 곳을 세고 있어요`
    if (counted === null) return `${when}, ${dongLabel}`
    if (counted.switchedFrom) return `지금 ${now}은 문 연 곳이 적어 ${counted.at} 기준으로 찾아요`
    return `${when}, ${dongLabel}에 ${counted.openCount}곳이 열려 있어요`
  })()

  const toggle = (key: ConditionKey) =>
    setConditions((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]))

  const find = () => {
    setLastDong(dong)
    // 조건 순서를 칩 순서로 맞춰 같은 조건이면 같은 주소가 되게 한다
    const s = CONDITIONS.map((c) => c.key).filter((key) => conditions.includes(key))
    goTo(maestroHref('/picks', { t, dong, s }))
  }

  const findButton = (
    <button type="button" onClick={find} className={`${buttonClass('primary')} w-full`}>
      3곳 찾기
    </button>
  )

  return (
    <div className="min-h-svh bg-mr-screen">
      <div className="hidden lg:block">
        <GnbPc context="지금 갈 식당 3곳" homeHref={maestroHref()} />
      </div>
      <main className="mx-auto flex max-w-[588px] flex-col px-5 pt-4 pb-[140px] lg:px-0 lg:pt-16 lg:pb-24">
        <div className="flex h-10 items-center lg:hidden">
          <Logo />
        </div>

        <section className="mt-6 flex flex-col gap-2 lg:mt-0 lg:gap-3">
          <p role="status" className="flex items-center gap-2 text-14 font-medium text-mr-main lg:text-16">
            <img src={nowMarker} alt="" aria-hidden="true" width={16} height={16} />
            {nowLine}
          </p>
          <h1 className="text-28 font-semibold text-mr-main lg:text-40">
            지금 열려 있고
            <br className="lg:hidden" /> 믿을 만한 곳,
            <br />
            3곳만 골라 드릴게요
          </h1>
          <p className="text-15 text-mr-sub lg:text-16">낯선 동네에서 실패하지 않게, 지도 앱 여러 곳에서 확인한 곳만 보여 드려요</p>
        </section>

        <div className="mt-6 flex flex-col gap-6 rounded-card border border-mr-line bg-white px-5 py-6 lg:mt-8">
          <div className="flex flex-col gap-3">
            <label htmlFor="maestro-time" className="text-16 font-semibold text-mr-main">
              언제
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <Icon src={timeIcon} size={20} />
              </span>
              <select
                id="maestro-time"
                value={t}
                onChange={(event) => setT(event.target.value)}
                aria-describedby="maestro-time-hint"
                className="h-12 w-full appearance-none rounded-sm border border-mr-line-strong bg-white pr-11 pl-11 text-16 text-mr-main"
              >
                <option value="now">
                  지금 {now}, {mealOf(now)}
                </option>
                {DEMO_TIMES.map((demo) => (
                  <option key={demo} value={demo}>
                    {clockOf(demo)}, {mealOf(clockOf(demo))}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                <Icon src={downIcon} size={20} />
              </span>
            </div>
            <p id="maestro-time-hint" className="text-13 text-mr-weak">
              시연용으로 12:40 · 19:30 · 22:00도 골라 볼 수 있어요
            </p>
          </div>

          <div role="group" aria-labelledby="maestro-dong" className="flex flex-col gap-3">
            <p id="maestro-dong" className="text-16 font-semibold text-mr-main">
              어느 동네
            </p>
            <div className="flex flex-wrap gap-2">
              {DONGS.map((d) => (
                <Tag key={d.key} label={d.label} selected={d.key === dong} onClick={() => setDong(d.key)} />
              ))}
            </div>
          </div>

          <div role="group" aria-labelledby="maestro-situation" className="flex flex-col gap-3">
            <p id="maestro-situation" className="flex items-baseline gap-2">
              <span className="text-16 font-semibold text-mr-main">지금 상황</span>
              <span className="text-13 text-mr-weak">골라도 되고 안 골라도 돼요</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <Tag key={c.key} label={c.label} selected={conditions.includes(c.key)} onClick={() => toggle(c.key)} />
              ))}
            </div>
            {conditions.includes('rain') && <p className="text-13 text-mr-weak">날씨는 시연용 가정이에요</p>}
          </div>

          <div className="hidden lg:block">{findButton}</div>
        </div>
      </main>
      <BottomBar className="lg:hidden">{findButton}</BottomBar>
    </div>
  )
}
