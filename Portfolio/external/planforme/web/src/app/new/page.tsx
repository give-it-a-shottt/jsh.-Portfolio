"use client";

import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { DateField, WeekdayPicker } from "@/components/PlanFields";
import { PreviewSkeleton } from "@/components/Skeleton";
import { Button, Chip, Field, Stepper, TextInput, TypeIcon, cx } from "@/components/ui";
import { api } from "@/lib/api";
import {
  addDays,
  diffDays,
  fmtDot,
  fmtMonthDayShort,
  fmtSlash,
  rangeText,
  weekdayName,
} from "@/lib/format";
import type { PlanInput, PlanType, Preview } from "@/lib/types";
import { useToday } from "@/lib/useToday";

const TYPES: { type: PlanType; title: string; desc: string; appBar: string }[] = [
  { type: "book", title: "책 (독서)", desc: "현재 · 마지막 페이지로 하루 분량 계산", appBar: "책 플랜" },
  { type: "lecture", title: "동영상 강의", desc: "강의 수 · 평균 길이로 하루 강의 수 계산", appBar: "강의 플랜" },
  { type: "routine", title: "일반 (매일 공부)", desc: "분량 없이 매일 할 일을 루틴으로 등록", appBar: "일반 플랜" },
];
const MINUTES = [10, 20, 30, 40, 50, 60];
const ROUTINE_EXAMPLES = ["알고리즘 1문제", "영단어 30개", "강의 복습 30분"];
const EVERYDAY = [0, 1, 2, 3, 4, 5, 6];

interface Form {
  type: PlanType | null;
  title: string;
  currentPage: string;
  lastPage: string;
  totalLectures: string;
  avgMinutes: number;
  start: string;
  end: string;
  weekdays: number[];
}

const num = (s: string) => (s === "" ? NaN : Number(s));

function toInput(f: Form): PlanInput {
  const base = { type: f.type!, title: f.title.trim(), start_date: f.start, end_date: f.end, weekdays: f.weekdays };
  if (f.type === "book") return { ...base, current_page: num(f.currentPage), last_page: num(f.lastPage) };
  if (f.type === "lecture") return { ...base, total_lectures: num(f.totalLectures), avg_minutes: f.avgMinutes };
  return base;
}

/** 2단계 입력 검증: 틀린 이유를 문장으로 돌려준다 (없으면 null) */
function validate(f: Form): string | null {
  if (!f.title.trim()) return f.type === "routine" ? "할 일을 입력해 주세요" : "제목을 입력해 주세요";
  if (f.type === "book") {
    const cur = num(f.currentPage);
    const last = num(f.lastPage);
    if (!(cur >= 1) || !(last >= 1)) return "페이지를 입력해 주세요";
    if (last < cur) return "마지막 페이지는 현재 페이지보다 크거나 같아야 해요";
  }
  if (f.type === "lecture" && !(num(f.totalLectures) >= 1)) return "총 강의 수를 입력해 주세요";
  if (f.end < f.start) return "종료일은 시작일보다 같거나 늦어야 해요";
  if (f.weekdays.length === 0) return "수행 요일을 하루 이상 골라 주세요";
  return null;
}

export default function NewPlanPage() {
  const today = useToday();
  if (!today) return null;
  return <NewPlan today={today} />;
}

function emptyForm(today: string): Form {
  return {
    type: null,
    title: "",
    currentPage: "1",
    lastPage: "",
    totalLectures: "",
    avgMinutes: 30,
    start: today,
    end: addDays(today, 27),
    weekdays: EVERYDAY,
  };
}

function NewPlan({ today }: { today: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(() => emptyForm(today));
  const [sliderMax, setSliderMax] = useState(56);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));
  const meta = TYPES.find((t) => t.type === form.type);

  // Next 16은 떠난 화면을 숨겨 두고(Activity) 다시 보여 준다.
  // 등록을 끝냈거나 닫았을 때는 다음에 처음부터 시작하도록 직접 초기화한다.
  function reset() {
    setStep(1);
    setForm(emptyForm(today));
  }

  function close() {
    reset();
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  function selectType(type: PlanType) {
    set({ type, weekdays: type === "book" ? [0, 1, 2, 3, 4] : EVERYDAY });
  }

  function goPreview() {
    setSliderMax(Math.max(28, diffDays(form.end, form.start) * 2));
    setStep(3);
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <AppBar
        title={step === 1 ? "새 플랜 만들기" : step === 2 ? (meta?.appBar ?? "") : "계산 결과"}
        icon={step === 1 ? "close" : "back"}
        onBack={step === 1 ? close : () => setStep(step - 1)}
      />
      <Stepper step={step} />

      {step === 1 && (
        <StepLayout
          label="1 / 3"
          title="어떤 목표를 세울까요?"
          desc="유형에 맞게 꼭 필요한 정보만 물어볼게요"
          footer={
            <Button disabled={!form.type} onClick={() => setStep(2)}>
              다음
            </Button>
          }
        >
          <div className="space-y-3">
            {TYPES.map((t) => {
              const active = form.type === t.type;
              return (
                <button
                  key={t.type}
                  onClick={() => selectType(t.type)}
                  className={cx(
                    "glass-card flex w-full items-center gap-4 p-5 text-left transition",
                    active && "border-glass-border-green! bg-glass-elevated shadow-primary",
                  )}
                >
                  <TypeIcon type={t.type} active={active} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-semibold">{t.title}</span>
                    <span className="mt-1 block text-[13px] text-text-sub">{t.desc}</span>
                  </span>
                  <span
                    className={cx(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                      active ? "border-primary" : "border-line-regular",
                    )}
                  >
                    {active && <span className="size-3 rounded-full bg-primary" />}
                  </span>
                </button>
              );
            })}
          </div>
        </StepLayout>
      )}

      {step === 2 && form.type && <DetailStep form={form} set={set} onNext={goPreview} />}

      {step === 3 && form.type && (
        <PreviewStep
          form={form}
          set={set}
          sliderMax={sliderMax}
          setSliderMax={setSliderMax}
          onDone={() => {
            reset();
            router.replace("/");
          }}
        />
      )}
    </main>
  );
}

function StepLayout({
  label,
  title,
  desc,
  children,
  footer,
}: {
  label: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 px-5 pt-7">
        <p className="text-[13px] font-medium">{label}</p>
        <h2 className="mt-1 whitespace-pre-line text-[24px] font-semibold leading-[1.4]">{title}</h2>
        <p className="mt-2 text-[14px] text-text-sub">{desc}</p>
        <div className="mt-7">{children}</div>
      </div>
      <div className="sticky bottom-0 bg-linear-to-t from-bg-light from-70% to-transparent px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-6">
        {footer}
      </div>
    </>
  );
}

function DetailStep({ form, set, onNext }: { form: Form; set: (p: Partial<Form>) => void; onNext: () => void }) {
  const error = validate(form);
  const digits = (v: string) => v.replace(/\D/g, "");
  const copy = {
    book: ["책 정보를 알려주세요", "현재 페이지와 마지막 페이지만 있으면 돼요"],
    lecture: ["강의 정보를 알려주세요", "총 강의 수와 1강당 평균 길이로 계산해요"],
    routine: ["매일 할 일을 알려주세요", "분량 계산 없이 선택한 요일마다 할 일이 등록돼요"],
  }[form.type!];

  return (
    <StepLayout
      label="2 / 3"
      title={copy[0]}
      desc={copy[1]}
      footer={
        <>
          {error && <p className="mb-2 text-center text-[12px] text-text-sub-weak">{error}</p>}
          <Button disabled={!!error} onClick={onNext}>
            계산 결과 보기
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {form.type === "book" && (
          <>
            <Field label="책 제목">
              <TextInput value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="예: 모던 자바스크립트 Deep Dive" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="현재 페이지">
                <TextInput inputMode="numeric" suffix="p" value={form.currentPage} onChange={(e) => set({ currentPage: digits(e.target.value) })} />
              </Field>
              <Field label="마지막 페이지">
                <TextInput inputMode="numeric" suffix="p" value={form.lastPage} onChange={(e) => set({ lastPage: digits(e.target.value) })} placeholder="350" />
              </Field>
            </div>
          </>
        )}

        {form.type === "lecture" && (
          <>
            <Field label="강의명">
              <TextInput value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="예: React 완벽 가이드" />
            </Field>
            <Field label="총 강의 수">
              <TextInput inputMode="numeric" suffix="강" value={form.totalLectures} onChange={(e) => set({ totalLectures: digits(e.target.value) })} placeholder="45" />
            </Field>
            <div>
              <span className="mb-2 block text-[13px] font-medium">1강당 평균 길이</span>
              <div className="flex flex-wrap gap-2">
                {MINUTES.map((m) => (
                  <Chip key={m} selected={form.avgMinutes === m} onClick={() => set({ avgMinutes: m })}>
                    {m}분
                  </Chip>
                ))}
              </div>
            </div>
          </>
        )}

        {form.type === "routine" && (
          <Field label="할 일">
            <TextInput value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="예: 영단어 30개 암기" />
            <div className="mt-3 flex flex-wrap gap-2">
              {ROUTINE_EXAMPLES.map((ex) => (
                <Chip key={ex} onClick={() => set({ title: ex })}>
                  {ex}
                </Chip>
              ))}
            </div>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <DateField label="시작일" value={form.start} onChange={(v) => set({ start: v, end: form.end < v ? v : form.end })} />
          <DateField label="종료일" value={form.end} min={form.start} onChange={(v) => set({ end: v })} />
        </div>
        <WeekdayPicker value={form.weekdays} onChange={(weekdays) => set({ weekdays })} />
      </div>
    </StepLayout>
  );
}

function PreviewStep({
  form,
  set,
  sliderMax,
  setSliderMax,
  onDone,
}: {
  form: Form;
  set: (p: Partial<Form>) => void;
  sliderMax: number;
  setSliderMax: (n: number) => void;
  onDone: () => void;
}) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const input = toInput(form);
  const inputKey = JSON.stringify(input);

  // 종료일 · 요일을 바꾸면 300ms 뒤에 다시 계산한다 (실시간 계산 프리뷰)
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api
        .preview(JSON.parse(inputKey))
        .then((p) => {
          if (cancelled) return;
          setPreview(p);
          setError(null);
        })
        .catch((e: Error) => {
          if (cancelled) return;
          setPreview(null);
          setError(e.message);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inputKey]);

  async function save() {
    setSaving(true);
    try {
      await api.createPlan(input);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록에 실패했어요");
      setSaving(false);
    }
  }

  function extend(weeks: number) {
    const end = addDays(form.end, weeks * 7);
    setSliderMax(Math.max(sliderMax, diffDays(end, form.start)));
    set({ end });
  }

  const type = form.type!;
  const p = preview;
  const allDays = form.weekdays.length === 7;
  const basis = p ? (allDays ? `매일 · ${p.valid_days}일` : `주 ${form.weekdays.length}일 · ${weekdayName(form.weekdays)}`) : "";

  let headline = "계산 중...";
  let unit = "";
  let sub = "";
  let lastDay = "";
  if (p) {
    if (type === "book") {
      headline = `하루 ${p.daily_amount}페이지씩 읽으면\n완독해요!`;
      unit = "페이지";
      sub = `${weekdayName(form.weekdays)} ${p.valid_days}일 · 총 ${p.total_amount}페이지`;
      lastDay = `${p.last_day_amount}페이지${p.last_day_amount < p.daily_amount ? "만" : ""} 읽으면 끝`;
    } else if (type === "lecture") {
      headline = p.overload ? `하루 ${p.daily_amount}강씩 들어야\n완강할 수 있어요` : `하루 ${p.daily_amount}강씩 들으면\n완강해요!`;
      unit = "강";
      sub = `약 ${p.daily_minutes}분 · ${form.avgMinutes}분 × ${p.daily_amount}강`;
      lastDay = `${p.last_day_amount}강${p.last_day_amount < p.daily_amount ? "만" : ""} 들으면 끝`;
    } else {
      headline = `종료일까지 총 ${p.valid_days}회\n수행하는 루틴이에요!`;
      unit = "회";
      sub = `${weekdayName(form.weekdays)} · 총 ${p.valid_days}회`;
    }
  }

  return (
    <StepLayout
      label="계산 완료"
      title={headline}
      desc={p ? `${basis} 기준으로 나눴어요` : ""}
      footer={
        <div className="space-y-2">
          {error && <p className="text-center text-[12px] text-[#D92D20]">{error}</p>}
          {p?.overload && p.extend_weeks && (
            <Button variant="outline" onClick={() => extend(p.extend_weeks!)}>
              종료일 {p.extend_weeks}주 늘리기
            </Button>
          )}
          <Button disabled={!p || saving} onClick={save}>
            {p?.overload ? "이대로 등록하기" : "플랜 등록하기"}
          </Button>
        </div>
      }
    >
      {p?.overload && (
        <div className="mb-4 flex gap-3 rounded-card bg-[#FFF4D6] p-4 text-[#5C3D00]">
          <CircleAlert size={20} className="mt-0.5 shrink-0 text-[#E5A000]" />
          <div>
            <p className="text-[14px] font-semibold">하루 공부량이 조금 많아요!</p>
            {p.extend_weeks && p.extend_daily && (
              <p className="mt-1 text-[12px]">
                종료일을 {p.extend_weeks}주만 늘리면 하루 {p.extend_daily}강(약 {p.extend_daily * form.avgMinutes}분)이 돼요.
              </p>
            )}
          </div>
        </div>
      )}

      {!p && !error && <PreviewSkeleton />}
      {p && (
        <div className="glass-card border-glass-border-green! p-6">
          <p className="text-[14px] font-medium">하루 할당량</p>
          <p className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[52px] font-semibold leading-none text-primary">{type === "routine" ? 1 : p.daily_amount}</span>
            <span className="text-[20px] font-semibold">{unit}</span>
          </p>
          <p className="mt-3 text-[13px] text-text-sub">{sub}</p>
          <div className="my-4 h-px bg-line-regular" />
          <dl className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-text-sub">기간</dt>
              <dd className="font-semibold">
                {fmtDot(form.start)} ~ {fmtDot(form.end)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-sub">수행 요일</dt>
              <dd className="font-semibold">{weekdayName(form.weekdays, true)}</dd>
            </div>
            {lastDay && (
              <div className="flex justify-between">
                <dt className="text-text-sub">마지막 날</dt>
                <dd className="font-semibold">{lastDay}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium">종료일 조정</span>
          <span className="text-[14px] font-semibold text-primary">{fmtMonthDayShort(form.end)}</span>
        </div>
        <input
          type="range"
          aria-label="종료일 조정"
          min={0}
          max={sliderMax}
          value={diffDays(form.end, form.start)}
          onChange={(e) => set({ end: addDays(form.start, Number(e.target.value)) })}
          className="mt-4 w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-[12px] text-text-sub-weak">
          <span>빨리 끝내기</span>
          <span>여유 있게</span>
        </div>
      </div>

      {p && type !== "routine" && p.first_week.length > 0 && (
        <div className="mt-7">
          <p className="text-[14px] font-medium">첫 주 미리보기</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {p.first_week.map((d) => (
              <div key={d.date} className="glass-card rounded-inner! px-1 py-3 text-center">
                <p className="text-[11px] text-text-sub-weak">{fmtSlash(d.date)}</p>
                <p className="mt-1 text-[13px] font-semibold">{rangeText(type, d.target_start, d.target_end, "~").replace(/p~/, "~").replace(/강~/, "~")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </StepLayout>
  );
}
