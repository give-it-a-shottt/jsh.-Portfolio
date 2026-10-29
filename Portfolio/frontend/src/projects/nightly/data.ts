// Nightly 시안의 가짜 데이터 — 서버 없이 화면만 보여 준다. 숫자는 피그마 「AI 수면」 Design 시안 그대로.

export type Stage = 'deep' | 'rem' | 'light' | 'awake'

/** 단계별 이름과 색. 그래프 막대 · 범례 · 숫자 색이 모두 여기서 나온다 */
export const STAGES: Record<Stage, { label: string; bar: string; text: string }> = {
  deep: { label: '깊은 잠', bar: 'bg-nt-primary', text: 'text-nt-primary-text' },
  rem: { label: 'REM', bar: 'bg-nt-secondary', text: 'text-nt-secondary-text' },
  light: { label: '얕은 잠', bar: 'bg-nt-primary-text', text: 'text-nt-sub' },
  awake: { label: '깨어 있음', bar: 'bg-nt-warning', text: 'text-nt-warning' },
}

/** 그래프 위에서 아래로 놓이는 순서 */
export const STAGE_ROWS: Stage[] = ['awake', 'rem', 'light', 'deep']

/** 어젯밤 단계별 시간(분) */
export const LAST_NIGHT: { stage: Stage; minutes: number; percent: number }[] = [
  { stage: 'deep', minutes: 112, percent: 26 },
  { stage: 'rem', minutes: 98, percent: 23 },
  { stage: 'light', minutes: 202, percent: 47 },
  { stage: 'awake', minutes: 20, percent: 4 },
]

export const SCORE = 87

/** 단계 비율(%) — 코치 화면 칩 · 사이드바가 같은 숫자를 쓰게 여기서 꺼낸다 */
export function stagePercent(stage: Stage) {
  return LAST_NIGHT.find((row) => row.stage === stage)?.percent ?? 0
}

/** 112 → '1h 52m', 20 → '20m' */
export function duration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

/** 수면 단계 그래프 — 잠든 시각(23:48)부터 지난 분(start)과 길이(min). 시안 막대 위치를 분으로 옮긴 값 */
export const SLEEP_START = '23:48'
export const SLEEP_TOTAL_MINUTES = 432
export const HYPNOGRAM: { stage: Stage; start: number; min: number }[] = [
  { stage: 'light', start: 0, min: 18 },
  { stage: 'deep', start: 19, min: 30 },
  { stage: 'deep', start: 50, min: 43 },
  { stage: 'light', start: 93, min: 18 },
  { stage: 'rem', start: 112, min: 21 },
  { stage: 'light', start: 134, min: 24 },
  { stage: 'deep', start: 159, min: 36 },
  { stage: 'light', start: 196, min: 18 },
  { stage: 'rem', start: 214, min: 27 },
  { stage: 'awake', start: 242, min: 6 },
  { stage: 'light', start: 249, min: 24 },
  { stage: 'deep', start: 274, min: 21 },
  { stage: 'light', start: 295, min: 27 },
  { stage: 'rem', start: 323, min: 34 },
  { stage: 'light', start: 357, min: 21 },
  { stage: 'awake', start: 379, min: 9 },
  { stage: 'rem', start: 389, min: 24 },
  { stage: 'light', start: 413, min: 19 },
]

/** 시간 눈금 — start 는 23:48 부터 지난 분. mobile 이 true 인 것만 좁은 화면에 남긴다 */
export const HYPNOGRAM_TICKS: { label: string; start: number; mobile: boolean }[] = [
  { label: '23:48', start: 0, mobile: true },
  { label: '01:00', start: 72, mobile: false },
  { label: '02:00', start: 132, mobile: true },
  { label: '03:00', start: 192, mobile: false },
  { label: '04:00', start: 252, mobile: true },
  { label: '05:00', start: 312, mobile: false },
  { label: '06:00', start: 372, mobile: false },
  { label: '07:00', start: 432, mobile: true },
]

/** 최근 7일 수면 점수 — 마지막이 어젯밤(화) */
export const WEEKLY: { day: string; score: number }[] = [
  { day: '수', score: 76 },
  { day: '목', score: 82 },
  { day: '금', score: 71 },
  { day: '토', score: 88 },
  { day: '일', score: 84 },
  { day: '월', score: 79 },
  { day: '화', score: 87 },
]

/** 웹훅 동기화 기록 — 200 · 중복(200, 1번만 저장) · 401(서명 불일치) */
export const SYNC_LOGS: { status: number; tone: 'ok' | 'muted' | 'danger'; label: string; time: string }[] = [
  { status: 200, tone: 'ok', label: '수면 데이터 저장', time: '07:02:14' },
  { status: 200, tone: 'muted', label: '중복 요청 · 1번만 저장', time: '07:02:15' },
  { status: 401, tone: 'danger', label: '서명 불일치로 거절', time: '06:58:40' },
  { status: 200, tone: 'ok', label: '수면 데이터 저장', time: '어제 07:10' },
]

/** AI 코치 — 추천 질문과 미리 써 둔 답. 실제 서비스에서는 Gemini 가 SSE 로 한 글자씩 보낸다 */
export const COACH_ANSWERS: Record<string, string> = {
  '오늘 왜 이렇게 피곤할까?':
    '점수는 높지만 새벽 4시 10분에 두 번 깨면서 그 뒤 깊은 잠이 거의 없었어요. 아침 피로감은 수면 후반부의 REM 단계가 끊겼을 때 자주 나타나요. 오늘은 잠들기 1시간 전부터 화면 밝기를 낮추고, 카페인은 오후 2시 이전에만 마셔 보세요.',
  '새벽에 깨는 이유가 뭘까?':
    '04:10과 05:31에 짧게 깼어요. 이 시간대는 얕은 잠과 REM이 번갈아 오는 구간이라 소음이나 실내 온도에 쉽게 깨요. 침실 온도를 18~20도로 맞추고 알림을 꺼 두면 도움이 돼요.',
  'REM 수면을 늘리려면?':
    'REM은 수면 후반부에 길어져요. 그래서 일어나는 시각을 매일 같게 두는 게 가장 효과적이에요. 어젯밤 REM은 23%로 괜찮은 편이니, 지금 리듬을 일주일만 유지해 보세요.',
  '자기 전 루틴 추천해 줘':
    '잠들기 1시간 전에는 조명을 낮추고, 30분 전에는 화면을 내려놓고, 10분 전에는 4-7-8 호흡을 세 번 해 보세요. 어젯밤처럼 잠들기까지 14분이면 아주 좋은 편이에요.',
  '카페인 끊어야 할까?':
    '끊을 필요까지는 없어요. 카페인은 6시간 가까이 몸에 남으니, 오후 2시 이후에만 피해도 새벽에 깨는 횟수가 줄어들 수 있어요.',
}

export const COACH_FALLBACK =
  '좋은 질문이에요. 지금은 시안이라 미리 써 둔 답만 보여 드려요. 실제 서비스에서는 어젯밤 수면 기록을 읽고 Gemini가 실시간으로 답해요.'

/** 사이드바 추천 질문 4개 (시안 순서) */
export const COACH_SUGGESTIONS = [
  '오늘 왜 이렇게 피곤할까?',
  '새벽에 깨는 이유가 뭘까?',
  'REM 수면을 늘리려면?',
  '자기 전 루틴 추천해 줘',
]

/** 모바일 아래 빠른 질문 — 짧은 글자로 보여 주고 누르면 원래 질문을 보낸다 */
export const COACH_QUICK: { label: string; question: string }[] = [
  { label: '새벽에 깨는 이유?', question: '새벽에 깨는 이유가 뭘까?' },
  { label: 'REM 늘리려면?', question: 'REM 수면을 늘리려면?' },
]

/** 대시보드 AI 코치 칸의 질문 칩 — 누르면 코치 화면에서 그 질문을 바로 보낸다 */
export const DASHBOARD_CHIPS: { label: string; question: string }[] = [
  { label: '왜 새벽에 깼을까?', question: '새벽에 깨는 이유가 뭘까?' },
  { label: '카페인 끊어야 할까?', question: '카페인 끊어야 할까?' },
  { label: '오늘 밤 루틴 추천', question: '자기 전 루틴 추천해 줘' },
]

/** 1분에 보낼 수 있는 질문 수(Redis 요청 제한 흉내). 시안처럼 이미 3번 물어본 상태에서 시작한다 */
export const RATE_LIMIT = 5
export const RATE_USED_AT_START = 3
