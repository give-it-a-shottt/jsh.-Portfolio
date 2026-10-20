"""DB를 다루는 비즈니스 로직: 플랜 생성, 진도 계산, 재계산, 완료 처리."""

from datetime import date, timedelta

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

import planner
from models import DailyTask, Plan
from schemas import PlanInput, PlanOut, PreviewOut, ReplanSuggestion, ScheduleItemOut, TaskOut
from timeutil import now_kst


class PlanError(ValueError):
    pass


# ---------- 생성 / 프리뷰 ----------


def _units_of(data: PlanInput) -> tuple[int | None, int | None]:
    if data.type == "book":
        return data.current_page, data.last_page
    if data.type == "lecture":
        return 1, data.total_lectures
    return None, None


def _schedule_for(data: PlanInput) -> tuple[list[date], list[planner.ScheduleItem], int]:
    days = planner.valid_days(data.start_date, data.end_date, set(data.weekdays))
    if not days:
        raise PlanError("기간 안에 선택한 요일이 하루도 없어요")
    start_unit, end_unit = _units_of(data)
    if data.type == "routine":
        return days, planner.build_routine_schedule(days), len(days)
    total = end_unit - start_unit + 1
    return days, planner.build_unit_schedule(start_unit, total, days), total


def preview(data: PlanInput) -> PreviewOut:
    days, schedule, total = _schedule_for(data)
    daily = 1 if data.type == "routine" else planner.daily_of(total, len(days))
    minutes = daily * data.avg_minutes if data.type == "lecture" else None
    overload = minutes is not None and minutes >= planner.OVERLOAD_MINUTES
    ext = (
        planner.overload_extension(total, data.start_date, data.end_date, set(data.weekdays), data.avg_minutes)
        if overload
        else None
    )
    return PreviewOut(
        valid_days=len(days),
        total_amount=total,
        daily_amount=daily,
        last_day_amount=schedule[-1].amount if schedule else 0,
        daily_minutes=minutes,
        overload=overload,
        extend_weeks=ext[0] if ext else None,
        extend_daily=ext[1] if ext else None,
        first_week=[ScheduleItemOut(**vars(s)) for s in schedule[:5]],
    )


def create_plan(db: Session, data: PlanInput) -> Plan:
    days, schedule, total = _schedule_for(data)
    start_unit, end_unit = _units_of(data)
    plan = Plan(
        type=data.type,
        title=data.title.strip(),
        start_date=data.start_date,
        end_date=data.end_date,
        weekdays=",".join(str(w) for w in sorted(set(data.weekdays))),
        status="active",
        start_unit=start_unit,
        end_unit=end_unit,
        avg_minutes=data.avg_minutes if data.type == "lecture" else None,
        daily_amount=1 if data.type == "routine" else planner.daily_of(total, len(days)),
    )
    plan.tasks = [_task_from(s) for s in schedule]
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


def _task_from(s: planner.ScheduleItem) -> DailyTask:
    return DailyTask(date=s.date, target_start=s.target_start, target_end=s.target_end, target_amount=s.amount)


# ---------- 진도 ----------


def total_amount(plan: Plan) -> int:
    if plan.type == "routine":
        return len(plan.tasks)
    return plan.end_unit - plan.start_unit + 1


def position(plan: Plan) -> int | None:
    """책/강의: 지금까지 실제로 도달한 페이지/강. 기록이 없으면 시작 직전 값."""
    if plan.type == "routine":
        return None
    reached = [t.actual_end for t in plan.tasks if t.actual_end is not None]
    return max(reached, default=plan.start_unit - 1)


def done_amount(plan: Plan) -> int:
    if plan.type == "routine":
        return sum(1 for t in plan.tasks if t.done)
    return max(0, min(total_amount(plan), position(plan) - (plan.start_unit - 1)))


def replan_start(plan: Plan, today: date) -> date:
    """재계산 시작일: 오늘 할 일을 이미 끝냈으면 내일부터, 아니면 오늘부터."""
    today_tasks = [t for t in plan.tasks if t.date == today]
    start = today + timedelta(days=1) if today_tasks and all(t.done for t in today_tasks) else today
    return max(start, plan.start_date)


def remaining_days(plan: Plan, start_from: date) -> list[date]:
    done_dates = {t.date for t in plan.tasks if t.done and t.date >= start_from}
    return planner.valid_days(start_from, plan.end_date, plan.weekday_set, exclude=done_dates)


def plan_out(plan: Plan, today: date) -> PlanOut:
    total = total_amount(plan)
    done = done_amount(plan)
    return PlanOut(
        id=plan.id,
        type=plan.type,
        title=plan.title,
        start_date=plan.start_date,
        end_date=plan.end_date,
        weekdays=sorted(plan.weekday_set),
        status=plan.status,
        start_unit=plan.start_unit,
        end_unit=plan.end_unit,
        avg_minutes=plan.avg_minutes,
        daily_amount=plan.daily_amount,
        position=position(plan),
        done_amount=done,
        total_amount=total,
        progress=round(done / total * 100) if total else 0,
        remaining_amount=total - done,
        remaining_days=len(remaining_days(plan, replan_start(plan, today))),
        d_day=(plan.end_date - today).days,
    )


def task_out(task: DailyTask) -> TaskOut:
    plan = task.plan
    routine_index = routine_total = None
    if plan.type == "routine":
        ids = [t.id for t in plan.tasks]
        routine_index = ids.index(task.id) + 1
        routine_total = len(ids)
    return TaskOut(
        id=task.id,
        plan_id=plan.id,
        plan_type=plan.type,
        plan_title=plan.title,
        date=task.date,
        target_start=task.target_start,
        target_end=task.target_end,
        target_amount=task.target_amount,
        actual_end=task.actual_end,
        done=task.done,
        completed_at=task.completed_at,
        avg_minutes=plan.avg_minutes,
        routine_index=routine_index,
        routine_total=routine_total,
    )


# ---------- 재계산 (Re-plan) ----------


def suggestion(plan: Plan, today: date) -> ReplanSuggestion:
    start_from = replan_start(plan, today)
    days = remaining_days(plan, start_from)
    remaining = total_amount(plan) - done_amount(plan)
    return ReplanSuggestion(
        plan_id=plan.id,
        plan_type=plan.type,
        plan_title=plan.title,
        remaining_amount=remaining,
        remaining_days=len(days),
        current_daily=plan.daily_amount,
        new_daily=planner.daily_of(remaining, len(days)),
        start_from=start_from,
        end_date=plan.end_date,
        weekdays=sorted(plan.weekday_set),
    )


def apply_replan(db: Session, plan: Plan, today: date) -> Plan:
    """남은 분량 ÷ 남은 유효 일수로 다시 나눈다. 시작일 이전 기록과 완료한 기록은 그대로 둔다."""
    start_from = replan_start(plan, today)
    days = remaining_days(plan, start_from)
    plan.rebased_on = start_from

    if plan.type == "routine":
        _delete_open_tasks(db, plan, start_from)
        plan.tasks.extend(_task_from(s) for s in planner.build_routine_schedule(days))
        db.commit()
        db.refresh(plan)
        return plan

    remaining = total_amount(plan) - done_amount(plan)
    if remaining <= 0:
        _delete_open_tasks(db, plan, start_from)
        plan.status = "done"
        db.commit()
        return plan
    if not days:
        raise PlanError("남은 유효 일수가 없어요. 종료일을 늘려 주세요")

    _delete_open_tasks(db, plan, start_from)
    schedule = planner.build_unit_schedule(position(plan) + 1, remaining, days)
    plan.tasks.extend(_task_from(s) for s in schedule)
    plan.daily_amount = planner.daily_of(remaining, len(days))
    db.commit()
    db.refresh(plan)
    return plan


def _delete_open_tasks(db: Session, plan: Plan, start_from: date) -> None:
    for t in list(plan.tasks):
        if t.date >= start_from and not t.done:
            plan.tasks.remove(t)
            db.delete(t)
    db.flush()


# ---------- 완료 처리 ----------


def complete_task(db: Session, task: DailyTask, actual_end: int | None, today: date):
    plan = task.plan
    diff = None
    if plan.type != "routine":
        if actual_end is None:
            actual_end = task.target_end
        if actual_end < plan.start_unit - 1 or actual_end > plan.end_unit:
            unit = "페이지" if plan.type == "book" else "강"
            raise PlanError(f"{plan.start_unit - 1}~{plan.end_unit}{unit} 사이로 입력해 주세요")
        task.actual_end = actual_end
        diff = actual_end - task.target_end
    task.done = True
    task.completed_at = now_kst()
    db.flush()

    if done_amount(plan) >= total_amount(plan):
        plan.status = "done"
        if plan.type != "routine":
            _delete_open_tasks(db, plan, task.date + timedelta(days=1))
    db.commit()
    db.refresh(task)

    sugg = None
    if diff and plan.status == "active":
        sugg = suggestion(plan, today)
    return task, diff, sugg


def uncomplete_task(db: Session, task: DailyTask) -> DailyTask:
    task.done = False
    task.actual_end = None
    task.completed_at = None
    if task.plan.status == "done":
        task.plan.status = "active"
    db.commit()
    db.refresh(task)
    return task


def get_plan(db: Session, plan_id: int) -> Plan | None:
    return db.get(Plan, plan_id)


def overdue_tasks(db: Session, today: date) -> list[DailyTask]:
    """밀린 할 일: 진행 중인 책/강의 플랜에서 오늘 이전인데 안 끝낸 것 (마지막 재계산 이후만)."""
    stmt = (
        select(DailyTask)
        .join(Plan)
        .where(
            DailyTask.date < today,
            DailyTask.done.is_(False),
            Plan.status == "active",
            Plan.type != "routine",
            or_(Plan.rebased_on.is_(None), DailyTask.date >= Plan.rebased_on),
        )
        .order_by(DailyTask.date)
    )
    return list(db.scalars(stmt))


def tasks_on(db: Session, day: date, include_paused: bool = False) -> list[DailyTask]:
    stmt = select(DailyTask).join(Plan).where(DailyTask.date == day).order_by(DailyTask.done, Plan.id)
    if not include_paused:
        stmt = stmt.where(Plan.status != "paused")
    return list(db.scalars(stmt))
