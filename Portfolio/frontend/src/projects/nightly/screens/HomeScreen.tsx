import serverIcon from '../assets/h-server.svg'
import shieldIcon from '../assets/h-shield.svg'
import sparklesIcon from '../assets/h-sparkles.svg'
import ticketIcon from '../assets/h-ticket.svg'
import watchIcon from '../assets/h-watch.svg'
import chevIcon from '../assets/s-chev.svg'
import { Ambient, Badge, Footer, GHOST_BUTTON, GLASS, GLASS_ELEVATED, GLASS_SUBTLE, Header, PRIMARY_BUTTON, ScoreRing, STAT, StatusPulse } from '../components'
import { duration, LAST_NIGHT, SCORE, STAGES, type Stage } from '../data'
import { nightlyHref } from '../routes'

// 01 랜딩 & 헬스체크 — 히어로(소개 + 어젯밤 점수 · 백엔드 연결 상태) → 기능 4개 → 가입 안내

const HEALTH = [
  { label: 'API', short: 'API', value: '32ms', shortValue: '32ms' },
  { label: 'PostgreSQL', short: 'DB', value: 'connected', shortValue: 'OK' },
  { label: 'Redis', short: 'Redis', value: 'connected', shortValue: 'OK' },
]

// 수면 데이터 · AI 코치만 이 시안 안에 화면이 있어서 누를 수 있다
const FEATURES = [
  {
    step: '01 · M2',
    title: '수면 데이터 자동 수집',
    desc: '기상 직후 기기가 HMAC 서명과 멱등성 키로 안전하게 전송해요.',
    short: 'HMAC 서명·멱등성 키로 안전하게 전송',
    icon: watchIcon,
    href: nightlyHref('/sleep'),
  },
  {
    step: '02 · M3',
    title: 'AI 수면 코치',
    desc: '어젯밤 깊은 잠·REM 비율을 읽고 한 글자씩 실시간 코칭해요.',
    short: '한 글자씩 실시간 코칭',
    icon: sparklesIcon,
    href: nightlyHref('/coach'),
  },
  {
    step: '03 · M5',
    title: '선착순 타임세일',
    desc: '500명이 동시에 눌러도 정확히 100장만 발급돼요.',
    short: '정확히 100장만 발급',
    icon: ticketIcon,
  },
  {
    step: '04 · M9',
    title: '실시간 기기 관제',
    desc: '관리자는 50대 기기 상태를 새로고침 없이 지켜봐요.',
    short: '50대 상태를 새로고침 없이',
    icon: shieldIcon,
  },
]

/** 모바일 시안은 막대 없이 깊은 잠 · 깨어 있음 숫자에만 단계 색을 입힌다 */
const MOBILE_TONE: Partial<Record<Stage, string>> = { deep: 'max-lg:text-nt-primary-text', awake: 'max-lg:text-nt-secondary-text' }

/** 홈 미리보기의 깨어 있음 막대는 그래프와 달리 회색이다(시안) */
const previewBar = (stage: Stage) => (stage === 'awake' ? 'bg-nt-weak' : STAGES[stage].bar)

/** 단계 막대 길이 — 4시간(240분)을 꽉 찬 길이로 본다(시안 막대 비율) */
const BAR_FULL_MINUTES = 240
const barWidth = (minutes: number) => `${Math.min(100, (minutes / BAR_FULL_MINUTES) * 100)}%`

function SleepScorePreview() {
  return (
    <section aria-labelledby="nt-score-title" className={`flex flex-col gap-5 p-5 lg:p-7 ${GLASS}`}>
      <div className="flex items-center justify-between">
        <h2 id="nt-score-title" className="text-18 font-semibold text-nt-main">
          어젯밤 수면 점수
        </h2>
        <Badge>숙면 우수</Badge>
      </div>
      <div className="flex items-center gap-5 lg:gap-7">
        <ScoreRing size="sm">
          <span className="text-40 font-semibold tracking-normal text-nt-main">{SCORE}</span>
          <span className="hidden text-12 font-medium tracking-normal text-nt-weak lg:block">/ 100</span>
        </ScoreRing>
        <dl className="flex flex-1 flex-col gap-2.5">
          {LAST_NIGHT.map(({ stage, minutes }) => (
            <div key={stage} className="flex flex-col gap-1">
              <div className="flex justify-between text-12 font-medium">
                <dt className="text-nt-sub">{STAGES[stage].label}</dt>
                <dd className={`tracking-normal text-nt-main ${MOBILE_TONE[stage] ?? ''}`}>{duration(minutes)}</dd>
              </div>
              <div
                aria-hidden="true"
                className="relative hidden h-1.5 rounded-full border border-nt-edge bg-linear-to-b from-white/10 to-white/3 lg:block"
              >
                <div className={`absolute -inset-y-px -left-px rounded-[3px] ${previewBar(stage)}`} style={{ width: barWidth(minutes) }} />
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function HealthCheck() {
  return (
    <section aria-labelledby="nt-health-title" className={`flex flex-col gap-3 p-4 lg:p-5 ${GLASS_SUBTLE}`}>
      <div className="flex items-center justify-between">
        <h2 id="nt-health-title" className="flex items-center gap-2 text-14 font-semibold text-nt-main lg:text-16">
          <img src={serverIcon} alt="" width={16} height={16} className="size-3.5 lg:size-4" />
          백엔드 연결 상태
        </h2>
        <StatusPulse tone="muted">200 OK</StatusPulse>
      </div>
      <dl className="flex gap-2">
        {HEALTH.map(({ label, short, value, shortValue }) => (
          <div key={label} className={STAT}>
            <dt className="text-12 font-medium tracking-normal text-nt-sub">
              <span className="hidden lg:inline">{label}</span>
              <span className="lg:hidden">{short}</span>
            </dt>
            <dd className="text-14 font-semibold tracking-normal text-nt-main">
              <span className="hidden lg:inline">{value}</span>
              <span className="lg:hidden">{shortValue}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function FeatureCard({ feature }: { feature: (typeof FEATURES)[number] }) {
  const { step, title, desc, short, icon, href } = feature
  const body = (
    <>
      {/* PC — 세로 카드. 아이콘은 상자 없이 44 칸 가운데에 둔다 */}
      <span className="hidden flex-col gap-2 lg:flex">
        <span aria-hidden="true" className="flex size-11 items-center justify-center">
          <img src={icon} alt="" width={22} height={22} />
        </span>
        <span className="mt-2 text-12 font-medium tracking-normal text-nt-weak">{step}</span>
        <span className="text-20 font-semibold text-nt-main">{title}</span>
        <span className="text-14 text-nt-sub">{desc}</span>
      </span>
      {/* 모바일 — 가로 줄 + 꺾쇠 */}
      <span className="flex items-center gap-3 lg:hidden">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center">
          <img src={icon} alt="" width={20} height={20} />
        </span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-16 font-semibold text-nt-main">{title}</span>
          <span className="text-12 font-medium text-nt-sub">{short}</span>
        </span>
        <img src={chevIcon} alt="" width={16} height={16} />
      </span>
    </>
  )
  const className = `block p-4 lg:flex-1 lg:p-6 ${GLASS}`
  return href ? (
    <a href={href} className={`${className} transition-[filter] hover:brightness-125`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}

export default function HomeScreen() {
  return (
    <div className="relative isolate min-h-screen bg-nt-bg text-nt-main">
      <Ambient
        glows={[
          { size: 880, x: -240, y: -200 },
          { size: 940, x: 250, y: -120 },
          { size: 860, x: 290, y: -120 },
        ]}
      />
      <Header variant="guest" />
      <main className="mx-auto flex max-w-300 flex-col gap-10 px-5 pt-6 pb-16 lg:gap-24 xl:px-0 lg:pt-18 lg:pb-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          <section aria-labelledby="nt-hero-title" className="flex flex-1 flex-col items-start">
            <Badge tone="primary">AI 수면 코칭 &amp; 구독 커머스</Badge>
            <h1 id="nt-hero-title" className="mt-4 text-32 font-semibold text-nt-main lg:mt-5 lg:text-56">
              AI가 읽어 주는
              <br />
              당신의 밤
            </h1>
            <p className="mt-3 text-15 text-nt-sub lg:mt-5 lg:text-16">
              웨어러블 기기가 보낸 수면 데이터로 Gemini가 맞춤 코칭을 실시간으로 들려줘요.
              <span className="hidden lg:inline"> 필요한 영양제는 선착순 쿠폰으로, 꾸준함은 정기구독으로.</span>
            </p>
            <div className="mt-6 flex w-full flex-col gap-2 lg:mt-8 lg:w-auto lg:flex-row lg:gap-3">
              <a href={nightlyHref('/coach')} className={PRIMARY_BUTTON}>
                수면 코칭 시작하기
              </a>
              <a href={nightlyHref('/sleep')} className={GHOST_BUTTON}>
                서비스 둘러보기
              </a>
            </div>
          </section>
          <div className="flex flex-col gap-10 lg:w-130 lg:gap-4">
            <SleepScorePreview />
            <HealthCheck />
          </div>
        </div>

        <section aria-labelledby="nt-features-title" className="flex flex-col gap-3 lg:gap-6">
          <div className="flex flex-col gap-3 lg:gap-1">
            <p lang="en" className="text-12 font-medium tracking-normal text-nt-primary-text lg:text-14">
              HOW NIGHTLY WORKS
            </p>
            <h2 id="nt-features-title" className="text-24 font-semibold text-nt-main lg:text-32">
              자고 일어나면, 나머지는 Nightly가
            </h2>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="nt-cta-title"
          className={`flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:p-10 ${GLASS_ELEVATED}`}
        >
          <div className="flex flex-1 flex-col gap-2">
            <h2 id="nt-cta-title" className="text-20 font-semibold text-nt-main lg:text-28">
              오늘 밤부터 시작해 볼까요?
            </h2>
            <p className="text-14 text-nt-sub lg:text-15">
              가입하면 첫 AI 코칭과 타임세일 알림을 <span className="hidden lg:inline">바로 </span>받을 수 있어요.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="hidden lg:block">
              <a href={nightlyHref('/sleep')} className={GHOST_BUTTON}>
                로그인
              </a>
            </span>
            <a href={nightlyHref('/sleep')} className={`flex-1 lg:flex-none ${PRIMARY_BUTTON}`}>
              무료로 가입하기
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
