# 디자인 연결

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 원본 위치와 FLASEEK 컴포넌트 매칭만 정리했어요. 피그마 링크는 아직 비어 있어요.
무엇을: 디자인 원본은 **피그마와 레포 루트의 디자인 md 두 개**예요. 이 문서는 그 원본이 어디 있는지와, 피그마 블록이 어느 코드 파일에 있는지만 알려 줘요. 색 값·무드 같은 디자인 내용은 원본에서 봐요.
왜: 디자인 내용을 여기 복사하면 원본과 어긋나요. 리뷰(R7)는 여기서 원본을 찾아가 직접 비교해요.

## 개발자 상세

### 피그마
| 프로젝트 | 파일·페이지 링크 |
|---|---|
| FLASEEK 리뉴얼 시안 | ❓ |
| Accio 리디자인 | ❓ |
| 개인 디자인 시스템 (jsh-ds) | ❓ |
| 마에스트로 | ❓ |
| techlearn 강의 플랫폼 | 피그마 「techlearn 디자인」 파일 · 「디자인 · 네이비」 페이지 (주소는 공개 문서에 적지 않아요) — 색은 `index.css`의 `tl-*` 토큰 |
| Nightly 수면 코칭 | 피그마 「AI 수면」 파일 · 「Design · Liquid Glass」 페이지의 'PC · Liquid Glass · 수정안' 01 · 04 · 05 (2026-10-31부터, 주소는 공개 문서에 적지 않아요). 모바일은 수정안이 없어 기존 모바일 배치에 수정안 색 · 유리 스타일을 맞췄어요 — 색은 `index.css`의 `nt-*` 토큰(피그마 변수 값 그대로) |
| 포트폴리오 홈 리뉴얼 | 피그마 「jsh」 파일 · 「01 Home — Light 리뉴얼」 프레임 (주소는 공개 문서에 적지 않아요) |

### 디자인 md · 토큰 원본
| 무엇 | 위치 |
|---|---|
| 공통 디자인 시스템 기준 | [MyDesign.md](../../MyDesign.md) |
| 이커머스 기준 (FLASEEK 상품 카드 등) | [MyDesign(E-commerce).md](<../../MyDesign(E-commerce).md>) |
| 토큰 코드 (Tailwind 4 `@theme`, 포트폴리오 Ivory `[data-theme="ivory"]`) | [index.css](../../Portfolio/frontend/src/index.css) |
| 시안 캡처 이미지 (프로젝트별 폴더) | [portfolio/assets/design/](../../Portfolio/frontend/src/portfolio/assets/design/) |
| FLASEEK 디자인 근거(진단·3안 비교·대비) | [data.ts](../../Portfolio/frontend/src/portfolio/data.ts)의 `flaseek-renewal` 사례 |
| 피그마 내보내기 파일 | [design_import/](../../design_import/), [figmaCSS.txt](../../figmaCSS.txt) — ❓ 어느 프로젝트 원본인지 확인 필요 |

- 💡 `index.css`는 기본 유틸리티(`--font-weight-*`, `--text-*`, `--radius-*`)를 `initial`로 지워서, 토큰에 없는 값을 쓰면 클래스가 아예 안 먹어요. 토큰 밖 값을 막는 장치예요.
- 프로젝트 전용 토큰은 접두어로 나눠요: `flaseek*`, `accio*`, `maestro*`, `portfolio`·`study`·`accent`.

### 컴포넌트 매칭 — FLASEEK
| 피그마 컴포넌트 | 코드 파일 | 구현한 상태 |
|---|---|---|
| ❓ | [ui.tsx](../../Portfolio/frontend/src/projects/flaseek/ui.tsx) `SpriteImage` | – |
| ❓ | ui.tsx `Container` | – |
| ❓ | ui.tsx `Tag` | – |
| ❓ | ui.tsx `BUTTON_PRIMARY` / `BUTTON_SECONDARY` | 기본·호버·포커스 (F-001 R7: 코드에 호버·포커스 클래스 없음) |
| ❓ | ui.tsx `PillTab` | 기본·선택 |
| ❓ | ui.tsx `FilterChip` | 기본·선택 |
| ❓ | ui.tsx `WishButton` | 찜·안 찜 |
| ❓ | ui.tsx `ProductCard` / `ProductGrid` | – |
| ❓ | ui.tsx `ToastHost` | 보임·숨김 |
| ❓ | [layout.tsx](../../Portfolio/frontend/src/projects/flaseek/layout.tsx) `Shell` (NoticeBar·Header·Footer·`mobileBottomBar`) | – |
| ❓ | [BeforeAfterSlider.tsx](../../Portfolio/frontend/src/projects/flaseek/BeforeAfterSlider.tsx) | 드래그 |
| ❓ | [ListPage.tsx](../../Portfolio/frontend/src/projects/flaseek/pages/ListPage.tsx) `ChipGroup`·`FilterBox`(PC)·`FilterSheet`(MO)·`SortSelect` | – |
| ❓ | [DetailPage.tsx](../../Portfolio/frontend/src/projects/flaseek/pages/DetailPage.tsx) `Gallery`·`TypeSelects`·`Accordion` | 접힘·펼침 |
| ❓ | [MainPage.tsx](../../Portfolio/frontend/src/projects/flaseek/pages/MainPage.tsx) `SectionTitle` | – |

### 컴포넌트 매칭 — 포트폴리오 · Accio · 마에스트로
- (빈 템플릿) 해당 기능을 리뷰할 때 채워요.

최종 수정: 2026-10-29 · 관련: F-001, F-006
