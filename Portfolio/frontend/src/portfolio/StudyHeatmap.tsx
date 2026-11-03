import { NOTES } from './notes'

// 공부 잔디 — 노트 날짜를 하루 한 칸으로 센다. 열은 한 주(월~일), 진하기는 그날 올린 노트 수.
// 칸이 많아 화면 낭독기에는 칸마다 읽히지 않게 묶음 전체를 요약 한 줄로 읽힌다.

const MAX_WEEKS = 26
const DAY = 24 * 60 * 60 * 1000

function parse(date: string) {
  const [y, m, d] = date.split('.').map(Number)
  return new Date(y, m - 1, d)
}

function format(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

function level(count: number) {
  if (count === 0) return 'bg-regular'
  if (count === 1) return 'bg-study/20'
  if (count <= 3) return 'bg-study/40'
  if (count <= 9) return 'bg-study/70'
  return 'bg-study'
}

const COUNTS = NOTES.reduce<Record<string, number>>((acc, note) => {
  acc[note.date] = (acc[note.date] ?? 0) + 1
  return acc
}, {})
const DATES = Object.keys(COUNTS).sort()

/** 첫 노트가 있는 주의 월요일부터 마지막 노트가 있는 주까지 — 길면 최근 26주만 */
function weeks() {
  if (DATES.length === 0) return []
  const last = parse(DATES[DATES.length - 1])
  const lastMonday = new Date(last.getTime() - ((last.getDay() + 6) % 7) * DAY)
  const first = parse(DATES[0])
  const firstMonday = new Date(first.getTime() - ((first.getDay() + 6) % 7) * DAY)
  const total = Math.min(Math.round((lastMonday.getTime() - firstMonday.getTime()) / (7 * DAY)) + 1, MAX_WEEKS)
  return Array.from({ length: total }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      // 날짜를 더할 때 서머타임이 끼어도 하루가 밀리지 않게 setDate 로 센다
      const date = new Date(lastMonday)
      date.setDate(lastMonday.getDate() - (total - 1 - w) * 7 + d)
      const key = format(date)
      return { key, count: COUNTS[key] ?? 0, future: date > last }
    }),
  )
}

export default function StudyHeatmap() {
  const grid = weeks()
  if (grid.length === 0) return null
  const first = DATES[0]
  const latest = DATES[DATES.length - 1]

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-16 font-semibold text-main">공부 잔디</span>
        <span className="text-12 text-sub-weak tabular-nums">
          {first} 첫 노트 · 최근 {latest}
        </span>
      </p>
      <div
        role="img"
        aria-label={`${first}부터 ${latest}까지 ${DATES.length}일 동안 노트 ${NOTES.length}개를 정리했어요.`}
        className="flex gap-1 overflow-x-auto"
      >
        {grid.map((week) => (
          <div key={week[0].key} className="flex flex-col gap-1">
            {week.map(({ key, count, future }) => (
              <span
                key={key}
                title={future ? undefined : `${key} · 노트 ${count}개`}
                className={`size-3.5 rounded-xs ${future ? 'bg-transparent' : level(count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="flex items-center gap-1 text-12 text-sub-weak">
        적음
        {[0, 1, 2, 4, 10].map((count) => (
          <span key={count} className={`size-3 rounded-xs ${level(count)}`} />
        ))}
        많음
      </p>
    </div>
  )
}
