import bookmarkIcon from '../assets/icon-bookmark.svg'
import infoIcon from '../assets/icon-info.svg'
import starIcon from '../assets/icon-star.svg'
import { Breadcrumb, Footer, Header } from '../components'
import { rating } from '../data'
import { LECTURE_TABS, LECTURES, matchesQuery, matchesTab, points, type Lecture, type LectureTab } from '../lectures'
import { techlearnHref } from '../routes'
import { useTechlearn } from '../store'

interface CourseListScreenProps {
  tab: LectureTab
  query: string
}

// 02 강의 목록 — 분야 탭 · 4칸 카드 그리드(모바일은 가로 한 줄 카드) · 수강 중 배지 · 포인트 안내
export default function CourseListScreen({ tab, query }: CourseListScreenProps) {
  const { enrolled } = useTechlearn()
  const lectures = LECTURES.filter((lecture) => matchesTab(lecture, tab) && matchesQuery(lecture, query))
  const tabHref = (id: LectureTab) => techlearnHref('/courses', { tab: id === 'all' ? undefined : id, q: query || undefined })

  return (
    <div className="flex min-h-svh flex-col bg-tl-bg-alt font-sans text-tl-ink">
      <Header />
      <main className="mx-auto flex w-full max-w-284 flex-1 flex-col gap-6 px-4 pt-6 pb-20 sm:pt-8">
        <Breadcrumb items={[{ label: '홈', href: techlearnHref() }, { label: '강의 목록' }]} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2">
              <span lang="en" className="rounded-tl-tag bg-tl px-2 py-0.5 text-11 font-semibold text-white">
                ALL COURSES
              </span>
              <span className="text-13 text-tl-muted" aria-live="polite">
                총 {lectures.length}개 강의
              </span>
            </p>
            <h1 className="text-24 font-semibold sm:text-32">{query ? `'${query}' 검색 결과` : '전체 강의'}</h1>
          </div>
          <nav aria-label="분야" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            <ul className="flex gap-1">
              {LECTURE_TABS.map(({ id, label }) => (
                <li key={id} className="shrink-0">
                  <a
                    href={tabHref(id)}
                    aria-current={tab === id ? 'page' : undefined}
                    className={`block rounded-xs px-3 py-1.5 text-13 font-medium ${tab === id ? 'bg-tl-ink text-white' : 'bg-tl-chip text-tl-ink hover:bg-tl-line'}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {lectures.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4">
            {lectures.map((lecture) => (
              <li key={lecture.id}>
                <LectureCard lecture={lecture} enrolled={Boolean(enrolled[lecture.id])} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white px-6 py-16 text-center">
            <p className="text-16 font-semibold">조건에 맞는 강의가 없어요</p>
            <p className="text-13 text-tl-muted">다른 검색어나 분야를 골라 보세요.</p>
            <a href={techlearnHref('/courses')} className="rounded-xs bg-tl px-4 py-2 text-13 font-medium text-white hover:bg-tl/90">
              전체 강의 보기
            </a>
          </div>
        )}

        <p className="flex items-start gap-2 rounded-xs bg-tl-bg px-4 py-3 text-13 break-keep text-tl-body">
          <img src={infoIcon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
          강의는 포인트로 신청해요. 신청한 강의는 카드에 &apos;수강 중&apos; 배지가 붙고, 내 강의에서 다시 볼 수 있어요.
        </p>
      </main>
      <Footer />
    </div>
  )
}

// 강의 카드 — PC 는 위 썸네일 세로 카드, 모바일은 왼쪽 썸네일 가로 카드.
// 수강 중이면 썸네일 라벨과 가격 왼쪽 글자가 네이비 '수강 중'으로 바뀐다. 무료는 가격 자리에 '무료'.
function LectureCard({ lecture, enrolled }: { lecture: Lecture; enrolled: boolean }) {
  const free = lecture.price === 0
  return (
    <article className="group relative flex h-full overflow-hidden rounded-sm bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:flex-col">
      <div className="relative w-24 shrink-0 self-start overflow-hidden bg-tl-chip max-sm:m-3 max-sm:aspect-video max-sm:rounded-xs sm:h-[153px] sm:w-full">
        <img src={lecture.thumbnail} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <span
          className={`absolute bottom-1 left-1 rounded-tl-tag px-1.5 py-px text-11 font-medium text-white backdrop-blur-[4px] sm:bottom-2.5 sm:left-2.5 sm:px-2 sm:py-0.5 ${enrolled ? 'bg-tl' : 'bg-tl-dark/85'}`}
        >
          {enrolled ? '수강 중' : lecture.level}
        </span>
      </div>
      <button
        type="button"
        aria-label={`${lecture.title} 찜하기`}
        className="absolute top-2.5 right-2.5 z-10 hidden size-8 items-center justify-center rounded-md bg-white/80 backdrop-blur-[4px] sm:flex"
      >
        <img src={bookmarkIcon} alt="" width={11.67} height={15} />
      </button>
      <div className="flex min-w-0 flex-1 flex-col py-3 pr-3 sm:p-4">
        <p className="flex flex-wrap gap-1.5 pb-1.5 sm:pb-2">
          {lecture.tags.map((tag) => (
            <span key={tag} lang="en" className="rounded-tl-tag bg-tl-chip px-2 py-0.5 text-12 text-tl-sub">
              {tag}
            </span>
          ))}
        </p>
        <h2 className="mb-1 truncate text-15 font-semibold text-tl-ink sm:mb-2 sm:line-clamp-2 sm:text-18 sm:whitespace-normal">
          <a href={techlearnHref(`/course/${lecture.id}`)} className="after:absolute after:inset-0 group-hover:text-tl">
            {lecture.title}
          </a>
        </h2>
        <p className="text-12 text-tl-sub sm:mb-4 sm:text-13">멘토 {lecture.mentor}</p>
        <div className="mt-auto flex items-end justify-between gap-2 sm:-mx-4 sm:flex-col sm:items-stretch sm:gap-1 sm:bg-tl-bg/40 sm:px-4 sm:py-2">
          <p className="flex items-center gap-1 text-11 font-semibold">
            <img src={starIcon} alt="" width={13.33} height={12.67} />
            <span className="text-tl-ink">{rating(lecture.rating)}</span>
            <span className="text-tl-weak">
              (<span className="sm:hidden">{lecture.students.toLocaleString('ko-KR')}</span>
              <span className="hidden sm:inline">{lecture.students.toLocaleString('ko-KR')}명 수강</span>)
            </span>
          </p>
          <div className="flex items-end justify-between sm:min-h-[45px]">
            {enrolled ? (
              <span className="hidden pb-5 text-15 font-semibold text-tl sm:block">수강 중</span>
            ) : (
              !free && <span className="hidden pb-5 text-15 font-semibold text-tl-muted sm:block">포인트 결제</span>
            )}
            <span className={`ml-auto text-16 font-semibold sm:pt-4 sm:text-18 ${free ? 'text-tl' : 'text-tl-ink'}`}>
              {free ? '무료' : points(lecture.price)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
