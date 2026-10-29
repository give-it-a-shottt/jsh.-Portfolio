import { useEffect, useRef, useState } from 'react'
import { COACH_ANSWERS, COACH_FALLBACK, COACH_SUGGESTIONS, RATE_LIMIT, RATE_USED_AT_START, SCORE } from './data'

export interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  text: string
  /** 지금까지 보여 준 글자 수. text 길이보다 작으면 아직 스트리밍 중 */
  shown: number
  /** 답 아래에 추천 상품 카드를 붙인다 */
  product?: boolean
}

const GREETING = `좋은 아침이에요! 어젯밤은 ${SCORE}점으로 숙면한 편이에요. 궁금한 점을 물어보세요.`
/** 질문 하나의 최대 길이 — 주소(?q=)로 들어온 긴 글도 잘라 쓴다 */
export const QUESTION_MAX = 100
const TICK_MS = 30
const CHARS_PER_TICK = 2
/** 요청 제한을 세는 시간 창 */
const RATE_WINDOW_MS = 60_000

// 질문 글자를 그대로 열쇠로 쓰므로, 'constructor' 같은 객체 기본 속성이 답으로 나오지 않게 자기 키만 본다
const answerFor = (question: string) => (Object.hasOwn(COACH_ANSWERS, question) ? COACH_ANSWERS[question] : COACH_FALLBACK)

/**
 * AI 코치 대화 흉내 — 서버 없이 미리 써 둔 답을 30ms 마다 두 글자씩 늘려 SSE 스트리밍처럼 보여 준다.
 * 시작하면 시안처럼 인사 → 첫 질문 → 답(스트리밍) 순서로 놓인다. 첫 질문은 대시보드에서 고른 질문(?q=)이 있으면 그것.
 * 1분에 RATE_LIMIT 번까지만 물을 수 있고(Redis 요청 제한 흉내), 넘기면 1분 뒤에 다시 연다.
 */
export function useCoachChat(firstQuestion: string | null) {
  const first = firstQuestion?.trim().slice(0, QUESTION_MAX) || COACH_SUGGESTIONS[0]
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 0, role: 'ai', text: GREETING, shown: GREETING.length },
    { id: 1, role: 'user', text: first, shown: first.length },
    { id: 2, role: 'ai', text: answerFor(first), shown: 0, product: true },
  ])
  const nextId = useRef(3)
  const [used, setUsed] = useState(RATE_USED_AT_START)
  const [reduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

  const streamingId = messages.find((message) => message.shown < message.text.length)?.id
  const streaming = streamingId !== undefined
  const limited = used >= RATE_LIMIT

  useEffect(() => {
    if (streamingId === undefined) return
    // 움직임 줄이기를 켠 사용자에게는 한 번에 다 보여 준다
    const step = reduceMotion ? Number.MAX_SAFE_INTEGER : CHARS_PER_TICK
    const timer = window.setInterval(() => {
      setMessages((list) =>
        list.map((message) =>
          message.id === streamingId ? { ...message, shown: Math.min(message.text.length, message.shown + step) } : message,
        ),
      )
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [streamingId, reduceMotion])

  useEffect(() => {
    if (!limited) return
    const timer = window.setTimeout(() => setUsed(0), RATE_WINDOW_MS)
    return () => window.clearTimeout(timer)
  }, [limited])

  /** 질문을 보낸다. 빈 글 · 답 쓰는 중 · 요청 제한이면 보내지 않고 false */
  function ask(raw: string) {
    const question = raw.trim().slice(0, QUESTION_MAX)
    if (!question || streaming || limited) return false
    const userId = nextId.current++
    const aiId = nextId.current++
    setUsed((count) => count + 1)
    setMessages((list) => [
      ...list,
      { id: userId, role: 'user', text: question, shown: question.length },
      { id: aiId, role: 'ai', text: answerFor(question), shown: 0 },
    ])
    return true
  }

  /** 다 쓴 마지막 AI 답 — 화면 읽기 프로그램에는 한 글자씩이 아니라 다 쓴 뒤 한 번만 읽힌다 */
  const lastAnswer = streaming ? '' : [...messages].reverse().find((message) => message.role === 'ai')?.text ?? ''

  return { messages, streamingId, streaming, used, limited, ask, lastAnswer }
}
