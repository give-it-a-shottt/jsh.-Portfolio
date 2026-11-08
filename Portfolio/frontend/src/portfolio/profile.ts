import contributions from './githubContributions.json'

// 첫 화면(F-013)의 스킬 · GitHub · 연락처 데이터. 스킬은 실제 프로젝트 · 공개 레포에서 쓴 것만 적는다.
// GitHub 잔디는 npm run github:sync 로 받아 둔 저장본(githubContributions.json)을 그린다.

export const GITHUB_USER = 'give-it-a-shottt'
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`
export const CONTACT_EMAIL = 'jeongseonghoon4537@gmail.com'

export interface SkillGroup {
  title: string
  /** 이 묶음을 어디서 썼는지 한 줄 */
  where: string
  items: string[]
}

export const SKILLS: SkillGroup[] = [
  { title: 'Design', where: '모든 프로젝트의 화면 · 디자인 시스템', items: ['Figma', '디자인 시스템', 'Photoshop'] },
  {
    title: 'Frontend',
    where: '이 사이트 · Accio · 마에스트로 · PlanForMe · 미니 인프런',
    items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
  },
  {
    title: 'Backend',
    where: 'Accio · 마에스트로 · PlanForMe · 미니 인프런',
    items: ['Python', 'FastAPI', 'SQLAlchemy', 'pytest', 'JWT'],
  },
  {
    title: 'DB · 배포',
    where: '실제로 배포해 둔 서비스',
    items: ['PostgreSQL', 'Supabase', 'Neon', 'Docker', 'Vercel', 'Render', 'GitHub Actions'],
  },
  { title: 'AI', where: 'Accio 검색 · 작업 보조', items: ['Gemini API', 'Claude Code'] },
]

export interface Repo {
  name: string
  desc: string
  /** 같은 프로젝트의 프로젝트 페이지 slug — 있으면 카드에 함께 링크 */
  project?: string
}

/** 첫 화면에 보여 줄 대표 공개 레포 — 나머지는 GitHub 프로필에서 */
export const REPOS: Repo[] = [
  { name: 'jsh.-Portfolio', desc: '이 사이트 — 검색형 포트폴리오 · 공부 노트 · 사례 데모' },
  { name: 'Accio', desc: 'AI 자연어 검색 쇼핑몰을 무료 스택 위에 다시 만든 것', project: 'accio' },
  { name: 'mini-inflearn', desc: 'Next.js · FastAPI · PostgreSQL 강의 수강신청 서비스', project: 'mini-inflearn' },
  { name: 'PlanForMe', desc: '하루 할당량을 계산해 주는 플래너', project: 'planforme' },
  { name: 'remind', desc: '노션 노트 복습 퀴즈 앱', project: 'remind' },
  { name: 'my-nightly-project', desc: 'Nightly — AI 수면 코칭 & 구독 커머스', project: 'nightly' },
]

export function repoUrl(name: string) {
  return `${GITHUB_URL}/${name}`
}

export interface ContributionDay {
  date: string
  count: number
  /** GitHub 가 정한 진하기 0~4 */
  level: number
}

export const CONTRIBUTIONS: { syncedAt: string; total: number; days: ContributionDay[] } = contributions
