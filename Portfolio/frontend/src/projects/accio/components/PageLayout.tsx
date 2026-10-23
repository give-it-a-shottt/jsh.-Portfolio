import type { ReactNode } from 'react'
import Container from './Container'
import SiteHeader from '../ui/SiteHeader'

interface PageLayoutProps {
  title: string
  description?: string
  /** 제목 오른쪽에 붙는 요소 (단계 표시, 버튼 등) */
  aside?: ReactNode
  /** 대화형 화면처럼 읽기 폭을 좁혀 가운데 두는 경우 */
  narrow?: boolean
  children: ReactNode
}

// 공통 GNB(유틸 헤더 · 메인 헤더 · 카테고리) 아래에 카드형(Card UI) 콘텐츠를 두는 서브 페이지 틀.
// 화면 배경은 bg-light, 카드는 흰색. 페이지 상단 여백은 24 → 32 → 40, 제목은 A-3 → A-4 단계.
export default function PageLayout({ title, description, aside, narrow = false, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-light">
      <SiteHeader />

      <main className="flex-1 pt-6 pb-16 sm:pt-8 lg:pt-10">
        <Container>
          <div className={`flex flex-col gap-6 ${narrow ? 'mx-auto w-full max-w-220' : ''}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2 lg:gap-3">
                <h1 className="text-20 font-semibold text-main lg:text-24">{title}</h1>
                {description && <p className="text-14 text-sub lg:text-15">{description}</p>}
              </div>
              {aside}
            </div>
            {children}
          </div>
        </Container>
      </main>
    </div>
  )
}
