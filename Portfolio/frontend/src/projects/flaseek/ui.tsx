import type { ReactNode } from 'react'
import productsImage from './assets/products.webp'
import heartIcon from './assets/icon-heart.svg'
import { type Crop, type Product, won } from './data'
import { flaseekHref } from './routes'
import { toggleWish, useToast, useWishes } from './store'

/** 캡처 원본(products.webp)의 가로 크기 — crop 좌표를 비율로 바꿀 때 쓴다 */
const SPRITE_WIDTH = 1920

/**
 * 캡처 한 장에서 crop 영역만 보여준다. 칸의 비율이 crop 과 달라도 object-fit: cover 처럼 가운데를 채운다.
 * 칸 크기(cqw·cqh)를 알아야 해서 container-type: size 를 쓴다 — className 으로 높이(또는 aspect)를 꼭 정한다.
 */
export function SpriteImage({ crop, className = '', alt = '' }: { crop: Crop; className?: string; alt?: string }) {
  const ratio = crop.w / crop.h
  return (
    <div className={`relative overflow-hidden [container-type:size] ${className}`}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: `max(100cqw, calc(100cqh * ${ratio}))`, aspectRatio: `${crop.w} / ${crop.h}` }}
      >
        <img
          src={productsImage}
          alt={alt}
          loading="lazy"
          draggable={false}
          className="absolute max-w-none"
          style={{
            width: `${(SPRITE_WIDTH / crop.w) * 100}%`,
            left: `${(-crop.x / crop.w) * 100}%`,
            top: `${(-crop.y / crop.h) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

/** 1200 콘텐츠 폭 + 모바일 좌우 20 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-5 lg:px-10 ${className}`}>{children}</div>
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-badge bg-flaseek-pink-soft px-2 py-1 text-12 font-medium whitespace-nowrap text-flaseek-text">{label}</span>
  )
}

/** 버튼 — L 48 · MO 주요 CTA 56. 주요는 진한 핑크 채움 + 흰 글자, 보조는 선 + 검정 글자 */
export const BUTTON_PRIMARY =
  'flex items-center justify-center rounded-sm bg-flaseek px-6 text-16 font-semibold whitespace-nowrap text-white'
export const BUTTON_SECONDARY =
  'flex items-center justify-center rounded-sm border border-regular bg-white px-6 text-16 font-semibold whitespace-nowrap text-main'

/** 알약 탭 — 높이 40, 선택은 진한 핑크 채움 */
export function PillTab({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-10 shrink-0 items-center rounded-full px-4 text-14 font-medium whitespace-nowrap ${
        selected ? 'bg-flaseek text-white' : 'border border-regular bg-white text-sub'
      }`}
    >
      {label}
    </button>
  )
}

/** 필터 칩 — 높이 36, 선택은 옅은 핑크 + 핑크 글자·테두리 */
export function FilterChip({ label, selected, onClick, lang }: { label: string; selected: boolean; onClick: () => void; lang?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      lang={lang}
      className={`flex h-9 shrink-0 items-center rounded-full border px-4 text-14 font-medium whitespace-nowrap ${
        selected ? 'border-flaseek-text bg-flaseek-soft text-flaseek-text' : 'border-regular bg-white text-sub'
      }`}
    >
      {label}
    </button>
  )
}

/** 찜 버튼 — 찜한 상품은 옅은 핑크 바탕 */
export function WishButton({ id, className = '', iconSize = 20, icon = heartIcon }: { id: number; className?: string; iconSize?: number; icon?: string }) {
  const wished = useWishes().has(id)
  return (
    <button
      type="button"
      onClick={() => toggleWish(id)}
      aria-pressed={wished}
      aria-label={wished ? '찜 해제' : '찜하기'}
      className={`flex items-center justify-center ${wished ? 'bg-flaseek-soft' : 'bg-white'} ${className}`}
    >
      <img src={icon} alt="" width={iconSize} height={iconSize} />
    </button>
  )
}

/**
 * 상품 카드 — 정보 순서 고정: 이미지 → 상품명 → 할인율+판매가(+정가) → 장당가(세트) → 별점 → 태그 최대 2개.
 * 모바일 2열은 상품명 13·가격 14, PC 4열은 상품명 14·가격 20.
 */
export function ProductCard({ product }: { product: Product }) {
  const href = flaseekHref('/detail', { id: product.id })
  return (
    <article className="flex min-w-0 flex-col gap-3">
      <div className="relative">
        <a href={href} aria-label={product.name} className="block">
          <SpriteImage crop={product.crop} className="aspect-square w-full rounded-thumb" />
        </a>
        <WishButton id={product.id} className="absolute right-2 bottom-2 rounded-full p-1 shadow-flaseek-2" />
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <a href={href} className="line-clamp-2 text-13 text-main lg:text-14">
          {product.name}
        </a>
        <p className="flex flex-wrap items-baseline gap-x-1">
          <span className="text-14 font-semibold text-flaseek-text lg:text-18">{product.discount}%</span>
          <span className="text-14 font-semibold text-main lg:text-20">{won(product.price)}</span>
          <span className="text-12 text-sub-weak line-through">{won(product.original)}</span>
        </p>
        {product.perPiece && <p className="text-12 font-medium text-flaseek-text">장당 {won(product.perPiece)}</p>}
        <p className="text-12 text-sub">
          ★ {product.rating} ({product.reviews.toLocaleString('ko-KR')})
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          {product.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </article>
  )
}

/** 상품 카드 격자 — 모바일 2열, 태블릿 3열, PC 4열 */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

/** 화면 아래 토스트 — 모바일은 하단 구매바 위로 띄운다 */
export function ToastHost() {
  const toast = useToast()
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-60 flex justify-center px-5 lg:bottom-10">
      <p
        key={toast.id}
        role="status"
        className="w-full max-w-90 rounded-thumb bg-main px-4 py-3.5 text-center text-14 font-medium text-white shadow-flaseek-3 motion-safe:animate-[accio-toast-in_200ms_ease-out]"
      >
        {toast.message}
      </p>
    </div>
  )
}
