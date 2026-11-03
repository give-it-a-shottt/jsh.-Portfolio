import { useCallback, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { BookIcon, LightbulbIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import Lightbox from './Lightbox'
import { appliedCases, findCourse, noteHref, NOTES, studyHref, visibleLearned, type StudyPractice } from './notes'
import StudyLayout from './StudyLayout'

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
      <h2 id={titleId} className="text-24 font-semibold text-main">
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
          // 포토샵 작업물은 구도가 핵심이라 통째로 보여 주고, 디테일은 눌러서 확대
          mode="fit"
        />
      )}
    </section>
  )
}

interface StudyDetailProps {
  slug: string
}

/**
 * 공부 노트 상세 — 노션 문서처럼(피그마 06): 속성 표 → 한 줄 요약 콜아웃 → 핵심 개념 → 배운 것(주제별) →
 * 실습 결과물 · 참고 예시(있을 때) → 써먹은 곳(실제로 쓴 사례가 있을 때). 틀렸던 문답 묶음은 visibleLearned 가 뺀다.
 * 왼쪽은 Study 사이드바, 넓은 화면에서는 오른쪽에 목차가 따라 내려온다.
 */
export default function StudyDetail({ slug }: StudyDetailProps) {
  const reduceMotion = useReducedMotion()
  const index = NOTES.findIndex((candidate) => candidate.slug === slug)
  const note = NOTES[index]

  if (!note) {
    return (
      <StudyLayout>
        <main className="mx-auto flex w-full max-w-256 flex-col gap-2 px-5 pt-16 pb-20 sm:px-10 lg:px-18">
          <h1 className="text-20 font-semibold break-keep text-main">노트를 찾을 수 없어요.</h1>
          <p className="text-14 text-sub">주소가 바뀌었거나 아직 올리지 않은 노트예요.</p>
          <a href={studyHref()} className="mt-4 w-fit text-14 font-medium text-portfolio underline-offset-4 hover:underline">
            공부 노트 홈으로 →
          </a>
        </main>
      </StudyLayout>
    )
  }

  const course = findCourse(note.area, note.course)
  const learned = visibleLearned(note)
  const applied = appliedCases(note)
  const practice = note.practice ?? []
  const examples = note.examples ?? []
  // NOTES 는 최신순 — 이전 노트는 더 오래된 쪽
  const older = NOTES[index + 1]
  const newer = NOTES[index - 1]
  const toc = [
    { id: 'note-summary', label: '한 줄 요약', children: [] },
    { id: 'note-points', label: '핵심 개념', children: [] },
    ...(learned.length > 0
      ? [{ id: 'note-learned', label: '배운 것', children: learned.map(({ title }, i) => ({ id: `note-learned-${i}`, label: title })) }]
      : []),
    ...(practice.length > 0 ? [{ id: 'note-practice', label: '내 실습 결과물', children: [] }] : []),
    ...(examples.length > 0 ? [{ id: 'note-examples', label: '참고 예시', children: [] }] : []),
    ...(applied.length > 0 ? [{ id: 'note-applied', label: '써먹은 곳', children: [] }] : []),
  ]
  // 해시 라우팅이라 '#아이디' 링크 대신 스크롤로 옮긴다
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  const properties = [
    { term: '분야', detail: <span lang="en">{note.area}</span> },
    { term: '강의', detail: `${note.course} · ${note.lesson}` },
    { term: '공부한 날', detail: <span className="tabular-nums">{note.date}</span> },
    ...(learned.length > 0
      ? [
          {
            term: '개념 묶음',
            detail: (
              <span className="flex flex-wrap gap-1.5">
                {learned.map(({ title }) => (
                  <span key={title} className="rounded-sm border border-regular bg-default px-2.5 py-1 text-13 font-medium break-keep text-sub">
                    {title}
                  </span>
                ))}
              </span>
            ),
          },
        ]
      : []),
    { term: '태그', detail: <span className="text-sub">{note.tags.map((tag) => `#${tag}`).join('  ')}</span> },
  ]

  return (
    <StudyLayout current={course}>
      <main className="mx-auto flex w-full max-w-256 gap-14 px-5 pt-10 pb-24 sm:px-10 lg:px-18">
        <article className="flex max-w-180 min-w-0 flex-1 flex-col">
          <p className="flex flex-wrap items-center gap-x-1.5 text-13 text-sub-weak">
            <a href={studyHref()} className="hover:text-main">
              공부 노트
            </a>
            <span aria-hidden="true">/</span>
            <span lang="en">{note.area}</span>
            <span aria-hidden="true">/</span>
            {course ? (
              <a href={studyHref(course)} className="hover:text-main">
                {note.course}
              </a>
            ) : (
              <span>{note.course}</span>
            )}
          </p>
          <span aria-hidden="true" className="mt-5 flex size-12 items-center justify-center rounded-md bg-study text-white">
            <BookIcon size={24} />
          </span>
          <h1 className="mt-4 text-28 font-semibold break-keep text-main sm:text-36">{note.title}</h1>

          <dl className="mt-5 flex flex-col">
            {properties.map(({ term, detail }) => (
              <div key={term} className="flex gap-3 py-1.5 text-14">
                <dt className="w-24 shrink-0 text-sub-weak sm:w-27.5">{term}</dt>
                <dd className="min-w-0 flex-1 break-keep text-main">{detail}</dd>
              </div>
            ))}
          </dl>

          <div id="note-summary" className="mt-7 flex scroll-mt-6 gap-3.5 rounded-card-sm bg-study-soft px-5 py-4.5">
            <LightbulbIcon size={20} className="mt-0.5 shrink-0 text-study-strong" />
            <div className="flex flex-col gap-1.5">
              <p className="text-13 font-medium text-study-strong">한 줄 요약</p>
              <p className="text-15 break-keep text-main">{note.summary}</p>
            </div>
          </div>

          <section id="note-points" aria-labelledby="note-points-title" className="mt-10 scroll-mt-6">
            <h2 id="note-points-title" className="text-24 font-semibold text-main">
              핵심 개념
            </h2>
            <ol className="mt-3.5 flex flex-col gap-2.5">
              {note.points.map((point, i) => (
                <li key={point} className="flex gap-2.5 text-15 break-keep text-sub">
                  <span aria-hidden="true" className="w-4 shrink-0 font-medium text-study-strong tabular-nums">
                    {i + 1}.
                  </span>
                  {point}
                </li>
              ))}
            </ol>
          </section>

          {learned.length > 0 && (
            <section id="note-learned" aria-labelledby="note-learned-title" className="mt-11 scroll-mt-6">
              <h2 id="note-learned-title" className="text-24 font-semibold text-main">
                배운 것
              </h2>
              <p className="mt-1.5 text-14 text-sub-weak">주제별로 묶어 정리했어요.</p>
              {learned.map(({ title, items }, i) => (
                <section key={title} id={`note-learned-${i}`} aria-labelledby={`note-learned-${i}-title`} className="mt-6 scroll-mt-6">
                  <h3 id={`note-learned-${i}-title`} className="flex items-center gap-2.5 text-18 font-semibold break-keep text-main">
                    <span aria-hidden="true" className="h-4.5 w-0.75 shrink-0 rounded-full bg-study" />
                    {title}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-15 break-keep text-sub">
                        <span aria-hidden="true" className="mt-2 size-1.25 shrink-0 rounded-full bg-icon-sub-weak" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
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
              <h2 id="note-applied-title" className="text-24 font-semibold text-main">
                써먹은 곳
              </h2>
              <p className="mt-1 text-14 text-sub">이 노트의 개념이 실제 화면·코드에 들어간 곳이에요.</p>
              <div className="mt-4 flex flex-col gap-4">
                {applied.map(({ item, learned: fromNote, used }) => (
                  <div key={item.slug} className="flex flex-col gap-4 rounded-card border border-regular bg-study-soft/60 p-6">
                    <div className="flex flex-col gap-2">
                      <CaseMeta item={item} />
                      <h3 className="text-18 font-semibold break-keep text-main">{item.title}</h3>
                    </div>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {[
                        { term: '노트에서 배운 것', detail: fromNote },
                        { term: '그래서 이렇게 썼다', detail: used },
                      ].map(({ term, detail }) => (
                        <div key={term} className="flex flex-col gap-1.5 rounded-card-sm border border-regular bg-default p-4">
                          <dt className="text-12 font-medium text-sub-weak">{term}</dt>
                          <dd className="text-14 break-keep text-main">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    {item.href && (
                      <a href={item.href} className="w-fit text-14 font-medium text-portfolio underline-offset-4 hover:underline">
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
            <nav aria-label="다른 노트" className="mt-14 grid gap-x-6 border-t border-regular sm:grid-cols-2">
              {older && (
                <a href={noteHref(older.slug)} className="group flex flex-col gap-1 py-6">
                  <span className="text-12 text-sub-weak">← 이전 노트</span>
                  <span className="text-14 font-medium break-keep text-main group-hover:text-study-strong">{older.title}</span>
                </a>
              )}
              {newer && (
                <a href={noteHref(newer.slug)} className="group flex flex-col gap-1 py-6 sm:col-start-2 sm:items-end sm:text-right">
                  <span className="text-12 text-sub-weak">다음 노트 →</span>
                  <span className="text-14 font-medium break-keep text-main group-hover:text-study-strong">{newer.title}</span>
                </a>
              )}
            </nav>
          )}
        </article>

        <aside aria-label="노트 목차" className="hidden w-50 shrink-0 xl:block">
          <div className="sticky top-6 flex flex-col pt-24">
            <p className="pb-1 text-12 font-medium text-sub-weak">이 노트</p>
            {toc.map(({ id, label, children }) => (
              <div key={id} className="flex flex-col">
                <button type="button" onClick={() => scrollTo(id)} className="w-fit py-1.5 text-left text-13 break-keep text-sub hover:text-main">
                  {label}
                </button>
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => scrollTo(child.id)}
                    className="w-fit py-1.5 pl-3.5 text-left text-13 break-keep text-sub-weak hover:text-main"
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </StudyLayout>
  )
}
