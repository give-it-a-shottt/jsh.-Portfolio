import CaseMeta from './CaseMeta'
import type { PortfolioCase } from './data'

// 홈 카드 한 장 — 화면이 있는 사례는 이미지 카드, 화면이 없는 사례(Back)는 지표를 보여주는 글자 카드.
// 카드 라운드 16, 썸네일은 안쪽 8 띄우고 라운드 12, 텍스트 패딩 20 (MyDesign 5장). 목록 B 스케일: 제목 18 · 설명 13.
// hover 는 그림자 한 단계 + 1px 위로 (9장 상태별 조합).
export default function RecordCard({ item }: { item: PortfolioCase }) {
  return (
    <a
      href={item.href}
      className="group flex h-full flex-col rounded-card border border-regular bg-default shadow-[0_1px_2px_rgba(45,42,37,0.06)] transition-[box-shadow,translate] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(45,42,37,0.08)] motion-reduce:hover:translate-y-0"
    >
      {item.image && (
        <div className="p-2 pb-0">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="h-44 w-full rounded-thumb bg-regular object-cover object-top"
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col ${item.image ? 'px-5 pt-4 pb-5' : 'p-6'}`}>
        <CaseMeta item={item} />
        <h3 className="mt-2 text-18 font-semibold break-keep text-main group-hover:text-portfolio">{item.title}</h3>
        <p className={`mt-2 text-13 break-keep text-sub ${item.image ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {item.description}
        </p>
        {item.image ? (
          <p className="mt-auto flex flex-wrap gap-x-2 pt-3 text-12 text-sub-weak">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        ) : (
          // 썸네일 자리 대신 지표 — 같은 줄의 이미지 카드와 높이를 맞추려 아래에 붙인다
          item.metrics.length > 0 && (
            <dl className="mt-auto flex flex-col gap-2 border-t border-light pt-4">
              {item.metrics.slice(0, 3).map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 text-13">
                  <dt className="break-keep text-sub-weak">{label}</dt>
                  <dd className="text-right font-semibold break-keep text-main">{value}</dd>
                </div>
              ))}
            </dl>
          )
        )}
      </div>
    </a>
  )
}
