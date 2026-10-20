"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "./format";

const noop = () => () => {};

/** 브라우저에서만 오늘 날짜를 읽는다. 미리 렌더링(서버)할 때는 null. */
export function useToday(): string | null {
  return useSyncExternalStore(noop, todayISO, () => null);
}
