import { motion, useReducedMotion } from 'motion/react'
import GitHubHeatmap from './GitHubHeatmap'
import ProjectShowcase from './home/ProjectShowcase'
import { scrollToShowcase } from './home/scrollToShowcase'
import { EASE_OUT } from './motion'
import { NOTES, studyHref } from './notes'
import { ACTIVE_DAYS, CONTACT_EMAIL, CONTRIBUTIONS, GITHUB_URL, REPOS, SKILLS, repoUrl } from './profile'
import { PROJECT_LIST, showcaseProjects, type Project, type ShowcaseProject } from './projects'
import { CoverPlate } from './ProjectParts'
import { projectHref } from './routes'
import useReveal from './useReveal'

// 홈(F-018 · D-009) - 첫 문장 + 대표 프로젝트 목차 → 메인 5개 스크롤 섹션 → 그 밖의 작업 → 스킬 → GitHub → 공부 기록.
// 연락처는 첫 화면 한 곳에만 둔다 - 아래에 다시 두면 겹친다(사용자 결정).
// 프로젝트를 추가할 때는 projects.ts 의 PROJECT_LIST 에 하나 넣으면 된다. 메인이면 showcase 칸도 채운다.

const MAIN_PROJECTS = showcaseProjects(PROJECT_LIST)
const SUB_PROJECTS = PROJECT_LIST.filter((p) => p.tier === 'sub')

const GLANCE = [
  { value: `${PROJECT_LIST.length}개`, label: '프로젝트' },
  { value: `${NOTES.length}개`, label: '공부 노트' },
  { value: `${CONTRIBUTIONS.total.toLocaleString()}건`, label: 'GitHub 기여 (최근 1년)' },
]

/** 첫 화면 아래 목차 - 누르면 그 프로젝트 섹션으로 스크롤한다(PC 만, 모바일은 바로 아래에 섹션이 이어진다) */
function IndexCard({ project, index }: { project: ShowcaseProject; index: number }) {
  return (
    <button type="button" onClick={() => scrollToShowcase(project.slug)} className="lift group flex w-full flex-col gap-3 text-left">
      <CoverPlate cover={project.cover} rounded="rounded-thumb" />
      <span className="flex flex-col gap-0.5">
        <span className="text-13 font-semibold text-portfolio tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-16 font-semibold break-keep text-main">{project.name}</span>
      </span>
    </button>
  )
}

function SubCard({ project }: { project: Project }) {
  return (
    <a href={projectHref(project.slug)} className="lift group flex h-full items-center gap-4 sm:flex-col sm:items-stretch">
      <CoverPlate cover={project.cover} className="w-32 shrink-0 sm:w-auto" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="text-16 font-semibold break-keep text-main sm:text-18">{project.name}</h3>
        <p lang="en" className="hidden text-13 font-medium tracking-normal text-sub-weak sm:block">
          {project.roles.join(' · ')}
        </p>
        <p className="line-clamp-2 text-13 break-keep text-sub sm:text-14">{project.card.desc}</p>
      </div>
    </a>
  )
}

interface SectionTitleProps {
  id: string
  en: string
  title: string
  sub?: string
  /** 회색 구역이면 작은 빨강 글자를 한 단계 진하게 */
  panel?: boolean
}

function SectionTitle({ id, en, title, sub, panel = false }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <span lang="en" className={`text-14 font-semibold tracking-normal ${panel ? 'text-portfolio-strong' : 'text-portfolio'}`}>
        {en}
      </span>
      <h2 id={id} className="text-28 font-semibold break-keep text-main sm:text-40">
        {title}
      </h2>
      {sub && <p className="text-15 break-keep text-sub sm:text-16">{sub}</p>}
    </div>
  )
}

export default function HomePage() {
  const reduceMotion = useReducedMotion()
  const reveal = useReveal()
  // 첫 화면은 들어오자마자 위에서부터 차례로 떠오른다
  const rise = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 + order * 0.07, ease: EASE_OUT },
        }

  return (
    <main className="flex flex-1 flex-col">
      {/* 첫 화면 - 문장 | 소개 · 숫자 · 연락처, 아래에 대표 프로젝트 목차 */}
      <section className="px-5 pt-14 pb-16 sm:px-10 lg:pt-22 lg:pb-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-16 lg:gap-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <motion.h1
              {...rise(0)}
              className="text-[44px] leading-[1.25] font-semibold tracking-[-0.03em] break-keep text-main sm:text-[64px] lg:leading-[1.2] xl:text-[88px]"
            >
              귀찮은 일을
              <br />
              그냥 두지
              <br className="sm:hidden" /> 못하는
              <br className="hidden sm:inline" /> 편입니다<span className="text-portfolio">.</span>
            </motion.h1>

            <motion.div {...rise(2)} className="flex shrink-0 flex-col gap-7 lg:w-110 lg:gap-8">
              <p className="text-16 break-keep text-sub lg:text-20">
                실제 업무에서 마주칠 문제를 풀고,
                <br />그 과정에서 공부한 내용까지 함께 기록했습니다.
              </p>
              <dl className="flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-10">
                {GLANCE.map(({ value, label }) => (
                  <div key={label} className="flex flex-col-reverse gap-1">
                    <dt className="text-13 font-medium break-keep text-sub-weak">{label}</dt>
                    <dd className="text-28 font-semibold tracking-normal text-main">{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="flex flex-col gap-2 border-t border-regular pt-6 text-15 lg:pt-8">
                <li className="flex flex-wrap gap-x-3">
                  <span className="w-13 shrink-0 font-medium text-sub-weak">이메일</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold break-all text-main hover:text-portfolio">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li className="flex flex-wrap gap-x-3">
                  <span lang="en" className="w-13 shrink-0 font-medium text-sub-weak">
                    GitHub
                  </span>
                  <a href={GITHUB_URL} target="_blank" rel="noopener" className="font-semibold break-all text-main hover:text-portfolio">
                    {GITHUB_URL.replace('https://', '')} ↗<span className="sr-only"> (새 탭)</span>
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {MAIN_PROJECTS.length > 0 && (
            <nav aria-label="대표 프로젝트 목차" className="hidden lg:block">
              <ol className="grid grid-cols-5 gap-4">
                {MAIN_PROJECTS.map((project, i) => (
                  <motion.li key={project.slug} {...rise(3 + i)}>
                    <IndexCard project={project} index={i} />
                  </motion.li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      </section>

      <ProjectShowcase projects={MAIN_PROJECTS} />

      {/* 그 밖의 작업 - 비면 제목까지 그리지 않는다 */}
      {SUB_PROJECTS.length > 0 && (
        <section aria-labelledby="projects-sub-title" className="px-5 py-18 sm:px-10 lg:py-35">
          <div className="mx-auto flex w-full max-w-300 flex-col gap-8 sm:gap-12">
            <motion.div {...reveal()}>
              <SectionTitle id="projects-sub-title" en="Projects" title="그 밖의 작업" />
            </motion.div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
              {SUB_PROJECTS.map((project, i) => (
                <motion.li key={project.slug} {...reveal(i % 3)}>
                  <SubCard project={project} />
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 스킬 */}
      <section aria-labelledby="skills-title" className="bg-regular px-5 py-16 sm:px-10 lg:py-30">
        <div className="mx-auto grid w-full max-w-300 gap-10 lg:grid-cols-[384px_1fr] lg:gap-6">
          <motion.div {...reveal()}>
            <SectionTitle id="skills-title" en="Skills" title="스킬" sub="실제 프로젝트에서 써 본 것만 적었어요." panel />
          </motion.div>
          <ul className="flex flex-col">
            {SKILLS.map(({ title, where, items }) => (
              <motion.li
                key={title}
                {...reveal()}
                className="grid gap-4 border-t border-regular py-6 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[220px_1fr] sm:gap-6"
              >
                <div className="flex flex-col gap-1">
                  <h3 lang="en" className="text-18 font-semibold text-main">
                    {title}
                  </h3>
                  <p className="text-13 font-medium break-keep text-sub">{where}</p>
                </div>
                <ul className="flex flex-wrap content-start gap-2">
                  {items.map((item) => (
                    <li key={item} className="rounded-full border border-regular bg-default px-3.5 py-2 text-15 font-medium text-main">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* GitHub - 잔디 + 대표 레포 */}
      <section aria-labelledby="github-title" className="px-5 py-16 sm:px-10 lg:py-30">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-8 lg:gap-10">
          <motion.div {...reveal()} className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle id="github-title" en="GitHub" title="코드와 기록" />
            <p className="flex flex-col gap-1 sm:items-end">
              <span className="text-16 font-semibold text-main">최근 1년 기여 {CONTRIBUTIONS.total.toLocaleString()}건</span>
              <span className="text-13 font-medium text-sub-weak">
                기여한 날 {ACTIVE_DAYS}일 · {CONTRIBUTIONS.syncedAt} 기준
              </span>
            </p>
          </motion.div>
          <motion.div {...reveal()} className="min-w-0">
            <GitHubHeatmap />
          </motion.div>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-3">
            {REPOS.map(({ name, desc, project }, i) => (
              <motion.li key={name} {...reveal(i % 3)}>
                <div className="lift flex h-full flex-col gap-2 border-t border-regular pt-5 [--lift:2px]">
                  <a
                    href={repoUrl(name)}
                    target="_blank"
                    rel="noopener"
                    lang="en"
                    className="w-fit text-15 font-semibold break-all text-main hover:text-portfolio"
                  >
                    {name} ↗<span className="sr-only"> (새 탭)</span>
                  </a>
                  <p className="text-14 break-keep text-sub">{desc}</p>
                  {project && (
                    <a href={projectHref(project)} className="w-fit text-13 font-medium text-sub underline-offset-4 hover:text-main hover:underline">
                      프로젝트 페이지 →
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 공부 기록 - Study 로 가는 길 */}
      <section aria-labelledby="study-title" className="bg-regular px-5 py-12 sm:px-10 lg:py-20">
        <motion.div {...reveal()} className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span lang="en" className="text-14 font-semibold tracking-normal text-portfolio-strong">
              Study
            </span>
            <h2 id="study-title" className="text-24 font-semibold break-keep text-main sm:text-28">
              매일 공부한 기록 · 노트 {NOTES.length}개
            </h2>
            <p className="text-15 break-keep text-sub sm:text-16">강의 · 코딩테스트 · 디자인 툴을 공부하며 정리한 노트를 모았어요.</p>
          </div>
          <a
            href={studyHref()}
            className="lift inline-flex h-12 w-full items-center justify-center rounded-button border border-black bg-default px-5 text-16 font-semibold text-main [--lift:2px] sm:w-auto"
          >
            공부 노트 보기 →
          </a>
        </motion.div>
      </section>
    </main>
  )
}
