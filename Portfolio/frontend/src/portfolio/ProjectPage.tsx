import { useEffect, useState } from 'react'
import { ChevronRightIcon, MinusIcon, PlusIcon } from '../shared/icons'
import { designPreview, findProject, nextProject, type Project, type ProjectTrouble } from './projects'
import { ButtonLink, ProjectCover } from './ProjectParts'
import RoleChips from './RoleChips'
import { caseHref, projectHref } from './routes'

// 프로젝트 페이지(F-011) — 피그마 jsh Page 3 「Project · Accio · PC 1440」.
// 위: 화면(7칸) | 구조(5칸) → 정보 띠 → 숫자 → 목차(3칸) + 본문(9칸) → 다음 프로젝트.
// 서비스 하나의 디자인 · 프론트 · 백엔드를 한 장에서 보도록, 본문에 '디자인'(시안 + 피그마)과 '막힌 것과 해결'(Front · Back 사례)을 함께 둔다(F-013).

interface Section {
  id: string
  title: string
}

/** 데이터가 있는 섹션만 목차에 올린다 */
function sectionsOf(p: Project): Section[] {
  return [
    { id: 'why', title: '왜 만들었나' },
    { id: 'design', title: '디자인' },
    p.decisions && { id: 'decisions', title: '중요한 결정' },
    p.chart && { id: 'chart', title: '검색 정확도' },
    p.troubles && { id: 'troubles', title: '막힌 것과 해결' },
    { id: 'screens', title: '화면' },
    p.next && { id: 'next', title: '다음 단계' },
  ].filter(Boolean) as Section[]
}

/** 해시 라우팅이라 목차는 주소(#…)를 바꾸지 않고 스크롤만 한다 */
function scrollToSection(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

/** 지금 화면 위쪽에 걸친 섹션 — 목차의 현재 위치 표시 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(',')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id.replace('project-', ''))
      },
      { rootMargin: '0px 0px -60% 0px' },
    )
    for (const id of key.split(',')) {
      const el = document.getElementById(`project-${id}`)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [key])
  return active
}

function SectionHeading({ index, title, sub }: { index: number; title: string; sub?: string }) {
  return (
    <header className="flex flex-col gap-1">
      <span lang="en" className="text-14 font-semibold tracking-normal text-portfolio">
        {String(index).padStart(2, '0')}
      </span>
      <h2 className="text-22 font-semibold break-keep text-main sm:text-24">{title}</h2>
      {sub && <p className="text-15 break-keep text-sub">{sub}</p>}
    </header>
  )
}

function CodeBadge({ code }: { code: string }) {
  return (
    <span lang="en" className="h-fit shrink-0 rounded-badge bg-regular px-2 py-0.5 text-13 font-medium tracking-normal text-main">
      {code}
    </span>
  )
}

function TroubleItem({ trouble, open }: { trouble: ProjectTrouble; open: boolean }) {
  const rows = [
    ['문제', trouble.problem],
    ['해결', trouble.solution],
    ['배운 점', trouble.lesson],
  ].filter(([, v]) => v) as [string, string][]
  return (
    <details open={open} className="group border-t border-regular first:border-t-0 open:bg-light">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
        <CodeBadge code={trouble.code} />
        <span className="flex-1 text-15 font-semibold break-keep text-main sm:text-16">{trouble.title}</span>
        <PlusIcon size={20} className="mt-0.5 shrink-0 text-icon-sub group-open:hidden" />
        <MinusIcon size={20} className="mt-0.5 hidden shrink-0 text-icon-sub group-open:block" />
      </summary>
      <div className="flex flex-col gap-3 px-5 pb-6 sm:px-6">
        {rows.length > 0 ? (
          rows.map(([k, v]) => (
            <p key={k} className="grid gap-1 text-14 break-keep sm:grid-cols-[64px_1fr] sm:gap-4">
              <span className={`font-semibold ${k === '배운 점' ? 'text-portfolio' : 'text-main'}`}>{k}</span>
              <span className="text-sub">{v}</span>
            </p>
          ))
        ) : (
          <p className="text-14 break-keep text-sub">{trouble.summary}</p>
        )}
        {trouble.href && (
          <a href={trouble.href} className="flex w-fit items-center gap-1 text-14 font-semibold text-main hover:text-portfolio">
            코드와 함께 자세히 보기
            <ChevronRightIcon size={16} />
          </a>
        )}
      </div>
    </details>
  )
}

/** 디자인 섹션에 보여 줄 시안 수 */
const DESIGN_PREVIEW_MAX = 6

/** 디자인 — 같은 서비스의 Design 사례 시안 몇 장 + 피그마 공개 링크. 사례가 없으면 피그마 버튼만 */
function DesignSection({ project, index }: { project: Project; index: number }) {
  // 아래 '화면' 섹션에 이미 있는 그림은 빼고 고른다 — 디자인만 한 프로젝트는 둘이 겹치기 쉬워서,
  // 빼고도 DESIGN_PREVIEW_MAX 장이 남도록 두 배를 받아 거른다
  const shown = new Set(project.screens.items.map((s) => s.image))
  const preview = project.designCase
    ? designPreview(project.designCase, DESIGN_PREVIEW_MAX * 2)
        .filter((v) => !shown.has(v.image))
        .slice(0, DESIGN_PREVIEW_MAX)
    : []
  return (
    <section id="project-design" className="flex scroll-mt-6 flex-col gap-5">
      <SectionHeading
        index={index}
        title="디자인"
        sub={preview.length > 0 ? '피그마로 설계한 화면과 기준이에요. 원본 파일도 열어 볼 수 있어요.' : '피그마 원본 파일을 열어 볼 수 있어요.'}
      />
      {preview.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map(({ image, label, note }) => (
            <li key={image} className="flex flex-col gap-2">
              <div className="aspect-[4/3] overflow-hidden rounded-thumb border border-regular bg-regular">
                <img src={image} alt={label} loading="lazy" className="size-full object-cover object-top" />
              </div>
              <span className="text-14 font-semibold break-keep text-main">{label}</span>
              <span className="line-clamp-2 text-13 break-keep text-sub">{note}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        {project.designCase && <ButtonLink href={caseHref(project.designCase)} label="디자인 과정 전체 보기" />}
        <ButtonLink href={project.figma} label="피그마에서 보기" />
      </div>
    </section>
  )
}

export default function ProjectPage({ slug }: { slug: string }) {
  const project = findProject(slug)
  const sections = project ? sectionsOf(project) : []
  const active = useActiveSection(sections.map((s) => s.id))

  if (!project) {
    return (
      <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-4 px-5 py-24 sm:px-10">
        <h1 className="text-24 font-semibold text-main">찾는 프로젝트가 없어요.</h1>
        <a href="#/" className="w-fit text-15 font-semibold text-portfolio hover:underline underline-offset-4">
          홈으로 가기 →
        </a>
      </main>
    )
  }

  const next = nextProject(project.slug)
  const indexOf = (id: string) => sections.findIndex((s) => s.id === id) + 1
  const mobileScreens = project.screens.device === 'mobile'

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-300 px-5 sm:px-10">
        <nav aria-label="현재 위치" className="pt-6">
          <ol className="flex flex-wrap items-center gap-2 text-13 text-sub-weak">
            <li>
              <a href="#/" className="hover:text-main">
                홈
              </a>
            </li>
            <li aria-hidden="true" className="text-disabled">
              /
            </li>
            <li aria-current="page" className="font-medium text-main">
              {project.name}
            </li>
          </ol>
        </nav>

        {/* 화면(7) | 구조(5) */}
        <div className="grid grid-cols-1 gap-6 pt-8 pb-16 lg:grid-cols-12">
          {/* 구조 패널이 없는 프로젝트(디자인만 한 것)는 대표 화면을 넓게 */}
          <div className={`flex flex-col gap-6 ${project.structure ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <div className="flex flex-col gap-3">
              <RoleChips roles={project.roles} size="md" />
              <h1 className="text-28 font-semibold break-keep text-main sm:text-36 lg:text-40">{project.title}</h1>
              <p className="text-16 break-keep text-sub sm:text-18">{project.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.links.map((link, i) => (
                <ButtonLink key={link.href} {...link} primary={i === project.links.length - 1} />
              ))}
            </div>
            <ProjectCover cover={project.cover} name={project.name} />
          </div>

          {project.structure && (
            <aside aria-labelledby="structure-title" className="flex h-fit flex-col gap-5 rounded-card bg-light p-6 sm:p-8 lg:col-span-5">
              <div className="flex flex-col gap-1">
                <span lang="en" className="text-14 font-semibold tracking-normal text-portfolio">
                  Architecture
                </span>
                <h2 id="structure-title" className="text-24 font-semibold text-main">
                  {project.structure.title}
                </h2>
              </div>
              <ol className="flex flex-col">
                {project.structure.steps.map((step, i) => (
                  <li key={step.key} className="flex flex-col items-stretch">
                    {i > 0 && (
                      <span aria-hidden="true" className="py-1.5 text-center text-14 text-sub-weak">
                        ↓
                      </span>
                    )}
                    <div className="flex items-center gap-4 rounded-button border border-regular bg-default p-4">
                      <span
                        lang="en"
                        className="flex h-8 w-14 shrink-0 items-center justify-center rounded-badge bg-portfolio-soft text-12 font-semibold tracking-normal text-portfolio"
                      >
                        {step.key}
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-15 font-semibold text-main">{step.name}</span>
                        <span className="text-13 break-keep text-sub">{step.desc}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
              {project.structure.note && <p className="text-13 break-keep text-sub">{project.structure.note}</p>}
            </aside>
          )}
        </div>

        {/* 정보 띠 */}
        <dl className="grid grid-cols-1 gap-6 border-y border-regular py-6 sm:grid-cols-2 lg:grid-cols-4">
          {project.info.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-13 text-sub-weak">{label}</dt>
              <dd className="text-15 font-medium break-keep text-main">{value}</dd>
            </div>
          ))}
        </dl>

        {/* 숫자 */}
        {project.numbers.length > 0 && (
          <section aria-labelledby="numbers-title" className="flex flex-col gap-7 py-20">
            <h2 id="numbers-title" className="text-24 font-semibold text-main sm:text-32">
              숫자로 보는 결과
            </h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {project.numbers.map(({ value, label, note }) => (
                <li key={label} className="flex flex-col gap-2 rounded-card bg-light p-6">
                  <span className="text-24 font-semibold tracking-normal text-main sm:text-28">{value}</span>
                  <span className="text-15 font-semibold break-keep text-main">{label}</span>
                  <span className="text-13 break-keep text-sub">{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* 목차(3) + 본문(9) */}
      <div className="border-t border-light">
        <div className="mx-auto grid w-full max-w-300 grid-cols-1 gap-6 px-5 py-20 sm:px-10 lg:grid-cols-12">
          <nav aria-label="목차" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-6 flex flex-col gap-1">
              <p className="pb-1 text-13 font-medium text-sub-weak">목차</p>
              {sections.map((s, i) => {
                const on = active === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToSection(s.id)}
                    aria-current={on ? 'true' : undefined}
                    className={`flex items-center gap-2 border-l-2 px-3 py-2 text-left text-14 ${on ? 'border-portfolio bg-portfolio-soft font-semibold text-portfolio' : 'border-transparent text-sub hover:text-main'}`}
                  >
                    <span lang="en" className={`font-medium tracking-normal ${on ? '' : 'text-sub-weak'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="flex min-w-0 flex-col gap-16 lg:col-span-9">
            <section id="project-why" className="flex scroll-mt-6 flex-col gap-5">
              <SectionHeading index={indexOf('why')} title="왜 만들었나" />
              <p className="text-16 break-keep text-sub">{project.why}</p>
            </section>

            <DesignSection project={project} index={indexOf('design')} />

            {project.decisions && (
              <section id="project-decisions" className="flex scroll-mt-6 flex-col gap-5">
                <SectionHeading index={indexOf('decisions')} title="중요한 결정" sub="결정 하나마다 상황 → 고른 것 → 이유를 남겼어요." />
                <ul>
                  {project.decisions.map((d) => (
                    <li key={d.code} className="flex gap-4 border-t border-regular py-5">
                      <CodeBadge code={d.code} />
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-16 font-semibold break-keep text-main">{d.title}</h3>
                        <p className="text-14 break-keep text-sub">{d.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.chart && (
              <section id="project-chart" className="flex scroll-mt-6 flex-col gap-5">
                <SectionHeading index={indexOf('chart')} title={project.chart.title} sub={project.chart.sub} />
                <div className="flex flex-col gap-4 rounded-card bg-light p-6 sm:p-8">
                  <ul className="flex flex-col gap-4">
                    {project.chart.bars.map(([label, value], i) => {
                      const first = i === 0
                      const last = i === project.chart!.bars.length - 1
                      return (
                        <li key={label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[208px_1fr_auto]">
                          <span className={`text-14 break-keep text-main ${last ? 'font-semibold' : ''}`}>{label}</span>
                          <span aria-hidden="true" className="order-last col-span-2 h-3 overflow-hidden rounded-full bg-regular sm:order-none sm:col-span-1">
                            <span
                              className={`block h-full rounded-full ${first ? 'bg-icon-disabled' : 'bg-portfolio'}`}
                              style={{ width: `${value * 100}%` }}
                            />
                          </span>
                          <span className={`text-14 font-semibold tracking-normal tabular-nums ${first ? 'text-sub' : 'text-portfolio'}`}>
                            {value.toFixed(3)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {project.chart.chips.map((chip) => (
                      <li key={chip} className="rounded-full border border-regular bg-default px-3 py-1.5 text-13 font-medium text-main">
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <p className="text-13 break-keep text-sub">{project.chart.note}</p>
                </div>
              </section>
            )}

            {project.troubles && (
              <section id="project-troubles" className="flex scroll-mt-6 flex-col gap-5">
                <SectionHeading index={indexOf('troubles')} title="막힌 것과 해결" sub="문제가 생긴 순간과 고친 방법을 그대로 남겼어요." />
                <div className="overflow-hidden rounded-card border border-regular">
                  {project.troubles.map((t, i) => (
                    <TroubleItem key={t.code} trouble={t} open={i === 0} />
                  ))}
                </div>
              </section>
            )}

            <section id="project-screens" className="flex scroll-mt-6 flex-col gap-5">
              <SectionHeading index={indexOf('screens')} title="화면" />
              <ul className={`grid gap-6 ${mobileScreens ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {project.screens.items.map(({ image, label }) => (
                  <li key={label} className="flex flex-col gap-3">
                    <div
                      className={`overflow-hidden rounded-thumb border border-regular bg-regular ${mobileScreens ? 'aspect-[390/700]' : 'aspect-[16/10]'}`}
                    >
                      <img src={image} alt={label} loading="lazy" className="size-full object-cover object-top" />
                    </div>
                    <span className="text-14 font-medium text-main">{label}</span>
                  </li>
                ))}
              </ul>
            </section>

            {project.next && (
              <section id="project-next" className="flex scroll-mt-6 flex-col gap-5">
                <SectionHeading index={indexOf('next')} title="다음 단계" />
                <ul className="flex flex-col gap-3 rounded-card bg-light p-6">
                  {project.next.map(({ title, body }) => (
                    <li key={title} className="grid gap-1 text-15 break-keep sm:grid-cols-[180px_1fr] sm:gap-4">
                      <span className="font-semibold text-main">{title}</span>
                      <span className="text-sub">{body}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {next && (
        <div className="mx-auto w-full max-w-300 px-5 pb-20 sm:px-10">
          <a
            href={projectHref(next.slug)}
            className="group flex flex-wrap items-center justify-between gap-4 rounded-card bg-light p-6 hover:bg-regular sm:p-8"
          >
            <span className="flex flex-col gap-1">
              <span className="text-13 font-medium text-sub">다음 프로젝트</span>
              <span className="text-20 font-semibold break-keep text-main sm:text-24">{next.title}</span>
            </span>
            <span className="inline-flex h-12 items-center gap-1 rounded-button border border-black bg-default px-5 text-16 font-semibold text-main">
              다음 프로젝트
              <ChevronRightIcon size={18} />
            </span>
          </a>
        </div>
      )}
    </main>
  )
}
