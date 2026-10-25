import type { ReactNode } from 'react'
import productsImage from './assets/products.webp'
import { type Crop, type Product, won } from './data'
import { flaseekHref } from './routes'
import { toggleWish, useToast, useWishes } from './store'

/** 스프라이트(products.webp)의 가로 크기 — crop 좌표를 비율로 바꿀 때 쓴다 */
const SPRITE_WIDTH = 1040

/**
 * 스프라이트 한 장에서 crop 영역만 보여준다. 칸의 비율이 crop 과 달라도 object-fit: cover 처럼 가운데를 채운다.
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

/** 하트 아이콘(20·24) — 찜 상태에 따라 색·채움을 바꾸려고 인라인으로 그린다 */
const HEART_PATHS = {
  20: 'M17.3667 3.84167C16.941 3.41584 16.4357 3.07804 15.8795 2.84757C15.3232 2.6171 14.7271 2.49848 14.125 2.49848C13.5229 2.49848 12.9268 2.6171 12.3705 2.84757C11.8143 3.07804 11.309 3.41584 10.8833 3.84167L10 4.725L9.11667 3.84167C8.25692 2.98192 7.09086 2.49892 5.875 2.49892C4.65914 2.49892 3.49308 2.98192 2.63333 3.84167C1.77359 4.70141 1.29059 5.86747 1.29059 7.08333C1.29059 8.29919 1.77359 9.46526 2.63333 10.325L3.51667 11.2083L10 17.6917L16.4833 11.2083L17.3667 10.325C17.7925 9.89937 18.1303 9.39401 18.3608 8.8378C18.5912 8.28158 18.7099 7.68541 18.7099 7.08333C18.7099 6.48126 18.5912 5.88509 18.3608 5.32887C18.1303 4.77265 17.7925 4.2673 17.3667 3.84167Z',
  24: 'M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.90831 3.57831 8.50903 2.99871 7.05 2.99871C5.59097 2.99871 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.12831 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.9379 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72719 21.351 5.12076 20.84 4.61Z',
}

/** 찜 버튼 — 찜한 상품은 브랜드 핑크 바탕에 흰 하트 */
export function WishButton({ id, className = '', iconSize = 20 }: { id: number; className?: string; iconSize?: 20 | 24 }) {
  const wished = useWishes().has(id)
  return (
    <button
      type="button"
      onClick={() => toggleWish(id)}
      aria-pressed={wished}
      aria-label={wished ? '찜 해제' : '찜하기'}
      className={`flex items-center justify-center ${wished ? 'border-flaseek-pink bg-flaseek-pink text-white' : 'border-regular bg-white text-icon-main'} ${className}`}
    >
      {/* 채운 하트는 같은 크기여도 선 하트보다 커 보여서 조금 줄인다 */}
      <svg aria-hidden width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`} fill={wished ? 'currentColor' : 'none'} className={wished ? 'scale-80' : ''}>
        <path d={HEART_PATHS[iconSize]} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
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
