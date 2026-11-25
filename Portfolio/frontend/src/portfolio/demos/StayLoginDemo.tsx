import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import apple from '../assets/design/stay-login/apple.svg'
import google from '../assets/design/stay-login/google.svg'
import googleMask from '../assets/design/stay-login/google-mask.svg'
import statusFill from '../assets/design/stay-login/status-fill.svg'
import statusOutline from '../assets/design/stay-login/status-outline.svg'
import visibilityOff from '../assets/design/stay-login/visibility-off.svg'
import visibilityOn from '../assets/design/stay-login/visibility-on.svg'
import { CheckIcon } from '../../shared/icons'

// 숙박 예약 앱 Accio 로그인 - 피그마 「로그인(수정)」 3안(336:741), 400×860 다크 화면.
// 이 앱만의 색이라 포트폴리오 토큰 대신 시안 값을 그대로 쓴다.
const FIELD_CLASS =
  'flex h-[51px] items-center rounded-[8px] border border-[rgba(229,229,236,0.7)] bg-[rgba(17,17,17,0.08)] shadow-[inset_0px_60px_0px_4px_rgba(255,255,255,0.03)]'
const INPUT_CLASS =
  'h-full min-w-0 flex-1 bg-transparent pl-[19px] text-12 text-white outline-none placeholder:text-[#505050]'
const SOCIAL_BUTTON_CLASS = `${FIELD_CLASS} w-full justify-center gap-[9px] text-15 font-medium text-white hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#177fff]`
const LINK_CLASS = 'rounded-badge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#177fff]'

const NOTICE_MS = 2400

export default function StayLoginDemo() {
  const id = useId()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [notice, setNotice] = useState('')
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // 화면 아래에 잠깐 띄우는 안내 - 실제 인증·이동은 없는 데모다
  const notify = (message: string) => {
    window.clearTimeout(timer.current)
    setNotice(message)
    timer.current = window.setTimeout(() => setNotice(''), NOTICE_MS)
  }
  const notifyNotLinked = (name: string) => notify(`데모라서 ${name} 화면은 연결되어 있지 않아요.`)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!userId.trim() || !password) {
      notify('아이디와 비밀번호를 모두 입력해 주세요.')
      return
    }
    notify('데모 화면이라 실제로 로그인되지는 않아요.')
  }

  return (
    <div className="relative flex min-h-[860px] flex-col bg-[#1c1c1c]">
      {/* 상태 표시줄 - 휴대폰 틀의 장식 */}
      <div aria-hidden="true" className="flex h-[50px] shrink-0 items-center justify-between px-6 py-[14px]">
        <span className="text-13 font-semibold tracking-normal text-[#e7e7e5]">9:41</span>
        <span className="flex items-center gap-1.5">
          <img src={statusFill} alt="" width={16} height={12} />
          <img src={statusOutline} alt="" width={16} height={12} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-[27px] pt-6 pb-10">
        <div className="flex flex-col gap-2 pb-9">
          <div className="flex items-center gap-2 pb-3">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#177fff] pl-1 font-[family-name:Diplomata] text-[19px] font-regular text-white"
            >
              A
            </span>
            <p
              lang="en"
              className="bg-[linear-gradient(-70.94deg,#ffffff_2.93%,#177fff_89.86%)] bg-clip-text text-40 leading-[normal] font-semibold text-transparent"
            >
              Accio
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-28 leading-[normal] font-semibold text-white">다시 만나서 반가워요</h3>
            <p className="text-14 leading-[normal] font-medium text-sub-weak">로그인하고 저장한 여행지를 확인하세요</p>
          </div>
        </div>

        <form noValidate onSubmit={onSubmit} className="flex flex-col">
          <div className="flex flex-col gap-[19px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-user`} className="text-14 font-medium text-white">
                아이디
              </label>
              <div className={`${FIELD_CLASS} focus-within:border-[#177fff]`}>
                <input
                  id={`${id}-user`}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  className={`${INPUT_CLASS} pr-[18px]`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-password`} className="text-14 font-medium text-white">
                비밀번호
              </label>
              <div className={`${FIELD_CLASS} focus-within:border-[#177fff]`}>
                <input
                  id={`${id}-password`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className={`${INPUT_CLASS} placeholder:text-[#474747]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  aria-pressed={showPassword}
                  className={`mr-[10px] flex size-9 shrink-0 items-center justify-center ${LINK_CLASS}`}
                >
                  {/* 아이콘(20px) 바깥으로 선이 살짝 넘치는 시안 크기를 그대로 쓴다 */}
                  <img src={showPassword ? visibilityOn : visibilityOff} alt="" width={21.77} height={21.17} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-2">
            <label className="flex cursor-pointer items-center gap-[7px] text-12 text-[#757575]">
              <span className="relative flex size-[19px] shrink-0">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer size-full cursor-pointer appearance-none rounded-[5px] border border-regular bg-[#111111] checked:border-[#177fff] checked:bg-[#177fff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#177fff]"
                />
                <CheckIcon
                  size={13}
                  className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100"
                />
              </span>
              아이디 저장
            </label>
            <button type="button" onClick={() => notifyNotLinked('비밀번호 찾기')} className={`text-12 text-[#757575] hover:text-white ${LINK_CLASS}`}>
              비밀번호 찾기
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="flex h-10 w-full items-center justify-center rounded-[16px] bg-[#177fff] px-5 text-14 leading-[normal] font-medium text-white hover:bg-[#0f6fe6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              로그인
            </button>
          </div>
        </form>

        <p className="flex items-center justify-center gap-1 pt-2 text-12 font-medium">
          <span className="text-[#757575]">아직 계정이 없으신가요?</span>
          <button type="button" onClick={() => notifyNotLinked('회원가입')} className={`text-white hover:underline ${LINK_CLASS}`}>
            회원가입
          </button>
        </p>

        <div className="flex h-16 items-center gap-3 py-8">
          <span aria-hidden="true" className="h-px flex-1 bg-[#3d3e3c]" />
          <span className="text-12 font-medium text-[#a2a39f]">또는 다음으로 로그인</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[#3d3e3c]" />
        </div>

        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => notifyNotLinked('Google 로그인')} className={SOCIAL_BUTTON_CLASS}>
            {/* 피그마 Symbol.svg - 마스크 그룹 구조를 그대로 옮긴다 */}
            <span aria-hidden="true" className="relative size-[15px] shrink-0 overflow-clip">
              <span
                className="absolute inset-[-0.43%_-0.75%_-0.73%_-0.75%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0.112px_0.064px] mask-size-[15px_15px]"
                style={{ maskImage: `url("${googleMask}")` }}
              >
                <span className="absolute inset-[-17.74%_-3.09%_-3.1%_-11.53%]">
                  <img src={google} alt="" className="block size-full max-w-none" />
                </span>
              </span>
            </span>
            <span lang="en">Google</span>
          </button>
          <button type="button" onClick={() => notifyNotLinked('Apple 로그인')} className={SOCIAL_BUTTON_CLASS}>
            <img src={apple} alt="" width={15} height={18} className="shrink-0" />
            <span lang="en">Apple</span>
          </button>
        </div>

        <div className="flex-1" />

        {/* 홈 인디케이터 - 휴대폰 틀의 장식 */}
        <div aria-hidden="true" className="flex h-[34px] items-center justify-center py-2">
          <span className="h-[5px] w-[134px] rounded-[3px] bg-[#e7e7e5] opacity-30" />
        </div>
      </div>

      <p
        role="status"
        className={`pointer-events-none absolute inset-x-[27px] bottom-20 rounded-[8px] bg-white px-4 py-3 text-13 font-medium text-main transition-opacity ${notice ? 'opacity-100' : 'opacity-0'}`}
      >
        {notice}
      </p>
    </div>
  )
}
