import { useState } from 'react'
import favoriteFillIcon from '../assets/figma/v3/icons/favorite-fill.svg'
import favoriteIcon from '../assets/figma/v3/icons/favorite.svg'
import localShippingIcon from '../assets/figma/v3/icons/local-shipping.svg'
import restartAltIcon from '../assets/figma/v3/icons/restart-alt.svg'
import shieldIcon from '../assets/figma/v3/icons/shield.svg'
import { PRODUCT_DETAIL } from '../data/mock'
import ReviewSection from './ReviewSection'
import SiteHeader from '../ui/SiteHeader'

const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`
const formatCount = (value: number) => value.toLocaleString('ko-KR')

const BENEFITS = [
  { icon: localShippingIcon, label: '무료배송' },
  { icon: shieldIcon, label: '정품보증' },
  { icon: restartAltIcon, label: '7일 무료반품' },
]

const TABS = ['상세정보', `리뷰 ${formatCount(PRODUCT_DETAIL.reviewCount)}`, '문의', '배송/교환']

const MAX_QUANTITY = 99

// 시안 1280px 기준: 좌우 24px 여백 안에 갤러리(599px) + 34px + 구매 정보(599px), 그 아래 탭 + 상세 통이미지.
// md 미만에서는 갤러리 아래로 구매 정보를 쌓는다.
export default function DetailPage() {
  const { brand, name, rating, reviewCount, wishCount, listPrice, discountRate, price, shippingNote, colors, images } =
    PRODUCT_DETAIL
  const [imageIndex, setImageIndex] = useState(0)
  const [color, setColor] = useState(colors[0])
  const [quantity, setQuantity] = useState(1)
  const [wished, setWished] = useState(false)
  const [tab, setTab] = useState(TABS[0])

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-9.5 px-4 pt-6.5 pb-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-6 lg:gap-8.5">
          <section aria-label="상품 이미지" className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="aspect-square w-full overflow-hidden rounded-[18px] bg-light">
              <img src={images[imageIndex]} alt={name} className="block size-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((image, i) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`${i + 1}번째 이미지 보기`}
                  aria-pressed={i === imageIndex}
                  onClick={() => setImageIndex(i)}
                  className={`aspect-square min-w-0 flex-1 overflow-hidden rounded-[10px] ${i === imageIndex ? 'border-2 border-light shadow-[4px_12px_50px_0_rgba(0,0,0,0.25)]' : ''}`}
                >
                  <img src={image} alt="" className="block size-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section aria-label="구매 정보" className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-12 font-medium text-sub-weak">{brand}</p>
              <h1 className="text-24 font-semibold break-keep text-main">{name}</h1>
              <div className="flex items-center gap-2 text-13 text-disabled tabular-nums">
                <span className="text-accent" aria-label={`평점 ${rating}점`}>
                  ★★★★★
                </span>
                <span>{rating}</span>
                <span className="h-3 border-l border-regular" aria-hidden="true" />
                <span>리뷰 {formatCount(reviewCount)}개</span>
                <span className="h-3 border-l border-regular" aria-hidden="true" />
                <span>찜 {formatCount(wishCount + (wished ? 1 : 0))}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-[14px] bg-light p-4.5">
              <p className="text-13 text-disabled tabular-nums line-through">{formatWon(listPrice)}</p>
              <p className="flex items-baseline gap-2 font-semibold tabular-nums">
                <span className="text-24 text-accent">{discountRate}%</span>
                <span className="text-28 text-main">{formatWon(price)}</span>
              </p>
              <p className="text-12 font-medium text-sub-weak">{shippingNote}</p>
            </div>

            <div role="radiogroup" aria-labelledby="detail-color-label" className="flex flex-col gap-2">
              <p id="detail-color-label" className="text-13 font-medium text-main">
                색상
              </p>
              <div className="flex gap-2">
                {colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={color === option}
                    onClick={() => setColor(option)}
                    className={`rounded-[10px] px-2 py-1 text-13 ${color === option ? 'border-[1.5px] border-black text-main' : 'border border-regular text-sub-weak'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-13 font-medium text-main">수량</p>
              <div className="flex h-7.5 w-20 items-center overflow-clip rounded-thumb-sm border border-regular bg-white text-13">
                <button
                  type="button"
                  aria-label="수량 빼기"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="flex h-full flex-1 items-center justify-center text-sub-weak disabled:cursor-default disabled:text-disabled"
                >
                  −
                </button>
                <output aria-label="수량" className="flex-1 text-center font-medium text-main tabular-nums">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label="수량 더하기"
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full flex-1 items-center justify-center text-sub-weak disabled:cursor-default disabled:text-disabled"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-y border-light py-3.5">
              <p className="text-14 font-semibold text-main">총 결제금액</p>
              <p className="text-24 font-semibold text-accent tabular-nums">{formatWon(price * quantity)}</p>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                aria-label="찜하기"
                aria-pressed={wished}
                onClick={() => setWished((w) => !w)}
                className="flex size-13 shrink-0 items-center justify-center rounded-thumb-sm border border-regular"
              >
                <img src={wished ? favoriteFillIcon : favoriteIcon} alt="" />
              </button>
              <button
                type="button"
                className="h-13 min-w-0 flex-1 rounded-thumb-sm border-[1.5px] border-black bg-white text-15 font-semibold text-main lg:w-51.75 lg:flex-none"
              >
                장바구니
              </button>
              <button
                type="button"
                className="h-13 min-w-0 flex-1 rounded-thumb-sm bg-accent text-15 font-semibold text-white"
              >
                바로 구매
              </button>
            </div>

            <ul className="flex flex-wrap gap-x-4.5 gap-y-2">
              {BENEFITS.map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-1 text-12 text-disabled">
                  <img src={icon} alt="" />
                  {label}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="flex flex-col gap-8 border-t border-regular">
          <div role="tablist" className="scrollbar-none flex gap-8 overflow-x-auto border-b border-regular pt-4">
            {TABS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                id={`detail-tab-${i}`}
                aria-selected={tab === label}
                aria-controls="detail-tabpanel"
                onClick={() => setTab(label)}
                className={`shrink-0 border-b-2 pb-3 text-14 whitespace-nowrap ${tab === label ? 'border-regular font-semibold text-main' : 'border-transparent font-medium text-disabled'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div id="detail-tabpanel" role="tabpanel" aria-labelledby={`detail-tab-${TABS.indexOf(tab)}`}>
            {tab === TABS[0] ? (
              // 시안 Detail Content 프레임(1232×2458)을 2x 로 내보낸 SVG. 배경색까지 포함돼 있어 폭에 맞춰 그대로 늘린다
              <img
                src={PRODUCT_DETAIL.contentImage}
                alt={`${name} 상세정보`}
                className="block h-auto w-full"
              />
            ) : tab === TABS[1] ? (
              <ReviewSection />
            ) : (
              // 문의·배송/교환 탭은 시안이 없어 빈 상태만 보여준다
              <p className="py-20 text-center text-14 text-sub-weak">{tab.split(' ')[0]} 내용을 준비 중이에요</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
