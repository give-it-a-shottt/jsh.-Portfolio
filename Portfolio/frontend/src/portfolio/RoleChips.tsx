import type { Role } from './data'

// 역할 칩 묶음 - 실제로 맡은 부분만(F-011). 빨강 포인트가 살도록 네 역할 모두 같은 회색(F-018). 화면 읽기 프로그램에는 "맡은 부분: Design, Front"로 읽힌다.
export default function RoleChips({ roles, size = 'sm' }: { roles: Role[]; size?: 'sm' | 'md' }) {
  return (
    <span className="flex flex-wrap gap-1">
      <span className="sr-only">맡은 부분:</span>
      {roles.map((role) => (
        <span
          key={role}
          lang="en"
          className={`rounded-badge bg-regular px-2 py-0.5 font-medium tracking-normal text-sub ${size === 'md' ? 'text-13' : 'text-12'}`}
        >
          {role}
        </span>
      ))}
    </span>
  )
}
