# 컴포넌트

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] FLASEEK만 정리했어요. 피그마 링크는 아직 비어 있어요.
무엇을: FLASEEK 화면을 이루는 블록 목록과, 각 블록이 어떤 상태(기본·선택·호버 등)를 갖는지 적었어요.
왜: 같은 블록을 다시 쓰는지, 상태를 빠뜨리지 않았는지 리뷰(R7)할 때 기준으로 써요.

## 개발자 상세

### FLASEEK 공통 (`projects/flaseek/ui.tsx`)
| 컴포넌트 | 하는 일 | 상태 | 피그마 |
|---|---|---|---|
| `SpriteImage` | 캡처 한 장을 `crop` 좌표로 잘라서 보여 줌 | – | ❓ |
| `Container` | 1200px 가운데 정렬 컨테이너 | – | ❓ |
| `Tag` | 상품 카드 태그 (최대 2개) | – | ❓ |
| `BUTTON_PRIMARY` / `BUTTON_SECONDARY` | 버튼 클래스 묶음 | 기본·호버·포커스 | ❓ |
| `PillTab` | 알약형 탭 | 선택/기본 | ❓ |
| `FilterChip` | 필터 칩 | 선택/기본 | ❓ |
| `WishButton` | 찜 하트(20·24px) | 찜/안 찜 | ❓ |
| `ProductCard` / `ProductGrid` | 상품 카드와 반응형 그리드. 누르면 상세로 이동 | – | ❓ |
| `ToastHost` | 토스트 표시 (3초) | 보임/숨김 | ❓ |

### FLASEEK 레이아웃 (`layout.tsx`)
- `Shell`: NoticeBar → Header(로고·GNB·검색·장바구니·로그인) → 본문 → Footer. 상세 화면에서는 `mobileBottomBar`도 붙여요.
- `BeforeAfterSlider.tsx`: 메인 히어로. 드래그로 비교하는 슬라이더예요.

### 화면 전용
- ListPage: `ChipGroup`, `FilterBox`(PC), `FilterSheet`(MO 바텀시트), `SortSelect`
- DetailPage: `Gallery`, `TypeSelects`(세트 타입 고르기), `Accordion`(접히는 본문)
- MainPage: `SectionTitle`

### 포트폴리오 · Accio · 마에스트로
- (빈 템플릿)

최종 수정: 2026-10-25 · 관련: F-001
