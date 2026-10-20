import type { Overdue, PlanType, Task } from "./types";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
// 서버(FastAPI)와 같은 요일 번호: 월=0 … 일=6
export const WEEKDAY_MON_FIRST = ["월", "화", "수", "목", "금", "토", "일"];

export const TYPE_LABEL: Record<PlanType, string> = { book: "책", lecture: "강의", routine: "일반" };
export const UNIT: Record<PlanType, string> = { book: "p", lecture: "강", routine: "회" };
export const UNIT_LONG: Record<PlanType, string> = { book: "페이지", lecture: "강", routine: "회" };

/** 한국 시간 기준 오늘 (YYYY-MM-DD) */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseISO(a).getTime() - parseISO(b).getTime()) / 86_400_000);
}

/** 10월 17일 (토) */
export function fmtMonthDay(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]})`;
}

/** 10월 17일 토요일 */
export function fmtLong(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAY[d.getDay()]}요일`;
}

/** 10.17 (토) */
export function fmtDot(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}.${d.getDate()} (${WEEKDAY[d.getDay()]})`;
}

/** 10/19 월 */
export function fmtSlash(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${WEEKDAY[d.getDay()]}`;
}

/** 11월 14일 */
export function fmtMonthDayShort(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** 수행 요일 표시: 매일 / 평일 / 주말 / 월·수·금 */
export function weekdayName(weekdays: number[], long = false): string {
  const w = [...weekdays].sort();
  if (w.length === 7) return "매일";
  if (same(w, [0, 1, 2, 3, 4])) return long ? "평일 (월~금)" : "평일";
  if (same(w, [5, 6])) return "주말";
  return w.map((i) => WEEKDAY_MON_FIRST[i]).join("·");
}

/** 오늘의 할 일 카드 제목 */
export function taskTitle(t: Pick<Task, "plan_type" | "target_amount" | "avg_minutes">): string {
  if (t.plan_type === "book") return `${t.target_amount}페이지 읽기`;
  if (t.plan_type === "lecture") return `${t.target_amount}강 듣기 · 약 ${t.target_amount * (t.avg_minutes ?? 0)}분`;
  return "오늘의 루틴";
}

export function taskMeta(t: Pick<Task, "plan_type" | "plan_title">): string {
  return `${TYPE_LABEL[t.plan_type]} · ${t.plan_title}`;
}

export function rangeText(type: PlanType, start: number | null, end: number | null, sep = " → "): string {
  if (start == null || end == null) return "";
  return `${start}${UNIT[type]}${sep}${end}${UNIT[type]}`;
}

export function taskSub(t: Task): string {
  if (t.plan_type === "routine") return `${t.routine_total}회 중 ${t.routine_index}회째`;
  return rangeText(t.plan_type, t.target_start, t.target_end);
}

export function overdueLabel(o: Overdue): string {
  return o.plan_type === "book" ? `${o.target_start}p` : `${o.target_start}강`;
}

export function dDay(n: number): string {
  if (n > 0) return `D-${n}`;
  if (n === 0) return "D-Day";
  return "종료";
}
