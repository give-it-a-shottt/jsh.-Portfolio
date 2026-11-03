import { useState, type ReactNode } from 'react'
import { BookIcon, ChevronDownIcon } from '../shared/icons'
import type { CaseType } from './data'
import { NOTES, STUDY_TREE, studyHref } from './notes'

interface StudyNavProps {
  /** 지금 보고 있는 강의 — 강의 화면·노트 상세에서 그 강의 줄을 표시한다. 없으면 '공부 노트 홈'을 표시한다 */
  current?: { area: CaseType; course: string }
}

const COURSE_COUNT = new Set(NOTES.map((note) => note.course)).size

/** 노션 사이드바처럼 분야 ▸ 강의 트리. 분야는 접고 펼 수 있고, 강의를 누르면 그 강의의 노트 모음으로 간다 */
function StudyNav({ current }: StudyNavProps) {
  const [closed, setClosed] = useState<Set<CaseType>>(() => new Set())
  const toggle = (area: CaseType) =>
    setClosed((prev) => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })

  return (
    <nav aria-label="공부 노트 목차" className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-study text-white">
          <BookIcon size={14} />
        </span>
        <span className="flex flex-col">
          <span className="text-14 font-medium text-main">jsh의 공부 노트</span>
          <span className="text-12 text-sub-weak">
            노트 {NOTES.length} · 강의 {COURSE_COUNT}
          </span>
        </span>
      </div>

      <a
        href={studyHref()}
        aria-current={current ? undefined : 'page'}
        className={`rounded-sm px-2 py-1.5 text-14 ${current ? 'text-sub hover:bg-regular' : 'bg-regular font-medium text-main'}`}
      >
        공부 노트 홈
      </a>

      <p className="mt-3 px-2 pb-1 text-12 font-medium text-sub-weak">분야 · 강의</p>
      <ul className="flex flex-col gap-0.5">
        {STUDY_TREE.map(({ area, count, courses }) => {
          const open = !closed.has(area)
          return (
            <li key={area}>
              <button
                type="button"
                onClick={() => toggle(area)}
                aria-expanded={open}
                className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left hover:bg-regular"
              >
                <ChevronDownIcon
                  size={16}
                  className={`shrink-0 text-icon-sub-weak transition-transform duration-150 ${open ? '' : '-rotate-90'}`}
                />
                <span lang="en" className="flex-1 text-14 font-medium tracking-normal text-main">
                  {area}
                </span>
                <span className="text-12 text-sub-weak tabular-nums">{count}</span>
              </button>
              {open && (
                <ul className="flex flex-col gap-0.5">
                  {courses.map((item) => {
                    const active = current?.area === area && current.course === item.course
                    return (
                      <li key={item.course}>
                        <a
                          href={studyHref(item)}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center gap-1.5 rounded-sm py-1.5 pr-2 pl-7.5 text-14 ${active ? 'bg-regular font-medium text-main' : 'text-sub hover:bg-regular'}`}
                        >
                          <span className="flex-1 break-keep">{item.course}</span>
                          <span className="text-12 font-regular text-sub-weak tabular-nums">{item.notes.length}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Study 화면 틀 — 데스크톱은 왼쪽에 노션 같은 사이드바(피그마 05·06), lg 미만은 본문 위 접히는 목차.
 * 사이드바 배경은 화면 끝까지, 목차는 스크롤을 따라 내려온다.
 */
export default function StudyLayout({ current, children }: StudyNavProps & { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <aside className="hidden w-70 shrink-0 border-r border-regular bg-light lg:block">
        <div className="sticky top-0 max-h-svh overflow-y-auto px-4 pt-6 pb-10">
          <StudyNav current={current} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <details className="group border-b border-regular bg-light px-5 sm:px-10 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-14 font-medium text-main">
            분야 · 강의 목차
            <ChevronDownIcon size={16} className="text-icon-sub-weak transition-transform group-open:rotate-180" />
          </summary>
          <div className="pb-4">
            <StudyNav current={current} />
          </div>
        </details>
        {children}
      </div>
    </div>
  )
}
