import type { Project } from './projects'
import { isExternal } from './routes'

/** 버튼 링크 - My Design System 08 Button. primary 는 한 영역에 하나(오른쪽 끝) */
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
    : 'border border-black bg-default text-main'
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={`lift inline-flex items-center justify-center gap-1.5 rounded-button font-semibold whitespace-nowrap [--lift:2px] ${sizeClass} ${styleClass}`}
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

/** 대표 화면 - 데스크톱 화면은 한 장을 16:9로, 휴대폰 화면은 여러 장을 나란히 위쪽부터.
 *  홈 카드처럼 첫 화면 아래에 있으면 loading="lazy" 로 보일 때 내려받는다 */
export function ProjectCover({
  cover,
  name,
  rounded = 'rounded-card',
  loading = 'eager',
}: {
  cover: Project['cover']
  name: string
  rounded?: string
  loading?: 'eager' | 'lazy'
}) {
  if (cover.device === 'desktop') {
    return (
      <div className={`aspect-video overflow-hidden border border-regular bg-regular ${rounded}`}>
        <img src={cover.images[0]} alt={`${name} 대표 화면`} loading={loading} className="size-full object-cover object-top" />
      </div>
    )
  }
  return (
    <div className={`flex aspect-video items-end justify-center gap-[4%] overflow-hidden bg-regular px-[6%] pt-[6%] ${rounded}`}>
      {cover.images.map((image, i) => (
        <div key={image} className="h-full w-[26%] overflow-hidden rounded-t-thumb border border-b-0 border-regular bg-default">
          <img src={image} alt={i === 0 ? `${name} 대표 화면` : ''} loading={loading} className="size-full object-cover object-top" />
        </div>
      ))}
    </div>
  )
}

interface CoverPlateProps {
  cover: Project['cover']
  rounded?: string
  className?: string
}

/** 회색 판 위에 대표 화면을 올린 작은 그림 - 홈의 목차와 '그 밖의 작업' 카드(F-018).
 *  부모에 group 을 주면 호버할 때 판 테두리가 나타난다. 이름은 카드 글에 있어서 그림은 장식으로 둔다.
 *  버튼 안에도 들어가므로 span 으로만 만든다 */
export function CoverPlate({ cover, rounded = 'rounded-card', className = '' }: CoverPlateProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative block aspect-[16/10] overflow-hidden border border-transparent bg-regular transition-colors duration-450 group-hover:border-hover group-hover:duration-200 ${rounded} ${className}`}
    >
      {cover.device === 'desktop' ? (
        <img
          src={cover.images[0]}
          alt=""
          loading="lazy"
          className="absolute top-[10.5%] left-[10.5%] aspect-[16/10] w-[79%] rounded-[clamp(4px,0.6vw,8px)] border border-regular bg-default object-cover object-top"
        />
      ) : (
        <span className="absolute inset-x-0 top-[13%] flex justify-center gap-[4%]">
          {cover.images.map((image) => (
            <img
              key={image}
              src={image}
              alt=""
              loading="lazy"
              className="aspect-[390/844] w-1/4 rounded-t-[clamp(4px,0.8vw,10px)] border border-regular bg-default object-cover object-top"
            />
          ))}
        </span>
      )}
    </span>
  )
}
