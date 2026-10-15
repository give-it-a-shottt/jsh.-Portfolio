import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { CASE_DETAILS, type CodeSample } from './caseDetails'
import { CASES, type PortfolioCase } from './data'
import { CheckIcon, ChevronRightIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import { searchHref, type ResultTab } from './routes'

const REPO_URL = 'https://github.com/give-it-a-shottt/jsh.-Portfolio'
const CODE_THEME = themes.oneDark

const LANGUAGES: Record<string, string> = {
  py: 'python',
  ts: 'tsx',
  tsx: 'tsx',
  css: 'css',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
}

function languageOf(path: string) {
  return LANGUAGES[path.split('.').pop() ?? ''] ?? 'markup'
}

function listHref(item: PortfolioCase) {
  return searchHref('', item.type.toLowerCase() as ResultTab)
}

function BackLink({ item }: { item: PortfolioCase }) {
  return (
    <a href={listHref(item)} className="flex w-fit items-center gap-1 text-14 font-medium text-sub hover:text-main">
      <ChevronRightIcon size={16} className="rotate-180" />
      <span>
        <span lang="en">{item.type}</span> 사례 목록
      </span>
    </a>
  )
}

/** 코드 패널 — 파일 탭 · 경로와 복사/GitHub · 하이라이트된 코드 · 설계 의도 */
function CodePanel({ samples, tall }: { samples: CodeSample[]; tall: boolean }) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  const sample = samples[active]
  // 윈도에서 받은 파일은 줄 끝이 CRLF 라 \r 까지 떼어 낸다
  const allLines = sample.source.replace(/\r?\n$/, '').split(/\r?\n/)
  const [start, end] = sample.lines ?? [1, allLines.length]
  const code = allLines.slice(start - 1, end).join('\n')
  const githubHref = `${REPO_URL}/blob/main/${sample.path.split('/').map(encodeURIComponent).join('/')}${
    sample.lines ? `#L${start}-L${end}` : ''
  }`

  const select = (index: number) => {
    setActive(index)
    setCopied('idle')
  }

  // 탭 목록 안에서는 화살표로 옮겨 다닌다
  const onTabKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + samples.length) % samples.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied('done')
    } catch {
      setCopied('failed')
    }
  }

  return (
    <section aria-label="핵심 코드" className="flex min-w-0 flex-col gap-3">
      <div className="overflow-hidden rounded-card" style={{ backgroundColor: CODE_THEME.plain.backgroundColor }}>
        <div
          role="tablist"
          aria-label="코드 파일"
          onKeyDown={onTabKeyDown}
          className="scrollbar-none flex gap-1 overflow-x-auto border-b border-white/10 px-3 pt-3"
        >
          {samples.map((item, index) => {
            const selected = index === active
            return (
              <button
                key={`${item.path}-${index}`}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                lang="en"
                className={`shrink-0 rounded-t-thumb-sm border-b-2 px-3 py-2 font-mono text-13 tracking-normal ${
                  selected ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-4 py-2.5">
          <p lang="en" className="min-w-0 truncate font-mono text-12 tracking-normal text-white/50">
            {sample.path}
            {sample.lines && ` · L${start}–${end}`}
          </p>
          <div className="flex shrink-0 items-center gap-4 text-12 font-medium">
            <button type="button" onClick={copy} className="flex items-center gap-1 text-white/70 hover:text-white">
              {copied === 'done' && <CheckIcon size={14} />}
              {copied === 'done' ? '복사했어요' : copied === 'failed' ? '복사하지 못했어요' : '코드 복사'}
            </button>
            <a href={githubHref} target="_blank" rel="noopener" className="text-white/70 hover:text-white">
              <span lang="en">GitHub</span>에서 보기 ↗
            </a>
          </div>
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
          <Highlight theme={CODE_THEME} code={code} language={languageOf(sample.path)}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre
                lang="en"
                className={`overflow-auto py-4 font-mono text-13 tracking-normal ${
                  tall ? 'max-h-[60svh] lg:max-h-[calc(100svh-220px)]' : 'max-h-[60svh] lg:max-h-120'
                }`}
              >
                <code className="block w-max min-w-full">
                  {tokens.map((line, i) => {
                    const { className, ...lineProps } = getLineProps({ line })
                    return (
                      <div key={i} {...lineProps} className={`${className} flex pr-6`}>
                        <span aria-hidden="true" className="w-14 shrink-0 pr-4 text-right text-white/30 select-none">
                          {start + i}
                        </span>
                        <span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    )
                  })}
                </code>
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      <div className="flex gap-3 rounded-card bg-light p-5">
        <CheckIcon size={18} className="mt-0.5 shrink-0 text-portfolio" />
        <div className="flex flex-col gap-1">
          <h3 className="text-14 font-semibold text-main">설계 의도</h3>
          <p className="text-14 break-keep text-sub">{sample.note}</p>
        </div>
      </div>
    </section>
  )
}

/** Front 사례의 대표 화면 — 세로로 긴 캡처라 윗부분만 보여주고, 누르면 원본을 연다 */
function Screenshot({ item }: { item: PortfolioCase }) {
  return (
    <figure className="flex h-80 items-start justify-center overflow-hidden rounded-card border border-regular bg-light px-6 pt-6 sm:h-110">
      {item.image ? (
        <a
          href={item.image}
          target="_blank"
          rel="noopener"
          aria-label={`${item.title} 화면 원본 크기로 보기`}
          className="w-full max-w-90"
        >
          <img src={item.image} alt={`${item.title} 화면`} className="w-full rounded-t-thumb border border-b-0 border-regular" />
        </a>
      ) : (
        // 아직 캡처가 없는 사례 — 결과 목록과 같은 사선 자리표시
        <div className="flex size-full items-center justify-center rounded-t-thumb bg-[repeating-linear-gradient(135deg,#f7f7fb_0_8px,#f1f1f5_8px_16px)] font-mono text-12 tracking-normal text-sub-weak">
          screenshot
        </div>
      )}
    </figure>
  )
}

interface EngineeringCaseDetailProps {
  slug: string
}

/**
 * Front·Back 사례 상세. 왼쪽은 문제 → 해결 포인트 → 결과 → 사용 기술,
 * 오른쪽은 Front 면 대표 화면 + 핵심 코드, Back 이면 코드만 길게(데스크톱에서는 따라 내려온다).
 */
export default function EngineeringCaseDetail({ slug }: EngineeringCaseDetailProps) {
  const item = CASES.find((candidate) => candidate.slug === slug)
  if (!item) return null
  const detail = CASE_DETAILS[slug]
  const isBack = item.type === 'Back'

  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col px-5 pt-6 pb-20 sm:px-10">
      <BackLink item={item} />

      {/* 한 줄일 때도 열 폭을 화면에 묶어 둔다 — 안 그러면 긴 코드 줄만큼 열이 넓어진다 */}
      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col">
            <CaseMeta item={item} />
            <h1 className="mt-3 text-24 font-semibold break-keep text-main sm:text-32">{item.title}</h1>
            <p className="mt-3 text-16 break-keep text-sub">{item.description}</p>
            {item.links && (
              <p className="mt-6 flex flex-wrap gap-3">
                {item.links.map(({ label, href }, index) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className={`flex w-fit items-center gap-1 rounded-full px-4 py-2 text-14 font-medium ${
                      index === 0 ? 'bg-main text-white hover:bg-icon-main' : 'border border-regular text-main hover:bg-light'
                    }`}
                  >
                    {label} ↗
                  </a>
                ))}
              </p>
            )}
            {item.metrics.length > 0 && (
              // 마지막 줄의 칸이 남은 폭을 나눠 가져서 빈칸이 생기지 않는다
              <dl className="mt-6 flex flex-wrap gap-px overflow-hidden rounded-card border border-regular bg-regular">
                {item.metrics.map(({ label, value }) => (
                  <div key={label} className="flex flex-[1_1_140px] flex-col gap-1 bg-white p-4">
                    <dt className="text-12 break-keep text-sub-weak">{label}</dt>
                    <dd className="text-16 font-semibold break-keep text-main">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </header>

          {detail ? (
            <>
              <section aria-labelledby="problem-title" className="flex flex-col gap-3">
                <h2 id="problem-title" className="text-16 font-semibold text-main">
                  문제
                </h2>
                <p className="text-15 break-keep text-sub">{detail.problem}</p>
              </section>

              <section aria-labelledby="points-title" className="flex flex-col gap-4">
                <h2 id="points-title" className="text-16 font-semibold text-main">
                  해결 포인트
                </h2>
                <ol className="flex flex-col gap-3">
                  {detail.points.map(({ title, body }, index) => (
                    <li key={title} className="flex gap-4 rounded-card border border-regular p-5">
                      <span
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-portfolio-soft text-13 font-semibold text-portfolio"
                      >
                        {index + 1}
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <h3 className="text-15 font-semibold break-keep text-main">{title}</h3>
                        <p className="text-14 break-keep text-sub">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {detail.result && (
                <section className="flex flex-col gap-2 rounded-card bg-portfolio-soft p-5">
                  <h2 className="text-16 font-semibold text-main">결과</h2>
                  <p className="text-14 break-keep text-main">{detail.result}</p>
                </section>
              )}

              <section aria-labelledby="stack-title" className="flex flex-col gap-3">
                <h2 id="stack-title" className="text-16 font-semibold text-main">
                  사용 기술
                </h2>
                <ul lang="en" className="flex flex-wrap gap-2">
                  {detail.stack.map((tech) => (
                    <li key={tech} className="rounded-full bg-light px-3 py-1.5 text-13 font-medium tracking-normal text-main">
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <p className="text-15 text-sub">상세 내용을 정리하고 있어요.</p>
          )}
        </div>

        <div className={`flex min-w-0 flex-col gap-6 ${isBack ? 'lg:sticky lg:top-6' : ''}`}>
          {!isBack && <Screenshot item={item} />}
          {/* 사례가 바뀌면 탭·복사 상태를 처음부터 */}
          {detail && detail.code.length > 0 && <CodePanel key={slug} samples={detail.code} tall={isBack} />}
        </div>
      </div>

      <nav aria-label="다른 사례" className="mt-16 flex flex-wrap gap-3">
        <a
          href={listHref(item)}
          className="flex w-fit items-center gap-1 rounded-full border border-regular px-5 py-3 text-14 font-medium text-main hover:bg-light"
        >
          <span>
            다른 <span lang="en">{item.type}</span> 사례 보기
          </span>
          <ChevronRightIcon size={16} />
        </a>
        <a
          href={searchHref()}
          className="flex w-fit items-center gap-1 rounded-full border border-regular px-5 py-3 text-14 font-medium text-main hover:bg-light"
        >
          전체 사례 보기
          <ChevronRightIcon size={16} />
        </a>
      </nav>
    </main>
  )
}
