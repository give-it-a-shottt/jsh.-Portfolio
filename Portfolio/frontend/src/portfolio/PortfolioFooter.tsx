const LINKS = [{ label: 'GitHub', href: 'https://github.com/give-it-a-shottt' }]

// 모든 포트폴리오 화면 맨 아래 — 위 구분선 · 1200 폭 · 13px (피그마 01 Home 리뉴얼 Footer)
export default function PortfolioFooter() {
  return (
    <footer className="mt-auto border-t border-light px-5 pt-10 pb-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-between gap-x-6 gap-y-2 text-13">
        <p className="text-sub-weak">© 2026 jsh. — 검색하듯 둘러보는 포트폴리오</p>
        <p className="flex gap-1.5 font-medium text-sub">
          {LINKS.map(({ label, href }, i) => (
            <span key={label} className="flex gap-1.5">
              {i > 0 && <span aria-hidden="true">·</span>}
              <a href={href} target="_blank" rel="noreferrer" lang="en" className="hover:text-main hover:underline underline-offset-4">
                {label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </footer>
  )
}
