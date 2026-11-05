import type { Project } from './projects'
import { isExternal } from './routes'

/** 버튼 링크 — My Design System 08 Button. primary 는 한 영역에 하나(오른쪽 끝) */
export function ButtonLink({
  href,
  label,
  primary = false,
  size = 'md',
}: {
  href: string
  label: string
  primary?: boolean
  size?: 'md' | 'lg'
}) {
  const external = isExternal(href)
  const sizeClass = size === 'lg' ? 'h-12 px-5 text-16' : 'h-10 px-4 text-15'
  const styleClass = primary
    ? 'bg-portfolio text-white hover:bg-portfolio-strong'
    : 'border border-black bg-default text-main hover:bg-light'
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={`inline-flex items-center justify-center gap-1.5 rounded-button font-semibold whitespace-nowrap ${sizeClass} ${styleClass}`}
    >
      {label}
      {external && (
        <>
          <span aria-hidden="true">↗</span>
          <span className="sr-only">(새 탭)</span>
        </>
      )}
    </a>
  )
}

/** 대표 화면 — 데스크톱 화면은 한 장을 16:9로, 휴대폰 화면은 여러 장을 나란히 위쪽부터 */
export function ProjectCover({ cover, name, rounded = 'rounded-card' }: { cover: Project['cover']; name: string; rounded?: string }) {
  if (cover.device === 'desktop') {
    return (
      <div className={`aspect-video overflow-hidden bg-regular ${rounded}`}>
        <img src={cover.images[0]} alt={`${name} 대표 화면`} className="size-full object-cover object-top" />
      </div>
    )
  }
  return (
    <div className={`flex aspect-video items-end justify-center gap-[4%] overflow-hidden bg-default px-[6%] pt-[6%] ${rounded}`}>
      {cover.images.map((image, i) => (
        <div key={image} className="h-full w-[26%] overflow-hidden rounded-t-thumb border border-b-0 border-regular bg-default">
          <img src={image} alt={i === 0 ? `${name} 대표 화면` : ''} className="size-full object-cover object-top" />
        </div>
      ))}
    </div>
  )
}
