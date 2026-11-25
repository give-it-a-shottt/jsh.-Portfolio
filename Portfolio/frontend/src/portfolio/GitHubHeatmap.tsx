import { useEffect, useRef } from 'react'
import { ACTIVE_DAYS, CONTRIBUTIONS, type ContributionDay } from './profile'

// GitHub 잔디 - 받아 둔 저장본(githubContributions.json)을 GitHub 처럼 한 열 = 한 주(일~토)로 그린다.
// PC 는 본문 폭을 꽉 채우고, 좁은 화면은 칸 크기를 지키고 가로로 넘긴다(처음에 최근 쪽이 보이게).
// 칸이 365개라 화면 낭독기에는 칸마다 읽히지 않게, 묶음 전체를 요약 한 줄로 읽힌다.

const LEVEL_CLASS = ['bg-regular', 'bg-status-success/25', 'bg-status-success/50', 'bg-status-success/75', 'bg-status-success']

/** 첫 날이 일요일이 아니면 앞을 빈칸으로 채워, 열마다 일~토가 같은 줄에 오게 한다 */
function weeks(days: ContributionDay[]) {
  if (days.length === 0) return []
  const lead = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const cells: (ContributionDay | null)[] = [...Array<null>(lead).fill(null), ...days]
  const out: (ContributionDay | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
  return out
}

export default function GitHubHeatmap() {
  const { days, total } = CONTRIBUTIONS
  const grid = weeks(days)
  const scroller = useRef<HTMLDivElement>(null)

  // 가로로 넘기는 폭이면 최근(오른쪽 끝)부터 보이게 한다
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth
  }, [])

  if (grid.length === 0) return null

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div ref={scroller} className="scrollbar-none overflow-x-auto">
        <div
          role="img"
          aria-label={`GitHub 잔디: 최근 1년 동안 ${ACTIVE_DAYS}일, 기여 ${total}건`}
          className="grid w-max auto-cols-3 grid-flow-col grid-rows-7 gap-1 lg:w-full lg:auto-cols-fr"
        >
          {grid.flatMap((week, w) =>
            week.map((day, d) =>
              day ? (
                <span
                  key={day.date}
                  title={`${day.date} · 기여 ${day.count}건`}
                  className={`aspect-square rounded-[3px] ${LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]}`}
                />
              ) : (
                <span key={`empty-${w}-${d}`} className="aspect-square" />
              ),
            ),
          )}
        </div>
      </div>
      <p aria-hidden="true" className="flex items-center gap-1 text-12 text-sub-weak">
        적음
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`size-2.5 rounded-[2px] ${c}`} />
        ))}
        많음
      </p>
    </div>
  )
}
