import { useEffect, useRef, useState, type ReactNode } from 'react'
import chevronDown from '../assets/icon-chevron-down.svg'
import heart24 from '../assets/icon-heart-24.svg'
import detailPreview from '../assets/detail-preview.webp'
import {
  GALLERY_EXTRAS,
  LEG_TYPES,
  PHOTO_REVIEWS,
  REVIEWS,
  REVIEW_SUMMARY,
  SET_OPTIONS,
  findProduct,
  won,
  type Crop,
  type Product,
} from '../data'
import { addToCart, showDemoNotice, showToast } from '../store'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Container, SpriteImage, Tag, WishButton } from '../ui'

/** 앵커 탭 — 원하는 곳으로 바로 간다 */
const SECTIONS = [
  { id: 'detail-info', label: '상세정보' },
  { id: 'detail-reviews', label: '리뷰 862' },
  { id: 'detail-qna', label: 'Q&A' },
  { id: 'detail-shipping', label: '배송·교환' },
] as const
type SectionId = (typeof SECTIONS)[number]['id']

const sameCrop = (a: Crop, b: Crop) => a.x === b.x && a.y === b.y

/** PC 는 큰 사진 + 썸네일 4장, 모바일은 옆으로 넘기는 사진 + 1 / 4 표시 */
function Gallery({ crop, name }: { crop: Crop; name: string }) {
  const images = [crop, ...GALLERY_EXTRAS.filter((extra) => !sameCrop(extra, crop))].slice(0, 4)
  const [current, setCurrent] = useState(0)

  return (
    <div className="flex flex-col gap-4 lg:w-[calc(50%-12px)] lg:shrink-0">
      {/* 모바일 — 화면 폭 정사각형을 옆으로 넘긴다 */}
      <div className="relative -mx-5 lg:hidden">
        <ul
          onScroll={(event) => setCurrent(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((image, index) => (
            <li key={`${image.x}-${image.y}`} className="w-full shrink-0 snap-start">
              <SpriteImage crop={image} alt={index === 0 ? name : ''} className="aspect-square w-full" />
            </li>
          ))}
        </ul>
        <span className="absolute right-3 bottom-4 rounded-full bg-main px-2 py-1 text-12 font-medium tracking-normal text-white">
          {current + 1} / {images.length}
        </span>
      </div>

      {/* PC */}
      <SpriteImage crop={images[current]} alt={name} className="hidden aspect-square w-full rounded-card lg:block" />
      <ul className="hidden gap-4 lg:flex">
        {images.map((image, index) => (
          <li key={`${image.x}-${image.y}`} className="flex-1">
            <button
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`${index + 1}번째 사진 보기`}
              aria-pressed={current === index}
              className={`block w-full overflow-hidden rounded-thumb border-2 ${current === index ? 'border-black' : 'border-transparent'}`}
            >
              <SpriteImage crop={image} className="aspect-square w-full" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface TypeSelectsProps {
  count: number
  types: string[]
  onChange: (types: string[]) => void
}

/** 세트에 담을 타입 — 고른 칸 다음에 빈 칸 하나를 더 보여준다 */
function TypeSelects({ count, types, onChange }: TypeSelectsProps) {
  const shown = Math.min(count, types.length + 1)
  return (
    <div role="group" aria-labelledby="type-label" className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-14">
        <p id="type-label" className="font-semibold">
          타입 선택
        </p>
        <p className="text-sub">
          {types.length} / {count} 선택
        </p>
      </div>
      {Array.from({ length: shown }, (_, index) => (
        <label key={index} className="relative flex">
          <span className="sr-only">{index + 1}번째 타입</span>
          <select
            id={`type-select-${index}`}
            value={types[index] ?? ''}
            onChange={(event) => {
              const next = [...types]
              next[index] = event.target.value
              onChange(next.filter(Boolean))
            }}
            className={`h-12 w-full appearance-none rounded-sm border border-regular bg-white pr-10 pl-4 text-14 outline-none focus:border-black ${
              types[index] ? 'text-main' : 'text-disabled'
            }`}
          >
            <option value="" disabled>
              {index + 1}번째 타입을 선택해 주세요
            </option>
            {LEG_TYPES.map((type) => (
              <option key={type} value={type} className="text-main">
                {index + 1}. {type}
              </option>
            ))}
          </select>
          <img src={chevronDown} alt="" width={20} height={20} className="pointer-events-none absolute top-3.5 right-3" />
        </label>
      ))}
    </div>
  )
}

function Accordion({ id, title, open, onToggle, children }: { id: SectionId; title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-14 border-b border-regular lg:scroll-mt-36">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          className="flex w-full items-center justify-between py-4 text-left text-16 font-semibold lg:py-5"
        >
          {title}
          <img src={chevronDown} alt="" width={20} height={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h2>
      {open && (
        <div id={`${id}-body`} className="pb-5 text-14 text-sub">
          {children}
        </div>
      )}
    </section>
  )
}

interface DetailPageProps {
  params: URLSearchParams
}

// 상품 상세 — 구매 영역은 스크롤해도 따라온다(PC 상단·모바일 하단 고정). 상세는 접고, 리뷰는 요약을 먼저.
export default function DetailPage({ params }: DetailPageProps) {
  const base = findProduct(Number(params.get('id'))) ?? findProduct(2)!
  const isSet = base.setCount !== undefined
  const [setCount, setSetCount] = useState(base.setCount ?? 1)
  const [types, setTypes] = useState<string[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<ReadonlySet<SectionId>>(new Set())
  const [activeSection, setActiveSection] = useState<SectionId>('detail-info')
  const [barVisible, setBarVisible] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  // 세트 칩을 바꾸면 그 매수의 상품(이름·가격·사진)으로 바꿔 보여준다
  const product: Product = isSet ? findProduct(SET_OPTIONS.find((option) => option.count === setCount)!.productId)! : base
  const needTypes = isSet && setCount > 1
  const optionSummary = types.length > 0 ? `${setCount}매 · ${types[0]}${types.length > 1 ? ` 외 ${types.length - 1}개` : ''}` : `${setCount}매 · 타입 선택 전`

  // PC — 구매 버튼이 화면 위로 사라지면 상단 구매바를 띄운다
  useEffect(() => {
    const actions = actionsRef.current
    if (!actions) return
    const observer = new IntersectionObserver(([entry]) => setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(actions)
    return () => observer.disconnect()
  }, [])

  // 지금 보고 있는 구역을 앵커 탭에 표시한다
  useEffect(() => {
    const onScroll = () => {
      const offset = window.innerWidth >= 1024 ? 160 : 64
      let current: SectionId = 'detail-info'
      for (const { id } of SECTIONS) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= offset) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleAccordion = (id: SectionId, force?: boolean) =>
    setOpenAccordions((open) => {
      const next = new Set(open)
      if (force ?? !next.has(id)) next.add(id)
      else next.delete(id)
      return next
    })

  const goToSection = (id: SectionId) => {
    if (id === 'detail-qna' || id === 'detail-shipping') toggleAccordion(id, true)
    // 아코디언이 열린 다음 위치로 간다
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const changeSet = (count: number) => {
    setSetCount(count)
    setTypes((current) => current.slice(0, count))
  }

  /** 세트는 타입을 다 골라야 담을 수 있다 */
  const ready = () => {
    if (!needTypes || types.length === setCount) return true
    showToast(`타입을 ${setCount}개 모두 골라 주세요`)
    document.getElementById(`type-select-${types.length}`)?.focus()
    return false
  }
  const onCart = () => ready() && addToCart()
  const onBuy = () => ready() && showDemoNotice('결제는')

  return (
    <>
      {/* PC 상단 고정 구매바 */}
      {barVisible && (
        <div className="fixed inset-x-0 top-0 z-40 hidden bg-white shadow-flaseek-2 lg:block">
          <Container className="flex items-center gap-4 py-3">
            <SpriteImage crop={product.crop} className="size-12 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-14 font-semibold">{product.name}</p>
              {needTypes && <p className="truncate text-12 text-sub">{optionSummary}</p>}
            </div>
            <p className="text-20 font-semibold">{won(product.price)}</p>
            <button type="button" onClick={onCart} className={`${BUTTON_SECONDARY} h-12`}>
              장바구니
            </button>
            <button type="button" onClick={onBuy} className={`${BUTTON_PRIMARY} h-12`}>
              구매하기
            </button>
          </Container>
        </div>
      )}

      <Container className="flex flex-col gap-4 lg:pt-8">
        <p className="hidden text-12 text-sub-weak lg:block">
          홈 / <span lang="en">LEGWEAR</span> / 압박스타킹
        </p>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
          <Gallery key={product.id} crop={product.crop} name={product.name} />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-4 lg:gap-2">
              <div className="flex gap-1">
                <Tag label="BEST" />
                <Tag label={product.tags[0]} />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-20 font-semibold lg:text-28">{product.name}</h1>
                <p className="flex items-center gap-2 text-14">
                  <span className="font-semibold tracking-normal">★ {product.rating}</span>
                  <button type="button" onClick={() => goToSection('detail-reviews')} className="font-medium text-flaseek-text">
                    리뷰 {product.reviews.toLocaleString('ko-KR')}개 보기
                  </button>
                </p>
              </div>
            </div>

            <div className="-mt-2 flex flex-col gap-1 lg:mt-0">
              <p className="text-13 text-sub-weak line-through lg:text-14">{won(product.original)}</p>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-24 font-semibold text-flaseek-text lg:text-28">{product.discount}%</span>
                <span className="text-24 font-semibold lg:text-32">{won(product.price)}</span>
                {product.perPiece && <span className="text-12 font-medium text-flaseek-text lg:text-14">장당 {won(product.perPiece)}</span>}
              </p>
            </div>

            <hr className="hidden border-regular lg:block" />
            <dl className="hidden flex-col gap-2 text-14 lg:flex">
              {isSet && (
                <div className="flex gap-4">
                  <dt className="w-14 shrink-0 text-sub">구성</dt>
                  <dd>원하는 타입 {setCount}매 선택 (압박스타킹·레깅스)</dd>
                </div>
              )}
              <div className="flex gap-4">
                <dt className="w-14 shrink-0 text-sub">혜택</dt>
                <dd>회원가입 시 할인 쿠폰 3종 즉시 발급</dd>
              </div>
            </dl>

            {isSet && (
              <div role="radiogroup" aria-labelledby="set-label" className="flex flex-col gap-3">
                <p id="set-label" className="text-14 font-semibold">
                  세트 구성
                </p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {SET_OPTIONS.map((option) => {
                    const selected = option.count === setCount
                    return (
                      <button
                        key={option.count}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => changeSet(option.count)}
                        className={`flex flex-col items-start gap-1 rounded-thumb px-4 py-3 text-left ${
                          selected ? 'border-[1.5px] border-flaseek-text bg-flaseek-soft text-flaseek-text' : 'border border-regular bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`text-16 font-semibold ${selected ? '' : 'text-main'}`}>{option.count}매</span>
                          {option.badge && <Tag label={option.badge} />}
                        </span>
                        <span className={`text-12 ${selected ? '' : 'text-sub'}`}>{option.note}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {needTypes && <TypeSelects count={setCount} types={types} onChange={setTypes} />}

            <div ref={actionsRef} className="hidden flex-col gap-6 lg:flex">
              <hr className="border-regular" />
              <div className="flex items-center justify-between">
                <p className="text-14 font-medium text-sub">총 상품 금액</p>
                <p className="text-28 font-semibold">{won(product.price)}</p>
              </div>
              <div className="flex gap-2">
                <WishButton id={product.id} icon={heart24} iconSize={24} className="size-12 shrink-0 rounded-sm border border-regular" />
                <button type="button" onClick={onCart} className={`${BUTTON_SECONDARY} h-12 flex-1`}>
                  장바구니
                </button>
                <button type="button" onClick={onBuy} className={`${BUTTON_PRIMARY} h-12 flex-1`}>
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* 앵커 탭 — 모바일은 위에, PC 는 구매바가 뜨면 그 아래에 붙는다 */}
      <div className="h-8 lg:h-20" />
      <nav aria-label="상품 정보 바로가기" className={`sticky top-0 z-30 bg-white ${barVisible ? 'lg:top-18' : ''}`}>
        <div className="mx-auto w-full max-w-[1280px] lg:px-10">
          <ul className="flex border-b border-regular">
            {SECTIONS.map(({ id, label }) => {
              const active = activeSection === id
              return (
                <li key={id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goToSection(id)}
                    aria-current={active ? 'location' : undefined}
                    className={`-mb-px w-full border-b-2 py-3 text-14 lg:py-4 lg:text-16 ${
                      active ? 'border-black font-semibold text-main' : 'border-transparent text-sub'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* 상세 — 처음엔 900px(모바일 480)만 보여주고 더보기로 펼친다 */}
      <section id="detail-info" aria-label="상세정보" className="mx-auto flex max-w-198 scroll-mt-14 flex-col items-center gap-4 lg:scroll-mt-36 lg:gap-0 lg:pt-12">
        <div className={`relative w-full overflow-hidden ${detailOpen ? '' : 'h-120 lg:h-225'}`}>
          <img src={detailPreview} alt="압박스타킹을 신은 다리 연출 컷" width={928} height={1152} className="h-auto w-full" />
          {!detailOpen && <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-white/0 to-white lg:h-60" />}
          <p className="absolute top-3 left-3 text-11 text-sub lg:top-4 lg:left-4">시안용 AI 생성 이미지</p>
        </div>
        <div className="w-full px-5 lg:w-96 lg:px-0">
          <button
            type="button"
            onClick={() => setDetailOpen((open) => !open)}
            aria-expanded={detailOpen}
            className={`${BUTTON_SECONDARY} h-14 w-full lg:h-12`}
          >
            {detailOpen ? '상세정보 접기' : '상세정보 더보기'}
          </button>
        </div>
      </section>

      {/* 리뷰 — 평균·사이즈감·압박감 요약을 먼저 */}
      <section id="detail-reviews" aria-labelledby="reviews-title" className="mx-auto flex max-w-198 scroll-mt-14 flex-col gap-4 px-5 pt-12 lg:scroll-mt-36 lg:gap-6 lg:px-0 lg:pt-20">
        <h2 id="reviews-title" className="flex gap-2 text-20 font-semibold lg:text-28">
          리뷰 <span className="text-flaseek-text">862</span>
        </h2>
        <div className="flex flex-col gap-4 rounded-card bg-light p-5 lg:flex-row lg:gap-10 lg:p-6">
          <div className="flex items-center gap-2 lg:w-40 lg:shrink-0 lg:flex-col lg:gap-1">
            <p className="text-32 font-semibold tracking-normal lg:text-40">4.9</p>
            <div className="flex flex-col gap-0.5 lg:items-center lg:gap-1">
              <p aria-label="별점 5점 만점에 4.9점" className="text-14 font-semibold tracking-normal text-flaseek-text">
                ★★★★★
              </p>
              <p className="text-12 text-sub">862개 리뷰</p>
            </div>
          </div>
          {REVIEW_SUMMARY.map(({ title, bars }) => {
            const top = Math.max(...bars.map(({ value }) => value))
            return (
              <div key={title} className="flex flex-1 flex-col gap-2 lg:gap-3">
                <p className="text-14 font-semibold">{title}</p>
                {bars.map(({ label, value }) => {
                  const isTop = value === top
                  return (
                    <div key={label} className="flex items-center gap-2 text-12">
                      <span className={`w-14 shrink-0 ${isTop ? 'text-main' : 'text-sub'}`}>{label}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-regular">
                        <span className={`block h-full ${isTop ? 'bg-flaseek' : 'bg-icon-sub-weak'}`} style={{ width: `${value}%` }} />
                      </span>
                      <span className={`w-7 shrink-0 text-right font-medium tracking-normal ${isTop ? 'text-main' : 'text-sub'}`}>{value}%</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="hidden flex-col gap-3 lg:flex">
          <p className="text-14 font-semibold">포토 리뷰 128</p>
          <ul className="flex gap-4">
            {PHOTO_REVIEWS.map((photo) => (
              <li key={`${photo.x}-${photo.y}`} className="flex-1">
                <SpriteImage crop={photo} className="aspect-square w-full rounded-thumb" />
              </li>
            ))}
          </ul>
        </div>

        <ul>
          {REVIEWS.map((review) => (
            <li key={review.author} className="flex flex-col gap-2 border-b border-light pt-2 pb-4 lg:py-6">
              <p className="flex items-center gap-2">
                <span aria-label={`별점 ${review.stars}점`} className="text-14 font-semibold tracking-normal text-flaseek-text">
                  {'★'.repeat(review.stars)}
                  {'☆'.repeat(5 - review.stars)}
                </span>
                <span className="text-12 text-sub-weak">
                  {review.author}님 · {review.date}
                </span>
              </p>
              <p className="text-12 font-medium text-sub">{review.option}</p>
              <p className="text-14 text-main lg:text-15">{review.body}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => showToast('시안에서는 리뷰를 2개만 보여줘요')}
            className={`${BUTTON_SECONDARY} h-12 w-full lg:w-96`}
          >
            리뷰 862개 모두 보기
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-198 px-5 pt-8 lg:px-0 lg:pt-15">
        <div className="lg:border-t lg:border-regular">
          <Accordion id="detail-qna" title="Q&A" open={openAccordions.has('detail-qna')} onToggle={() => toggleAccordion('detail-qna')}>
            <p className="font-medium text-main">Q. 세탁기에 돌려도 되나요?</p>
            <p className="mt-1">A. 런드리백에 넣어 찬물·울 코스로 세탁하면 압박력이 오래가요. (예시 문답)</p>
          </Accordion>
          <Accordion
            id="detail-shipping"
            title="배송·교환·반품 안내"
            open={openAccordions.has('detail-shipping')}
            onToggle={() => toggleAccordion('detail-shipping')}
          >
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>평일 오후 2시 전 주문은 당일 출고해요.</li>
              <li>스타킹·속옷은 착용 흔적이 없을 때만 교환·반품할 수 있어요.</li>
              <li>받은 날부터 7일 안에 고객센터로 접수해 주세요. (예시 안내)</li>
            </ul>
          </Accordion>
        </div>
        <p className="pt-4 pb-12 text-11 text-sub-weak lg:pt-6 lg:pb-20 lg:text-12">
          별점·리뷰는 예시 데이터 · 상세 연출 컷은 시안용 AI 생성 이미지
        </p>
      </div>

      {/* 모바일 하단 고정 구매바 — 주요 CTA 56 */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 bg-white px-5 pt-3 pb-8 shadow-flaseek-3 lg:hidden">
        <WishButton id={product.id} icon={heart24} iconSize={24} className="size-14 shrink-0 rounded-sm border border-regular" />
        <button type="button" onClick={onCart} className={`${BUTTON_SECONDARY} h-14 flex-1`}>
          장바구니
        </button>
        <button type="button" onClick={onBuy} className={`${BUTTON_PRIMARY} h-14 flex-1`}>
          구매하기
        </button>
      </div>
    </>
  )
}
