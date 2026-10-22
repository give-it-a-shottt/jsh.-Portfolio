import bannerSale from '../assets/study/banner-sale.webp'
import cardNews from '../assets/study/card-news.webp'
import invitation from '../assets/study/invitation.webp'
import productBanner from '../assets/study/product-banner.webp'
import splitNewyork from '../assets/study/split-newyork.webp'
import composeBlending from '../assets/study/compose-blending.webp'
import composeClipping from '../assets/study/compose-clipping.webp'
import composePolaroid from '../assets/study/compose-polaroid.webp'
import toneMorning from '../assets/study/tone-morning.webp'
import toneOriginal from '../assets/study/tone-original.webp'
import toneSunset from '../assets/study/tone-sunset.webp'
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
