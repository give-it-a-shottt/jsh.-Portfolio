# 디자인 연결

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] 원본 위치와 FLASEEK 컴포넌트 매칭을 정리했어요. 프로젝트별 피그마 공개 링크는 [F-013](../features/F-013-landing-main/feature.md)의 표와 코드 `projects.ts`의 `figma`에 있어요(사용자 확인, 2026-11-08, Q-004).
무엇을: 디자인 원본은 **피그마와 레포 루트의 디자인 md 두 개**예요. 이 문서는 그 원본이 어디 있는지와, 피그마 블록이 어느 코드 파일에 있는지만 알려 줘요. 색 값·무드 같은 디자인 내용은 원본에서 봐요.
왜: 디자인 내용을 여기 복사하면 원본과 어긋나요. 리뷰(R7)는 여기서 원본을 찾아가 직접 비교해요.

## 개발자 상세

### 피그마
| 프로젝트 | 파일·페이지 링크 |
|---|---|
| FLASEEK 리뉴얼 시안 | ❓ |
| Accio 리디자인 | ❓ |
| 개인 디자인 시스템 (jsh-ds) | ❓ |
| 마에스트로 (F-010 리뉴얼) | 피그마 「마에스트로」 파일 · 「Screens — 리뉴얼」(화면) · 「Design System — 리뉴얼」(시스템) · Page 1 「리뉴얼 기획」(IA · 플로우) (주소는 공개 문서에 적지 않아요) — 색은 `index.css`의 `mr-*` 토큰 |
| techlearn 강의 플랫폼 | 피그마 「techlearn 디자인」 파일 · 「디자인 · 네이비」 페이지 (주소는 공개 문서에 적지 않아요) — 색은 `index.css`의 `tl-*` 토큰 |
| Nightly 수면 코칭 | 피그마 「AI 수면」 파일 · 「Design · Liquid Glass」 페이지의 'PC · Liquid Glass · 수정안' 01 · 04 · 05 (2026-10-31부터, 주소는 공개 문서에 적지 않아요). 모바일은 수정안이 없어 기존 모바일 배치에 수정안 색 · 유리 스타일을 맞췄어요 — 색은 `index.css`의 `nt-*` 토큰(피그마 변수 값 그대로) |
| 포트폴리오 홈 리뉴얼 | 피그마 「jsh」 파일 · 「01 Home — Light 리뉴얼」 프레임 (주소는 공개 문서에 적지 않아요) |
| Study 노션형 (F-004) | 피그마 「jsh」 파일 · Page 2 「05 Study 홈 — PC 1440」 · 「06 Study 상세 — 노션 문서형 PC 1440」 · 「Study Components」(`Study/TreeRow` → `StudyLayout.tsx`, `Study/ConceptChip` · `Study/ConceptCard` → `StudyHome.tsx`) — 색은 `jsh` 변수 Ivory 모드 = `index.css` Ivory · `study` 토큰 |

### 포트폴리오 포커스 표시 (2026-11-03, F-004 5차)
- 키보드 포커스는 `portfolio` 파랑 솔리드 링 2px + 간격 2px다. 디자인 md의 Focus/Ring(#5B8CFF 40% 헤일로 3px)과 다른데, md 6-5의 접근성 예외(간격 2 + 링 2)를 따랐다. 헤일로만으로는 흰 배경 대비가 3:1이 안 된다. 위치는 `index.css` `@layer base`의 `[data-theme="ivory"] :is(a, button, summary):focus-visible`, 가로 스크롤 탭만 안쪽에 그린다.

### 디자인 md · 토큰 원본
| 무엇 | 위치 |
|---|---|
| 공통 디자인 시스템 기준 | [My_DesignSystem_v1.md](../../My_DesignSystem_v1.md) (예전 이름 MyDesign.md, 2026-11-03 링크 수정 — 사용자 확인) |
| 이커머스 기준 (FLASEEK 상품 카드 등) | [MyDesign(E-commerce).md](<../../MyDesign(E-commerce).md>) |
| 마에스트로 리뉴얼 (브리프 · IA · 대비 판정 ①②③ · 시스템 밖 결정) | [maestro-design.md](../../maestro-design.md) |
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

### 컴포넌트 매칭 — 포트폴리오 · Accio
- (빈 템플릿) 해당 기능을 리뷰할 때 채워요.

### 컴포넌트 매칭 — 마에스트로 (F-010, 파일은 `src/projects/maestro/`)
| 피그마 컴포넌트 | 코드 | 구현한 상태 |
|---|---|---|
| GNB Sub MO · GNB PC | `components.tsx` `GnbSub` · `GnbPc` | – |
| Tag (조건 칩) | `components.tsx` `Tag` | 기본 · 선택(check 아이콘) |
| Badge (영업 중 · 마감 임박 · 확인) | `components.tsx` `Badge` | Green · Red · Navy, S · M |
| Now Bar (영업시간 막대) | `components.tsx` `NowBar` | 영업 · 브레이크 · 라스트오더 · 지금 마커(첫 카드만 이동) |
| Result Card | `components.tsx` `ResultCard` | 기본 · 강조(핀 선택) |
| Segment (목록 · 표로 비교, 지금 / 30분 뒤) | `components.tsx` `Segment` | 기본 · 선택 |
| Evidence Block (믿을 이유) | `components.tsx` `EvidenceBlock` | – |
| Map Pin | `MapView.tsx` `pinIcon` | 기본 · 선택 |
| Bottom Button Bar | `components.tsx` `BottomBar` | 영업 중 · 마감(비활성) |
| Bottom Sheet (자리 물어보기) | `screens/SeatSheet.tsx` | 입력 · 기다림 · 답(가능 · 제한 · 불가 · 응답 없음) · 오류 |
| Empty · Error · Skeleton · Toast | `components.tsx` `EmptyState` · `ErrorInline` · `SkeletonCards` · `Toast` | – |
| Data Table (표로 비교) | `screens/ResultScreen.tsx` `CompareTable` | – |

최종 수정: 2026-11-01 · 관련: F-001, F-006, F-010
