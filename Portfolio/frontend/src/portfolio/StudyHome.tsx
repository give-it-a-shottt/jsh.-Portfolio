import { BookIcon } from '../shared/icons'
import { COURSES, FEATURED_COURSES, findCourse, noteHref, NOTES, studyHref, visibleLearned, type StudyCourse, type StudyNote } from './notes'
import StudyHeatmap from './StudyHeatmap'
import StudyLayout from './StudyLayout'

// Study 홈(피그마 05) — 들어오자마자 '개념으로 정리했다'가 보이게, 강의마다 개념 묶음과 노트의 핵심 개념 두 줄을 먼저 보여 준다.
// 강의를 고르면(?area=…&course=…) 그 강의의 노트를 모두 같은 카드로 보여 준다.

const GROUP_COUNT = NOTES.reduce((sum, note) => sum + visibleLearned(note).length, 0)
const CONCEPT_COUNT = NOTES.reduce(
  (sum, note) => sum + visibleLearned(note).reduce((count, group) => count + group.items.length, 0),
  0,
)
// '공부한 날'은 공부를 본격적으로 시작한 날부터 오늘까지 지난 날수(시작일 포함) — 사용자 결정. 노트를 올린 날 수가 아니다
// 날짜만 비교하려고 둘 다 UTC 자정으로 맞춘다 — 서머타임이 끼어도 하루가 23·25시간으로 어긋나지 않는다
const STUDY_START_UTC = Date.UTC(2026, 7, 18) // 2026-08-18 FastAPI 1일차 (월은 0부터 세서 7 = 8월)
const MS_PER_DAY = 24 * 60 * 60 * 1000

function daysSinceStart(today = new Date()) {
  const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.max(0, Math.floor((end - STUDY_START_UTC) / MS_PER_DAY) + 1)
}

function stats() {
  return [
    { label: '노트', value: NOTES.length },
    { label: '개념 묶음', value: GROUP_COUNT },
    { label: '정리한 개념', value: CONCEPT_COUNT },
    { label: '공부한 날', value: daysSinceStart() },
  ]
}

/** '다른 강의' 한 줄에 붙일 대표 낱말 — 노트 태그에서 많이 나온 순. 강의 이름·분야처럼 뻔한 태그는 뺀다 */
function courseKeywords({ area, course, notes }: StudyCourse) {
  const skip = new Set([course, area, '프론트엔드', '백엔드', '디자인'])
  const counts = new Map<string, number>()
  for (const tag of notes.flatMap((note) => note.tags)) if (!skip.has(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([tag]) => tag)
}

function Breadcrumb({ course }: { course?: StudyCourse }) {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-13 text-sub-weak">
      <span lang="en">Study</span>
      <span aria-hidden="true">/</span>
      {course ? (
        <>
          <a href={studyHref()} className="hover:text-main">
            공부 노트
          </a>
          <span aria-hidden="true">/</span>
          <span>{course.course}</span>
        </>
      ) : (
        <span>공부 노트</span>
      )}
    </p>
  )
}

function ConceptChips({ groups }: { groups: string[] }) {
  if (groups.length === 0) return null
  return (
    <ul aria-label="정리한 개념 묶음" className="flex flex-wrap gap-1.5">
      {groups.map((group) => (
        <li key={group} className="rounded-sm border border-regular bg-default px-2.5 py-1 text-13 font-medium break-keep text-sub">
          {group}
        </li>
      ))}
    </ul>
  )
}

/** 노트 카드 — 제목보다 핵심 개념 두 줄이 먼저 읽히게. Design 노트는 실습 결과물 첫 장을 위에 둔다 */
function ConceptCard({ note }: { note: StudyNote }) {
  const thumb = note.practice?.[0]
  const groups = visibleLearned(note).map((group) => group.title)
  return (
    <a
      href={noteHref(note.slug)}
      className="group flex h-full flex-col gap-3 rounded-card border border-regular bg-default p-5 transition-colors duration-150 hover:border-black"
    >
      {thumb && (
        <img src={thumb.image} alt="" loading="lazy" className="aspect-3/2 w-full rounded-thumb-sm border border-light object-cover" />
      )}
      <p className="text-12 text-sub-weak tabular-nums">
        {note.lesson} · {note.date}
      </p>
      <h3 className="text-16 font-semibold break-keep text-main group-hover:text-study-strong">{note.title}</h3>
      <ul className="flex flex-col gap-2">
        {note.points.slice(0, 2).map((point) => (
          <li key={point} className="flex gap-2.5 text-13 break-keep text-sub">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-study" />
            {point}
          </li>
        ))}
      </ul>
      {groups.length > 0 && (
        <p className="mt-auto border-t border-light pt-3 text-12 font-medium break-keep text-study-strong">{groups.join(' · ')}</p>
      )}
    </a>
  )
}

function CardGrid({ notes }: { notes: StudyNote[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <li key={note.slug}>
          <ConceptCard note={note} />
        </li>
      ))}
    </ul>
  )
}

const CARDS_PER_COURSE = 3

function FeaturedCourse({ course }: { course: StudyCourse }) {
  const titleId = `course-${course.area}-${course.course}`
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span aria-hidden="true" className="size-2 rounded-full bg-study" />
          <h3 id={titleId} className="text-18 font-semibold break-keep text-main">
            {course.course}
          </h3>
          <span className="text-13 text-sub-weak">
            <span lang="en">{course.area}</span> · 노트 {course.notes.length}개
          </span>
        </div>
        <a href={studyHref(course)} className="text-13 font-medium text-portfolio underline-offset-4 hover:underline">
          강의 노트 모두 보기 →
        </a>
      </div>
      <ConceptChips groups={course.groups} />
      <CardGrid notes={course.notes.slice(0, CARDS_PER_COURSE)} />
    </section>
  )
}

function Overview() {
  const others = COURSES.filter((course) => !FEATURED_COURSES.includes(course)).sort((a, b) => b.notes.length - a.notes.length)

  return (
    <main className="mx-auto flex w-full max-w-256 flex-col gap-12 px-5 pt-10 pb-24 sm:px-10 lg:px-18">
      <header className="flex flex-col gap-3">
        <Breadcrumb />
        <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-md bg-study text-white">
          <BookIcon size={28} />
        </span>
        <h1 className="text-32 font-semibold text-main sm:text-40">공부 노트</h1>
        <p className="text-16 break-keep text-sub sm:text-18">
          강의와 책으로 공부한 내용을 문답이 아니라 개념으로 다시 정리했어요. 강의마다 개념 묶음으로 나눴고, 노트마다 핵심 개념을 먼저 보여 줘요.
        </p>
      </header>

      <section aria-label="공부 기록" className="flex flex-col gap-8 rounded-card border border-regular p-6 sm:flex-row sm:items-center sm:gap-10 sm:px-7">
        <dl className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-5">
          {stats().map(({ label, value }) => (
            <div key={label} className="flex w-24 flex-col-reverse gap-0.5">
              <dt className="text-13 text-sub-weak">{label}</dt>
              <dd className="text-28 font-semibold text-main tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="min-w-0 border-regular sm:border-l sm:pl-10">
          <StudyHeatmap />
        </div>
      </section>

      <section aria-labelledby="concepts-title" className="flex flex-col gap-10">
        <div className="flex flex-col gap-1.5">
          <h2 id="concepts-title" className="text-24 font-semibold text-main">
            강의별로 정리한 개념
          </h2>
          <p className="text-14 break-keep text-sub">강의마다 배운 것을 개념 묶음으로 나눴어요. 카드에는 노트의 핵심 개념 두 줄을 먼저 보여 줘요.</p>
        </div>
        {FEATURED_COURSES.map((course) => (
          <FeaturedCourse key={`${course.area}-${course.course}`} course={course} />
        ))}
      </section>

      {others.length > 0 && (
        <section aria-labelledby="others-title">
          <h2 id="others-title" className="text-18 font-semibold text-main">
            다른 강의
          </h2>
          <ul className="mt-2">
            {others.map((course) => (
              <li key={`${course.area}-${course.course}`}>
                <a
                  href={studyHref(course)}
                  className="group flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-light py-3.5"
                >
                  <span className="w-35 text-14 font-medium break-keep text-main group-hover:text-study-strong">{course.course}</span>
                  <span lang="en" className="w-14 text-12 tracking-normal text-sub-weak">
                    {course.area}
                  </span>
                  <span className="min-w-0 flex-1 text-13 break-keep text-sub">{courseKeywords(course).join(' · ')}</span>
                  <span className="text-13 font-medium text-portfolio">노트 {course.notes.length}개 →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

function CourseView({ course }: { course: StudyCourse }) {
  const dates = course.notes.map((note) => note.date).sort()
  return (
    <main className="mx-auto flex w-full max-w-256 flex-col gap-10 px-5 pt-10 pb-24 sm:px-10 lg:px-18">
      <header className="flex flex-col gap-3">
        <Breadcrumb course={course} />
        <h1 className="text-28 font-semibold break-keep text-main sm:text-32">{course.course}</h1>
        <p className="text-14 text-sub-weak tabular-nums">
          <span lang="en">{course.area}</span> · 노트 {course.notes.length}개 · {dates[0]}
          {dates.length > 1 && dates[0] !== dates[dates.length - 1] && ` ~ ${dates[dates.length - 1]}`}
        </p>
      </header>
      {course.groups.length > 0 && (
        <section aria-labelledby="course-groups-title" className="flex flex-col gap-3">
          <h2 id="course-groups-title" className="text-16 font-semibold text-main">
            정리한 개념 묶음
          </h2>
          <ConceptChips groups={course.groups} />
        </section>
      )}
      <section aria-labelledby="course-notes-title" className="flex flex-col gap-4">
        <h2 id="course-notes-title" className="text-16 font-semibold text-main">
          노트 {course.notes.length}개
        </h2>
        <CardGrid notes={course.notes} />
      </section>
    </main>
  )
}

interface StudyHomeProps {
  area: string | null
  course: string | null
}

export default function StudyHome({ area, course }: StudyHomeProps) {
  const found = findCourse(area, course)
  return <StudyLayout current={found}>{found ? <CourseView course={found} /> : <Overview />}</StudyLayout>
}
