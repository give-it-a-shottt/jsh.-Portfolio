import { Highlight, themes } from 'prism-react-renderer'
import type { NoteCode as NoteCodeData } from './notes'

/**
 * 공부 노트 안의 코드 블록 — 사례 상세(EngineeringCaseDetail)와 같은 하이라이터 · 테마.
 * 하이라이터가 무거워서 StudyDetail 이 lazy 로 받는다(코드가 있는 노트를 열 때만).
 */
export default function NoteCode({ code }: { code: NoteCodeData }) {
  return (
    <figure className="mt-3 overflow-hidden rounded-card-sm bg-[#282c34]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-12 text-white/60">
        <span lang="en" className="font-medium tracking-normal uppercase">
          {code.lang}
        </span>
        {code.caption && <span className="break-keep">{code.caption}</span>}
      </figcaption>
      <Highlight theme={themes.oneDark} code={code.source.trim()} language={code.lang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre lang="en" className="scrollbar-dark overflow-x-auto px-4 py-3.5 font-mono text-13 leading-relaxed tracking-normal">
            <code className="block w-max min-w-full">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </figure>
  )
}
