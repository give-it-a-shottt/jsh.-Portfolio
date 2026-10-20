"use client";

import { ChevronRight, RotateCw } from "lucide-react";
import { useCallback, useLayoutEffect, useState } from "react";
import { api } from "@/lib/api";
import { addDays, fmtDot, fmtMonthDayShort, TYPE_LABEL, todayISO, UNIT, UNIT_LONG, weekdayName } from "@/lib/format";
import type { ReplanSuggestion, Task } from "@/lib/types";
import { BottomSheet } from "./BottomSheet";
import { Button, TextInput, TypeIcon } from "./ui";

type ReplanState = { suggestion: ReplanSuggestion; diff: number | null };

/**
 * 할 일 체크 · 실제 진행량 입력 · 재계산 제안을 한 곳에서 처리한다 (User Flow B).
 * 홈, 캘린더, 알림, 플랜 상세에서 같이 쓴다.
 */
export function useTaskActions(onChanged: () => void) {
  const [progressTask, setProgressTask] = useState<Task | null>(null);
  const [replan, setReplan] = useState<ReplanState | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 화면을 떠나면(Activity로 숨겨지면) 열려 있던 바텀시트를 닫아 둔다
  useLayoutEffect(
    () => () => {
      setProgressTask(null);
      setReplan(null);
    },
    [],
  );

  const showError = useCallback((e: unknown) => {
    setToast(e instanceof Error ? e.message : "요청에 실패했어요");
    setTimeout(() => setToast(null), 3000);
  }, []);

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      setBusy(true);
      try {
        await fn();
      } catch (e) {
        showError(e);
      } finally {
        setBusy(false);
      }
    },
    [showError],
  );

  const toggle = useCallback(
    (task: Task) =>
      run(async () => {
        if (task.done) {
          await api.uncomplete(task.id);
          onChanged();
        } else if (task.plan_type === "routine") {
          await api.complete(task.id);
          onChanged();
        } else {
          setProgressTask(task); // 책/강의는 실제 진행량을 먼저 묻는다
        }
      }),
    [run, onChanged],
  );

  const submitProgress = (actualEnd?: number) =>
    run(async () => {
      if (!progressTask) return;
      const result = await api.complete(progressTask.id, actualEnd);
      setProgressTask(null);
      onChanged();
      if (result.suggestion) setReplan({ suggestion: result.suggestion, diff: result.diff });
    });

  const openReplan = useCallback(
    (planId: number) =>
      run(async () => {
        setReplan({ suggestion: await api.replanSuggestion(planId), diff: null });
      }),
    [run],
  );

  const confirmReplan = () =>
    run(async () => {
      if (!replan) return;
      await api.replan(replan.suggestion.plan_id);
      setReplan(null);
      onChanged();
    });

  const sheets = (
    <>
      <BottomSheet open={!!progressTask} onClose={() => setProgressTask(null)}>
        {progressTask && <ProgressForm key={progressTask.id} task={progressTask} busy={busy} onSubmit={submitProgress} />}
      </BottomSheet>
      <BottomSheet open={!!replan} onClose={() => setReplan(null)}>
        {replan && <ReplanContent {...replan} busy={busy} onConfirm={confirmReplan} onKeep={() => setReplan(null)} />}
      </BottomSheet>
      {toast && (
        <div className="fixed inset-x-0 top-4 z-60 mx-auto w-fit max-w-[90%] rounded-full bg-text-main px-4 py-2 text-[13px] text-white shadow-glass">
          {toast}
        </div>
      )}
    </>
  );

  return { toggle, openReplan, sheets, busy };
}

function ProgressForm({ task, busy, onSubmit }: { task: Task; busy: boolean; onSubmit: (actualEnd?: number) => void }) {
  const [value, setValue] = useState("");
  const isBook = task.plan_type === "book";
  const unit = UNIT[task.plan_type];
  const unitLong = UNIT_LONG[task.plan_type];
  const target = task.target_end ?? 0;
  const num = value === "" ? null : Number(value);
  const diff = num == null || Number.isNaN(num) ? null : num - target;
  const verb = isBook ? "읽었어요" : "들었어요";

  return (
    <div>
      <div className="flex items-center gap-3">
        <TypeIcon type={task.plan_type} />
        <div className="min-w-0">
          <p className="truncate text-[13px] text-text-sub">
            {TYPE_LABEL[task.plan_type]} · {task.plan_title}
          </p>
          <p className="text-[19px] font-semibold">{isBook ? "오늘 몇 페이지까지 읽었나요?" : "오늘 몇 강까지 들었나요?"}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-inner bg-glass-sub px-4 py-4 text-[14px]">
        <span className="text-text-sub">오늘 목표</span>
        <span className="font-semibold">
          {task.target_start}
          {unit} → {task.target_end}
          {unit} ({task.target_amount}
          {unitLong})
        </span>
      </div>

      <Button className="mt-4" disabled={busy} onClick={() => onSubmit()}>
        목표대로 완료했어요 · {target}
        {unit}
      </Button>

      <div className="my-5 flex items-center gap-3 text-[12px] text-text-sub-weak">
        <div className="h-px flex-1 bg-line-regular" />
        {isBook ? "다르게 읽었다면" : "다르게 들었다면"}
        <div className="h-px flex-1 bg-line-regular" />
      </div>

      <p className="mb-2 text-[13px] font-medium">{isBook ? "읽은 마지막 페이지" : "들은 마지막 강"}</p>
      <TextInput
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
        placeholder={String(target)}
        suffix={unit}
      />
      {diff != null && diff !== 0 && (
        <p className="mt-3 text-[12px] text-text-sub">
          목표보다 {Math.abs(diff)}
          {unitLong} {diff < 0 ? "덜" : "더"} {verb}. 저장하면 재계산을 제안해 드려요.
        </p>
      )}
      <Button variant="outline" className="mt-4" disabled={busy || num == null} onClick={() => num != null && onSubmit(num)}>
        {isBook ? "이 페이지로 기록하기" : "이 강까지 기록하기"}
      </Button>
    </div>
  );
}

function startLabel(startFrom: string) {
  const today = todayISO();
  if (startFrom === today) return "오늘부터";
  if (startFrom === addDays(today, 1)) return "내일부터";
  return `${fmtMonthDayShort(startFrom)}부터`;
}

function ReplanContent({
  suggestion: s,
  diff,
  busy,
  onConfirm,
  onKeep,
}: ReplanState & { busy: boolean; onConfirm: () => void; onKeep: () => void }) {
  const unit = UNIT[s.plan_type];
  const unitLong = UNIT_LONG[s.plan_type];
  const verb = s.plan_type === "book" ? "읽으셨네요" : "들으셨네요";
  const particle = s.plan_type === "book" ? "를" : "을";
  const from = startLabel(s.start_from);
  const finished = s.remaining_amount <= 0;
  const noDays = !finished && s.remaining_days === 0;

  const title =
    diff == null || diff === 0
      ? "남은 일정을 다시 나눌까요?"
      : `목표보다 ${Math.abs(diff)}${unitLong} ${diff < 0 ? "덜" : "더"} ${verb}`;

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-inner bg-primary-glass text-primary">
        <RotateCw size={26} />
      </div>
      <h2 className="mt-4 text-[20px] font-semibold">{title}</h2>
      <p className="mt-2 whitespace-pre-line text-[14px] text-text-sub">
        {finished
          ? "남은 분량이 없어요. 플랜을 완료로 바꿀게요."
          : noDays
            ? "남은 유효 일수가 없어요.\n플랜 상세에서 종료일을 늘려 주세요."
            : `남은 ${s.remaining_amount}${unitLong}${particle} 종료일에 맞춰\n${from} 다시 똑같이 나눌까요?`}
      </p>

      {!finished && !noDays && (
        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1 rounded-card bg-glass-sub py-4">
            <p className="text-[12px] text-text-sub-weak">지금</p>
            <p className="mt-1 text-[20px] font-semibold">
              하루 {s.current_daily}
              {unit}
            </p>
          </div>
          <ChevronRight className="shrink-0 text-icon-sub-weak" size={20} />
          <div className="flex-1 rounded-card border border-glass-border-green bg-primary-glass py-4">
            <p className="text-[12px] text-text-sub-weak">{from}</p>
            <p className="mt-1 text-[20px] font-semibold text-primary">
              하루 {s.new_daily}
              {unit}
            </p>
          </div>
        </div>
      )}

      <dl className="mt-5 space-y-3 text-[14px]">
        <Row label="남은 분량" value={`${Math.max(0, s.remaining_amount)}${unitLong}`} />
        <Row label="남은 유효 일수" value={`${s.remaining_days}일 (${weekdayName(s.weekdays)})`} />
        <Row label="종료일" value={`${fmtDot(s.end_date)} 그대로`} />
      </dl>

      <Button className="mt-6" disabled={busy || noDays} onClick={onConfirm}>
        {finished ? "완료 처리하기" : "네, 다시 계산해 주세요"}
      </Button>
      <Button variant="ghost" className="mt-1" onClick={onKeep}>
        기존 계획 유지할게요
      </Button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-sub">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
