import { useEffect, useRef, useState, type FormEvent } from 'react'
import arrowRight from '../assets/v4/icons/arrow-right.svg'
import imageIcon from '../assets/v4/icons/image.svg'
import send16 from '../assets/v4/icons/send-16.svg'
import sendActive from '../assets/v4/icons/send.svg'
import { describePick, type ResultGroup } from '../data/aiEngine'
import { productHref, type Product } from '../data/catalog'
import { accioHref } from '../routes'
import { AiDot, Button } from '../ui/primitives'
import { cartActions, findProduct } from '../ui/useCart'
import { chatActions, type ChatMessage } from '../ui/useAiChat'
import { formatWon } from '../utils/format'

/** AI 말풍선 옆 동그란 아바타 — 연한 오렌지 원 + 말풍선 점 */
export function AiAvatar({ size = 28 }: { size?: 24 | 28 | 56 }) {
  const box = { 24: 'size-6', 28: 'size-7', 56: 'size-14' }[size]
  const dot = { 24: 10, 28: 12, 56: 24 }[size]
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full bg-accio-soft ${box}`}>
      <AiDot size={dot} />
    </span>
  )
}

/** AI 추천 질문 칩 — 누르면 바로 질문을 보낸다 */
export function AiChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => chatActions.send(label)}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-regular bg-white px-4 py-2 text-14 font-medium whitespace-nowrap text-main hover:border-accio"
    >
      <AiDot size={9.8} />
      {label}
    </button>
  )
}

/** 입력창 — 왼쪽 사진 첨부, 오른쪽 보내기(입력하면 오렌지로 켜진다) */
export function Composer({ placeholder, size = 'lg', disabled = false }: { placeholder: string; size?: 'lg' | 'md' | 'sm'; disabled?: boolean }) {
  const [text, setText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const height = { lg: 'h-14', md: 'h-12', sm: 'h-11' }[size]
  const sendSize = size === 'lg' ? 'size-10' : 'size-8'
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || disabled) return
    chatActions.send(text)
    setText('')
  }
  const ready = text.trim().length > 0 && !disabled

  return (
    <form onSubmit={onSubmit} className={`flex w-full items-center gap-2.5 rounded-full border border-regular bg-white pr-2 pl-3.5 shadow-accio-1 focus-within:border-accio ${height}`}>
      <button type="button" onClick={() => fileRef.current?.click()} aria-label="사진으로 찾기" className="shrink-0">
        <img src={imageIcon} alt="" className="size-6" />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) chatActions.sendImage()
          e.target.value = ''
        }}
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label="AI에게 묻기"
        className={`min-w-0 flex-1 bg-transparent text-main outline-none placeholder:text-disabled ${size === 'lg' ? 'text-15' : 'text-14'}`}
      />
      <button type="submit" disabled={!ready} aria-label="보내기" className="shrink-0">
        {ready ? (
          <img src={sendActive} alt="" className={sendSize} />
        ) : (
          <span className={`flex items-center justify-center rounded-full bg-regular ${sendSize}`}>
            <img src={send16} alt="" className="size-4" />
          </span>
        )}
      </button>
    </form>
  )
}

/** 결과 미니 카드 — 위젯(118) · 모바일 대화(132) 가로 줄 */
export function MiniResultCard({ product, size, selected = false, onClick }: { product: Product; size: 'widget' | 'mobile'; selected?: boolean; onClick?: () => void }) {
  const isWidget = size === 'widget'
  const className = `flex shrink-0 flex-col items-start gap-1 rounded-[10px] bg-white text-left ${
    isWidget ? 'w-[118px] px-1.5 pt-1.5 pb-2' : 'w-[132px] gap-1.5 rounded-md px-2 pt-2 pb-2.5'
  } ${selected ? 'border-[1.5px] border-black' : 'border border-regular'}`
  const body = (
    <>
      <img src={product.image} alt="" className={`w-full rounded-[6px] object-cover ${isWidget ? 'h-21' : 'h-25 rounded-sm'}`} />
      <span className="line-clamp-2 text-12 text-main">{product.fullName ?? product.name}</span>
      <span className={`font-semibold text-main tabular-nums ${isWidget ? 'text-13' : 'text-14'}`}>{formatWon(product.price)}</span>
    </>
  )
  return onClick ? (
    <button type="button" onClick={onClick} className={className}>
      {body}
    </button>
  ) : (
    <a href={productHref(product)} className={className}>
      {body}
    </a>
  )
}

/** 모바일 대화 안 결과 — 탭(재료) + 가로로 미는 카드 */
function InlineResult({ groups }: { groups: ResultGroup[] }) {
  const [tab, setTab] = useState(0)
  const group = groups[Math.min(tab, groups.length - 1)]
  return (
    <div className="flex w-full min-w-0 flex-col gap-2.5">
      {groups.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setTab(i)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-13 ${i === tab ? 'bg-main font-semibold text-white' : 'border border-regular bg-white font-medium text-sub'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {group.products.slice(0, 8).map((p, i) => (
          <MiniResultCard key={p.id} product={p} size="mobile" selected={i === 0} />
        ))}
      </div>
    </div>
  )
}

/** '장바구니에 담을까요?' 확인 카드 */
function ConfirmCard({ message }: { message: Extract<ChatMessage, { role: 'ai' }> }) {
  const ids = message.reply.confirm?.productIds ?? []
  const products = ids.map(findProduct).filter((p): p is Product => !!p)
  if (products.length === 0) return null

  if (message.confirmState === 'added')
    return (
      <p className="flex w-full items-center justify-between rounded-[14px] border border-regular bg-white px-4 py-3.5 text-14 text-main">
        장바구니에 {products.length}개를 담았어요
        <a href={accioHref('/cart')} className="font-semibold text-accio-strong">
          장바구니 보기
        </a>
      </p>
    )
  if (message.confirmState === 'cancelled') return <p className="text-14 text-sub-weak">담지 않았어요. 다른 상품을 찾아 볼까요?</p>

  return (
    <div className="flex w-full flex-col gap-3 rounded-[14px] border border-regular bg-white px-4 py-3.5">
      <p className="text-15 font-semibold text-main">장바구니에 담을까요?</p>
      <p className="text-14 text-sub">{describePick(products)}</p>
      <div className="flex gap-2">
        <Button onClick={() => chatActions.setConfirm(message.id, 'cancelled')} className="flex-1">
          취소
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            products.forEach((p) => cartActions.add(p, '기본', 1))
            chatActions.setConfirm(message.id, 'added')
          }}
          className="flex-1"
        >
          담기
        </Button>
      </div>
    </div>
  )
}

/**
 * 대화 목록. variant 로 결과를 어디에 그릴지 정한다 —
 * 'page'(PC) 는 오른쪽 패널이 결과를 맡고, 'mobile' 은 대화 안에 탭+카드, 'widget' 은 카드 3장 + 전체화면 링크.
 */
export function MessageList({
  messages,
  thinking,
  variant,
  onExpand,
}: {
  messages: ChatMessage[]
  thinking: boolean
  variant: 'page' | 'mobile' | 'widget'
  onExpand?: () => void
}) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages.length, thinking])

  const lastAiIndex = messages.map((m) => m.role).lastIndexOf('ai')
  const small = variant === 'widget'
  const bubbleText = small ? 'text-14' : 'text-15'

  return (
    <div className={`flex flex-col ${small ? 'gap-3.5' : 'gap-[18px] lg:gap-6'}`}>
      {messages.map((m, index) =>
        m.role === 'user' ? (
          <div key={m.id} className="flex justify-end">
            <p className={`max-w-[85%] rounded-[18px] rounded-br-[4px] bg-regular text-main ${small ? 'px-3.5 py-2 text-14' : 'px-4 py-2.5 text-15'}`}>
              {m.image && <span className="mr-1 text-sub">[사진]</span>}
              {m.text}
            </p>
          </div>
        ) : (
          <div key={m.id} className="flex flex-col gap-2">
            <div className={`flex items-start ${small ? 'gap-2' : 'gap-2.5'}`}>
              <AiAvatar size={small ? 24 : 28} />
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                {m.reply.text.map((line) => (
                  <p key={line} className={`${bubbleText} text-main`}>
                    {line}
                  </p>
                ))}
                {m.reply.result && variant === 'mobile' && <InlineResult groups={m.reply.result.groups} />}
                {m.reply.result && variant === 'widget' && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {m.reply.result.groups[0].products.slice(0, 3).map((p) => (
                      <MiniResultCard key={p.id} product={p} size="widget" />
                    ))}
                  </div>
                )}
                {m.reply.confirm && <ConfirmCard message={m} />}
                {m.reply.link && (
                  <a href={m.reply.link.href} className="flex w-fit items-center gap-1 text-13 font-semibold text-main">
                    {m.reply.link.label}
                    <img src={arrowRight} alt="" className="size-4" />
                  </a>
                )}
              </div>
            </div>
            {variant === 'widget' && m.reply.result && (
              <button type="button" onClick={onExpand} className="flex w-fit items-center gap-1 pl-8 text-13 font-semibold text-main">
                결과 {m.reply.result.groups.reduce((n, g) => n + g.products.length, 0)}개 전체화면으로 보기
                <img src={arrowRight} alt="" className="size-4" />
              </button>
            )}
            {/* 추천 질문 칩은 마지막 답에만 — 모바일은 입력창 위에 따로 둔다 */}
            {index === lastAiIndex && variant !== 'mobile' && m.reply.chips && !thinking && (
              <div className={`flex flex-wrap gap-1.5 ${small ? 'pl-8' : 'pl-[38px]'}`}>
                {m.reply.chips.map((chip) => (
                  <AiChip key={chip} label={chip} />
                ))}
              </div>
            )}
          </div>
        ),
      )}
      {thinking && (
        <div className="flex items-center gap-2.5" role="status" aria-label="답을 만드는 중">
          <AiAvatar size={small ? 24 : 28} />
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-pulse rounded-full bg-icon-sub-weak" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
