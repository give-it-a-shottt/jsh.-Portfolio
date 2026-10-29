import { useState } from 'react'
import awardIcon from '../assets/icon-award.svg'
import checkcIcon from '../assets/icon-checkc.svg'
import chevNavy from '../assets/icon-chev-navy.svg'
import clockIcon from '../assets/icon-clock.svg'
import listIcon from '../assets/icon-list.svg'
import loaderIcon from '../assets/icon-loader.svg'
import playIcon from '../assets/icon-play.svg'
import starIcon from '../assets/icon-star-14.svg'
import userIcon from '../assets/icon-user-14.svg'
import { Breadcrumb, Footer, Header } from '../components'
import { rating } from '../data'
import { EnrollModal, EnrollToast } from '../enroll'
import { useEnroll, type EnrollState } from '../hooks'
import { AREA_LABEL, findLecture, lessonCount, points, totalLength, type Lecture } from '../lectures'
import { techlearnHref } from '../routes'

// 03 강의 상세 — 왼쪽 본문(요약 · 소개 · 커리큘럼), 오른쪽 따라오는 수강신청 카드.
// 모바일은 카드 대신 위에 썸네일 · 포인트 요약, 화면 아래에 붙는 신청 바를 둔다.
export default function CourseDetailScreen({ id }: { id: string }) {
  const lecture = findLecture(id)
  if (!lecture) return <NotFound />
  // 강의가 바뀌면 신청 상태(모달 · 토스트)를 새로 시작한다
  return <CourseDetail key={lecture.id} lecture={lecture} />
}

function CourseDetail({ lecture }: { lecture: Lecture }) {
  const enroll = useEnroll(lecture)
  const sectionCount = lecture.curriculum.length
  const curriculumMeta = `${sectionCount}개 섹션 · ${lessonCount(lecture)}강`

  return (
    // 모바일은 아래 고정 신청 바 높이만큼 끝을 띄워 푸터 안내가 가려지지 않게 한다
    <div className="flex min-h-svh flex-col bg-tl-bg-alt font-sans text-tl-ink max-lg:pb-24">
      <Header />
      <main className="mx-auto flex w-full max-w-284 flex-1 gap-8 px-4 pt-6 pb-20 sm:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <Breadcrumb
            items={[
              { label: '강의 목록', href: techlearnHref('/courses') },
              { label: AREA_LABEL[lecture.area] },
            ]}
          />

          {/* 모바일 — 카드 대신 맨 위에 큰 썸네일 */}
          <img src={lecture.cover ?? lecture.thumbnail} alt="" className="aspect-video w-full rounded-sm object-cover lg:hidden" />

          <section aria-labelledby="tl-lecture-title" className="rounded-sm bg-tl-bg p-5 sm:p-8">
            <p className="flex flex-wrap gap-1.5">
              {lecture.isNew && (
                <span lang="en" className="rounded-tl-tag bg-tl px-2 py-0.5 text-11 font-semibold text-white">
                  NEW
                </span>
              )}
              {[...lecture.tags, lecture.level].map((chip) => (
                <span key={chip} className="rounded-tl-tag bg-white px-2 py-0.5 text-12 text-tl-body">
                  {chip}
                </span>
              ))}
            </p>
            <h1 id="tl-lecture-title" className="mt-3 text-22 font-semibold break-keep sm:text-32">
              {lecture.title}
            </h1>
            <p className="mt-3 text-14 break-keep text-tl-body sm:text-15">{lecture.summary}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-13 text-tl-body">
              <span className="flex items-center gap-1">
                <img src={starIcon} alt="" width={14} height={14} />
                <span className="font-semibold text-tl-ink">{rating(lecture.rating)}</span>
                <span className="text-tl-muted">({lecture.students.toLocaleString('ko-KR')}명 수강)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <img src={userIcon} alt="" width={14} height={14} />
                멘토 {lecture.mentor}
              </span>
              <span className="flex items-center gap-1.5">
                <img src={listIcon} alt="" width={14} height={14} />
                {curriculumMeta}
              </span>
            </p>
          </section>

          {/* 모바일 — 포인트 요약 (PC 는 오른쪽 카드에 있다) */}
          <MobilePoints enroll={enroll} curriculumMeta={curriculumMeta} />

          <section aria-labelledby="tl-intro-title" className="flex flex-col gap-3 rounded-sm bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-6">
            <h2 id="tl-intro-title" className="text-20 font-semibold">
              강의 소개
            </h2>
            <p className="text-14 break-keep text-tl-body">{lecture.intro}</p>
            <div className="flex flex-col gap-2 rounded-xs bg-tl-bg p-4">
              <h3 className="text-14 font-semibold">이런 걸 배워요</h3>
              <ul className="flex flex-col gap-2">
                {lecture.learn.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-14 break-keep text-tl-body">
                    <img src={checkcIcon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Curriculum lecture={lecture} meta={`${curriculumMeta} · 총 ${totalLength(lecture)}`} />
        </div>

        <aside aria-label="수강신청" className="hidden w-90 shrink-0 pt-[37px] lg:block">
          <div className="sticky top-24">
            <EnrollCard lecture={lecture} enroll={enroll} curriculumMeta={curriculumMeta} />
          </div>
        </aside>
      </main>

      <MobileEnrollBar lecture={lecture} enroll={enroll} />
      <Footer />

      {enroll.confirming && (
        <EnrollModal
          lecture={lecture}
          myPoints={enroll.myPoints}
          remaining={enroll.remaining}
          shortBy={enroll.shortBy}
          onCancel={enroll.cancel}
          onConfirm={enroll.submit}
          onCharge={enroll.charge}
        />
      )}
      <EnrollToast toast={enroll.toast} onDone={enroll.clearToast} />
    </div>
  )
}

type Enroll = ReturnType<typeof useEnroll>

// 버튼 문구 — 시안 03-1. 포인트 부족은 막지 않고 모달에서 충전하게 해서 '신청 가능'과 같은 버튼을 쓴다(사용자 확인)
const BUTTON_LABEL: Record<EnrollState, string> = {
  available: '수강신청 하기',
  pending: '신청 처리 중...',
  enrolled: '수강 중인 강의입니다',
  short: '수강신청 하기',
}

function EnrollButton({ enroll, className = '' }: { enroll: Enroll; className?: string }) {
  const { state } = enroll
  const styles: Record<EnrollState, string> = {
    available: 'bg-tl text-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-tl/90',
    pending: 'bg-tl/80 text-white',
    enrolled: 'bg-tl-chip text-disabled',
    short: 'bg-tl text-white shadow-[0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-tl/90',
  }
  return (
    <button
      type="button"
      onClick={enroll.open}
      // 신청 중에는 눌러도 아무 일이 없게 — 중복 요청 방지. 비활성이어도 포커스는 받아 상태를 읽을 수 있게 aria-disabled
      aria-disabled={state === 'pending' || state === 'enrolled'}
      aria-busy={state === 'pending'}
      className={`flex h-12 items-center justify-center gap-2 rounded-xs text-15 font-semibold aria-disabled:cursor-not-allowed ${styles[state]} ${className}`}
    >
      {state === 'pending' && <img src={loaderIcon} alt="" width={18} height={18} className="animate-spin motion-reduce:animate-none" />}
      {BUTTON_LABEL[state]}
    </button>
  )
}

/** 버튼 아래 한 줄 안내 — 상태마다 다르다 */
function EnrollHint({ enroll }: { enroll: Enroll }) {
  if (enroll.state === 'enrolled')
    return (
      <a href={techlearnHref('/courses')} className="flex items-center justify-center gap-1 text-13 font-semibold text-tl hover:underline">
        내 강의로 이동
        <img src={chevNavy} alt="" width={12} height={12} />
      </a>
    )
  if (enroll.state === 'short')
    return (
      <p className="text-center text-12 font-medium break-keep text-tl-sale">
        포인트가 {points(enroll.shortBy)} 부족해요. 신청할 때 충전할 수 있어요.
      </p>
    )
  return (
    <p className="text-center text-12 text-tl-muted">
      {enroll.state === 'pending' ? '처리 중에는 버튼을 다시 누를 수 없어요.' : '신청하면 내 강의에서 바로 확인할 수 있어요.'}
    </p>
  )
}

/** 내 포인트 · 신청 후 잔여 (수강 중이면 신청일 · 커리큘럼) */
function PointRows({ enroll, curriculumMeta }: { enroll: Enroll; curriculumMeta: string }) {
  if (enroll.enrolledAt)
    return (
      <dl className="flex flex-col gap-2 text-13 text-tl-body">
        <div className="flex justify-between">
          <dt>신청일</dt>
          <dd className="font-medium">{enroll.enrolledAt}</dd>
        </div>
        <div className="flex justify-between">
          <dt>커리큘럼</dt>
          <dd className="font-medium">{curriculumMeta}</dd>
        </div>
      </dl>
    )
  return (
    <dl className="flex flex-col gap-2 text-13">
      <div className="flex justify-between">
        <dt className="text-tl-body">내 포인트</dt>
        <dd className="font-medium">{points(enroll.myPoints)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-tl-body">신청 후 잔여</dt>
        <dd className={`font-semibold ${enroll.shortBy > 0 ? 'text-tl-sale' : 'text-tl'}`}>{points(enroll.remaining)}</dd>
      </div>
    </dl>
  )
}

function Price({ lecture, enrolled }: { lecture: Lecture; enrolled: boolean }) {
  return (
    <div className="flex items-end justify-between">
      <p className="flex flex-col gap-1 font-semibold">
        <span className="text-13 text-tl-muted">수강료</span>
        <span className={`text-28 ${lecture.price === 0 ? 'text-tl' : ''}`}>{lecture.price === 0 ? '무료' : points(lecture.price)}</span>
      </p>
      {enrolled && (
        <span lang="en" className="mb-2 rounded-tl-tag bg-tl px-2 py-0.5 text-11 font-semibold text-white">
          ENROLLED
        </span>
      )}
    </div>
  )
}

function EnrollCard({ lecture, enroll, curriculumMeta }: { lecture: Lecture; enroll: Enroll; curriculumMeta: string }) {
  return (
    <div className="overflow-hidden rounded-sm bg-white shadow-[0_20px_25px_rgba(222,227,232,0.4),0_8px_10px_rgba(222,227,232,0.4)]">
      <img src={lecture.cover ?? lecture.thumbnail} alt="" className="h-[203px] w-full object-cover" />
      <div className="flex flex-col p-6">
        <Price lecture={lecture} enrolled={enroll.state === 'enrolled'} />
        <hr className="mt-5 mb-4 border-tl-chip" />
        <PointRows enroll={enroll} curriculumMeta={curriculumMeta} />
        <EnrollButton enroll={enroll} className="mt-5 w-full" />
        <div className="mt-3">
          <EnrollHint enroll={enroll} />
        </div>
        <p className="mt-4 flex justify-between border-t border-tl-chip pt-3 text-11 text-tl-muted">
          <span className="flex items-center gap-1">
            <img src={clockIcon} alt="" width={12} height={12} />
            수강 기한: 무제한
          </span>
          <span className="flex items-center gap-1">
            <img src={awardIcon} alt="" width={12} height={12} />
            수료증 발급 가능
          </span>
        </p>
      </div>
    </div>
  )
}

function MobilePoints({ enroll, curriculumMeta }: { enroll: Enroll; curriculumMeta: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-sm bg-tl-bg p-4 lg:hidden">
      <PointRows enroll={enroll} curriculumMeta={curriculumMeta} />
      {enroll.state === 'short' && <EnrollHint enroll={enroll} />}
    </div>
  )
}

// 모바일 하단 고정 바 — 수강료와 신청 버튼
function MobileEnrollBar({ lecture, enroll }: { lecture: Lecture; enroll: Enroll }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
      <p className="flex flex-col font-semibold">
        <span className="text-11 text-tl-muted">수강료</span>
        <span className="text-20">{lecture.price === 0 ? '무료' : points(lecture.price)}</span>
        {enroll.state !== 'enrolled' && (
          <span className={`text-11 ${enroll.shortBy > 0 ? 'text-tl-sale' : 'text-tl'}`}>잔여 {points(enroll.remaining)}</span>
        )}
      </p>
      <EnrollButton enroll={enroll} className="flex-1 px-4" />
    </div>
  )
}

// 커리큘럼 — 섹션마다 접고 펼친다. PC 는 모두 펼친 채로, 모바일은 첫 섹션만 펼친 채로 시작한다.
function Curriculum({ lecture, meta }: { lecture: Lecture; meta: string }) {
  const [openOnStart] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  return (
    <section aria-labelledby="tl-curriculum-title" className="flex flex-col gap-4 rounded-sm bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="tl-curriculum-title" className="text-20 font-semibold">
          커리큘럼
        </h2>
        <p className="text-13 text-tl-muted">{meta}</p>
      </div>
      {lecture.curriculum.map((section, i) => (
        <details key={section.title} open={openOnStart || i === 0} className="group/section">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xs bg-tl-bg px-4 py-2.5 text-14 font-semibold [&::-webkit-details-marker]:hidden">
            섹션 {i + 1}. {section.title}
            <span className="flex items-center gap-1 text-12 font-medium text-tl-muted">
              {section.lessons.length}강
              <img src={chevNavy} alt="" width={12} height={12} className="rotate-90 transition-transform group-open/section:-rotate-90" />
            </span>
          </summary>
          <ol>
            {section.lessons.map((lesson, j) => (
              <li key={lesson.title} className="flex items-center gap-2.5 border-b border-tl-chip px-4 py-3 last:border-b-0">
                <img src={playIcon} alt="" width={16} height={16} />
                <span className="flex-1 text-14 text-tl-body">
                  {j + 1}. {lesson.title}
                </span>
                <span className="text-12 text-tl-muted">{lesson.length}</span>
              </li>
            ))}
          </ol>
        </details>
      ))}
    </section>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-tl-bg-alt font-sans text-tl-ink">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <p lang="en" className="text-13 font-semibold text-tl">
          404
        </p>
        <h1 className="text-24 font-semibold">강의를 찾을 수 없어요</h1>
        <p className="text-14 text-tl-muted">주소가 바뀌었거나 없어진 강의예요.</p>
        <a href={techlearnHref('/courses')} className="mt-2 rounded-xs bg-tl px-5 py-2.5 text-14 font-medium text-white hover:bg-tl/90">
          강의 목록으로
        </a>
      </main>
      <Footer />
    </div>
  )
}
