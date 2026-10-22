import { TYPE_DOT_CLASS } from './data'
import NoteMeta from './NoteMeta'
import { appliedCases, noteHref, type StudyNote } from './notes'

// 작은 노트 카드 — 검색 결과 중간의 '이 키워드로 공부한 노트' 묶음과 홈의 '최근 공부 노트'에 쓴다.
// 실제로 쓴 사례가 있을 때만 맨 아래에 '써먹은 곳' 한 줄을 붙인다(없다고 표시하지 않는다).
export default function NoteCard({ note }: { note: StudyNote }) {
  const applied = appliedCases(note)[0]

  return (
    <a
      href={noteHref(note.slug)}
      className="group flex h-full flex-col rounded-card-sm border border-regular bg-default p-4 transition-colors duration-150 hover:border-black"
    >
      <NoteMeta note={note} compact />
      <h3 className="mt-2 text-16 font-semibold break-keep text-main group-hover:text-study-strong">{note.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-13 break-keep text-sub">{note.summary}</p>
      {applied && (
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-12 font-medium text-sub-weak">
          <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${TYPE_DOT_CLASS[applied.item.type]}`} />
          <span className="truncate">써먹은 곳 · {applied.item.title}</span>
        </p>
      )}
    </a>
  )
}
