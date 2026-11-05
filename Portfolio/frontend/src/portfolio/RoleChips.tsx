import { ROLE_BADGE_CLASS, type Role } from './data'

// 역할 칩 묶음 — 실제로 맡은 부분만(F-011). 화면 읽기 프로그램에는 "맡은 부분: Design, Front"로 읽힌다.
export default function RoleChips({ roles, size = 'sm' }: { roles: Role[]; size?: 'sm' | 'md' }) {
  return (
    <span className="flex flex-wrap gap-1">
      <span className="sr-only">맡은 부분:</span>
      {roles.map((role) => (
        <span
          key={role}
          lang="en"
          className={`rounded-badge font-semibold tracking-normal ${size === 'md' ? 'px-2 py-0.5 text-13' : 'px-2 py-0.5 text-12'} ${ROLE_BADGE_CLASS[role]}`}
        >
          {role}
        </span>
      ))}
    </span>
  )
}
