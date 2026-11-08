import { motion, useReducedMotion } from 'motion/react'
import GitHubHeatmap from './GitHubHeatmap'
import { EASE_OUT } from './motion'
import { NOTES, studyHref } from './notes'
import { CONTACT_EMAIL, CONTRIBUTIONS, GITHUB_URL, REPOS, SKILLS, repoUrl } from './profile'
import { PROJECT_LIST, type Project } from './projects'
import { ProjectCover } from './ProjectParts'
import RoleChips from './RoleChips'
import { projectHref } from './routes'

// 첫 화면(F-013) — 스크롤 한 번으로 나를 다 보는 긴 페이지.
// 소개(+ 한눈에: 숫자 · 이메일 · GitHub) → 프로젝트(PROJECT_LIST 전부, 작은 카드) → 스킬 → GitHub → 공부 기록.
// 연락처는 맨 위 '한눈에' 칸 한 곳에만 둔다 — 아래에 다시 두면 겹친다(사용자 결정).
// 검색은 헤더로 옮겼다. 프로젝트를 추가할 때는 projects.ts 의 PROJECT_LIST 에 하나 넣으면 카드가 생긴다.

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-light bg-default shadow-[0_1px_2px_rgb(45_42_37/0.06)] hover:shadow-[0_2px_4px_rgb(45_42_37/0.08)]">
      <ProjectCover cover={project.cover} name={project.name} rounded="rounded-none" loading="lazy" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <RoleChips roles={project.roles} />
        <h3 className="text-16 font-semibold break-keep text-main">
          <a href={projectHref(project.slug)} className="after:absolute after:inset-0 group-hover:text-portfolio">
            {project.card.title}
          </a>
        </h3>
        <p className="line-clamp-2 text-13 break-keep text-sub">{project.card.desc}</p>
      </div>
    </article>
  )
}

function SectionTitle({ id, en, title, sub }: { id: string; en: string; title: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span lang="en" className="text-14 font-semibold tracking-normal text-portfolio">
        {en}
      </span>
      <h2 id={id} className="text-24 font-semibold break-keep text-main sm:text-32">
        {title}
      </h2>
      {sub && <p className="text-15 break-keep text-sub sm:text-16">{sub}</p>}
    </div>
  )
}

interface HomePageProps {
  /** 인트로의 자기소개 영상을 다시 튼다 */
  onReplayIntro: () => void
}

export default function HomePage({ onReplayIntro }: HomePageProps) {
  const reduceMotion = useReducedMotion()
  const rise = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.15 + order * 0.08, ease: EASE_OUT },
        }
  // 아래 영역은 스크롤해서 화면에 들어올 때 한 번만 떠오른다
  const reveal = (order: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.5, delay: order * 0.05, ease: EASE_OUT },
        }

  const scrollTo = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const glance = [
    { value: `${PROJECT_LIST.length}개`, label: '프로젝트' },
    { value: `${NOTES.length}개`, label: '공부 노트' },
    { value: `${CONTRIBUTIONS.total.toLocaleString()}건`, label: 'GitHub 기여 (최근 1년)' },
  ]

  return (
    <main className="flex flex-1 flex-col">
      {/* 소개 — 글(7) | 한눈에(5) */}
      <section className="px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto grid w-full max-w-300 grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <motion.p {...rise(0)} lang="en" className="text-16 font-medium tracking-normal text-portfolio sm:text-18">
              Design · Fullstack
            </motion.p>
            <motion.h1 {...rise(1)} className="text-32 font-semibold break-keep text-main sm:text-40 lg:text-48">
              화면에서 구조까지,
              <br />
              하나의 경험으로.
            </motion.h1>
            <motion.p {...rise(2)} className="text-16 break-keep text-sub sm:text-20">
              실제 업무에서 마주칠 문제를 풀고, 그 과정에서 공부한 내용까지 함께 기록했습니다.
            </motion.p>
            <motion.div {...rise(3)} className="flex flex-wrap gap-2 pt-3">
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex h-12 items-center gap-1.5 rounded-button border border-black bg-default px-5 text-16 font-semibold text-main hover:bg-light"
              >
                <span aria-hidden="true">▶</span> 자기소개 영상 (1분)
              </button>
              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="inline-flex h-12 items-center rounded-button bg-portfolio px-5 text-16 font-semibold text-white hover:bg-portfolio-strong"
              >
                프로젝트 보기
              </button>
            </motion.div>
          </div>

          <motion.aside {...rise(4)} aria-label="한눈에 보기" className="flex flex-col gap-6 rounded-card bg-light p-6 sm:p-8 lg:col-span-5">
            <dl className="grid grid-cols-3 gap-4">
              {glance.map(({ value, label }) => (
                <div key={label} className="flex flex-col-reverse gap-1">
                  <dt className="text-12 break-keep text-sub-weak">{label}</dt>
                  <dd className="text-20 font-semibold tracking-normal text-main sm:text-24">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="flex flex-col gap-2 border-t border-regular pt-5 text-14">
              <li className="flex flex-wrap gap-x-3">
                <span className="w-14 shrink-0 text-sub-weak">이메일</span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium break-all text-main hover:text-portfolio">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex flex-wrap gap-x-3">
                <span lang="en" className="w-14 shrink-0 text-sub-weak">
                  GitHub
                </span>
                <a href={GITHUB_URL} target="_blank" rel="noopener" className="font-medium break-all text-main hover:text-portfolio">
                  {GITHUB_URL.replace('https://', '')} ↗<span className="sr-only"> (새 탭)</span>
                </a>
              </li>
            </ul>
          </motion.aside>
        </div>
      </section>

      {/* 프로젝트 — 목록 전부, 작은 카드 */}
      <section id="projects" aria-labelledby="projects-title" className="scroll-mt-4 bg-light px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-7">
          <motion.div {...reveal(0)}>
            <SectionTitle
              id="projects-title"
              en="Projects"
              title="프로젝트"
              sub="카드를 누르면 그 서비스의 디자인 · 프론트 · 백엔드를 한 페이지에서 볼 수 있어요."
            />
          </motion.div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECT_LIST.map((project, i) => (
              <motion.li key={project.slug} {...reveal(i % 4)}>
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 스킬 */}
      <section aria-labelledby="skills-title" className="px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-7">
          <motion.div {...reveal(0)}>
            <SectionTitle id="skills-title" en="Skills" title="스킬" sub="실제 프로젝트에서 써 본 것만 적었어요." />
          </motion.div>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map(({ title, where, items }, i) => (
              <motion.li key={title} {...reveal(i % 3)} className="flex flex-col gap-3 rounded-card border border-regular bg-default p-6">
                <div className="flex flex-col gap-1">
                  <h3 lang="en" className="text-18 font-semibold text-main">
                    {title}
                  </h3>
                  <p className="text-13 break-keep text-sub-weak">{where}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li key={item} className="rounded-full border border-regular bg-light px-3 py-1 text-13 font-medium text-main">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* GitHub — 잔디 + 대표 레포 */}
      <section aria-labelledby="github-title" className="bg-light px-5 py-16 sm:px-10 lg:py-20">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-7">
          <motion.div {...reveal(0)}>
            <SectionTitle id="github-title" en="GitHub" title="코드와 기록" />
          </motion.div>
          <motion.div {...reveal(1)} className="rounded-card border border-regular bg-default p-6 sm:p-8">
            <GitHubHeatmap />
          </motion.div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REPOS.map(({ name, desc, project }, i) => (
              <motion.li key={name} {...reveal(i % 3)} className="flex flex-col gap-2 rounded-card border border-regular bg-default p-5">
                <a
                  href={repoUrl(name)}
                  target="_blank"
                  rel="noopener"
                  lang="en"
                  className="w-fit text-15 font-semibold break-all text-main hover:text-portfolio"
                >
                  {name} ↗<span className="sr-only"> (새 탭)</span>
                </a>
                <p className="text-13 break-keep text-sub">{desc}</p>
                {project && (
                  <a href={projectHref(project)} className="mt-auto w-fit pt-1 text-13 font-medium text-sub hover:text-main hover:underline underline-offset-4">
                    프로젝트 페이지 →
                  </a>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 공부 기록 — Study 로 가는 길 */}
      <section aria-labelledby="study-title" className="px-5 py-16 sm:px-10 lg:py-20">
        <motion.div
          {...reveal(0)}
          className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-between gap-6 rounded-card border border-regular bg-default p-6 sm:p-8"
        >
          <div className="flex flex-col gap-2">
            <span lang="en" className="text-14 font-semibold tracking-normal text-study-strong">
              Study
            </span>
            <h2 id="study-title" className="text-22 font-semibold break-keep text-main sm:text-24">
              매일 공부한 기록 · 노트 {NOTES.length}개
            </h2>
            <p className="text-15 break-keep text-sub">강의 · 코딩테스트 · 디자인 툴을 공부하며 정리한 노트를 모았어요.</p>
          </div>
          <a
            href={studyHref()}
            className="inline-flex h-12 items-center rounded-button border border-black bg-default px-5 text-16 font-semibold text-main hover:bg-light"
          >
            공부 노트 보기 →
          </a>
        </motion.div>
      </section>

    </main>
  )
}
