// 버튼 모양 — 피그마 M-2 Button (Primary / Secondary × XL 56 · L 48 · S 32). <a> 와 <button> 이 같이 쓴다

const BUTTON_SIZE = { XL: 'h-14 px-6', L: 'h-12 px-5', S: 'h-8 px-3 text-14' }
const BUTTON_STYLE = {
  primary: 'bg-mr-primary text-white hover:bg-mr-primary-hover active:bg-mr-primary-pressed',
  secondary: 'bg-mr-fill text-mr-main hover:bg-mr-line',
}

export function buttonClass(style: 'primary' | 'secondary', size: 'XL' | 'L' | 'S' = 'XL') {
  return `flex items-center justify-center rounded-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:bg-mr-fill disabled:text-mr-disabled ${
    size === 'S' ? '' : 'text-16'
  } ${BUTTON_SIZE[size]} ${BUTTON_STYLE[style]}`
}

