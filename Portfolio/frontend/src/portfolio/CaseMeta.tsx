import { caseRoles, type PortfolioCase } from './data'
import RoleChips from './RoleChips'

// 사례 위쪽 한 줄 — 역할 칩(실제로 맡은 부분) · 코드 · 날짜. 결과 목록과 상세 화면이 함께 쓴다.
export default function CaseMeta({ item }: { item: PortfolioCase }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-13 tracking-normal text-sub-weak">
      <RoleChips roles={caseRoles(item)} />
      <span lang="en" className="font-medium">
        {item.code}
      </span>
      <span aria-hidden="true">·</span>
      <span>{item.date}</span>
    </p>
  )
}
