# 디자인 토큰

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과]
무엇을: 색·글자 크기·굵기·라운드에 이름을 붙여 `index.css` 한 곳에 모았어요. 화면 코드는 값(`#d90855`) 대신 이름(`bg-flaseek`)을 써요. 페인트 통에 라벨을 붙여 두고 라벨로 주문하는 것과 같아요.
왜: 색을 바꿀 때 한 곳만 고치면 되고, 프로젝트끼리 색이 섞이지 않아요.

## 개발자 상세
- 위치: `Portfolio/frontend/src/index.css` `@theme { … }` (Tailwind 4). 기준 문서는 `/MyDesign.md`, `/MyDesign(E-commerce).md`
- 💡 기본 유틸리티를 지웠어요(`--font-weight-*`, `--text-*`, `--radius-*: initial`). 그래서 정의되지 않은 값을 쓰면 클래스가 아예 안 먹어요. 토큰 밖 값을 막는 장치예요.

| 분류 | 토큰 | 값·규칙 |
|---|---|---|
| 폰트 | `--font-sans` | Pretendard 계열 |
| 굵기 | `regular` `medium` `semibold` | 400 / 500 / 600만 허용 |
| 글자 크기 | `text-11` ~ `text-56` | 11·12·13·14·15·16·18·20·24·28·32·36·40·48·56. 16~28은 행간 1.4, 32 이상 1.3, 15 이하 1.45. 자간 -0.025em |
| 글자색 | `text-main` `text-sub` `text-sub-weak` `text-disabled` | #111 / #505050 / #767676 / #999 |
| 선 | `border-light` `border-regular` `border-black` | #f1f1f5 / #e5e5ec / #111 |
| 배경 | `bg-default` `bg-light` `bg-regular` `bg-main` | #fff / #f7f7fb / #f1f1f5 / #111 |
| 아이콘 | `icon-main` `icon-sub` `icon-sub-weak` `icon-disabled` | #2a2a37 ~ #a5a5af |
| 라운드 | `card` `card-sm` `thumb` `thumb-sm` `badge` / `xs`~`xl` | 16 / 12 / 12 / 8 / 4 · 4~20 |

### 프로젝트 전용 (접두어로 구분)
| 프로젝트 | 토큰 | 역할 |
|---|---|---|
| FLASEEK | `flaseek` #d90855 | 흰 글자를 얹는 버튼 |
| | `flaseek-text` #ca074f | 핑크 글자 |
| | `flaseek-pink` #fa78a8 · `flaseek-pink-soft` · `flaseek-soft` | 장식·배지·옅은 배경 (흰 글자 금지) |
| | `shadow-flaseek-2/3/4` | 찜·구매바 / 슬라이더 손잡이 / 바텀시트 |
| 포트폴리오 | `portfolio` `study` `accent`, `[data-theme="ivory"]` | Ivory 테마는 neutral 값만 덮어써요 |
| Accio | `accio*`, `status-*`, `shadow-accio-1~4` | |
| 마에스트로 | `maestro*`, `font-maestro-*` | |

최종 수정: 2026-10-25 · 관련: F-001
