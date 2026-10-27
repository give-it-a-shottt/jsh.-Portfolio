import { useCallback, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ChevronRightIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import NoteMeta from './NoteMeta'
import Lightbox from './Lightbox'
import { appliedCases, noteHref, NOTES, type StudyPractice } from './notes'
import { searchHref } from './routes'

const STUDY_LIST_HREF = searchHref('', 'study')

function BackLink() {
  return (
    <a href={STUDY_LIST_HREF} className="flex w-fit items-center gap-1 text-14 font-medium text-sub hover:text-main">
      <ChevronRightIcon size={16} className="rotate-180" />
      <span>
        <span lang="en">Study</span> 노트 목록
      </span>
    </a>
  )
}

interface ImageGalleryProps {
  id: string
  title: string
  description: string
  items: StudyPractice[]
}

/** 이미지 카드 목록 — 누르면 라이트박스로 크게 띄우고 같은 목록 안을 넘겨 본다(Design 사례와 같은 뷰어) */
function ImageGallery({ id, title, description, items }: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setOpenIndex(null), [])
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} className="mt-12 scroll-mt-6">
      <h2 id={titleId} className="text-20 font-semibold text-main">
        {title}
      </h2>
      <p className="mt-1 text-14 text-sub">{description}</p>
      <ul className={`mt-4 grid gap-4 ${items.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {items.map(({ image, caption, how }, index) => (
          <li key={caption} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`${caption} 크게 보기`}
              className="block cursor-zoom-in overflow-hidden rounded-thumb border border-regular bg-regular"
            >
              <img
                src={image}
                alt={caption}
                loading="lazy"
                // 한 장뿐이면(가로로 긴 배너 등) 자르지 않고 그대로
                className={items.length > 1 ? 'aspect-4/3 w-full object-cover' : 'h-auto w-full'}
              />
            </button>
            <div className="flex flex-col gap-0.5 px-1">
              <p className="text-14 font-medium break-keep text-main">{caption}</p>
              <p className="text-12 break-keep text-sub-weak">{how}</p>
            </div>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Lightbox
          title={title}
          items={items.map(({ image, caption, how }) => ({ label: caption, image, note: how }))}
          index={openIndex}
          onIndex={setOpenIndex}
          onClose={closeLightbox}
        />
      )}
    </section>
  )
}

interface StudyDetailProps {
  slug: string
}

/**
 * 공부 노트 상세 — 핵심 요약 → 배운 것 → 실습 결과물 · 참고 예시(있을 때) → 써먹은 곳(실제로 쓴 사례가 있을 때).
 * 데스크톱은 8 + 4 단으로 오른쪽에 목차와 같은 강의의 노트가 따라 내려온다.
 */
export default function StudyDetail({ slug }: StudyDetailProps) {
  const reduceMotion = useReducedMotion()
  const index = NOTES.findIndex((candidate) => candidate.slug === slug)
  const note = NOTES[index]

  if (!note) {
    return (
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-2 px-5 pt-16 pb-20 sm:px-10">
        <h1 className="text-20 font-semibold break-keep text-main">노트를 찾을 수 없어요.</h1>
        <p className="text-14 text-sub">주소가 바뀌었거나 아직 올리지 않은 노트예요.</p>
        <div className="mt-4">
          <BackLink />
        </div>
      </main>
    )
  }

  const applied = appliedCases(note)
  const practice = note.practice ?? []
  const examples = note.examples ?? []
  // NOTES 는 최신순 — 이전 노트는 더 오래된 쪽
  const older = NOTES[index + 1]
  const newer = NOTES[index - 1]
  const sameCourse = NOTES.filter((candidate) => candidate.course === note.course && candidate.slug !== note.slug)
  const toc = [
    { id: 'note-summary', label: '핵심 요약' },
    ...(note.learned.length > 0 ? [{ id: 'note-learned', label: '배운 것' }] : []),
    ...(practice.length > 0 ? [{ id: 'note-practice', label: '내 실습 결과물' }] : []),
    ...(examples.length > 0 ? [{ id: 'note-examples', label: '참고 예시' }] : []),
    ...(applied.length > 0 ? [{ id: 'note-applied', label: '써먹은 곳' }] : []),
  ]
  // 해시 라우팅이라 '#아이디' 링크 대신 스크롤로 옮긴다
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })

  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col px-5 pt-6 pb-20 sm:px-10">
      <BackLink />

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-6">
        <article className="flex min-w-0 flex-col">
          <header className="flex flex-col">
            <NoteMeta note={note} />
            <h1 className="mt-3 text-24 font-semibold break-keep text-main sm:text-32">{note.title}</h1>
            <p className="mt-3 text-16 break-keep text-sub sm:text-18">{note.summary}</p>
            <p className="mt-4 flex flex-wrap gap-2 text-13 text-sub-weak">
              {note.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </p>
          </header>

          <section id="note-summary" aria-labelledby="note-summary-title" className="mt-12 scroll-mt-6">
            <h2 id="note-summary-title" className="text-20 font-semibold text-main">
              핵심 요약
            </h2>
            <ul className="mt-4 flex flex-col gap-3 rounded-card border border-regular bg-default p-6">
              {note.points.map((point) => (
                <li key={point} className="flex gap-3 text-15 break-keep text-main">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-study" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {note.learned.length > 0 && (
            <section id="note-learned" aria-labelledby="note-learned-title" className="mt-12 scroll-mt-6">
              <h2 id="note-learned-title" className="text-20 font-semibold text-main">
                배운 것
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {note.learned.map(({ title, items }) => (
                  <section key={title} className="rounded-card border border-regular bg-default p-5">
                    <h3 className="text-15 font-semibold break-keep text-main">{title}</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {items.map((item) => (
                        <li key={item} className="flex gap-2 text-14 break-keep text-sub">
                          <span aria-hidden="true" className="text-disabled">
                            —
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          )}

          {practice.length > 0 && (
            <ImageGallery
              id="note-practice"
              title="내 실습 결과물"
              description="직접 만든 결과물이에요. 누르면 크게 볼 수 있어요."
              items={practice}
            />
          )}

          {examples.length > 0 && (
            <ImageGallery
              id="note-examples"
              title="참고 예시"
              description="강의 미션을 같은 재료로 풀어 본 예시예요. 직접 만든 결과물은 아니에요."
              items={examples}
            />
          )}

          {applied.length > 0 && (
            <section id="note-applied" aria-labelledby="note-applied-title" className="mt-12 scroll-mt-6">
              <h2 id="note-applied-title" className="text-20 font-semibold text-main">
                써먹은 곳
              </h2>
              <p className="mt-1 text-14 text-sub">이 노트의 개념이 실제 화면·코드에 들어간 곳이에요.</p>
              <div className="mt-4 flex flex-col gap-4">
                {applied.map(({ item, learned, used }) => (
                  <div key={item.slug} className="flex flex-col gap-4 rounded-card border border-regular bg-study-soft/60 p-6">
                    <div className="flex flex-col gap-2">
                      <CaseMeta item={item} />
                      <h3 className="text-18 font-semibold break-keep text-main">{item.title}</h3>
                    </div>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {[
                        { term: '노트에서 배운 것', detail: learned },
                        { term: '그래서 이렇게 썼다', detail: used },
                      ].map(({ term, detail }) => (
                        <div key={term} className="flex flex-col gap-1.5 rounded-card-sm border border-regular bg-default p-4">
                          <dt className="text-12 font-medium text-sub-weak">{term}</dt>
                          <dd className="text-14 break-keep text-main">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    {item.href && (
                      <a href={item.href} className="w-fit text-14 font-medium text-portfolio hover:underline underline-offset-4">
                        사례 보러 가기 →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 이전·다음은 내용이 아니라 이동이라 카드 대신 바닥 UI — 구분선 하나 위에 테두리 없이 둔다 */}
          {(older || newer) && (
            <nav aria-label="다른 노트" className="mt-16 grid gap-x-6 border-t border-regular sm:grid-cols-2">
              {older && (
                <a href={noteHref(older.slug)} className="group flex flex-col gap-1 py-6">
                  <span className="text-12 text-sub-weak">← 이전 노트</span>
                  <span className="text-15 font-medium break-keep text-main group-hover:text-study-strong">{older.title}</span>
                </a>
              )}
              {newer && (
                <a href={noteHref(newer.slug)} className="group flex flex-col gap-1 py-6 sm:col-start-2 sm:items-end sm:text-right">
                  <span className="text-12 text-sub-weak">다음 노트 →</span>
                  <span className="text-15 font-medium break-keep text-main group-hover:text-study-strong">{newer.title}</span>
                </a>
              )}
            </nav>
          )}
        </article>

        <aside aria-label="노트 목차" className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex">
          <div className="flex flex-col gap-1 rounded-card border border-regular bg-default px-6 py-5">
            <p className="text-13 font-semibold text-sub-weak">이 노트</p>
            {toc.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="w-fit py-1.5 text-left text-14 text-sub hover:text-main"
              >
                {label}
              </button>
            ))}
          </div>
          {sameCourse.length > 0 && (
            <div className="flex flex-col rounded-card border border-regular bg-default px-6 pt-5 pb-3">
              <p className="text-13 font-semibold text-sub-weak">같은 강의의 노트</p>
              {sameCourse.map((other) => (
                <a key={other.slug} href={noteHref(other.slug)} className="py-2.5 text-14 break-keep text-sub hover:text-main">
                  {other.lesson} · {other.title}
                </a>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
