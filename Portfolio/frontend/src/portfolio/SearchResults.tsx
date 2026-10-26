import screenshotPlaceholder from './assets/screenshot-placeholder.webp'
import { KEYWORDS, type PortfolioCase } from './data'
import { SearchIcon } from '../shared/icons'
import CaseMeta from './CaseMeta'
import NoteCard from './NoteCard'
import NoteMeta from './NoteMeta'
import { appliedCases, noteHref, type StudyNote } from './notes'
import { searchHref, type ResultTab } from './routes'
import { search } from './search'

const TABS: { tab: ResultTab; label: string }[] = [
  { tab: 'all', label: '전체' },
  { tab: 'front', label: 'Front' },
  { tab: 'back', label: 'Back' },
  { tab: 'design', label: 'Design' },
  { tab: 'study', label: 'Study' },
]

/** '전체' 탭에서 사례 몇 개 뒤에 노트 묶음을 끼울지 — 사례가 먼저, 노트는 결과 사이 모듈로 */
const NOTES_AFTER = 3
const NOTES_IN_MODULE = 3

function KeywordChips({ exclude }: { exclude?: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {KEYWORDS.filter(({ label }) => label !== exclude).map(({ label }) => (
        <li key={label}>
          <a
            href={searchHref(label)}
            className="block rounded-full border border-regular bg-default px-4 py-2 text-14 font-medium text-main hover:bg-light"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

// 사례 한 줄 — 목록(리스트 아이템) B 스케일: 제목 20, 설명 14. 갈 곳(href)이 있는 사례만 행 전체가 링크다.
function ResultRow({ item }: { item: PortfolioCase }) {
  return (
    <li className="relative flex gap-6 border-b border-light py-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <CaseMeta item={item} />
        <h2 className="mt-2 text-18 font-semibold break-keep text-main sm:text-20">
          {item.href ? (
            <a href={item.href} className="hover:text-portfolio after:absolute after:inset-0">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h2>
        <p className="mt-2 text-14 break-keep text-sub">{item.description}</p>
        {item.metrics.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.metrics.map(({ label, value }) => (
              <li key={label} className="flex items-center gap-2 rounded-thumb-sm bg-light px-3 py-1 text-13">
                <span className="text-sub-weak">{label}</span>
                <span className="font-semibold tracking-normal text-main">{value}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 flex flex-wrap gap-2 text-13 text-sub-weak">
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        {/* 행 전체를 덮는 제목 링크(after:inset-0) 위로 올려야 눌린다 */}
        {item.links && (
          <p className="relative z-10 mt-3 flex flex-wrap gap-3 text-13">
            {item.links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                className="font-semibold text-sub underline-offset-4 hover:text-portfolio hover:underline"
              >
                {label} ↗
              </a>
            ))}
          </p>
        )}
      </div>

      {/* 화면이 있는 사례(Front·Design)만 썸네일을 둔다 */}
      {item.type !== 'Back' && (
        <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-thumb border border-regular sm:block">
          {item.image ? (
            <img src={item.image} alt="" className="size-full object-cover object-top" />
          ) : (
            // 아직 캡처가 없는 사례 — 자리표시 이미지로 대신한다
            <img src={screenshotPlaceholder} alt="" className="size-full object-cover" />
          )}
        </div>
      )}
    </li>
  )
}

// 노트 한 줄 — Study 탭 목록. 사례 행과 같은 B 스케일이고, 실습 결과물이 있으면 첫 장을 썸네일로 둔다.
function NoteRow({ note }: { note: StudyNote }) {
  const applied = appliedCases(note)
  const thumb = note.practice?.[0]

  return (
    <li className="relative flex gap-6 border-b border-light py-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <NoteMeta note={note} />
        <h2 className="mt-2 text-18 font-semibold break-keep text-main sm:text-20">
          <a href={noteHref(note.slug)} className="hover:text-study-strong after:absolute after:inset-0">
            {note.title}
          </a>
        </h2>
        <p className="mt-2 text-14 break-keep text-sub">{note.summary}</p>
        <p className="mt-3 flex flex-wrap gap-2 text-13 text-sub-weak">
          {note.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
        {applied.length > 0 && (
          <p className="mt-3 text-13 font-medium break-keep text-sub">
            써먹은 곳 · {applied.map(({ item }) => item.title).join(', ')}
          </p>
        )}
      </div>
      {thumb && (
        <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-thumb border border-regular sm:block">
          <img src={thumb.image} alt="" loading="lazy" className="size-full object-cover" />
        </div>
      )}
    </li>
  )
}

// '전체' 탭 결과 사이에 끼우는 노트 묶음 — 사례를 묻지 않으면서 같은 키워드로 공부한 것을 함께 보여준다
function NotesModule({ notes, query }: { notes: StudyNote[]; query: string }) {
  return (
    <section aria-labelledby="notes-module-title" className="my-6 rounded-card border border-regular bg-default p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 id="notes-module-title" className="flex items-center gap-2 text-16 font-semibold text-main">
          <span aria-hidden="true" className="size-2 rounded-full bg-study" />
          {query ? '이 키워드로 공부한 노트' : '공부 노트'}
          <span className="text-14 font-medium tracking-normal text-sub-weak">{notes.length}</span>
        </h2>
        <a href={searchHref(query, 'study')} className="text-13 font-medium text-portfolio hover:underline underline-offset-4">
          <span lang="en">Study</span> 탭에서 모두 보기 →
        </a>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {notes.slice(0, NOTES_IN_MODULE).map((note) => (
          <li key={note.slug}>
            <NoteCard note={note} />
          </li>
        ))}
      </ul>
    </section>
  )
}

interface SearchResultsProps {
  query: string
  tab: ResultTab
}

export default function SearchResults({ query, tab }: SearchResultsProps) {
  // 사례는 레벨 높은 것부터(rank.ts), 노트는 최신순(notes.ts) — 찾는 규칙은 search.ts
  const { cases: matched, notes: matchedNotes } = search(query)
  // Front · Back · Design 탭은 그 분야 사례 아래에 같은 분야 노트를 잇는다. Study 탭은 분야 구분 없이 전체
  const casesOf = (tab: ResultTab) => matched.filter((item) => item.type.toLowerCase() === tab)
  const notesOf = (tab: ResultTab) => matchedNotes.filter((note) => note.area.toLowerCase() === tab)
  const counts: Record<ResultTab, number> = {
    all: matched.length + matchedNotes.length,
    front: casesOf('front').length + notesOf('front').length,
    back: casesOf('back').length + notesOf('back').length,
    design: casesOf('design').length + notesOf('design').length,
    study: matchedNotes.length,
  }
  const results = tab === 'all' || tab === 'study' ? matched : casesOf(tab)
  const areaNotes = tab === 'all' || tab === 'study' ? [] : notesOf(tab)
  const related = KEYWORDS.filter(({ label }) => label !== query).slice(0, 5)
  const isStudy = tab === 'study'
  // 노트 묶음은 '전체' 탭에서만. 사례가 적으면 목록 끝에, 사례가 없으면 빈 안내 대신 노트를 보여준다
  const showModule = tab === 'all' && matchedNotes.length > 0
  const isEmpty = isStudy ? matchedNotes.length === 0 : results.length === 0 && !showModule && areaNotes.length === 0
  const resultLabel = query ? `'${query}' 검색 결과` : TABS.find((item) => item.tab === tab)?.label ?? '전체'
  const summary = isStudy
    ? `${query ? `'${query}' 공부 노트` : '전체 공부 노트'} ${matchedNotes.length}건`
    : tab === 'all' && matchedNotes.length > 0
      ? `${query ? `'${query}' 검색 결과` : '전체'} ${counts.all}건 · 사례 ${matched.length} · 공부 노트 ${matchedNotes.length}`
      : areaNotes.length > 0
        ? `${resultLabel} ${counts[tab]}건 · 사례 ${results.length} · 공부 노트 ${areaNotes.length}`
        : `${query ? `'${query}' 검색 결과` : '전체 사례'} ${results.length}건`

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="sr-only">{query ? `'${query}' 검색 결과` : '전체 사례'}</h1>

      <div className="border-b border-light">
        {/* 탭이 다섯 개라 좁은 화면에서는 가로로 넘긴다 */}
        <nav aria-label="결과 분류" className="scrollbar-none mx-auto flex max-w-300 gap-6 overflow-x-auto px-5 sm:px-10">
          {TABS.map(({ tab: id, label }) => {
            const active = tab === id
            return (
              <a
                key={id}
                href={searchHref(query, id)}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 border-b-2 pt-4 pb-3 text-15 tracking-normal ${active ? 'border-black font-semibold text-main' : 'border-transparent font-medium text-sub-weak hover:text-main'}`}
              >
                {id === 'study' && <span aria-hidden="true" className="size-1.5 rounded-full bg-study" />}
                {label}
                <span className="text-13 font-medium text-sub-weak tabular-nums">{counts[id]}</span>
              </a>
            )
          })}
        </nav>
      </div>

      <div className="mx-auto flex w-full max-w-300 flex-wrap items-start gap-16 px-5 pt-6 pb-20 sm:px-10">
        <main className="min-w-0 flex-[1_1_560px]">
          <p className="text-13 text-sub-weak">{summary}</p>

          {isEmpty ? (
            <div className="flex flex-col gap-2 py-16">
              <h2 className="text-20 font-semibold break-keep text-main">
                {isStudy
                  ? query
                    ? `'${query}'에 대한 공부 노트가 아직 없어요.`
                    : '아직 올린 공부 노트가 없어요.'
                  : query
                    ? `'${query}'에 대한 사례가 아직 없어요.`
                    : '아직 등록된 사례가 없어요.'}
              </h2>
              <p className="text-14 text-sub">다른 키워드로 검색하거나 아래 키워드를 눌러보세요.</p>
              <div className="mt-4">
                <KeywordChips exclude={query} />
              </div>
            </div>
          ) : isStudy ? (
            <ul className="mt-2">
              {matchedNotes.map((note) => (
                <NoteRow key={note.slug} note={note} />
              ))}
            </ul>
          ) : (
            <>
              {results.length > 0 && (
                <ul className="mt-2">
                  {results.slice(0, showModule ? NOTES_AFTER : undefined).map((item) => (
                    <ResultRow key={item.slug} item={item} />
                  ))}
                </ul>
              )}
              {showModule && results.length === 0 && (
                <p className="mt-6 text-15 break-keep text-sub">{`'${query}'에 대한 사례는 아직 없지만, 공부한 노트가 있어요.`}</p>
              )}
              {showModule && <NotesModule notes={matchedNotes} query={query} />}
              {showModule && results.length > NOTES_AFTER && (
                <ul>
                  {results.slice(NOTES_AFTER).map((item) => (
                    <ResultRow key={item.slug} item={item} />
                  ))}
                </ul>
              )}
              {areaNotes.length > 0 && (
                <section aria-labelledby="area-notes-title" className={results.length > 0 ? 'mt-14' : 'mt-6'}>
                  {results.length === 0 && (
                    <p className="mb-6 text-15 break-keep text-sub">
                      {query ? `'${query}'에 대한 사례는 아직 없지만, 공부한 노트가 있어요.` : '이 분야 사례는 아직 없지만, 공부한 노트가 있어요.'}
                    </p>
                  )}
                  <h2 id="area-notes-title" className="flex items-center gap-2 text-16 font-semibold text-main">
                    <span aria-hidden="true" className="size-2 rounded-full bg-study" />
                    공부 노트
                    <span className="text-14 font-medium tracking-normal text-sub-weak">{areaNotes.length}</span>
                  </h2>
                  <ul className="mt-2">
                    {areaNotes.map((note) => (
                      <NoteRow key={note.slug} note={note} />
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </main>

        <aside aria-labelledby="related-title" className="min-w-60 flex-[0_1_280px] pt-8">
          <div className="rounded-card border border-regular p-6">
            <h2 id="related-title" className="text-14 font-semibold text-main">
              관련 검색어
            </h2>
            <ul className="mt-3 flex flex-col">
              {related.map(({ label }) => (
                <li key={label}>
                  <a href={searchHref(label)} className="flex items-center gap-3 py-2 text-14 text-sub hover:text-main">
                    <SearchIcon size={14} className="text-icon-disabled" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
