import { useEffect, useRef, useState, type FormEvent } from 'react'
import chevIcon from '../assets/c-chev.svg'
import dot1 from '../assets/c-dot1.svg'
import dot2 from '../assets/c-dot2.svg'
import dot3 from '../assets/c-dot3.svg'
import pillIcon from '../assets/c-pill.svg'
import sendIcon from '../assets/c-send.svg'
import sparkles14Icon from '../assets/c-sparkles-14.svg'
import sparklesWhiteIcon from '../assets/c-sparkles-white.svg'
import mDot1 from '../assets/mc-dot1.svg'
import mDot2 from '../assets/mc-dot2.svg'
import mDot3 from '../assets/mc-dot3.svg'
import leftIcon from '../assets/mc-left.svg'
import mPillIcon from '../assets/mc-pill.svg'
import mSendIcon from '../assets/mc-send.svg'
import mSparklesIcon from '../assets/mc-sparkles-14.svg'
import { Badge, CELL, Footer, GLASS, Header, StatusPulse } from '../components'
import { COACH_QUICK, COACH_SUGGESTIONS, duration, RATE_LIMIT, SCORE, SLEEP_TOTAL_MINUTES, stagePercent } from '../data'
import { QUESTION_MAX, useCoachChat, type ChatMessage } from '../hooks'
import { nightlyHref } from '../routes'

// 05 AI 수면 코치 — PC 는 왼쪽 코칭 기준(어젯밤 데이터 · 추천 질문 · 요청 제한) + 오른쪽 대화,
// 모바일은 헤더 · 푸터 없이 화면 전체를 대화로 쓴다(시안 05-M).

type Size = 'pc' | 'mobile'

const CONTEXT_ROWS = [
  { label: '깊은 잠', value: `${stagePercent('deep')}%`, tone: 'text-nt-primary-text' },
  { label: 'REM', value: `${stagePercent('rem')}%`, tone: 'text-nt-secondary-text' },
  { label: '깨어남', value: '2회 · 04:10', tone: 'text-nt-warning' },
  { label: '총 수면', value: duration(SLEEP_TOTAL_MINUTES), tone: 'text-nt-main' },
]

function AiAvatar({ size }: { size: Size | 'head' }) {
  const small = size === 'mobile'
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-135 from-nt-ai from-15% to-nt-violet to-85% ${small ? 'size-7' : 'size-9'}`}
    >
      <img src={small ? mSparklesIcon : sparklesWhiteIcon} alt="" width={small ? 14 : 18} height={small ? 14 : 18} />
    </span>
  )
}

/** 추천 상품 카드 — 타임세일 화면은 다른 곳에서 완성하므로 '보러 가기'는 누르지 않는 표시로 둔다 */
function ProductCard({ size }: { size: Size }) {
  const pc = size === 'pc'
  return (
    <div className={`flex w-full items-center ${CELL} ${pc ? 'gap-3 p-3' : 'gap-2.5 p-2.5'}`}>
      <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-sm bg-nt-glass-soft ${pc ? 'size-12' : 'size-9'}`}>
        <img src={pc ? pillIcon : mPillIcon} alt="" width={pc ? 22 : 16} height={pc ? 22 : 16} />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className={pc ? 'text-14 font-medium text-nt-main' : 'text-13 font-semibold text-nt-main'}>
          {pc ? '마그네슘 글리시네이트 슬립' : '마그네슘 슬립'}
        </p>
        <p className={`font-medium text-nt-warning ${pc ? 'text-12' : 'text-11'}`}>
          {pc ? '타임세일 32% · 선착순 쿠폰 23장 남음' : '타임세일 32%'}
        </p>
      </div>
      <span aria-disabled="true" title="준비 중이에요" className="flex items-center gap-2 px-1 text-14 font-medium text-nt-primary-text lg:px-4">
        <span className="hidden lg:inline">보러 가기</span>
        <img src={chevIcon} alt="" width={14} height={14} />
      </span>
    </div>
  )
}

function Message({ message, streaming, size }: { message: ChatMessage; streaming: boolean; size: Size }) {
  const pc = size === 'pc'
  if (message.role === 'user')
    return (
      <div className="flex justify-end">
        <p
          className={`rounded-tl-card rounded-tr-[4px] rounded-b-card bg-linear-165 from-nt-indigo from-15% to-nt-indigo-strong to-85% font-medium text-nt-main ${
            pc ? 'px-4 py-3 text-15' : 'px-3.5 py-2.5 text-14'
          }`}
        >
          {message.text}
        </p>
      </div>
    )
  return (
    <div className={`flex items-start ${pc ? 'gap-3' : 'gap-2'}`}>
      <AiAvatar size={size} />
      <div
        className={`flex flex-col rounded-tl-[4px] rounded-tr-card rounded-b-card border border-nt-line-light bg-nt-glass-highlight ${
          pc ? 'w-140 max-w-full gap-3 px-4 py-3.5' : 'flex-1 gap-2.5 px-3.5 py-3'
        }`}
      >
        <p className={`text-nt-main ${pc ? 'text-15' : 'text-14'}`}>{message.text.slice(0, message.shown)}</p>
        {streaming && (
          <span aria-hidden="true" className={`w-0.5 bg-nt-secondary-text motion-safe:animate-pulse ${pc ? 'h-4.5' : 'h-4'}`} />
        )}
        {message.product && <ProductCard size={size} />}
      </div>
    </div>
  )
}

function Typing({ size }: { size: Size }) {
  const pc = size === 'pc'
  const dots = pc ? [dot1, dot2, dot3] : [mDot1, mDot2, mDot3]
  return (
    <div aria-hidden="true" className={`flex items-center ${pc ? 'gap-2 pl-12' : 'gap-1.5 pl-9'}`}>
      {dots.map((dot) => (
        <img key={dot} src={dot} alt="" width={pc ? 6 : 5} height={pc ? 6 : 5} />
      ))}
      <span className={`font-medium text-nt-weak ${pc ? 'text-12' : 'text-11'}`}>
        {pc ? 'Gemini가 답변을 이어서 쓰는 중' : '답변 이어서 쓰는 중'}
      </span>
    </div>
  )
}

export default function CoachScreen({ question }: { question: string | null }) {
  const { messages, streamingId, streaming, used, limited, ask, lastAnswer } = useCoachChat(question)
  const [draft, setDraft] = useState('')
  const mobileListRef = useRef<HTMLDivElement>(null)

  // 모바일 대화창은 따로 스크롤되므로, 글자가 늘어날 때마다 맨 아래를 보여 준다
  useEffect(() => {
    const list = mobileListRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  function submit(e: FormEvent) {
    e.preventDefault()
    if (ask(draft)) setDraft('')
  }

  const status = limited ? '요청이 많아요 (429) · 1분 뒤에 다시 물어볼 수 있어요' : streaming ? '답변을 쓰는 중이에요' : ''

  const list = (size: Size) => (
    <>
      {messages.map((message) => (
        <Message key={message.id} message={message} streaming={message.id === streamingId} size={size} />
      ))}
      {streaming && <Typing size={size} />}
    </>
  )

  const composer = (size: Size) => {
    const pc = size === 'pc'
    return (
      <form onSubmit={submit} className={`flex items-center ${pc ? 'gap-3' : 'gap-2'}`}>
        <label className={`flex flex-1 items-center gap-2.5 rounded-sm border border-nt-line bg-nt-glass-pressed backdrop-blur-[4px] focus-within:border-nt-line-active focus-within:shadow-[0_0_0_3px_#8ab0fa3d] ${pc ? 'h-13 px-4' : 'h-12 px-3.5'}`}>
          <span className="sr-only">코치에게 질문</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={QUESTION_MAX}
            disabled={limited}
            placeholder={pc ? '어젯밤 수면에 대해 물어보세요' : '수면에 대해 물어보세요'}
            className={`min-w-0 flex-1 bg-transparent text-nt-main outline-none placeholder:text-nt-disabled disabled:cursor-not-allowed ${pc ? 'text-15' : 'text-14'}`}
          />
          {pc && (
            <span className="text-12 font-medium tracking-normal text-nt-weak">
              {used}/{RATE_LIMIT}
            </span>
          )}
        </label>
        <button
          type="submit"
          aria-label="보내기"
          disabled={streaming || limited}
          className={`flex shrink-0 items-center justify-center rounded-sm bg-linear-135 from-nt-indigo from-15% to-nt-indigo-strong to-85% shadow-nt-cta inset-shadow-nt-button disabled:opacity-50 ${pc ? 'size-13' : 'size-12'}`}
        >
          <img src={pc ? sendIcon : mSendIcon} alt="" width={pc ? 20 : 18} height={pc ? 20 : 18} />
        </button>
      </form>
    )
  }

  return (
    <div className="bg-nt-bg text-nt-main">
      {/* 화면 읽기 프로그램용 — 다 쓴 답과 상태를 한 번씩만 읽는다 */}
      <p aria-live="polite" className="sr-only">
        {lastAnswer}
      </p>
      <p role="status" className="sr-only">
        {status}
      </p>

      {/* PC */}
      <div className="hidden min-h-screen flex-col lg:flex">
        <Header variant="member" active="coach" />
        <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-5 pt-10 pb-24 xl:px-0">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p lang="en" className="text-14 font-medium tracking-normal text-nt-primary-text">
                AI COACH · M3
              </p>
              <h1 className="text-32 font-semibold text-nt-main">AI 수면 코치</h1>
              <p className="text-16 text-nt-sub">어젯밤 수면 기록을 읽고 Gemini가 한 글자씩 실시간으로 답해요.</p>
            </div>
            <StatusPulse>SSE 스트리밍 연결됨</StatusPulse>
          </div>

          <div className={`flex overflow-hidden ${GLASS}`}>
            <aside aria-label="코칭 기준" className="flex w-80 shrink-0 flex-col gap-6 border-r border-nt-line bg-nt-glass-subtle p-6">
              <section aria-labelledby="nt-coach-context" className="flex flex-col gap-2.5">
                <h2 id="nt-coach-context" className="text-13 font-semibold text-nt-sub">
                  코칭 기준 데이터
                </h2>
                <div className={`flex flex-col gap-2.5 p-4 ${CELL}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-12 font-medium text-nt-weak">어젯밤 · 10.21</span>
                    <Badge>{SCORE}점</Badge>
                  </div>
                  <dl className="flex flex-col gap-2.5">
                    {CONTEXT_ROWS.map(({ label, value, tone }) => (
                      <div key={label} className="flex justify-between">
                        <dt className="text-13 text-nt-sub">{label}</dt>
                        <dd className={`text-14 font-medium tracking-normal ${tone}`}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              <section aria-labelledby="nt-coach-suggest" className="flex flex-col gap-2">
                <h2 id="nt-coach-suggest" className="text-13 font-semibold text-nt-sub">
                  추천 질문
                </h2>
                {COACH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    disabled={streaming || limited}
                    className="flex items-center gap-2 rounded-sm border border-nt-line-light bg-nt-glass-highlight px-3 py-2.5 text-left text-13 font-medium text-nt-main transition-colors hover:border-nt-line-highlight disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <img src={sparkles14Icon} alt="" width={14} height={14} />
                    {suggestion}
                  </button>
                ))}
              </section>

              <section aria-label="요청 제한" className={`flex flex-col gap-2 p-4 ${CELL}`}>
                <div className="flex justify-between text-12 font-medium">
                  <span className="text-nt-sub">이번 1분 요청</span>
                  <span className="text-14 tracking-normal text-nt-main">
                    {used} / {RATE_LIMIT}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="이번 1분 요청 수"
                  aria-valuemin={0}
                  aria-valuemax={RATE_LIMIT}
                  aria-valuenow={used}
                  className="h-1.5 overflow-hidden rounded-full bg-nt-glass-pressed"
                >
                  <div className="h-full rounded-full bg-nt-primary" style={{ width: `${(used / RATE_LIMIT) * 100}%` }} />
                </div>
                <p className={`text-11 font-medium ${limited ? 'text-nt-warning' : 'text-nt-weak'}`}>
                  {limited ? '요청이 많아요 (429). 1분 뒤에 다시 물어볼 수 있어요.' : '5회를 넘기면 잠시 쉬었다 다시 물어볼 수 있어요 (429).'}
                </p>
              </section>
            </aside>

            <section aria-label="Nightly Coach 대화" className="flex flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-nt-line px-6 py-4">
                <div className="flex items-center gap-3">
                  <AiAvatar size="head" />
                  <div className="flex flex-col">
                    <p lang="en" className="text-16 font-semibold text-nt-main">
                      Nightly Coach
                    </p>
                    <p className="text-12 font-medium tracking-normal text-nt-weak">Gemini · POST /api/v1/coach/stream</p>
                  </div>
                </div>
                <Badge tone={streaming ? 'secondary' : 'muted'}>{streaming ? '스트리밍 중' : '대기 중'}</Badge>
              </div>
              <div aria-busy={streaming} className="flex flex-1 flex-col gap-5 p-6">
                {list('pc')}
              </div>
              <div className="border-t border-nt-line px-6 pt-4 pb-5">{composer('pc')}</div>
            </section>
          </div>
        </main>
        <Footer />
      </div>

      {/* 모바일 */}
      <div className="flex h-dvh flex-col lg:hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-nt-line bg-nt-glass-elevated pr-5 pl-4 shadow-nt-glass inset-shadow-nt-specular backdrop-blur-[12px]">
          <a href={nightlyHref('/sleep')} aria-label="수면 대시보드로 돌아가기" className="-m-2 p-2">
            <img src={leftIcon} alt="" width={22} height={22} />
          </a>
          <AiAvatar size="head" />
          <div className="flex flex-1 flex-col">
            <h1 lang="en" className="text-16 font-semibold text-nt-main">
              Nightly Coach
            </h1>
            <p className="text-11 font-medium text-nt-success">SSE 스트리밍 연결됨</p>
          </div>
          <Badge tone="muted">
            {used}/{RATE_LIMIT}
          </Badge>
        </header>
        <ul aria-label="코칭 기준 데이터" className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-nt-line-light bg-nt-glass-subtle px-4 py-3">
          <li><Badge>어젯밤 {SCORE}점</Badge></li>
          <li><Badge tone="primary">깊은 잠 {stagePercent('deep')}%</Badge></li>
          <li><Badge tone="secondary">REM {stagePercent('rem')}%</Badge></li>
          <li><Badge tone="warning">깨어남 2회</Badge></li>
        </ul>
        <div ref={mobileListRef} aria-busy={streaming} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-5 pb-4">
          {list('mobile')}
        </div>
        <div className="flex shrink-0 gap-1.5 px-4 pb-2.5">
          {COACH_QUICK.map(({ label, question: quick }) => (
            <button
              key={label}
              type="button"
              onClick={() => ask(quick)}
              disabled={streaming || limited}
              className="rounded-full border border-nt-line bg-nt-glass-highlight px-3 py-1.5 text-12 font-medium text-nt-sub disabled:opacity-60"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="shrink-0 border-t border-nt-line bg-nt-glass-elevated px-4 pt-3 pb-7">{composer('mobile')}</div>
      </div>
    </div>
  )
}
