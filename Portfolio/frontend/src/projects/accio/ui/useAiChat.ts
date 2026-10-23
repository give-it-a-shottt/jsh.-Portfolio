import { useSyncExternalStore } from 'react'
import { respond, respondToImage, type AiReply } from '../data/aiEngine'
import { latestOrder } from './useOrders'

// AI 대화 — /ai 전체 화면과 플로팅 위젯이 같은 대화를 함께 쓴다(위젯에서 '전체화면'을 눌러도 이어진다).
export type ChatMessage =
  | { id: string; role: 'user'; text: string; image?: boolean }
  | { id: string; role: 'ai'; reply: AiReply; confirmState?: 'pending' | 'added' | 'cancelled' }

export interface Conversation {
  id: string
  title: string
  updatedAt: number
  messages: ChatMessage[]
}

interface ChatState {
  conversations: Conversation[]
  activeId: string | null
  /** 답을 기다리는 중(입력 중 표시) */
  thinking: boolean
}

const KEY = 'accio:ai'
const DAY = 24 * 60 * 60 * 1000
const listeners = new Set<() => void>()
let seq = 0
const uid = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`

/** 질문 하나로 대화를 만든다 (사이드바 기록 시드용) */
function seedConversation(question: string, ago: number): Conversation {
  const reply = respond(question, [])
  return {
    id: uid(),
    title: question.replace(/(찾아줘|추천해줘|담아줘)$/, '').trim(),
    updatedAt: Date.now() - ago,
    messages: [
      { id: uid(), role: 'user', text: question },
      { id: uid(), role: 'ai', reply, confirmState: reply.confirm ? 'pending' : undefined },
    ],
  }
}

// 처음 온 사람에게도 시안처럼 '오늘 2 · 지난 7일 3' 기록이 보이도록 한다
function seed(): ChatState {
  return {
    activeId: null,
    thinking: false,
    conversations: [
      { ...seedConversation('김치찌개 재료 한 번에', 30 * 60 * 1000), title: '김치찌개 재료 한 번에' },
      { ...seedConversation('캠핑 의자 가벼운 거', 2 * 60 * 60 * 1000), title: '캠핑 의자 가벼운 거' },
      { ...seedConversation('3만원대 집들이 선물', 2 * DAY), title: '3만원대 집들이 선물' },
      { ...seedConversation('내 주문 어디까지 왔어?', 3 * DAY), title: '내 주문 어디까지 왔어?' },
      { ...seedConversation('비 오는 날 운동화', 5 * DAY), title: '비 오는 날 운동화' },
    ],
  }
}

function read(): ChatState {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? { ...JSON.parse(saved), thinking: false } : seed()
  } catch {
    return seed()
  }
}

let state = read()

function write(next: ChatState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify({ conversations: next.conversations, activeId: next.activeId }))
  } catch {
    // 저장이 막혀도 이번 방문 동안은 유지된다
  }
  listeners.forEach((notify) => notify())
}

function updateConversation(id: string | null, change: (c: Conversation) => Conversation) {
  write({ ...state, conversations: state.conversations.map((c) => (c.id === id ? change(c) : c)) })
}
const updateActive = (change: (c: Conversation) => Conversation) => updateConversation(state.activeId, change)

/** 지금 대화의 AI 답들 — '다 담아줘'처럼 앞 결과를 이어 받는 질문에 쓴다 */
const aiReplies = (c: Conversation | undefined) =>
  (c?.messages ?? []).flatMap((m) => (m.role === 'ai' ? [m.reply] : []))

function answer(makeReply: (history: AiReply[]) => AiReply) {
  // 기다리는 사이 다른 대화를 열어도 답은 질문한 대화에 붙인다
  const targetId = state.activeId
  write({ ...state, thinking: true })
  // 실제 AI 처럼 잠깐 생각하는 틈을 둔다
  window.setTimeout(() => {
    const target = state.conversations.find((c) => c.id === targetId)
    const reply = makeReply(aiReplies(target))
    state = { ...state, thinking: false }
    updateConversation(targetId, (c) => ({
      ...c,
      updatedAt: Date.now(),
      messages: [...c.messages, { id: uid(), role: 'ai', reply, confirmState: reply.confirm ? 'pending' : undefined }],
    }))
  }, 650)
}

function ensureConversation(title: string) {
  if (state.activeId && state.conversations.some((c) => c.id === state.activeId)) return
  const conversation: Conversation = { id: uid(), title: title.slice(0, 20), updatedAt: Date.now(), messages: [] }
  write({ ...state, activeId: conversation.id, conversations: [conversation, ...state.conversations] })
}

export const chatActions = {
  /** '새 대화' — 첫 화면으로 돌아간다 */
  startNew: () => write({ ...state, activeId: null }),
  open: (id: string) => write({ ...state, activeId: id }),
  send(text: string) {
    const question = text.trim()
    if (!question || state.thinking) return
    ensureConversation(question)
    updateActive((c) => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, { id: uid(), role: 'user', text: question }] }))
    answer((history) => respond(question, history, latestOrder()))
  },
  sendImage() {
    if (state.thinking) return
    ensureConversation('사진으로 찾기')
    updateActive((c) => ({ ...c, messages: [...c.messages, { id: uid(), role: 'user', text: '이 사진이랑 비슷한 상품 찾아줘', image: true }] }))
    answer(() => respondToImage())
  },
  setConfirm: (messageId: string, confirmState: 'added' | 'cancelled') =>
    updateActive((c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === messageId && m.role === 'ai' ? { ...m, confirmState } : m)),
    })),
}

export default function useAiChat() {
  const snapshot = useSyncExternalStore(
    (notify) => {
      listeners.add(notify)
      return () => listeners.delete(notify)
    },
    () => state,
    () => state,
  )
  const active = snapshot.conversations.find((c) => c.id === snapshot.activeId)
  // 결과 패널은 이 대화에서 가장 최근에 나온 결과를 보여 준다
  const latestResult = [...aiReplies(active)].reverse().find((r) => r.result)?.result
  return { ...snapshot, active, latestResult }
}

// AI 위젯 열림 상태 — 플로팅 버튼·목록의 'AI 검색' 등 어디서든 연다
let widgetOpen = false
const widgetListeners = new Set<() => void>()
export function setAiWidgetOpen(next: boolean) {
  widgetOpen = next
  widgetListeners.forEach((notify) => notify())
}
export const openAiWidget = () => setAiWidgetOpen(true)
export function useAiWidgetOpen() {
  return useSyncExternalStore(
    (notify) => {
      widgetListeners.add(notify)
      return () => widgetListeners.delete(notify)
    },
    () => widgetOpen,
    () => false,
  )
}
