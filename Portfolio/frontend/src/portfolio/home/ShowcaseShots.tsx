import type { ShowcaseProject } from '../projects'

/**
 * 메인 섹션의 회색 판 위에 올리는 화면(F-018) - 휴대폰 서비스는 3장을 나란히(가운데만 위로), PC 서비스는 PC 화면 위에 다른 화면을 하나 겹친다.
 * 판 폭의 비율로 놓되, 낮은 창에서 넘치지 않게 높이(svh)로도 묶는다. eager 면 화면 밖이어도 미리 받는다.
 */
export default function ShowcaseShots({ project, eager = false }: { project: ShowcaseProject; eager?: boolean }) {
  const { shots } = project.showcase
  const loading = eager ? 'eager' : 'lazy'
  const frame = 'border border-regular bg-default object-cover object-top shadow-[0_6px_12px_rgb(42_42_55/0.12)]'

  if (shots.kind === 'phones')
    return (
      <div className="flex w-full items-start justify-center gap-[2.4%] pt-[6%]">
        {shots.images.map((image, i) => (
          <img
            key={image}
            src={image}
            alt={i === 0 ? `${project.name} 대표 화면` : ''}
            loading={loading}
            decoding="async"
            className={`aspect-[390/844] w-[min(27.6%,29svh)] rounded-[clamp(12px,2.2vw,24px)] ${frame} ${i === 1 ? '-mt-[6%]' : ''}`}
          />
        ))}
      </div>
    )

  // 피그마 장면: 744×547 안에 PC 704×440(왼쪽 위) + 겹친 화면(오른쪽 아래, 휴대폰 188 · PC 368)
  const overlay = shots.overlayDevice === 'mobile' ? 'aspect-[390/844] w-[25.3%] rounded-[clamp(10px,1.6vw,20px)]' : 'aspect-[16/10] w-[49.5%] rounded-[clamp(6px,0.8vw,10px)]'
  return (
    <div className="relative aspect-[744/547] w-[min(88.6%,104svh)]">
      <img
        src={shots.main}
        alt={`${project.name} 대표 화면`}
        loading={loading}
        decoding="async"
        className={`absolute top-0 left-0 aspect-[16/10] w-[94.6%] rounded-[clamp(8px,1vw,12px)] ${frame}`}
      />
      <img src={shots.overlay} alt="" loading={loading} decoding="async" className={`absolute right-0 bottom-0 ${overlay} ${frame}`} />
    </div>
  )
}
