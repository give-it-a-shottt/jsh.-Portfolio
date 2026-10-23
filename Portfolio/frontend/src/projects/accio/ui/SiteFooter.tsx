import { FOOTER } from '../data/catalog'
import { accioHref } from '../routes'
import { Container, Logo } from './primitives'

/** 공통 푸터. PC 는 고객센터 + 링크 3열, 모바일은 로고·정책 링크·회사 정보만 회색 바탕에 둔다 */
export default function SiteFooter() {
  return (
    <footer>
      {/* ── PC ── */}
      <div className="hidden border-t border-regular pt-14 pb-16 lg:block">
        <Container className="flex flex-col gap-10">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-15 font-semibold text-main">고객센터</p>
              <p className="text-24 font-semibold text-main tabular-nums">{FOOTER.phone}</p>
              <p className="text-13 text-sub-weak">
                {FOOTER.hours[0]}
                <br />
                {FOOTER.hours[1]}
              </p>
            </div>
            {FOOTER.columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
                <p className="text-15 font-semibold text-main">{column.title}</p>
                {column.links.map((link) => (
                  <a key={link} href={accioHref('/support')} className="w-fit text-14 text-sub hover:text-main">
                    {link}
                  </a>
                ))}
              </nav>
            ))}
          </div>

          <div className="h-px bg-light" />

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <Logo height={34.4} />
              <div className="flex gap-5 text-13 text-sub">
                {FOOTER.policies.map((policy) => (
                  <a key={policy} href={accioHref('/support')} className={policy === '개인정보처리방침' ? 'font-semibold' : ''}>
                    {policy}
                  </a>
                ))}
              </div>
              <p className="text-12 text-sub-weak">
                {FOOTER.company}
                <br />
                {FOOTER.address}
              </p>
            </div>
            <p className="text-12 text-sub-weak">© 2026 Accio</p>
          </div>
        </Container>
      </div>

      {/* ── 모바일 (아래 120 은 하단 탭 바 자리) ── */}
      <div className="flex flex-col gap-4 bg-light px-5 pt-8 pb-30 lg:hidden">
        <Logo height={25.8} />
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-12 text-sub">
          {['이용약관', '개인정보처리방침', '고객센터', '입점 문의'].map((policy) => (
            <a key={policy} href={accioHref('/support')} className={policy === '개인정보처리방침' ? 'font-semibold' : ''}>
              {policy}
            </a>
          ))}
        </div>
        <p className="text-11 text-sub-weak">
          고객센터 {FOOTER.phone} · 평일 09:00 – 18:00
          <br />
          (주)액시오 · 대표 홍길동 · 사업자등록번호 000-00-00000
          <br />
          개인 포트폴리오 프로젝트로, 실제 판매가 이루어지지 않습니다.
        </p>
      </div>
    </footer>
  )
}
