import calendarIcon from '../assets/s-calendar.svg'
import chevIcon from '../assets/s-chev.svg'
import batteryIcon from '../assets/s-battery.svg'
import clock12Icon from '../assets/s-clock-12.svg'
import clock14Icon from '../assets/s-clock-14.svg'
import heartIcon from '../assets/s-heart.svg'
import keyIcon from '../assets/s-key.svg'
import leftIcon from '../assets/s-left.svg'
import moon12Icon from '../assets/s-moon-12.svg'
import moon16Icon from '../assets/s-moon-16.svg'
import shield14Icon from '../assets/s-shield-14.svg'
import sparkles16Icon from '../assets/s-sparkles-16.svg'
import sunIcon from '../assets/s-sun.svg'
import wavesIcon from '../assets/s-waves.svg'
import wifiIcon from '../assets/s-wifi.svg'
import watchIcon from '../assets/h-watch.svg'
import {
  Ambient,
  Badge,
  Footer,
  GLASS,
  GLASS_CONTROL,
  GLASS_ELEVATED,
  GLASS_SUBTLE,
  Header,
  PRIMARY_BUTTON,
  ScoreRing,
  STAT,
  StatusPulse,
  TabBar,
} from '../components'
import {
  DASHBOARD_CHIPS,
  duration,
  HYPNOGRAM,
  HYPNOGRAM_TICKS,
  LAST_NIGHT,
  SCORE,
  SLEEP_TOTAL_MINUTES,
  STAGE_ROWS,
  STAGES,
  SYNC_LOGS,
  WEEKLY,
  type Stage,
} from '../data'
import { nightlyHref } from '../routes'

// 04 수면 대시보드 — 머리말 → 점수 · 단계 카드 · 단계 그래프 → 7일 점수 · 기기 · 동기화 기록 → AI 코치로 이어 묻기

const SUMMARY = [
  { label: '총 수면', icon: moon12Icon, value: duration(SLEEP_TOTAL_MINUTES) },
  { label: '잠들기까지', icon: clock12Icon, value: '14m' },
  { label: '평균 심박', icon: heartIcon, value: '58bpm' },
]

const STAGE_ICON: Record<Stage, string> = {
  deep: wavesIcon,
  rem: sparkles16Icon,
  light: moon16Icon,
  awake: sunIcon,
}

const DEVICE_ROWS = [
  { label: '마지막 전송', icon: clock14Icon, value: '오늘 07:02 · POST /webhooks/sleep' },
  { label: '서명 검증', icon: shield14Icon, value: 'HMAC-SHA256 통과' },
  { label: '멱등성 키', icon: keyIcon, value: 'idem_7f3a…c21 · 1회 저장' },
]

const LOG_TONE = { ok: 'success', muted: 'muted', danger: 'danger' } as const

const weeklyAverage = Math.round(WEEKLY.reduce((sum, { score }) => sum + score, 0) / WEEKLY.length)
const percentOfNight = (minutes: number) => `${(minutes / SLEEP_TOTAL_MINUTES) * 100}%`

function PageHead() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p lang="en" className="text-12 font-medium tracking-normal text-nt-primary-text lg:text-14">
            SLEEP · M2
          </p>
          {/* 모바일은 날짜를 라벨 오른쪽에 작게 둔다 */}
          <DateNav className="lg:hidden" />
        </div>
        <h1 className="text-24 font-semibold text-nt-main lg:text-32">어젯밤 수면 리포트</h1>
        <p className="text-14 text-nt-sub lg:text-16">
          <span className="hidden lg:inline">23:48에 잠들어 07:00에 일어났어요 · 총 7시간 12분</span>
          <span className="lg:hidden">23:48 → 07:00 · 총 7시간 12분</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <StatusPulse>Nightly Band · 07:02 동기화</StatusPulse>
        <DateNav className={`hidden rounded-sm py-1.5 pr-3 pl-2 lg:flex ${GLASS_CONTROL}`} />
      </div>
    </div>
  )
}

/** 날짜 이동 — 가짜 데이터가 하루치라 앞뒤 버튼은 눌리지 않게 둔다 */
function DateNav({ className }: { className: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button type="button" disabled aria-label="이전 날짜 (기록 없음)" className="flex">
        <img src={leftIcon} alt="" width={16} height={16} />
      </button>
      <img src={calendarIcon} alt="" width={14} height={14} className="hidden lg:block" />
      <span className="text-14 font-medium tracking-normal text-nt-main">10.21 (화)</span>
      <button type="button" disabled aria-label="다음 날짜 (기록 없음)" className="flex">
        <img src={chevIcon} alt="" width={16} height={16} />
      </button>
    </div>
  )
}

function ScoreCard() {
  return (
    <section aria-labelledby="nt-sleep-score" className={`flex flex-col gap-5 p-5 lg:w-96 lg:shrink-0 lg:justify-center lg:p-7 xl:w-108 ${GLASS}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p lang="en" className="hidden text-13 font-medium text-nt-primary-text lg:block">
            SLEEP SCORE
          </p>
          <h2 id="nt-sleep-score" className="text-18 font-semibold text-nt-main lg:text-20">
            수면 점수
          </h2>
        </div>
        <Badge>숙면 우수</Badge>
      </div>
      <div className="flex justify-center">
        <ScoreRing size="lg">
          <span className="text-56 font-semibold tracking-normal text-nt-main">{SCORE}</span>
          <span className="text-12 font-medium text-nt-success">지난주보다 +6</span>
        </ScoreRing>
      </div>
      <dl className="flex gap-2">
        {SUMMARY.map(({ label, icon, value }) => (
          <div key={label} className={STAT}>
            <dt className="flex items-center gap-1 text-11 font-medium text-nt-weak">
              <img src={icon} alt="" width={12} height={12} />
              {label}
            </dt>
            <dd className="text-16 font-semibold tracking-normal text-nt-main">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function StageCards() {
  return (
    <ul aria-label="단계별 수면 시간" className="grid grid-cols-2 gap-3 lg:flex lg:gap-4">
      {LAST_NIGHT.map(({ stage, minutes, percent }) => {
        return (
          <li key={stage} className={`flex flex-col gap-1.5 p-4 lg:flex-1 lg:p-5 ${GLASS_SUBTLE}`}>
            <div className="mb-1.5 flex items-center justify-between">
              {/* 아이콘은 상자 없이 32 칸 가운데에 둔다 */}
              <span aria-hidden="true" className="flex size-8 items-center justify-center">
                <img src={STAGE_ICON[stage]} alt="" width={16} height={16} />
              </span>
              <span className={`text-14 font-medium tracking-normal ${STAGES[stage].text}`}>{percent}%</span>
            </div>
            <span className="text-12 font-medium text-nt-sub">{STAGES[stage].label}</span>
            <span className="text-20 font-semibold tracking-normal text-nt-main lg:text-24">{duration(minutes)}</span>
          </li>
        )
      })}
    </ul>
  )
}

function Legend({ className }: { className: string }) {
  return (
    <ul aria-hidden="true" className={`flex items-center gap-3.5 ${className}`}>
      {(['deep', 'rem', 'light', 'awake'] as const).map((stage) => (
        <li key={stage} className="flex items-center gap-1.5 text-12 font-medium text-nt-sub">
          <span className={`size-2.5 rounded-[3px] ${STAGES[stage].bar}`} />
          {STAGES[stage].label}
        </li>
      ))}
    </ul>
  )
}

/** 수면 단계 그래프 — 막대 위치는 잠든 뒤 지난 분을 밤 전체(432분)에 대한 비율로 놓아 화면 폭에 맞춰 늘어난다 */
function Hypnogram() {
  const summary = LAST_NIGHT.map(({ stage, minutes }) => `${STAGES[stage].label} ${duration(minutes)}`).join(', ')
  return (
    <section aria-labelledby="nt-hypno-title" className={`flex flex-col gap-4 p-5 lg:p-6 ${GLASS}`}>
      <div className="flex items-center justify-between">
        <h2 id="nt-hypno-title" className="text-18 font-semibold text-nt-main lg:text-20">
          수면 단계 그래프
        </h2>
        <Legend className="hidden lg:flex" />
      </div>
      <figure role="img" aria-label={`23:48부터 07:00까지 수면 단계. ${summary}`} className="flex">
        <div aria-hidden="true" className="hidden w-18 shrink-0 flex-col lg:flex">
          {STAGE_ROWS.map((stage) => (
            <span key={stage} className="flex h-10.5 items-center text-11 font-medium text-nt-weak">
              {STAGES[stage].label}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="relative flex-1">
          {STAGE_ROWS.map((stage) => (
            <div key={stage} className="relative h-7.5 lg:h-10.5">
              <span className="absolute inset-x-0 top-1/2 h-px bg-nt-line-light" />
              {HYPNOGRAM.filter((segment) => segment.stage === stage).map(({ start, min }) => (
                <span
                  key={start}
                  className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-[4px] opacity-90 lg:h-6 ${STAGES[stage].bar}`}
                  style={{ left: percentOfNight(start), width: `calc(${percentOfNight(min)} - 1px)` }}
                />
              ))}
            </div>
          ))}
          <div className="relative mt-2 h-4">
            {HYPNOGRAM_TICKS.map(({ label, start, mobile }) => (
              <span
                key={label}
                className={`absolute text-11 font-medium tracking-normal text-nt-weak ${mobile ? '' : 'hidden lg:block'} ${
                  start === SLEEP_TOTAL_MINUTES ? '-translate-x-full' : start > 0 ? '-translate-x-1/2' : ''
                }`}
                style={{ left: percentOfNight(start) }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </figure>
      <Legend className="flex-wrap lg:hidden" />
    </section>
  )
}

function WeeklyTrend() {
  const label = WEEKLY.map(({ day, score }) => `${day} ${score}점`).join(', ')
  return (
    <section aria-labelledby="nt-weekly-title" className={`flex flex-col gap-4 p-5 lg:col-span-2 lg:justify-center lg:p-6 xl:flex-1 ${GLASS}`}>
      <div className="flex items-center justify-between">
        <h2 id="nt-weekly-title" className="text-18 font-semibold text-nt-main lg:text-20">
          최근 7일<span className="hidden lg:inline"> 수면 점수</span>
        </h2>
        <p className="text-14 font-medium text-nt-primary-text">평균 {weeklyAverage}점</p>
      </div>
      <figure role="img" aria-label={`최근 7일 수면 점수. ${label}`} className="flex h-40 items-end gap-3">
        {WEEKLY.map(({ day, score }, i) => {
          const today = i === WEEKLY.length - 1
          return (
            <div key={day} aria-hidden="true" className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className={`hidden text-11 font-medium tracking-normal lg:block ${today ? 'text-nt-main' : 'text-nt-weak'}`}>
                {score}
              </span>
              {/* 50점을 바닥으로 두고 1점에 3px — 시안 막대 높이 그대로 */}
              <span
                className={`w-full rounded-t-[6px] rounded-b-[2px] ${
                  today ? 'bg-linear-to-b from-nt-mist to-nt-cta' : 'bg-nt-primary-soft'
                }`}
                style={{ height: (score - 50) * 3 }}
              />
              <span className={`text-12 font-medium ${today ? 'text-nt-primary-text' : 'text-nt-weak'}`}>{day}</span>
            </div>
          )
        })}
      </figure>
    </section>
  )
}

function DeviceCard() {
  return (
    <>
      <section aria-labelledby="nt-device-title" className={`hidden flex-col gap-3.5 p-6 lg:flex xl:w-90 xl:shrink-0 ${GLASS}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-13 font-medium text-nt-primary-text">연결된 기기</p>
            <h2 id="nt-device-title" className="text-20 font-semibold text-nt-main">
              Nightly Band S2
            </h2>
          </div>
          <StatusPulse>Online</StatusPulse>
        </div>
        <dl className="flex gap-2">
          {[
            { label: '배터리', icon: batteryIcon, value: '76%' },
            { label: '신호', icon: wifiIcon, value: '강함' },
          ].map(({ label, icon, value }) => (
            <div key={label} className={STAT}>
              <dt className="flex items-center gap-1.5 text-12 font-medium text-nt-weak">
                <img src={icon} alt="" width={14} height={14} />
                {label}
              </dt>
              <dd className="text-18 font-semibold text-nt-main">{value}</dd>
            </div>
          ))}
        </dl>
        <dl className="flex flex-col">
          {DEVICE_ROWS.map(({ label, icon, value }) => (
            <div key={label} className="flex items-center gap-2.5 py-1">
              <img src={icon} alt="" width={14} height={14} />
              <dt className="w-18 shrink-0 text-12 font-medium text-nt-weak">{label}</dt>
              <dd className="flex-1 text-12 font-medium text-nt-main">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 모바일은 기기를 한 줄로 줄이고 동기화 기록은 뺀다(시안 04-M) */}
      <section aria-label="연결된 기기" className={`flex items-center gap-3 p-4 lg:hidden ${GLASS}`}>
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center">
          <img src={watchIcon} alt="" width={20} height={20} />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-16 font-semibold text-nt-main">Nightly Band S2</p>
          <p className="text-12 font-medium text-nt-sub">배터리 76% · HMAC 검증 통과</p>
        </div>
        <StatusPulse>Online</StatusPulse>
      </section>
    </>
  )
}

function SyncLog() {
  return (
    <section aria-labelledby="nt-sync-title" className={`hidden flex-col p-6 lg:flex xl:w-90 xl:shrink-0 ${GLASS}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 id="nt-sync-title" className="text-20 font-semibold text-nt-main">
          동기화 기록
        </h2>
        <span lang="en" className="text-12 font-medium tracking-normal text-nt-weak">
          webhook
        </span>
      </div>
      <ul>
        {SYNC_LOGS.map(({ status, tone, label, time }) => (
          <li key={`${label}-${time}`} className="flex items-center gap-2.5 border-b border-nt-line-light py-3">
            <Badge tone={LOG_TONE[tone]}>{status}</Badge>
            <div className="flex flex-col gap-0.5">
              <span className="text-13 font-medium text-nt-main">{label}</span>
              <span className="text-11 font-medium tracking-normal text-nt-weak">{time}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CoachCta() {
  return (
    <section aria-labelledby="nt-coach-cta" className={`flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-6 lg:p-7 ${GLASS_ELEVATED}`}>
      <div className="flex flex-col gap-2 lg:flex-1">
        <h2 id="nt-coach-cta" className="text-14 font-medium text-nt-main lg:text-18 lg:font-semibold">
          <span className="hidden lg:inline">깊은 잠 비율이 좋아요. 그런데 새벽 4시쯤 두 번 깼어요.</span>
          <span className="lg:hidden">새벽 4시쯤 두 번 깼어요. 이유를 물어볼까요?</span>
        </h2>
        <ul className="hidden gap-2 lg:flex">
          {DASHBOARD_CHIPS.map(({ label, question }) => (
            <li key={label}>
              <a
                href={nightlyHref('/coach', { q: question })}
                className={`flex rounded-full px-3 py-1.5 text-12 font-medium text-nt-sub transition-colors hover:text-nt-main ${GLASS_CONTROL}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a href={nightlyHref('/coach')} className={PRIMARY_BUTTON}>
        AI 코치에게 물어보기
      </a>
    </section>
  )
}

export default function SleepScreen() {
  return (
    <div className="relative isolate min-h-screen bg-nt-bg text-nt-main">
      <Ambient
        glows={[
          { size: 880, x: -240, y: -200 },
          { size: 860, x: 760, y: -60 },
          { size: 940, x: 384, y: 657 },
        ]}
      />
      <Header variant="member" active="sleep" />
      {/* 모바일은 아래 떠 있는 탭 바(64 + 여백 16)에 가리지 않게 아래 여백을 넉넉히 둔다 */}
      <main className="mx-auto flex max-w-300 flex-col gap-4 px-5 pt-5 pb-28 lg:gap-6 xl:px-0 lg:pt-10 lg:pb-24">
        <PageHead />
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <ScoreCard />
          <div className="flex flex-1 flex-col gap-4 lg:gap-6">
            <StageCards />
            <Hypnogram />
          </div>
        </div>
        {/* 1024~1279 폭에서는 7일 점수를 한 줄 전체로, 기기 · 동기화 기록을 그 아래 두 칸으로 놓는다 */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6 xl:flex xl:flex-row">
          <WeeklyTrend />
          <DeviceCard />
          <SyncLog />
        </div>
        <CoachCta />
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <TabBar active="수면" />
    </div>
  )
}
