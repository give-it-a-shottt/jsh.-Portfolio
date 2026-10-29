import { useId, useState } from 'react'
import { getAllSuggestions } from './suggest'
import { ArrowRightIcon, CloseIcon, SearchIcon } from '../shared/icons'
import './SearchBox.css'

/** 전역 `/` 단축키가 찾아 포커스하는 입력창 id (화면마다 검색창은 하나뿐이다) */
export const SEARCH_INPUT_ID = 'portfolio-search'

const SIZE = {
  // 검색 홈: 64px 알약
  lg: {
    bar: 'h-16 gap-3 pr-2 pl-6',
    icon: 20,
    input: 'text-16 sm:text-18',
    submit: 'size-12',
    arrow: 18,
    clear: 'size-8',
    dropdown: 'top-18',
    option: 'px-4 text-16',
    placeholder: '문제, 기술, 공부한 내용을 검색해 보세요',
  },
  // 결과 헤더: 48px 알약 (버튼이 바와 동심원이 되도록 오른쪽 6px)
  md: {
    bar: 'h-12 gap-3 pr-1.5 pl-5',
    icon: 18,
    input: 'text-16',
    submit: 'size-9',
    arrow: 16,
    clear: 'size-7',
    dropdown: 'top-14',
    option: 'px-3 text-15',
    placeholder: '문제, 기술, 키워드로 검색',
  },
}

interface SearchBoxProps {
  size: keyof typeof SIZE
  defaultValue?: string
  /** 그라데이션 테두리 글로우(SearchBox.css). 검색 홈에서만 켠다 */
  glow?: boolean
  onSearch: (query: string) => void
}

// 자동완성 검색창 — 포커스하면 추천/자동완성 목록이 열리고 ↑↓ 로 고르고 Enter 로 검색, Esc 로 닫는다.
export default function SearchBox({ size, defaultValue = '', glow = false, onSearch }: SearchBoxProps) {
  const style = SIZE[size]
  const listId = useId()
  const [value, setValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)

  const suggestions = getAllSuggestions(value)
  const open = focused && suggestions.length > 0
  const optionId = (i: number) => `${listId}-option-${i}`

  const search = (query: string) => {
    setActive(-1)
    document.getElementById(SEARCH_INPUT_ID)?.blur()
    onSearch(query.trim())
  }

  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          search(suggestions[active]?.text ?? value)
        }}
        className={`flex items-center rounded-full border bg-default ${style.bar} ${glow ? 'search-glow border-transparent' : focused ? 'border-black shadow-[0_8px_24px_rgba(45,42,37,0.06)] transition-shadow' : 'border-regular transition-shadow'}`}
      >
        <SearchIcon size={style.icon} className="shrink-0 text-icon-main" />
        <input
          id={SEARCH_INPUT_ID}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setActive(-1)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            setActive(-1)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, suggestions.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, -1))
            } else if (e.key === 'Escape') {
              e.currentTarget.blur()
            }
          }}
          placeholder={style.placeholder}
          aria-label="포트폴리오 검색"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          className={`min-w-0 flex-1 bg-transparent text-main outline-none placeholder:text-disabled ${style.input}`}
        />
        {size === 'lg' && !focused && !value && (
          // 키보드가 없는 모바일에서는 단축키 힌트를 숨긴다
          <kbd
            aria-hidden="true"
            className="hidden rounded-badge border border-regular px-2 py-0.5 font-mono text-12 tracking-normal text-sub-weak sm:inline"
          >
            /
          </kbd>
        )}
        {value && (
          <button
            type="button"
            aria-label="검색어 지우기"
            // 포커스를 잃지 않도록 mousedown 에서 처리한다
            onMouseDown={(e) => {
              e.preventDefault()
              setValue('')
              setActive(-1)
            }}
            className={`flex shrink-0 items-center justify-center rounded-full bg-regular text-icon-sub ${style.clear}`}
          >
            <CloseIcon size={14} />
          </button>
        )}
        <button
          type="submit"
          aria-label="검색"
          className={`flex shrink-0 items-center justify-center rounded-full bg-main text-white ${style.submit}`}
        >
          <ArrowRightIcon size={style.arrow} />
        </button>
      </form>

      {open && (
        <div
          className={`absolute inset-x-0 z-10 rounded-card border border-regular bg-default p-2 shadow-[0_12px_32px_rgba(45,42,37,0.08)] ${style.dropdown}`}
        >
          <p className="px-4 pt-2 pb-1 text-12 font-medium text-sub-weak">{value.trim() ? '자동완성' : '추천 검색어'}</p>
          <ul id={listId} role="listbox" aria-label="검색어 제안">
            {suggestions.map((suggestion, i) => {
              return (
                <li
                  key={`${suggestion.type}-${suggestion.text}`}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    search(suggestion.text)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-card-sm py-3 ${style.option} ${i === active ? 'bg-light' : ''}`}
                >
                  <span className="flex min-w-0 items-center gap-3 text-sub">
                    <SearchIcon size={16} className="shrink-0 text-icon-sub-weak" />
                    {/* 띄어쓰기·초성·치는 도중의 글자로 맞아도 맞은 글자를 굵게(suggest.ts) */}
                    <span className="truncate">
                      {suggestion.segments.map(({ text, match }, index) =>
                        match ? (
                          <b key={index} className="font-semibold text-main">
                            {text}
                          </b>
                        ) : (
                          text
                        ),
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-12 font-medium tracking-normal text-sub-weak">{suggestion.type}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
