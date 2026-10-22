import { noteHref, notesForCase } from './notes'

// 사례 상세 아래 '이 작업에 쓴 공부' — 이 사례를 '써먹은 곳'으로 가리키는 노트가 있을 때만 보인다.
export default function CaseNotes({ slug }: { slug: string }) {
  const notes = notesForCase(slug)
  if (notes.length === 0) return null

  return (
    <section aria-labelledby="case-notes-title" className="mt-16 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="case-notes-title" className="text-20 font-semibold text-main">
          이 작업에 쓴 공부
        </h2>
        <p className="text-14 break-keep text-sub">강의에서 배운 개념이 이 작업 어디에 들어갔는지 정리했어요.</p>
      </div>
      <ul className="flex flex-col rounded-card border border-regular bg-default">
        {notes.map((note) => {
          const used = note.applied?.find((applied) => applied.slug === slug)?.used
          return (
            <li key={note.slug} className="flex flex-col gap-2 border-b border-light p-5 last:border-b-0 md:flex-row md:gap-8">
              <a
                href={noteHref(note.slug)}
                className="flex shrink-0 items-start gap-2 text-14 font-semibold break-keep text-main hover:text-study-strong md:w-72"
              >
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-study" />
                <span>
                  {note.lesson} · {note.title}
                </span>
              </a>
              <p className="text-14 break-keep text-sub">{used}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
