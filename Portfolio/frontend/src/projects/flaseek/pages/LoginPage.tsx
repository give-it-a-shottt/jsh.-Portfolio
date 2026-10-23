import { useState, type FormEvent } from 'react'
import kakaoLogo from '../assets/logo-kakao.svg'
import naverLogo from '../assets/logo-naver.svg'
import { showDemoNotice, showToast } from '../store'
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '../ui'

const BENEFITS = [
  { label: '신규 가입', value: '할인 쿠폰 3종' },
  { label: '생일 축하', value: '20% 할인 쿠폰' },
  { label: '구매 감사', value: '15% 할인 쿠폰' },
  { label: '깜짝 게릴라', value: '수시 발급 쿠폰' },
]

const INPUT =
  'h-12 w-full rounded-sm border border-regular bg-white px-4 text-15 text-main outline-none placeholder:text-disabled focus:border-black'

// 로그인 — 폼 1단 384(가운데 4칸). 간편 로그인은 아이디 로그인 아래에 폼 너비 그대로 크게.
export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [keep, setKeep] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!id.trim() || !password) {
      showToast(!id.trim() ? '아이디를 입력해 주세요' : '비밀번호를 입력해 주세요')
      document.getElementById(!id.trim() ? 'login-id' : 'login-password')?.focus()
      return
    }
    showDemoNotice('로그인은')
  }

  return (
    <div className="px-5 pt-10 pb-16 lg:pt-20 lg:pb-24">
      <div className="mx-auto flex w-full max-w-96 flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-28 font-semibold lg:text-32">로그인</h1>
          <p className="text-14 text-sub">플레시크 회원이 되면 할인 쿠폰 3종을 드려요</p>
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-id" className="sr-only">
              아이디
            </label>
            <input id="login-id" value={id} onChange={(event) => setId(event.target.value)} placeholder="아이디" autoComplete="username" className={INPUT} />
            <label htmlFor="login-password" className="sr-only">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className={INPUT}
            />
          </div>
          <div className="flex items-center justify-between text-14">
            <label className="flex cursor-pointer items-center gap-2 text-sub">
              <input type="checkbox" checked={keep} onChange={(event) => setKeep(event.target.checked)} className="size-5 accent-flaseek" />
              로그인 상태 유지
            </label>
            <button type="button" onClick={() => showDemoNotice('계정 찾기는')} className="font-medium text-sub">
              아이디·비밀번호 찾기
            </button>
          </div>
          <button type="submit" className={`${BUTTON_PRIMARY} h-14 w-full lg:h-12`}>
            로그인
          </button>
        </form>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-regular" />
          <span className="text-12 text-sub">또는 간편 로그인</span>
          <span className="h-px flex-1 bg-regular" />
        </div>

        <div className="flex flex-col gap-2">
          {/* 카카오·네이버 색은 각 사 브랜드 가이드 규정색 — 대비 기준 예외 */}
          <button
            type="button"
            onClick={() => showDemoNotice('간편 로그인은')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#fee500] text-16 font-semibold text-[#191919]"
          >
            <img src={kakaoLogo} alt="" width={20} height={20} />
            카카오로 시작하기
          </button>
          <button
            type="button"
            onClick={() => showDemoNotice('간편 로그인은')}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#03c75a] text-16 font-semibold text-white"
          >
            <img src={naverLogo} alt="" width={16} height={16} />
            네이버로 시작하기
          </button>
          <p className="text-11 text-sub-weak">카카오·네이버 버튼 색은 각 사 브랜드 가이드 규정색 (대비 기준 예외)</p>
        </div>

        <button type="button" onClick={() => showDemoNotice('주문조회는')} className={`${BUTTON_SECONDARY} h-12 w-full`}>
          비회원 주문조회
        </button>

        <section aria-labelledby="join-title" className="flex flex-col gap-4 rounded-card bg-flaseek-pink-soft p-6">
          <div className="flex flex-col gap-1">
            <h2 id="join-title" className="text-18 font-semibold">
              아직 회원이 아니신가요?
            </h2>
            <p className="text-14 text-sub">가입하는 순간 받을 수 있는 혜택이에요</p>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {BENEFITS.map(({ label, value }) => (
              <li key={label} className="flex flex-col gap-1 rounded-thumb bg-white px-4 py-3">
                <span className="text-12 font-medium text-sub">{label}</span>
                <span className="text-14 font-semibold text-flaseek-text">{value}</span>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => showDemoNotice('회원가입은')} className={`${BUTTON_SECONDARY} h-12 w-full`}>
            회원가입하고 쿠폰 받기
          </button>
        </section>
      </div>
    </div>
  )
}
