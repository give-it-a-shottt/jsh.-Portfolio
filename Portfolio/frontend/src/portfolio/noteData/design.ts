import bannerSale from '../assets/study/banner-sale.webp'
import cardNews from '../assets/study/card-news.webp'
import invitation from '../assets/study/invitation.webp'
import missionSplit from '../assets/study/mission-1-split.webp'
import missionStory from '../assets/study/mission-2-story.webp'
import missionLeft from '../assets/study/mission-3-left.webp'
import missionSerif from '../assets/study/mission-4-serif.webp'
import missionGreen from '../assets/study/mission-5-green.webp'
import missionRoast from '../assets/study/mission-6-roast.webp'
import missionBakery from '../assets/study/mission-7-bakery.webp'
import productBanner from '../assets/study/product-banner.webp'
import splitNewyork from '../assets/study/split-newyork.webp'
import composeBlending from '../assets/study/compose-blending.webp'
import flowerFeed from '../assets/study/flower-feed.webp'
import flowerOverlay from '../assets/study/flower-overlay.webp'
import composeClipping from '../assets/study/compose-clipping.webp'
import composePolaroid from '../assets/study/compose-polaroid.webp'
import toneMorning from '../assets/study/tone-morning.webp'
import toneOriginal from '../assets/study/tone-original.webp'
import toneSunset from '../assets/study/tone-sunset.webp'
import titleJoker from '../assets/study/title-joker.webp'
import titleJokerPurple from '../assets/study/title-joker-1-purple.webp'
import titleJokerRed from '../assets/study/title-joker-2-red.webp'
import titleJokerGlitch from '../assets/study/title-joker-3-glitch.webp'
import titleJokerInk from '../assets/study/title-joker-4-ink.webp'
import titleLongShadow from '../assets/study/title-long-shadow.webp'
import titleLongShadowNavy from '../assets/study/title-long-shadow-1-navy.webp'
import titleLongShadowCoral from '../assets/study/title-long-shadow-2-coral.webp'
import titleLongShadowNeon from '../assets/study/title-long-shadow-3-neon.webp'
import titleLongShadowMustard from '../assets/study/title-long-shadow-4-mustard.webp'
import titleSpeedFlash from '../assets/study/title-speed-flash.webp'
import titleSpeedFlashNeon from '../assets/study/title-speed-flash-1-neon.webp'
import titleSpeedFlashGold from '../assets/study/title-speed-flash-2-gold.webp'
import titleSpeedFlashElectric from '../assets/study/title-speed-flash-3-electric.webp'
import titleSpeedFlashKwang from '../assets/study/title-speed-flash-4-kwang.webp'
import titleSpeedFlashShuung from '../assets/study/title-speed-flash-5-shuung.webp'
import titleSpeedFlashBanjjak from '../assets/study/title-speed-flash-6-banjjak.webp'
import title3dJinjjaro from '../assets/study/title-3d-jinjjaro.webp'
import title3dKkuljaem from '../assets/study/title-3d-kkuljaem.webp'
import title3dBrushShape from '../assets/study/title-3d-brush-shape.webp'
import title3dAiSheet from '../assets/study/title-3d-ai-sheet.webp'
import neonSneaker from '../assets/study/neon-sneaker.webp'
import realestateOnboarding from '../assets/study/design-practice-realestate-onboarding.webp'
import realestateHome from '../assets/study/design-practice-realestate-home.webp'
import type { StudyNote } from '../notes'

// Design 공부 노트 — 노션 학습노트 > 학습 폴더 > 포토샵 / 일러스트 (6강 이후는 앞 회차 초안을 합친 요약본이라 1~3·5번은 싣지 않는다)
export const DESIGN_NOTES: StudyNote[] = [
  {
    slug: 'ps-compose-mask-blend',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '7강',
    date: '2026.10.15',
    title: '포토샵 합성 — 마스크와 블렌딩',
    summary: '합성은 "무엇을 보여줄지(마스크)"와 "어떻게 섞을지(블렌딩)" 두 가지 결정이다.',
    points: [
      '클리핑 마스크는 아래 레이어의 모양을, 레이어 마스크는 흑백을 기준으로 보여줄 곳을 정한다',
      '블렌딩 모드는 사라지는 중립색으로 고른다 — 검정 배경의 빛은 Screen, 흰 배경의 잉크는 Multiply',
      '합성 티는 광원 방향 · 색온도 · 대비 · 접지 그림자 · 질감 5가지에서 난다',
    ],
    learned: [
      {
        title: '마스크 — 무엇을 보여줄지',
        items: [
          '클리핑 마스크: 아래 레이어에 픽셀이 있는 곳만 보인다. 글자·도형 안에 이미지를 채울 때',
          '레이어 마스크: 흰색은 보이고 검정은 숨김, 회색은 반투명. 경계를 자연스럽게 지울 때',
          '조정 레이어를 클리핑하면 그 레이어에만 보정이 먹는다 — "인물만 밝게, 배경은 그대로"',
        ],
      },
      {
        title: '블렌딩 — 어떻게 섞을지',
        items: [
          'Multiply: 항상 어두워지고 흰색이 사라진다 → 종이 · 잉크 · 스캔',
          'Screen: 항상 밝아지고 검정이 사라진다 → 불꽃 · 빛 · 보케',
          'Overlay · Soft Light: 50% 회색이 사라지고 질감만 남는다',
          'Color Dodge 같은 특수 8개 모드는 Opacity 와 Fill 의 결과가 다르다',
        ],
      },
      {
        title: '웹에서는',
        items: [
          'mix-blend-mode · background-blend-mode 에 같은 이름의 모드가 있다',
          'mask-image, background-clip: text 가 레이어 마스크 · 텍스트 클리핑과 같은 개념이다',
        ],
      },
    ],
    practice: [
      { image: composePolaroid, caption: '폴라로이드 프레임', how: '도형 + 클리핑 마스크로 사진을 틀 안에' },
      { image: composeClipping, caption: '클리핑 마스크 타이포', how: '글자 모양 안에만 인물 사진이 보이게' },
      { image: composeBlending, caption: '블렌딩 연습', how: '어두운 숲 위에 구겨진 종이 질감을 Overlay 로' },
    ],
    applied: [
      {
        slug: 'portfolio-ivory',
        learned: '빛 소스는 검정 배경 위에서 Screen 으로 살아나고, 밝은 배경 위에서는 거의 보이지 않는다.',
        used: '참고한 네온 검색창은 모두 어두운 배경이었다. 아이보리 홈에서는 번지는 빛이 묻히고 글자를 가려서, 빛 대신 그라데이션 테두리와 옅은 색 그림자로 옮겼다.',
      },
    ],
    tags: ['포토샵', '마스크', '블렌딩', '합성'],
    keywords: 'photoshop mask blend blending clipping 클리핑 레이어 마스크 multiply screen overlay mix-blend-mode',
  },
  {
    slug: 'ps-tone-color',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '6강',
    date: '2026.10.15',
    title: '포토샵 보정 — 톤과 색',
    summary: '보정은 넓게 → 좁게, 언제든 되돌릴 수 있게. 목표는 "보정한 티는 안 나는데 좋아 보이는 것".',
    points: [
      '원본 픽셀은 두고 조정 레이어 · 스마트 오브젝트 · 마스크로 쌓는다 (비파괴 편집)',
      '톤은 Levels · Curves 로 밝기와 대비를, 색은 Selective Color 로 계열별로 잡는다',
      '보정은 "목적 → 기준 → 순서"로 말한다 — 레퍼런스 1장을 정하고 그 톤에 맞춘다',
    ],
    learned: [
      {
        title: '톤 — 밝기와 대비',
        items: [
          '히스토그램 양 끝에 벽처럼 붙으면 디테일이 날아간 클리핑',
          'Levels 는 3점, Curves 는 원하는 구간만. S자 곡선이면 대비가 올라간다',
        ],
      },
      {
        title: '색 — 보색으로 생각하기',
        items: [
          'Red ↔ Cyan, Green ↔ Magenta, Blue ↔ Yellow — 하나를 빼면 반대가 올라온다',
          '잔디는 Greens 가 아니라 Yellows 로 잡는다 (노란 기가 섞인 연두라서)',
          '인물엔 Saturation 보다 Vibrance — 이미 채도가 있는 피부를 덜 건드린다',
        ],
      },
      {
        title: '여러 장을 같은 톤으로',
        items: ['조정 레이어 그룹 · 프리셋을 다른 파일에 재사용한다', '웹 결과물은 sRGB 로 내보낸다'],
      },
    ],
    practice: [
      { image: toneOriginal, caption: '원본', how: '도로 위 풀밭 풍경' },
      { image: toneMorning, caption: '오전', how: '조정 레이어로 시간대 연출 — 화사하게' },
      { image: toneSunset, caption: '오후', how: '조정 레이어로 시간대 연출 — 노을 느낌' },
    ],
    applied: [
      {
        slug: 'portfolio-ivory',
        learned: '여러 장을 같은 분위기로 맞출 때는 기준 톤을 먼저 정하고, 전체를 그 색온도에 맞춘다.',
        used: '흰 바탕 + 쿨톤 회색이던 토큰을 Ivory 웜톤 값으로 한 번에 바꿨다. 회색 하나만 차가워도 전체가 어긋나서 글자 · 선 · 아이콘까지 같은 따뜻한 톤으로 맞췄다.',
      },
    ],
    tags: ['포토샵', '보정', '컬러', '톤'],
    keywords: 'photoshop tone color levels curves selective color vibrance 색온도 보색 비파괴',
  },
  {
    slug: 'ps-layout-brand',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '8강',
    date: '2026.10.15',
    title: '레이아웃과 브랜드 — 배치 · 여백 · 가이드라인',
    summary: '레이아웃은 그리드 · 여백 · 행간으로 읽는 순서를 설계하는 일, 브랜드는 늘 같은 채널로 보이게 하는 규칙을 정하는 일.',
    points: [
      '묶을 건 가깝게, 나눌 건 멀게. 행간은 자간보다 넓게',
      '메인 → 서브 → 보조로 크기 · 굵기 · 색 차이를 줘서 시선을 순서대로 움직인다',
      '브랜드 가이드라인은 컬러 3~4개(메인 · 세컨더리 · 엑스트라)와 "용도 × 언어" 폰트 표',
    ],
    learned: [
      {
        title: '레이아웃',
        items: [
          '여백 3종: 프레임 여백 · 오브젝트 여백 · 텍스트 여백(행간 · 자간)',
          '기울기 · 사선은 한두 요소만 — 그리드와 정렬은 유지한다',
          '화면을 작게 줄여도 메인 문구가 읽히는지 확인한다',
        ],
      },
      {
        title: '브랜드',
        items: [
          '네임 → 키워드 → 리서치 → 로고 순서',
          '로고는 작게 보일 때가 많다 → 굵게, 크게, 벡터로 만든다',
          '컬러 비율 60-30-10. 엑스트라는 "여기를 보세요" 신호로 한두 군데만',
        ],
      },
      {
        title: '웹에서는',
        items: ['그리드 → CSS grid, 프레임 여백 → padding, 오브젝트 여백 → gap', '브랜드 가이드라인 → 디자인 토큰'],
      },
    ],
    applied: [
      {
        slug: 'gameprobe',
        learned: '브랜드 가이드라인은 컬러를 역할로 나누고, 폰트를 "용도 × 언어" 표로 정리해 작업할 때 헤매지 않게 한다.',
        used: '디자인 시스템 문서에 텍스트 스타일을 KR/EN × 카테고리(Display · Headline · Title · Body · Caption) 표로, 컬러를 text · icon · line · bg 역할로 나눠 정리했다.',
      },
    ],
    tags: ['레이아웃', '브랜드', '여백', '디자인 시스템'],
    keywords: 'layout brand grid spacing guideline 그리드 행간 자간 로고 가이드라인 토큰',
  },
  {
    slug: 'ps-diagonal-banner',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '9강',
    date: '2026.10.18',
    title: '시선을 사로잡는 배너 — 사선 · 누끼 · 컬러 추출',
    summary: '배경을 사선으로 나눠 긴장감을 만들고, 인물을 문구 위에 겹쳐 깊이감을 주고, 색은 사진에서 뽑아 최소한으로 쓴다.',
    points: [
      '사선을 쓰면 긴장감이 올라간다',
      '메인 이미지 뒤로 문구가 살짝 겹치면 입체감과 깊이감이 생긴다',
      '색이 고민되면 사용한 사진에서 추출한다 — 요소처럼 색도 최소한으로',
    ],
    learned: [
      {
        title: '만드는 법',
        items: [
          '사각형을 복제하고 Direct Selection 으로 꼭짓점만 옮겨 사선 배경을 만든다',
          'Select Subject → Select and Mask(Refine Hair)로 머리카락까지 누끼',
          '크기를 바꾸기 전에 스마트 오브젝트로 바꿔야 화질이 유지된다',
        ],
      },
      {
        title: '색과 깊이',
        items: [
          '배경색은 인물의 손바닥 · 옷에서 스포이트로 뽑고, 포인트 문구는 반대쪽 배경색으로 교차',
          '문구 레이어를 인물 아래로 내려 살짝 겹치게 한다',
          '사선 각도는 15~30° — 눕히면 불안하고, 세우면 그냥 분할선처럼 보인다',
        ],
      },
    ],
    practice: [{ image: bannerSale, caption: '사선 배너 "50% OFF"', how: '사선 배경 + 누끼 인물 + 사진에서 뽑은 두 색' }],
    tags: ['포토샵', '배너', '사선', '컬러'],
    keywords: 'photoshop banner diagonal 누끼 select subject 컬러 추출 스포이트',
  },
  {
    slug: 'ps-brush-invitation',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '10강',
    date: '2026.10.19',
    title: '붓터치 사진 초대장 — 레이어 마스크 · 블렌딩 질감 · 텍스트 왜곡',
    summary: '종이 질감을 블렌딩으로 배경에 녹이고, 사진은 마스크로 붓터치 모양만 보이게 해서 손으로 만든 듯한 인쇄물 느낌을 낸다.',
    points: [
      '인쇄물처럼 종이 질감이 보이면 디지털 단색보다 따뜻하고 고급스럽다',
      '레이어 마스크는 지우지 않고 가리기만 한다 — 흰색은 보이기, 검정은 가리기',
      '곡선으로 휜 텍스트가 프레임을 따라 시선을 사진 → 아래 정보로 이어 준다',
    ],
    learned: [
      {
        title: '질감 배경과 붓터치 프레임',
        items: [
          '칠 레이어(#ffd200) + Pin Light 블렌딩으로 종이 결이 드러난 노랑 — 색만 바꾸면 다른 종이가 된다',
          '검은 마스크에 거친 파스텔 브러시로 흰색을 칠해 붓 자국 사이로만 사진이 보이게',
          'Alt + 마스크 추가면 처음부터 전부 가린 마스크 · 체인을 끊으면 프레임은 두고 사진만 이동',
        ],
      },
      {
        title: '문구와 정보 위계',
        items: [
          'Warp Text: Arc, Bend -35% → 아래로 휘어 둥근 프레임 아래를 감싼다',
          '구분선은 배경보다 살짝 진한 같은 계열(#ffb400) — 톤온톤으로 튀지 않게',
          '손글씨 제목 → 사진 → 곡선 영문 → 일시 · 장소 순으로 크기가 내려가며 읽는 순서를 만든다',
        ],
      },
    ],
    practice: [{ image: invitation, caption: '생일 초대장', how: '종이 질감 블렌딩 + 붓터치 마스크 + 곡선 텍스트' }],
    tags: ['포토샵', '레이어 마스크', '블렌딩', '타이포'],
    keywords: 'photoshop layer mask pin light warp text 초대장 종이 질감 톤온톤',
  },
  {
    slug: 'ps-split-thumbnail',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '11강',
    date: '2026.10.20',
    title: '분할 구도 감성 썸네일 — 클리핑 마스크 · 그레이디언트 마스크 · LUT',
    summary: '사진 두 장을 가이드라인 기준으로 반씩 나누고, 경계는 그레이디언트 마스크로 녹여 한 장처럼 잇고, LUT와 외부 광선으로 밤거리 네온 톤을 맞춘다.',
    points: [
      '정확히 반 나눈 분할 구도는 두 장면을 대비시키면서도 안정적이다',
      '경계를 자르지 않고 그레이디언트로 흐리게 녹이면 원래 한 장의 사진처럼 이어진다',
      '사진마다 색감이 다를 때 Color Lookup(LUT) 한 번으로 전체 톤을 통일한다',
    ],
    learned: [
      {
        title: '두 사진 잇기',
        items: [
          '검은 사각형을 바탕으로 사진을 클리핑 → 사각형을 바꾸면 보이는 범위가 같이 바뀐다',
          '마스크는 사진이 아니라 클리핑의 바탕(사각형)에 건다 — 바탕이 흐려지면 사진도 같이 흐려진다',
          '사각형을 가이드라인 너머로 넓혀 겹치는 구간을 만들어야 그 구간에서 섞인다',
        ],
      },
      {
        title: '색과 빛',
        items: [
          'Color Lookup 은 아래 모든 레이어에 적용 — 한 장에만 쓰려면 클리핑으로 묶는다',
          '노란 글자(#ffe400)에 더 진한 주황(#ff9000) 외부 광선 → 네온관처럼 빛난다',
          '큰 한글 → 작은 영문 → 장식 텍스트로 크기 차이를 크게 줘서 정보 계층을 만든다',
        ],
      },
    ],
    practice: [{ image: splitNewyork, caption: '분할 구도 썸네일 "뉴욕"', how: '클리핑 + 그레이디언트 마스크 + LUT + 외부 광선' }],
    tags: ['포토샵', '클리핑 마스크', '그레이디언트', 'LUT'],
    keywords: 'photoshop clipping mask gradient mask color lookup lut outer glow 네온 썸네일 분할',
  },
  {
    slug: 'ps-product-banner-cardnews',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '12강',
    date: '2026.10.22',
    title: '제품 배너 · 카드뉴스 템플릿 — 라이브 코너 · 개체 선택 · 아트보드',
    summary: '제품 배너는 프레임 밖으로 튀어나온 신발과 글자 뒤 그림자로 깊이를 만들고, 카드뉴스는 아트보드 한 장을 완성한 뒤 복제해 시리즈 통일감을 만든다.',
    points: [
      '신발 한 짝만 프레임 밖으로 빼면 평면 배너가 입체적으로 보인다',
      '레이어 순서가 곧 앞뒤 관계 — 문구를 튀어나온 신발 아래로 내려 깊이를 만든다',
      '카드뉴스는 이미지 자리 · 질문 · 본문 · 배지 위치를 정해 둔 템플릿을 복제한다',
    ],
    learned: [
      {
        title: '제품 배너',
        items: [
          '원본은 클리핑으로 프레임 안에, 복제본은 개체 선택 + 마스크로 신발 한 짝만 → 겹쳐서 "빠져나온" 모습',
          '배경 빨강(#af000d)은 신발의 빨강에서 추출해 제품과 배경을 한 색으로 묶는다',
          '글자 모양 선택 영역 안에만 5% 브러시를 여러 번 칠해 신발 그림자를 쌓는다',
        ],
      },
      {
        title: '카드뉴스 템플릿',
        items: [
          '아트보드로 한 파일에서 여러 장을 같이 보며 작업 · 내보내기',
          '질문 60pt / 본문 25pt(행간 200%) — 크기 차이로 질문 → 본문 순서로 읽힌다',
          '형광 연두 테두리 + 보라 포인트의 강한 대비로 피드에서 눈에 띈다',
        ],
      },
    ],
    practice: [
      { image: productBanner, caption: '제품 배너 "Still Alive?"', how: '클리핑 + 마스크로 프레임 밖 신발, 글자 위 그림자' },
      { image: cardNews, caption: '카드뉴스 템플릿 3장', how: '아트보드 1장을 완성해 복제 · 말풍선 꼬리 · 톱니 배지' },
    ],
    tags: ['포토샵', '배너', '카드뉴스', '템플릿'],
    keywords: 'photoshop banner card news artboard object selection live corners polygon 템플릿',
  },
  {
    slug: 'ps-neon-photo',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '17강',
    date: '2026.11.06',
    title: '네온 사진 — Color Lookup · Inner Glow 흰 심지 · Outer Glow · Shift 직선',
    summary: '네온은 빛이라서 먼저 Color Lookup(Moonlight)으로 배경을 어둡게 만든다. 그다음 브러시 선 하나에 색(Color Overlay) → 가까운 빛(Outer Glow, Linear Dodge) → 넓은 빛(Drop Shadow) → 흰 심지(Inner Glow)를 쌓으면 네온관이 된다.',
    points: [
      '흰 심지는 Inner Glow(Edge) — 15px 선에 Size 8px 이면 양쪽 가장자리의 빛이 가운데에서 만나 선 전체가 하얘진다',
      'Outer Glow 는 Linear Dodge (Add) — 아래 색에 더해져 겹칠수록 밝아지고, 밝은 배경에서는 묻힌다',
      'Ctrl+J 로 복사한 뒤 색만 바꾸고 Inner Glow 는 흰색 그대로 — 차가운 밤 배경 속 노랑 로고가 시선 1순위가 된다',
    ],
    learned: [
      {
        title: '어두운 무대 먼저',
        items: [
          'Color Lookup 조정 레이어 → 3DLUT File Moonlight 로 낮 사진을 어둡고 채도 낮은 푸른 밤으로 바꾼다',
          '조정 레이어라 원본 사진은 그대로다 — 너무 어두우면 조정 레이어 Opacity 로 강도를 줄인다',
        ],
      },
      {
        title: '네온관 한 줄의 층',
        items: [
          'Inner Glow 흰색(Size 8px · Contour Half Round) → Color Overlay #FFD800 → Outer Glow 같은 색(Linear Dodge, 50% · 20px) → Drop Shadow 같은 색(넓게)',
          'Inner Glow 기본값(Edge)은 가장자리에서 안쪽으로 번진다 — 선이 굵어지면 Size 를 선 굵기의 절반 이상으로 키우거나 Source 를 Center 로',
          'Drop Shadow 는 16강과 반대로 Spread 를 낮추고 Size 를 크게 써야 부드러운 빛이 된다',
          '효과는 넣은 순서가 아니라 Layer Style 목록 순서로 쌓인다 — 위에서부터 심지 → 색 → 가까운 빛 → 먼 빛, 실제 네온관 구조와 같다',
        ],
      },
      {
        title: '선 긋기와 색 바꾸기',
        items: [
          'Hard Round 15px, 직선은 Shift + 클릭, 곡선은 Smoothing 50% — 두께가 일정해야 유리관처럼 보인다',
          'Ctrl+J 복사본에서 Color Overlay · Outer Glow · Drop Shadow 색만 바꿔 빨강 · 파랑을 만든다. Inner Glow 까지 바꾸면 흰 심지가 사라져 납작해진다',
          '칠하기 전에 어느 색 레이어가 선택돼 있는지 확인한다 — 노랑 레이어에 밑창을 그리면 색을 따로 바꿀 수 없다',
          '브러시 굵기를 바꾸면 레이어 우클릭 Scale Effects 로 효과 크기도 같은 비율로 맞춘다',
        ],
      },
      {
        title: '색과 구도',
        items: [
          '배경은 검정에 가깝고 심지는 흰색이라 명도 대비가 극단적이다 — 그래서 선이 빛나 보인다',
          '차가운 푸른 밤 속 유일한 따뜻한 색인 노랑 로고가 가장 먼저 눈에 들어온다',
          '윤곽 전체가 아니라 로고 · 밑창 · 윤곽선 같은 포인트만 칠해서 시선이 로고 → 윤곽 → 밑창 순서로 흐른다',
          '삼원색은 레트로 팝, 시안 + 마젠타는 사이버펑크, 핑크 한 색은 감성 간판처럼 색 수만으로 장르가 바뀐다',
        ],
      },
    ],
    practice: [
      { image: neonSneaker, caption: '네온 신발', how: 'Moonlight LUT 로 밤 배경, 로고 노랑 · 밑창 빨강 · 윤곽 파랑 네온 레이어 세 개' },
    ],
    tags: ['포토샵', '레이어 스타일', '블렌딩 모드', '빛 효과'],
    keywords: 'photoshop neon glow color lookup lut 3dlut moonlight inner glow outer glow drop shadow color overlay linear dodge add contour half round source edge center smoothing shift click straight line ctrl+j duplicate scale effects 네온 흰 심지 빛 번짐 가산 혼합 블룸',
  },
  {
    slug: 'ps-3d-typo',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '16강',
    date: '2026.11.04',
    title: '입체 타이포 — Drop Shadow 여러 겹 · Inner Shadow · 회전 + 기울이기',
    summary: 'Drop Shadow 를 (+)로 여러 겹 쌓고 Distance 는 0 → 20 → 30 으로 늘리며 색은 점점 어둡게 하면 글자에 두께가 생긴다. Inner Shadow 로 안쪽 입체를 더하고 래스터화하지 않으면, 글자만 바꿔도 스타일이 따라오는 템플릿이 된다.',
    points: [
      'Distance 0 · Spread 100 인 그림자는 번지지 않고 글자에 딱 붙어 외곽선이 된다',
      'Rotation -15° + Horizontal Skew -15° — 기준선은 오른쪽 위로 올라가고 세로획은 똑바로 선다',
      '같은 파랑에서 명도만 단계적으로 낮춰 두께를 칠하고, 모든 그림자 Angle 을 125° 로 맞춰 광원을 하나로',
    ],
    learned: [
      {
        title: '두께 만들기',
        items: [
          'Drop Shadow 는 (+)로 같은 설정을 복제해 쌓는다 — Distance 0 · 20 · 30, 색은 외곽선 하늘 → 진파랑 → 남색',
          'Layer Style 목록에서 위에 있는 그림자가 앞에 그려진다 — 외곽선용(Distance 0)이 맨 위, 가장 먼 그림자가 맨 아래',
          'Spread 는 거리가 아니라 Size 중 몇 % 를 딱딱하게 할지다 — Spread 100 이면 만화처럼 경계가 또렷하고, Size 가 0 이면 Spread 를 올려도 커지지 않는다',
          '(+)로 여러 겹 넣을 수 있는 건 Stroke · Inner Shadow · Color Overlay · Gradient Overlay · Drop Shadow 다섯 개뿐이다',
        ],
      },
      {
        title: '안쪽 입체와 기울기',
        items: [
          'Inner Shadow 를 Angle 125° · Distance 10px · Size 5px 로 넣으면 흰 면 왼쪽 위에 그늘이 생겨 도톰해 보인다',
          '안쪽 그늘 색은 검정 대신 배경 계열 하늘색(Opacity 50%) — 무겁지 않게 입체만 더한다',
          'Ctrl+T 로 Rotation -15° 뒤 Horizontal Skew -15° — 회전만 하면 세로획까지 쓰러져 불안해 보이고, 기울이기만 하면 이탤릭일 뿐 상승감이 약하다',
        ],
      },
      {
        title: '다시 쓰기',
        items: [
          '래스터화하지 않고 텍스트 레이어에 스타일만 얹으면 글자를 바꿔도 효과가 새 모양을 따라 다시 계산된다',
          'Copy · Paste Layer Style 로 Hard Round 브러시로 그린 모양에도 같은 입체를 붙인다 — Soft Round 는 가장자리가 흐려 외곽선이 뭉개진다',
          'New Style 로 Styles 패널에 저장하면 다른 문서에서도 클릭 한 번으로 쓴다. Use Global Light 를 켜 두면 Angle 하나로 모든 그림자 방향이 같이 바뀐다',
        ],
      },
      {
        title: '색과 구도',
        items: [
          '글자색은 순백 대신 배경색을 한 방울 섞은 #EFF7FE 근처 — 배경과 한 팔레트로 묶여 차분하다',
          '아주 밝은 글자 면과 아주 어두운 두께가 맞닿아 있어서 밝은 배경에서도 또렷하게 읽힌다',
          '기준선이 오른쪽 위로 올라가는 상승 대각선이라 가장 높이 뜬 "?" 에서 시선이 끝나 반문하는 느낌이 산다',
          '같은 구조라도 어두운 배경 + 노랑은 쇼핑 · 할인, 청록 플랫은 정보 · 이벤트, 남색 + 핑크 빛은 밤 · 감성으로 장르가 바뀐다',
        ],
      },
    ],
    practice: [
      { image: title3dJinjjaro, caption: '진짜로?', how: 'Rotation · Skew -15°, Drop Shadow 3겹(Distance 0 · 20 · 30)으로 외곽선과 두께, Inner Shadow 로 안쪽 입체' },
      { image: title3dKkuljaem, caption: '꿀잼', how: '같은 스타일에 글자와 색만 민트 계열로 바꾼 버전' },
      { image: title3dBrushShape, caption: '브러시 모양 응용', how: 'Hard Round 로 그린 별 · 원 · 물결에 Paste Layer Style' },
    ],
    // AI 버전 — 같은 기법에 값만 바꾼 것(사용자 요청으로 참고 예시에 싣는다)
    examples: [
      { image: title3dAiSheet, caption: 'AI 버전 · 핫딜 · 오늘만 · 새벽감성 · 말랑', how: '이중 외곽선 스티커, 30겹 롱 섀도우, Spread 0 으로 번지는 네온 빛, Angle 90° 로 아래로 두꺼운 젤리' },
    ],
    tags: ['포토샵', '타이포그래피', '레이어 스타일', '입체'],
    keywords: 'photoshop 3d typography extrude drop shadow multiple inner shadow layer style distance spread size angle 125 global light rotation skew free transform ctrl+t copy paste layer style hard round brush styles panel non-destructive 입체 타이포 두께 외곽선 가변형 롱 섀도우',
  },
  {
    slug: 'ps-speed-typo-flash',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '15강',
    date: '2026.11.03',
    title: '번쩍 속도감 타이포 — 기울기 · 그레이디언트 마스크 · 빛망울 · Linear Dodge',
    summary: '속도감은 기울기(Skew -15°)와 끝이 흐려지는 겹침(그레이디언트 마스크)으로, 빛은 완전한 검정 위에 만든 빛망울 + Linear Dodge (Add)로 만든다. 빛 효과는 어두운 배경 위에서만 산다.',
    points: [
      '글자를 -15° 기울이고 끝을 그레이디언트 마스크로 흐리면 지나간 자리에 잔상이 남은 듯 달려 나간다',
      '빛망울은 완전한 검정 위에서 만든다 — Linear Dodge 는 밝기를 더하는 모드라 검정만 변화가 없어 사라져 보인다',
      '흰색 · 검정에는 색조가 없어 Hue 를 돌려도 안 바뀐다 — Colorize 로 새 색을 입힌다',
    ],
    learned: [
      {
        title: '속도감',
        items: [
          '-10° 안팎은 세련된 이탤릭, -15° ~ -20° 는 스포츠 · 게임처럼 강한 속도감 — 너무 기울이면 획이 얇아져 읽기 어렵다',
          '흐려진 "번" 위에 "쩍"을 겹치면 평면인데도 앞뒤 깊이가 생긴다',
          '기울어진 글자의 대각선은 움직임, 가로 빛줄기의 수평선은 속도 방향 — 두 선이 만나는 곳에 빛망울을 둬 시선을 모은다',
        ],
      },
      {
        title: '빛망울 만들기',
        items: [
          '흰 점 하나를 납작하게 눌러 빛줄기를 만들고, 30° 회전 후 Ctrl+Alt+Shift+T 로 복사하며 반복해 12갈래 별을 만든다',
          'Transform Again 은 바로 직전의 변형 하나만 기억한다 — 회전을 마지막에 해야 회전이 반복된다',
          'Ctrl+Alt+Shift+E 로 보이는 레이어만 합친 새 레이어를 만들어 원본은 남겨 둔다',
          '바탕이 회색이면 그 회색만큼 화면 전체가 뿌옇게 밝아진다 — 그래서 완전한 검정',
        ],
      },
      {
        title: '블렌딩 모드',
        items: [
          'Screen 은 부드럽게, Linear Dodge (Add) 는 하얗게 타듯 강하게 밝아진다. 반대로 Multiply 는 흰색이 사라진다',
          '밝은 곳끼리 겹쳐 하얗게 날아가면 불투명도를 낮추거나 Screen 으로 바꾼다',
          '빛망울을 스마트 오브젝트로 바꾼 뒤 Colorize 를 걸면 스마트 필터로 남아 Alt+드래그로 다른 빛에 복사할 수 있다',
        ],
      },
      {
        title: '색과 구도',
        items: [
          '짙은 남보라 배경 + 형광 연두 글자 — 명도 대비가 최대에 가깝고 색상환에서 보색에 가까워 서로를 더 선명하게 만든다',
          '빛 효과는 어두운 면적이 넓을수록 강해 보여서 배경 비율을 80% 까지 키웠다',
          '같은 틀에 단어와 색만 바꿔도 장르가 달라진다 — 핑크 · 시안은 사이버, 골드는 프리미엄, 흰색 · 파랑은 스피드',
        ],
      },
    ],
    practice: [
      { image: titleSpeedFlash, caption: '번쩍', how: '-15° 기울인 글자 + 그레이디언트 마스크 잔상, 검정 위 빛망울을 Linear Dodge 로 얹고 Colorize 로 보라빛' },
    ],
    // AI 버전 — 같은 원리에 색 · 구성 · 단어만 바꾼 것(사용자 요청으로 참고 예시에 싣는다)
    examples: [
      { image: titleSpeedFlashNeon, caption: 'v1 · 네온 핑크 · 시안', how: '글자 복사본 Fill 0% · 시안 Stroke 를 몇 px 밀어 외곽선 잔상, 왼쪽에 속도선' },
      { image: titleSpeedFlashGold, caption: 'v2 · 골든 플래시', how: '노랑 → 오렌지 Gradient Overlay, 복사 → Flip Vertical → 불투명도 13% 로 바닥 반사' },
      { image: titleSpeedFlashElectric, caption: 'v3 · 일렉트릭 블루', how: 'Ctrl+J 3번 → 왼쪽으로 50px 씩 · 불투명도 60 · 35 · 18% 로 파란 잔상 3겹' },
      { image: titleSpeedFlashKwang, caption: 'v4 · 쾅! (충격)', how: '빨강 그림자 글자 위에 노랑 글자를 어긋나게, 집중선은 세로 줄무늬에 Polar Coordinates' },
      { image: titleSpeedFlashShuung, caption: 'v5 · 슈웅 (질주)', how: '민트 글자 복사본에 Motion Blur 잔상, 가로 빛줄기 여러 개' },
      { image: titleSpeedFlashBanjjak, caption: 'v6 · 반짝 (반짝임)', how: '파스텔 그라데이션 글자, 45° 회전 · Ctrl+Alt+Shift+T 두 번으로 4갈래 별을 크기 달리해 흩뿌리기' },
    ],
    tags: ['포토샵', '타이포그래피', '블렌딩 모드', '빛 효과'],
    keywords: 'photoshop speed typography skew italic gradient mask layer mask lens flare light flare soft round brush transform again ctrl+alt+shift+t stamp visible linear dodge add screen multiply smart object colorize hue saturation complementary color 번쩍 빛망울 속도감 잔상',
  },
  {
    slug: 'ps-long-shadow-joker',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '14강',
    date: '2026.11.02',
    title: '분위기 타이틀 2종 — 긴 그림자 · 레이어 마스크 질감 · 연기 합성',
    summary: '타이틀의 분위기는 글자 모양보다 주변에 무엇을 더하고(그림자 · 획 · 내부 그림자) 무엇을 깎아내느냐(마스크 질감)로 만든다. 긴 그림자는 같은 레이어를 1px씩 밀어 쌓는 반복이다.',
    points: [
      '긴 그림자는 그룹을 45° 돌려 놓고 Alt+↓ 로 100번 이상 쌓는다 — 색은 검정이 아니라 바탕색에서 뽑은 아주 어두운 색',
      '거친 질감은 지우는 게 아니라 레이어 마스크로 가린다 — 원본 글자가 살아 있어서 되돌릴 수 있다',
      '검은 배경 연기는 Screen, 흰 배경 소스는 Multiply 로 배경을 뺀다',
    ],
    learned: [
      {
        title: '긴 그림자',
        items: [
          '방향키는 상하좌우로만 밀어서, 돌려 놓고 아래로 쌓은 뒤 회전을 되돌려야 45° 대각선이 된다',
          '그림자 끝에 "전경색 → 투명" 그레이디언트 마스크를 주면 화면 끝에서 딱 잘린 느낌 없이 배경에 녹는다',
          'Stroke 3px + Inner Shadow 로 평평한 글자가 한 칸 눌린 듯한 입체감을 얻는다',
          '그림자는 한 방향 · 한 각도 · 한 색 — 각도를 섞으면 광원이 여러 개처럼 보인다',
        ],
      },
      {
        title: '마스크 질감 · 연기',
        items: [
          '마스크는 흰색 = 보임, 검정 = 가림, 회색 = 그 밝기만큼 반투명',
          '거친 털 브러시는 문지르지 말고 톡톡 찍는다 — 드래그하면 줄 자국이 남는다',
          '균열 질감 이미지를 마스크 안에 붙여 넣고 레벨로 회색을 흰색 쪽으로 밀면 균열 선만 뚫린다',
          '흰색 → 은은한 연두 그레이디언트 오버레이로 완전한 흰색보다 차갑고 불안한 분위기',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것',
        items: [
          'Alt+방향키를 눌렀는데 복제 대신 자간만 바뀌었다 → 문자 툴이 선택돼 있었다. 복제는 Move Tool(V) 상태에서만',
          '질감을 글자 전체에 고르게 깎으면 오히려 깔끔해 보인다 → 모서리 · 아래쪽에 몰아야 부서지는 중 같은 이야기가 생긴다',
        ],
      },
    ],
    practice: [
      { image: titleLongShadow, caption: '긴 그림자 타이포 "긴그림자"', how: '45° 회전 그룹을 1px씩 100번 이상 복제, 바탕 녹색에서 뽑은 그림자색 + Stroke · Inner Shadow' },
      { image: titleJoker, caption: '조커 분위기 타이틀', how: '균열 질감을 문자 레이어 마스크에 넣고 레벨로 다듬기, 흰색 → 연두 그레이디언트, 아래에 연기' },
    ],
    // 같은 원리로 색 · 방향 · 분위기만 바꾼 AI 버전 — 직접 만든 게 아니라서 실습 결과물과 따로 싣는다(사용자 요청)
    examples: [
      { image: titleLongShadowNavy, caption: '긴 그림자 v1 · 레트로 네이비', how: '남색 바탕 · 크림 글자 · 빨강 내부 그림자 + 노이즈 2~3% 로 빈티지 인쇄 느낌' },
      { image: titleLongShadowCoral, caption: '긴 그림자 v2 · 플랫 코랄', how: '그림자를 흐리지 않고 화면 끝까지, 불투명도 50~60% 의 플랫 스타일' },
      { image: titleLongShadowNeon, caption: '긴 그림자 v3 · 네온 외곽선', how: '글자 Fill 0% 로 Stroke 만 남기고, 그림자에 핑크 → 보라 그레이디언트' },
      { image: titleLongShadowMustard, caption: '긴 그림자 v4 · 머스터드 135°', how: '그룹을 반대로 돌려 그림자 방향을 왼쪽 아래로' },
      { image: titleJokerPurple, caption: '조커 v1 · 보라 · 초록', how: '연기 2장을 Screen 으로 겹치고 각각 Color Overlay, 글자에 Outer Glow' },
      { image: titleJokerRed, caption: '조커 v2 · 핏빛 연기', how: '빨간 연기 + 균열 틈 아래 레이어에 빨강 · Gaussian Blur 로 붉은 빛' },
      { image: titleJokerGlitch, caption: '조커 v3 · 글리치', how: '글자 3장을 R · G · B 채널만 켜서 좌우로 몇 px 씩 밀기 + 가로 슬라이스 어긋남' },
      { image: titleJokerInk, caption: '조커 v4 · 종이 · 잉크', how: '밝은 바탕으로 반전, 흰 배경 연기 소스를 Multiply 로' },
    ],
    tags: ['포토샵', '타이포그래피', '레이어 마스크', '합성'],
    keywords: 'photoshop long shadow typography title stroke inner shadow gradient overlay layer mask texture legacy brushes rough round bristle lasso levels threshold generate image smoke screen multiply 긴 그림자 조커 균열 연기 타이틀',
  },
  {
    slug: 'ps-flower-feed',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '13강',
    date: '2026.10.27',
    title: '꽃 구독 피드 3장 + 구도 연습 — 찢어진 종이 · 프레임 속 프레임 · 흐림 배경',
    summary: '피드 3장은 같은 사진 · 연어색 강조색 하나 · 종이 질감을 반복해 한 세트로 묶고, 사진을 흐리게 하면 뒤로 물러나 글이 앞으로 나온다. 사진 위 글자는 색보다 명도 대비가 가독성을 정한다.',
    points: [
      '따로 올려도 한 세트로 보이게 하는 공통 규칙 3개 — 강조색 하나 · 같은 사진 반복 · 같은 질감',
      '같은 사진을 흐리게 깔면 통일감과 위계를 한 번에 — 사진은 뒤로 물러나고 30% 가 먼저 보인다',
      '분할 구도는 가독성을 지키는 구도이기도 하다 — 글 뒤 배경이 일정해져 어디서나 똑같이 읽힌다',
    ],
    learned: [
      {
        title: '세트로 묶기 (원본 3장)',
        items: [
          '1장 표지는 위 사진 · 아래 종이로 나눈 분할, 2장은 찢어진 종이 틈으로 사진을 보여 주는 프레임 속 프레임',
          '글자 위계는 크기만이 아니라 색(연어색 → 회색)과 굵기로도 만든다',
          '레이어 마스크에 흑백 그라디언트로 사진 위쪽을 흰 배경에 페이드, 곡선 문구는 원 패스 위에 글자를 얹는다',
        ],
      },
      {
        title: '기법',
        items: [
          '클리핑 마스크(Ctrl+Alt+G) — 종이 사이 영역 모양 안에서만 사진이 보이게',
          '가우시안 블러로 사진을 흐려 배경으로 물리고, 둥근 사각형 카드 하나에 쿠폰 정보를 모은다',
          'Canvas Size(Ctrl+Alt+C)는 요소는 그대로 두고 캔버스만, New Guide Layout 은 열 · 여백 안내선을 한 번에',
        ],
      },
      {
        title: '막힌 것 · 바로잡은 것 (구도 연습)',
        items: [
          '좌우 분할(사진 6 : 글 4) 미션이었는데 사진이 캔버스를 다 덮어 결과적으로 오버레이 구도가 됐다',
          '흰 부제가 잘 안 읽힌 이유 — 배경도 밝은 분홍이라 명도 차이가 거의 없었다',
          '글자색 · 곡선 문구까지 같이 바뀌어 구도 때문에 달라진 점을 따로 볼 수 없었다 → 연습은 한 번에 변수 하나만',
        ],
      },
    ],
    practice: [
      { image: flowerFeed, caption: '꽃 구독 피드 3장 "MONTHLY BLOOM"', how: '표지 위아래 분할 · 찢어진 종이 프레임 · 흐린 배경 위 쿠폰 카드' },
      { image: flowerOverlay, caption: '구도 연습 — 오버레이', how: '좌우 분할을 노렸지만 사진 전체 위에 글을 얹은 오버레이가 됨' },
    ],
    // 같은 재료로 변수 하나만 바꾼 미션 예시 — 직접 만든 게 아니라서 실습 결과물과 따로 싣는다(사용자 요청)
    examples: [
      { image: missionSplit, caption: '미션 1 · 좌우 분할 (사진 6 : 글 4)', how: '찢어진 종이를 세로로 세워 사진 칸과 글 칸의 경계로' },
      { image: missionStory, caption: '미션 2 · 4:5 → 9:16 스토리', how: '늘어난 570px 대부분을 사진에, 맨 위 250px 은 안전 영역으로 비움' },
      { image: missionLeft, caption: '미션 3 · 가운데 → 왼쪽 정렬', how: '모든 요소를 x 120px 한 선에, 흰 글자 뒤 옅은 그라디언트로 명도 대비' },
      { image: missionSerif, caption: '미션 4 · 장체 고딕 → 세리프', how: '제목을 세리프로, 부제 자간을 넓혀 우아한 인상으로' },
      { image: missionGreen, caption: '미션 5 · 강조색 연어색 → 딥그린', how: '사진 속 잎에서 뽑은 #4E6A55 하나를 세 장 모두에' },
      { image: missionRoast, caption: '미션 6 · 원두 구독 MONTHLY ROAST', how: '공통 규칙 3개를 새 브랜드로 — 캐러멜 강조색 · 크림 종이 · 커피 사진' },
      { image: missionBakery, caption: '미션 7 · 베이커리 1주년', how: '관심 → 정보 → 행동 순서, 7–9AM 을 가장 큰 숫자로' },
    ],
    tags: ['포토샵', '피드', '구도', '통일감'],
    keywords: 'photoshop instagram feed series torn paper clipping mask gaussian blur layer mask gradient type on path canvas size guide layout 오버레이 분할 프레임 속 프레임 명도 대비 위계 통일감 꽃 구독',
  },

  // ── 디자인의 힘 (책 『AI 시대에 살아남는 DESIGN의 힘』) — F-012 노트 틀 ──
  {
    slug: 'design-power-basics',
    area: 'Design',
    course: '디자인의 힘',
    lesson: '1장',
    date: '2026.11.04',
    title: '디자인을 보는 눈과 재료 — 나쁜 디자인 5패턴 · 점선면 · 위계 · 타이포',
    summary:
      '나쁜 디자인을 위계 · 여백 · 색 · 폰트 · 컨셉 같은 이유의 언어로 짚고, 점 · 선 · 면, 시선의 경로, 자간 · 행간 · 커닝으로 고칠 수 있다.',
    points: [
      '좋다 · 나쁘다는 감상이고 왜 그런지 말하는 게 실력이다. 시작 전에 가장 먼저 봐야 할 것 하나를 정한다',
      '점은 시선을 멈추고, 선은 움직이고, 면은 나눈다. 여백도 면이다',
      '자간은 글자 전체에 한 번에 주고, 커닝은 두 글자 사이 하나를 눈으로 맞춘다',
    ],
    learned: [],
    sections: [
      {
        title: '나쁜 디자인의 5가지 패턴',
        body: '컨셉 없는 배치(요소끼리 관계가 없음), 폰트 남용(서체가 여러 목소리로 동시에 말함), 색의 충돌(채도가 비슷한 색 두 개가 나란히), 위계의 붕괴(전부 비슷한 크기라 아무것도 중요해 보이지 않음), 여백 공포증(빈 곳을 못 참고 채움). 처방은 각각 모든 요소에 있어야 할 이유 붙이기, 서체는 한 화면에 2종(패밀리)까지, 주인공 색은 하나, 크기 · 굵기 · 색으로 보는 순서 설계, 여백을 숨 쉬는 공간으로 남기기다.',
        why: '문제에 이름을 붙일 수 있어야 고칠 수 있고, AI 에게도 "예쁘게" 대신 "제목을 본문의 2배로, 배경 채도를 낮춰" 처럼 정확히 지시할 수 있다.',
      },
      {
        title: '점 · 선 · 면, 그리고 형태의 감정',
        body: '모든 시각물은 점 · 선 · 면으로 이뤄진다. 점(강조 숫자 · 아이콘)은 시선을 멈추게 하고, 선(구분선 · 정렬선)은 시선을 움직이고, 면(배경 · 블록 · 여백)은 공간을 나눈다. 선은 수평이면 안정, 수직이면 긴장 · 힘, 사선이면 역동을 주고, 도형은 원이 따뜻함 · 안전, 사각형이 신뢰 · 질서, 삼각형이 역동 · 긴장을 떠올리게 한다.',
        why: '형태가 메시지와 같은 말을 해야 한다 — 어린이 교육 브랜드에 각진 서체와 삼각형을 쓰면 세련돼도 차갑고 멀게 느껴진다.',
      },
      {
        title: '위계와 시선의 경로',
        body: '위계는 "이것부터 봐라" 라는 보는 순서를 설계하는 것이다. 눈은 본능적으로 큰 것 → 작은 것, 밝은 것 → 어두운 것, 색 있는 것 → 색 없는 것 순서로 움직이고 사람 얼굴을 가장 먼저 본다. 가장 먼저 볼 것 하나를 정해 가장 크고 강하게 두고, 나머지는 단계적으로 낮춘다. 글이 적은 화면은 Z 패턴, 글이 많은 화면은 F 패턴으로 읽힌다.',
        why: 'AI 는 입력된 정보를 모두 똑같이 중요하게 보고 고르게 배치한다. 무엇이 더 중요한지는 내용을 아는 사람만 정할 수 있다.',
      },
      {
        title: '서체 · 자간 · 행간 · 정렬',
        body: '세리프(명조)는 전통 · 신뢰, 산세리프(고딕)는 현대 · 중립, 손글씨는 감성을 준다. 자간은 글자 사이, 행간은 줄 사이 간격이다. 본문 행간은 영문 1.2~1.5배, 글자가 네모꼴로 꽉 찬 한글은 1.5~1.8배를 쓰고, 제목은 더 좁게 묶는다. 긴 본문은 왼쪽 정렬, 가운데 정렬은 초대장 · 짧은 제목에만 쓴다.',
        why: '"왠지 이쪽이 더 좋다" 는 느낌의 정체는 눈에 잘 안 보이는 간격과 정렬에 있는 경우가 많다.',
      },
      {
        title: '커닝 — 두 글자 사이 하나',
        body: '자간이 선택한 글자 전체에 한 번에 주는 간격이라면, 커닝은 글자 쌍마다 따로 맞추는 간격이다. To · Av · Ye 처럼 서로 반대로 기운 쌍은 같은 간격이어도 벌어져 보여 좁히고, I · l 처럼 세로획끼리는 붙어 보여 넓힌다. 기준은 수치가 아니라 눈이다.',
        why: '로고 · 큰 제목처럼 크게 보이는 글자에서만 차이가 눈에 띄어서, 본문까지 손으로 맞출 필요는 없다.',
      },
    ],
    pitfalls: [
      '폰트 2종은 서체 패밀리 기준이다 — Pretendard Bold 와 Regular 는 1종이고, 위계는 한 패밀리의 굵기 · 크기로 만든다',
      '"골고루 깔끔하게" 는 칭찬이 아니다 — 전부 강조하면 아무것도 강조되지 않는다',
      '영문 기준 행간(1.2~1.5배)을 한글 본문에 그대로 쓰면 빽빽해 보인다',
      '피그마에는 글자 쌍 커닝 메뉴가 따로 없어서, 글자 하나만 선택해 자간을 바꾸는 방식으로 대신한다',
    ],
    practice: [
      { image: realestateOnboarding, caption: '디자인 연습 · 부동산 앱 온보딩', how: '피그마 모바일 화면 — 사진 위에 제목 → 설명 → 버튼 순서' },
      { image: realestateHome, caption: '디자인 연습 · 부동산 앱 홈', how: '피그마 모바일 화면 — 카테고리 탭 · 인기 매물 카드 · 내 주변 건물 목록' },
    ],
    tags: ['디자인 원칙', '위계', '타이포', '커닝'],
    keywords:
      'design hierarchy typography kerning tracking leading alignment serif sans-serif point line plane shape form eye tracking z pattern f pattern 나쁜 디자인 컨셉 폰트 남용 색의 충돌 위계 여백 점선면 시선 자간 행간 정렬 커닝 이유의 언어',
  },
  {
    slug: 'design-basics-communication',
    area: 'Design',
    course: '포토샵 / 일러스트',
    lesson: '4강',
    date: '2026.10.13',
    title: '디자인 기초 — 소통 · 타이포 · 색',
    summary: '디자인의 본질은 예쁨이 아니라 소비자와의 소통이다. 타깃과 브랜딩 키워드로 방향을 잡고, 타이포와 색으로 풀어내고, 여백을 가장 중요하게 둔다.',
    points: [
      '예술은 감상하는 것, 디자인은 소비되는 것 — 타깃 없는 디자인은 본인 만족용',
      '타이포 3요소: 굵기는 무게감, 크기는 시선 분배, 간격은 가독성',
      '색은 덜어낼수록 시선을 끈다 — 전체는 무채색, 포인트는 1~2가지',
    ],
    learned: [
      {
        title: '브랜딩과 타이포',
        items: [
          '브랜딩은 아이덴티티를 담아 가치 있게 만드는 것, 브랜드 디자인은 그걸 시각으로 푸는 것',
          '포토샵 자간 0~25 = 글자 크기의 0~2.5% (1/1000 em 단위) — 피그마에도 같은 % 로',
          '박스를 글자로 가득 채우지 말고 여러 줄로 나누고 여백을 남긴다',
        ],
      },
      {
        title: '색',
        items: [
          '색의 3속성: 색상 · 명도 · 채도. 흰색-검정 명도 차이만으로도 심플하고 세련된 인상',
          '색 사용 4원칙: 흰·검 활용, 대비 활용, 한 프레임에 두 색, 최소화',
          '눈이 편한 빨강은 원색(#FF0000)보다 채도 · 명도를 한 단계 낮춘 색',
        ],
      },
    ],
    tags: ['디자인 기초', '타이포', '컬러', '브랜딩'],
    keywords: 'design basics typography color branding 색의 3속성 여백 자간 소통',
  },
  {
    slug: 'design-motion-basics',
    area: 'Design',
    course: '디자인 지식',
    lesson: '모션그래픽',
    date: '2026.10.13',
    title: '모션그래픽 기초 — 드로잉 · 편집 디자인 · 애니메이션 원칙',
    summary: '툴은 도구일 뿐이고 핵심은 디자인 · 드로잉 · 움직임의 기본 개념이다. 편집은 폰트 · 컬러 · 레이아웃, 움직임은 리듬 · 아크 · 과장 같은 원칙으로 밀도를 쌓는다.',
    points: [
      '드로잉은 형태 → 빛과 그림자 → 재질, 아트웍은 조형 · 부피감 · 공간감',
      '그래픽 디자인 3요소: 폰트(대비 · 가독성) · 컬러(감정 · 6:3:1) · 레이아웃(그리드 · 여백)',
      '애니메이션은 리듬(가속 · 감속) · 아크 · 스쿼시&스트레치 · 세컨더리 액션 · 과장',
    ],
    learned: [
      {
        title: '편집 디자인',
        items: [
          '타이포 팁: 대비 · 크롭 · 레이어드 · 자간과 행간 · 더미 텍스트',
          '레이아웃은 시선 유도 · 그리드 · 균형 · 여백, 게슈탈트(근접 · 유사 · 정렬 · 전경과 배경)',
          '작업물을 흑백으로 바꿔 보면 명도 대비가 충분한지 바로 보인다',
        ],
      },
      {
        title: '움직임',
        items: [
          '모든 요소가 동시에 움직이지 않게 시작 타이밍에 차이를 준다 (불규칙성)',
          '슬로우 인 · 아웃 = 툴의 이징 — 피그마도 이징 하나만 바꿔도 체감이 달라진다',
          '"모션그래픽의 50%는 사운드" — BGM 먼저 깔고 모션, 효과음은 마지막에',
        ],
      },
    ],
    tags: ['모션', '편집 디자인', '애니메이션', '드로잉'],
    keywords: 'motion graphics animation principles easing layout gestalt 12원칙 애프터이펙트',
  },
  {
    slug: 'design-figma-hierarchy',
    area: 'Design',
    course: '디자인 지식',
    lesson: '피그마',
    date: '2026.08.17',
    title: '피그마로 로그인 화면 만들기 — 폰트 계층과 컴포넌트',
    summary: '로그인 화면을 만들며 폰트 계층과 컴포넌트화의 중요성을 정리했다. 크기만 키우지 말고 굵기 · 색을 함께 조절해야 위계가 세련돼진다.',
    points: [
      '한 화면의 폰트 크기 단계는 3~4개를 넘기지 않는다',
      '크기 외에 굵기(Bold · Regular)와 명도(Black · Gray)를 함께 조절한다',
      '위 단계로 갈 때 최소 1.2배 이상 차이를 줘야 계층이 눈에 들어온다',
    ],
    learned: [
      {
        title: '폰트 계층',
        items: [
          'Display 32~40 / H2 24~28 / H3 18~20 / Body 16 / Caption 12~14 (8pt 기준)',
          'Major Second 1.125 · Minor Third 1.2 · Major Third 1.25 같은 비율 스케일',
          '4배수 · 8배수 규칙을 쓰는 디자이너가 많다',
        ],
      },
      {
        title: '피그마 작업',
        items: ['오토 레이아웃 해제: Ctrl + Shift + G', '딤 처리는 #000000 80% / 50% — 팀마다 기준이 다르다'],
      },
    ],
    tags: ['피그마', '폰트 계층', '컴포넌트', 'UI'],
    keywords: 'figma typography hierarchy type scale component auto layout 로그인 화면',
  },
  {
    slug: 'design-ecommerce-terms',
    area: 'Design',
    course: '디자인 지식',
    lesson: '용어',
    date: '2026.10.04',
    title: '이커머스 레이아웃 용어',
    summary: '쇼핑몰 화면을 기획 · 디자인할 때 쓰는 영역 이름을 내비게이션 · 배너 · 상품 · 프로모션으로 나눠 정리했다.',
    points: [
      'GNB 는 모든 페이지 공통 상단 메뉴, LNB 는 카테고리 안쪽 좌측 세부 메뉴',
      '메인 비주얼(KV) · 롤링 배너 · 인디케이터 — 첫 화면의 주인공 영역',
      'PLP 는 상품 목록, PDP 는 상품 상세 페이지',
    ],
    learned: [
      {
        title: '영역 이름',
        items: [
          '유틸 메뉴(로그인 · 장바구니) · 드로어 / 햄버거 · 띠배너(공지 · 쿠폰)',
          '상품 카드 = 썸네일 + 상품명 + 가격 + 할인율 + 뱃지',
          '기획전은 한국 이커머스 고유 개념 — 테마로 상품을 묶은 별도 페이지',
        ],
      },
      {
        title: '오버레이 · 고정 영역',
        items: ['레이어 팝업 · 모달 · 바텀시트', '플로팅 버튼 · 스티키 헤더 · 스티키 CTA'],
      },
    ],
    tags: ['이커머스', 'UI 용어', '레이아웃', '기획'],
    keywords: 'ecommerce gnb lnb kv carousel plp pdp 기획전 바텀시트 스티키 쇼핑몰',
  },
]
