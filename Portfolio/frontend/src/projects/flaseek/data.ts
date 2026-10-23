// FLASEEK 리뉴얼 시안 데이터 — 상품명·가격은 피그마 시안(현재 몰 상품) 그대로, 별점·리뷰 수는 예시 값이다.
// 상품 사진은 현재 몰을 캡처한 한 장(assets/products.webp)에서 잘라 쓴다. crop 은 그 이미지의 픽셀 좌표.

/** 원본 캡처(products.webp)에서 잘라 쓸 영역 */
export interface Crop {
  x: number
  y: number
  w: number
  h: number
}

/** 상품 사진 한 칸 — 캡처 속 상품은 260px 정사각형 간격으로 놓여 있다 */
const square = (x: number, y: number): Crop => ({ x, y, w: 260, h: 260 })

export type Category = 'legwear' | 'shapewear' | 'set' | 'laundry'
export type Thickness = 'see-through' | 'premium' | 'napping'
export type Skin = '밝은' | '보통' | '어두운'
export type Pressure = '약' | '중' | '강'
export type Season = '사계절' | '겨울용'

export interface Product {
  id: number
  name: string
  discount: number
  price: number
  original: number
  /** 세트 상품의 장당 가격 */
  perPiece?: number
  rating: number
  reviews: number
  /** 카드에 붙는 태그 — 최대 2개 */
  tags: string[]
  crop: Crop
  categories: Category[]
  /** 아래는 레그웨어만 가진 필터 값. 모음·세트는 여러 타입을 고를 수 있어 여러 값을 가진다 */
  thickness?: Thickness[]
  skin?: Skin[]
  pressure?: Pressure[]
  season?: Season[]
  /** 1·3·5·7매 세트 칩으로 고르는 상품이면 기본 매수 */
  setCount?: number
}

const ALL_THICKNESS: Thickness[] = ['see-through', 'premium', 'napping']
const ALL_SKIN: Skin[] = ['밝은', '보통', '어두운']

export const PRODUCTS: Product[] = [
  { id: 1, name: '압박스타킹 보정레깅스 외 모음구성', discount: 36, price: 15800, original: 24800, rating: 4.8, reviews: 1204, tags: ['다리라인 보정', '사계절'], crop: square(299, 301), categories: ['legwear'], thickness: ALL_THICKNESS, skin: ALL_SKIN, pressure: ['중'], season: ['사계절', '겨울용'], setCount: 1 },
  { id: 2, name: '압박스타킹/레깅스 3매 SET', discount: 46, price: 39800, original: 74400, perPiece: 13267, rating: 4.9, reviews: 862, tags: ['세트 특가', '타입 선택'], crop: square(580, 301), categories: ['legwear', 'set'], thickness: ALL_THICKNESS, skin: ALL_SKIN, pressure: ['중'], season: ['사계절', '겨울용'], setCount: 3 },
  { id: 3, name: '압박스타킹/레깅스 5매 SET', discount: 49, price: 62800, original: 124000, perPiece: 12560, rating: 4.9, reviews: 537, tags: ['세트 특가', '타입 선택'], crop: square(860, 301), categories: ['legwear', 'set'], thickness: ALL_THICKNESS, skin: ALL_SKIN, pressure: ['중'], season: ['사계절', '겨울용'], setCount: 5 },
  { id: 4, name: '시크릿 캐미솔 보정속옷 외 모음구성', discount: 39, price: 45800, original: 74800, rating: 4.7, reviews: 391, tags: ['체형 보정', '사계절'], crop: square(1140, 301), categories: ['shapewear'] },
  { id: 5, name: '압박스타킹 시스루 플러스 - 스킨2', discount: 36, price: 17800, original: 27800, rating: 4.8, reviews: 2031, tags: ['보통~어두운 피부', '비침 있음'], crop: square(299, 722), categories: ['legwear'], thickness: ['see-through'], skin: ['보통', '어두운'], pressure: ['중'], season: ['사계절'] },
  { id: 6, name: '압박스타킹/레깅스 7매 SET', discount: 54, price: 79800, original: 173600, perPiece: 11400, rating: 4.9, reviews: 318, tags: ['세트 특가', '타입 선택'], crop: square(580, 722), categories: ['legwear', 'set'], thickness: ALL_THICKNESS, skin: ALL_SKIN, pressure: ['중'], season: ['사계절', '겨울용'], setCount: 7 },
  { id: 7, name: '시크릿 백 엉뽕 힙업 팬티 보정속옷 모음구성', discount: 36, price: 15800, original: 24800, rating: 4.6, reviews: 744, tags: ['힙업 보정', '사계절'], crop: square(860, 722), categories: ['shapewear'] },
  { id: 8, name: '시크릿 캐미솔 2종 SET', discount: 49, price: 75800, original: 149600, perPiece: 37900, rating: 4.8, reviews: 205, tags: ['세트 특가', '컬러 선택'], crop: square(1140, 722), categories: ['shapewear', 'set'] },
  { id: 9, name: '시크릿백 2종 SET', discount: 40, price: 29800, original: 49600, perPiece: 14900, rating: 4.7, reviews: 412, tags: ['세트 특가', '컬러 선택'], crop: square(299, 1144), categories: ['shapewear', 'set'] },
  { id: 10, name: '보정속옷 + 압박 레그웨어 2종 SET', discount: 45, price: 55200, original: 99600, perPiece: 27600, rating: 4.8, reviews: 169, tags: ['세트 특가', '타입 선택'], crop: square(580, 1144), categories: ['shapewear', 'legwear', 'set'] },
  { id: 11, name: '압박스타킹 프리미엄 - 블랙', discount: 36, price: 17800, original: 27800, rating: 4.9, reviews: 1587, tags: ['모든 피부톤', '비침 없음'], crop: square(860, 1144), categories: ['legwear'], thickness: ['premium'], skin: ALL_SKIN, pressure: ['강'], season: ['사계절'] },
  { id: 12, name: '압박스타킹 시스루 플러스 - 스킨1', discount: 36, price: 17800, original: 27800, rating: 4.8, reviews: 1322, tags: ['밝은~보통 피부', '비침 있음'], crop: square(1140, 1144), categories: ['legwear'], thickness: ['see-through'], skin: ['밝은', '보통'], pressure: ['약'], season: ['사계절'] },
]

export const findProduct = (id: number) => PRODUCTS.find((product) => product.id === id)

/** 상세 갤러리 뒤쪽 사진 — 시안의 썸네일 2~4 */
export const GALLERY_EXTRAS: Crop[] = [square(860, 1144), square(299, 722), square(299, 1987)]

/** 포토 리뷰 칸 — 시안과 같은 다섯 장 */
export const PHOTO_REVIEWS: Crop[] = [square(299, 301), square(299, 722), square(860, 1144), square(860, 1565), square(860, 722)]

export interface CategoryInfo {
  key: Category | 'all'
  /** 헤더 메뉴의 영문 이름 */
  en: string
  ko: string
  /** 메인 카테고리 카드의 한 줄 설명 */
  note: string
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'all', en: 'BEST', ko: '인기상품', note: '' },
  { key: 'legwear', en: 'LEGWEAR', ko: '압박스타킹·레깅스', note: '압박스타킹·레깅스' },
  { key: 'shapewear', en: 'SHAPEWEAR', ko: '보정속옷', note: '보정속옷' },
  { key: 'set', en: 'SET & SALE', ko: '세트·특가', note: '최대 49% 할인' },
  { key: 'laundry', en: 'ETC', ko: '런드리백', note: '세탁 손상 방지' },
]

/** 카테고리 탭·카드에 쓰는 짧은 한글 이름 */
export const CATEGORY_TAB: Record<Category, string> = {
  legwear: '레그웨어',
  shapewear: '쉐이프웨어',
  set: '세트·특가',
  laundry: '런드리백',
}

export interface ThicknessInfo {
  key: Thickness
  en: string
  ko: string
  /** 메인 '두께로 골라보세요' 카드 문구 */
  note: string
  /** 카드 사진 — 384×240 비율 */
  crop: Crop
}

export const THICKNESSES: ThicknessInfo[] = [
  { key: 'see-through', en: 'SEE-THROUGH', ko: '시스루', note: '얇게 비치는 시스루', crop: { x: 299, y: 771, w: 260, h: 162 } },
  { key: 'premium', en: 'PREMIUM', ko: '미디엄', note: '적당한 두께감', crop: { x: 860, y: 1193, w: 260, h: 162 } },
  { key: 'napping', en: 'NAPPING', ko: '기모', note: '기모 안감 보온', crop: { x: 299, y: 2457, w: 260, h: 162 } },
]

export const SKINS: Skin[] = ['밝은', '보통', '어두운']
export const PRESSURES: Pressure[] = ['약', '중', '강']
export const SEASONS: Season[] = ['사계절', '겨울용']

/** 레그웨어 세트 칩 — 매수가 늘수록 장당 가격이 내려간다 */
export interface SetOption {
  count: number
  /** 이 매수의 상품 — 이름·가격·사진을 여기서 가져온다 */
  productId: number
  /** 칩 아랫줄 */
  note: string
  badge?: string
}

export const SET_OPTIONS: SetOption[] = [
  { count: 1, productId: 1, note: '15,800원~' },
  { count: 3, productId: 2, note: '장당 13,267원' },
  { count: 5, productId: 3, note: '장당 12,560원' },
  { count: 7, productId: 6, note: '장당 11,400원', badge: '장당 최저' },
]

/** 세트에 담을 수 있는 타입 */
export const LEG_TYPES = ['시스루 플러스 - 스킨1', '시스루 플러스 - 스킨2', '시스루 - 블랙', '시스루 - 커피', '프리미엄 - 블랙', '기모 - 블랙']

export interface Review {
  stars: number
  author: string
  date: string
  option: string
  body: string
}

export const REVIEWS: Review[] = [
  { stars: 5, author: 'ma*****', date: '2026.10.12', option: '3매 SET · 사이즈감 딱 맞아요 · 압박감 적당해요', body: '세 가지 타입을 골라 담을 수 있어서 출근용, 주말용으로 나눠 신고 있어요. 압박감이 적당해서 하루 종일 신어도 답답하지 않아요.' },
  { stars: 4, author: 'su*****', date: '2026.10.03', option: '3매 SET · 사이즈감 작아요 · 압박감 강해요', body: '시스루 스킨2 색이 피부에 자연스럽게 붙어요. 키가 큰 편이라 조금 타이트했어요. 사이즈 표를 꼭 확인하세요.' },
]

/** 리뷰 요약 막대 — 가장 많이 고른 값만 브랜드 색으로 채운다 */
export const REVIEW_SUMMARY = [
  { title: '사이즈감', bars: [{ label: '작아요', value: 8 }, { label: '딱 맞아요', value: 81 }, { label: '커요', value: 11 }] },
  { title: '압박감', bars: [{ label: '약해요', value: 12 }, { label: '적당해요', value: 70 }, { label: '강해요', value: 18 }] },
]

export const won = (value: number) => `${value.toLocaleString('ko-KR')}원`
