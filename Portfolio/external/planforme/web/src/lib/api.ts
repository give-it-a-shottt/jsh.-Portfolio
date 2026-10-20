"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CompleteResult,
  Notification,
  Plan,
  PlanDetail,
  PlanInput,
  PlanStatus,
  Preview,
  ReplanSuggestion,
  Stats,
  Task,
  Today,
} from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// FastAPI 에러 응답(detail)을 사람이 읽을 문장으로 바꾼다
function errorMessage(body: unknown, status: number): string {
  const detail = (body as { detail?: unknown })?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return `요청에 실패했어요 (${status})`;
}

// 브라우저는 Next.js의 /api 프록시만 호출한다. API 키는 서버에만 있다.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, "네트워크에 연결할 수 없어요");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, errorMessage(body, res.status));
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const json = (body: unknown) => JSON.stringify(body);

export const api = {
  today: () => request<Today>("/today"),
  tasksOn: (date: string) => request<Task[]>(`/tasks?date=${date}`),
  complete: (taskId: number, actualEnd?: number) =>
    request<CompleteResult>(`/tasks/${taskId}/complete`, { method: "POST", body: json({ actual_end: actualEnd ?? null }) }),
  uncomplete: (taskId: number) => request<Task>(`/tasks/${taskId}/uncomplete`, { method: "POST" }),

  preview: (input: PlanInput) => request<Preview>("/plans/preview", { method: "POST", body: json(input) }),
  createPlan: (input: PlanInput) => request<Plan>("/plans", { method: "POST", body: json(input) }),
  plans: () => request<Plan[]>("/plans"),
  plan: (id: number) => request<PlanDetail>(`/plans/${id}`),
  updatePlan: (
    id: number,
    body: Partial<{ title: string; end_date: string; weekdays: number[]; status: PlanStatus }>,
  ) => request<Plan>(`/plans/${id}`, { method: "PATCH", body: json(body) }),
  deletePlan: (id: number) => request<void>(`/plans/${id}`, { method: "DELETE" }),
  replanSuggestion: (id: number) => request<ReplanSuggestion>(`/plans/${id}/replan`),
  replan: (id: number) => request<Plan>(`/plans/${id}/replan`, { method: "POST" }),

  calendar: (year: number, month: number) =>
    request<{ days: Record<string, string[]> }>(`/calendar?year=${year}&month=${month}`),
  notifications: (remindHour = 21) => request<Notification[]>(`/notifications?remind_hour=${remindHour}`),
  stats: (period: "week" | "month") => request<Stats>(`/stats?period=${period}`),
};

/**
 * 화면에서 데이터를 불러오는 공통 훅. key가 바뀌면 다시 불러온다.
 * 결과를 key와 함께 저장해서, 다른 key(예: 다른 날짜)의 지난 데이터를 보여 주지 않는다.
 * reload()는 같은 key로 다시 불러오므로 기존 데이터를 유지한 채 새로 고친다.
 */
export function useApi<T>(fetcher: () => Promise<T>, key: string) {
  const [result, setResult] = useState<{ key: string; data: T | null; error: string | null }>({
    key,
    data: null,
    error: null,
  });
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const error = e instanceof Error ? e.message : "알 수 없는 오류";
        setResult((prev) => ({ key, data: prev.key === key ? prev.data : null, error }));
      });
    return () => {
      cancelled = true;
    };
    // fetcher는 매 렌더 새로 만들어지므로 key로만 다시 불러온다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const fresh = result.key === key;
  const data = fresh ? result.data : null;
  const error = fresh ? result.error : null;
  return { data, error, loading: data === null && error === null, reload };
}
