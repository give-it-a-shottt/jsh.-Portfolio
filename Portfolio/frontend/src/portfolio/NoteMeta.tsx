import type { StudyNote } from './notes'

// 노트 위쪽 한 줄 — Study 배지 · 강의 · 날짜. 사례의 CaseMeta 와 같은 모양이다.
// compact 는 좁은 카드용 — 날짜를 빼서 한 줄에 들어가게 한다.
export default function NoteMeta({ note, compact = false }: { note: StudyNote; compact?: boolean }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-13 tracking-normal text-sub-weak">
      <span lang="en" className="rounded-badge bg-study-soft px-2 py-0.5 text-12 font-semibold text-study-strong">
        Study
      </span>
      <span className="font-medium">
        {note.course} · {note.lesson}
      </span>
      {!compact && (
        <>
          <span aria-hidden="true">·</span>
          <span>{note.date}</span>
        </>
      )}
    </p>
  )
}
