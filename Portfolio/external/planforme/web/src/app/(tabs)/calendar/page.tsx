"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TaskListSkeleton } from "@/components/Skeleton";
import { TaskCard } from "@/components/TaskCard";
import { useTaskActions } from "@/components/TaskActions";
import { Empty, ErrorBox, cx } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { addDays, fmtMonthDay, parseISO, toISO } from "@/lib/format";
import { useToday } from "@/lib/useToday";

const HEAD = ["일", "월", "화", "수", "목", "금", "토"];
const DOT: Record<string, string> = { book: "bg-primary", lecture: "bg-primary/60", routine: "bg-primary/30" };

/** 달력에 그릴 날짜 칸: 일요일 시작, 빈 칸은 null */
function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = Array(first.getDay()).fill(null);
  for (let d = 1; d <= days; d++) cells.push(toISO(new Date(year, month - 1, d)));
  return cells;
}

function weekCells(iso: string): string[] {
  const d = parseISO(iso);
  const sunday = addDays(iso, -d.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
}

export default function CalendarPage() {
  const today = useToday();
  if (!today) return null;
  return <Calendar today={today} />;
}

function Calendar({ today }: { today: string }) {
  const [selected, setSelected] = useState(today);
  const [view, setView] = useState<"month" | "week">("month");
  const sel = parseISO(selected);
  const year = sel.getFullYear();
  const month = sel.getMonth() + 1;

  const cal = useApi(() => api.calendar(year, month), `cal-${year}-${month}`);
  const list = useApi(() => api.tasksOn(selected), `tasks-${selected}`);
  const reloadAll = () => {
    cal.reload();
    list.reload();
  };
  const actions = useTaskActions(reloadAll);

  function move(dir: -1 | 1) {
    if (view === "week") return setSelected(addDays(selected, dir * 7));
    const d = new Date(year, month - 1 + dir, 1);
    setSelected(toISO(d));
  }

  const cells = view === "month" ? monthCells(year, month) : weekCells(selected);
  const dots = cal.data?.days ?? {};

  return (
    <main className="px-5 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold">
          {year}년 {month}월
        </h1>
        <div className="flex gap-1">
          <button aria-label="이전" onClick={() => move(-1)} className="flex size-9 items-center justify-center text-icon-main">
            <ChevronLeft size={22} />
          </button>
          <button aria-label="다음" onClick={() => move(1)} className="flex size-9 items-center justify-center text-icon-main">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex rounded-full bg-glass-sub p-1">
        {(["month", "week"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cx(
              "h-10 flex-1 rounded-full text-[14px] transition",
              view === v ? "bg-bg-default font-semibold shadow-glass" : "text-text-sub",
            )}
          >
            {v === "month" ? "월간" : "주간"}
          </button>
        ))}
      </div>

      <section className="glass-card mt-5 px-3 py-5">
        <div className="grid grid-cols-7 text-center text-[12px]">
          {HEAD.map((h, i) => (
            <span key={h} className={i === 0 ? "text-[#F04438]" : "text-text-sub-weak"}>
              {h}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-y-2 text-center">
          {cells.map((iso, i) => {
            if (!iso) return <span key={`e${i}`} />;
            const d = parseISO(iso);
            const isSel = iso === selected;
            const past = iso < today;
            return (
              <button key={iso} onClick={() => setSelected(iso)} className="flex flex-col items-center gap-1 py-1">
                <span
                  className={cx(
                    "flex size-9 items-center justify-center rounded-full text-[15px]",
                    isSel && "bg-primary font-semibold text-white",
                    !isSel && iso === today && "font-semibold text-primary",
                    !isSel && iso !== today && (d.getDay() === 0 ? "text-[#F04438]" : past ? "text-text-disabled" : "text-text-main"),
                  )}
                >
                  {d.getDate()}
                </span>
                <span className="flex h-1.5 gap-0.5">
                  {(dots[iso] ?? []).map((t) => (
                    <span key={t} className={cx("size-1.5 rounded-full", DOT[t])} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">{fmtMonthDay(selected)}</h2>
          <span className="text-[13px] text-text-sub-weak">{list.data?.length ?? 0}개</span>
        </div>
        <div className="mt-4 space-y-3">
          {list.loading && <TaskListSkeleton count={2} />}
          {list.error && <ErrorBox message={list.error} onRetry={list.reload} />}
          {list.data && list.data.length === 0 && <Empty>이 날은 할 일이 없어요</Empty>}
          {list.data?.map((t) => <TaskCard key={t.id} task={t} onToggle={actions.toggle} />)}
        </div>
      </section>
      {actions.sheets}
    </main>
  );
}
