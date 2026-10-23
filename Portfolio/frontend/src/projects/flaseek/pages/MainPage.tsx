import { useState, type ReactNode } from 'react'
import BeforeAfterSlider from '../BeforeAfterSlider'
import { CATEGORIES, CATEGORY_TAB, PRODUCTS, THICKNESSES, type Category } from '../data'
import { flaseekHref } from '../routes'
import { BUTTON_PRIMARY, Container, PillTab, ProductGrid, SpriteImage } from '../ui'

type BestTab = 'all' | Extract<Category, 'legwear' | 'shapewear'>
const BEST_TABS: { key: BestTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'legwear', label: CATEGORY_TAB.legwear },
  { key: 'shapewear', label: CATEGORY_TAB.shapewear },
]

interface SectionTitleProps {
  id: string
  title: string
  description?: ReactNode
  action?: { label: string; href: string }
}

function SectionTitle({ id, title, description, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2 lg:gap-3">
        <h2 id={id} className="text-24 font-semibold lg:text-32">
          {title}
        </h2>
        {description && <p className="text-14 text-sub lg:text-16">{description}</p>}
      </div>
      {action && (
        <a href={action.href} className="shrink-0 text-13 font-medium text-sub lg:text-14">
          {action.label}
        </a>
      )}
    </div>
  )
}

// 메인 — 대담함은 Before/After 히어로 하나. 나머지 섹션은 같은 간격(PC 60 · MO 40), 같은 카드, 같은 제목 크기로 차분하게.
export default function MainPage() {
  const [bestTab, setBestTab] = useState<BestTab>('all')
  const best = PRODUCTS.filter((product) => bestTab === 'all' || product.categories.includes(bestTab)).slice(0, 4)

  return (
    <>
      {/* 히어로 — PC 슬라이더 6칸 + 카피 6칸, 모바일은 슬라이더 위·카피 아래 */}
      <section aria-labelledby="hero-title" className="bg-flaseek-pink-soft pt-6 pb-8 lg:py-20">
        <Container className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
          <BeforeAfterSlider className="h-65 w-full shrink-0 lg:h-100 lg:w-[calc(50%-12px)]" />
          <div className="flex flex-1 flex-col items-start">
            <p className="text-14 font-medium text-flaseek-text lg:text-18">
              <span lang="en">Before / After</span> 실제 착용 후기
            </p>
            <h1 id="hero-title" className="mt-2 text-28 font-semibold lg:mt-3 lg:text-56">
              입는 순간
              <br />
              라인이 정리돼요
            </h1>
            <p className="mt-3 text-15 text-sub lg:mt-5 lg:text-20">
              보정레깅스부터 시크릿 캐미솔까지,
              <br />
              구매 전에 리뷰 사진으로 먼저 확인하세요.
            </p>
            <figure className="mt-5 flex w-full flex-col gap-1 rounded-thumb bg-white p-4 lg:mt-6 lg:w-120 lg:px-5">
              <p aria-label="별점 5점" className="text-14 font-semibold tracking-normal text-flaseek-text">
                ★★★★★
              </p>
              <blockquote className="text-14 text-main">"몸매 보정 최고예요! 입은 쪽이 더 날씬해 보여요."</blockquote>
              <figcaption className="text-12 text-sub">ma*****님 · 시크릿 캐미솔</figcaption>
            </figure>
            <a href={flaseekHref('/list')} className={`${BUTTON_PRIMARY} mt-6 h-14 w-full lg:mt-8 lg:h-12 lg:w-auto`}>
              베스트 상품 보기
            </a>
          </div>
        </Container>
      </section>

      {/* 카테고리 — PC 4칸, 모바일 가로 스크롤 */}
      <nav aria-label="카테고리 바로가기" className="pt-10 lg:pt-15">
        <Container>
          <ul className="scrollbar-none -mr-5 flex gap-3 overflow-x-auto pr-5 lg:mr-0 lg:gap-6 lg:overflow-visible lg:pr-0">
            {CATEGORIES.filter(({ key }) => key !== 'all').map(({ key, note }) => (
              <li key={key} className="w-37 shrink-0 lg:w-auto lg:flex-1">
                <a href={flaseekHref('/list', { cat: key })} className="flex flex-col gap-1 rounded-card bg-light px-6 py-5">
                  <span className="text-18 font-semibold whitespace-nowrap">{CATEGORY_TAB[key as Category]}</span>
                  <span className="text-14 whitespace-nowrap text-sub">{note}</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* BEST — 탭으로 바로 걸러 보기 */}
      <section aria-labelledby="best-title" className="pt-10 lg:pt-15">
        <Container className="flex flex-col gap-4 lg:gap-6">
          <SectionTitle id="best-title" title="지금 많이 찾는 상품" action={{ label: '전체 보기', href: flaseekHref('/list') }} />
          <div className="flex gap-2">
            {BEST_TABS.map(({ key, label }) => (
              <PillTab key={key} label={label} selected={bestTab === key} onClick={() => setBestTab(key)} />
            ))}
          </div>
          <ProductGrid products={best} />
        </Container>
      </section>

      {/* 두께로 고르기 — 업계 말(두께 이름)을 그대로 쓰고 한 줄로 풀어 준다 */}
      <section aria-labelledby="thickness-title" className="pt-10 pb-25 lg:pt-15">
        <Container className="flex flex-col gap-4 lg:gap-6">
          <SectionTitle
            id="thickness-title"
            title="두께로 골라보세요"
            description={
              <>
                비치는 정도와 보온감으로 <span className="hidden lg:inline">나에게 맞는 스타킹을 </span>찾아요
              </>
            }
          />
          <ul className="scrollbar-none -mr-5 flex gap-3 overflow-x-auto pr-5 lg:mr-0 lg:gap-6 lg:overflow-visible lg:pr-0">
            {THICKNESSES.map(({ key, en, note, crop }) => (
              <li key={key} className="w-70 shrink-0 lg:w-auto lg:flex-1">
                <a href={flaseekHref('/list', { thick: key })} className="flex flex-col overflow-hidden rounded-card bg-light">
                  <SpriteImage crop={crop} className="h-60 w-full" />
                  <span className="flex flex-col gap-1 px-6 pt-5 pb-6">
                    <span lang="en" className="text-28 font-semibold tracking-normal">
                      {en}
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-16 text-sub">{note}</span>
                      <span className="shrink-0 text-14 font-medium text-flaseek-text">보러 가기</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
