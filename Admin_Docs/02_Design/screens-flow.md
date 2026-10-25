# 화면 목록과 흐름

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] FLASEEK만 정리했어요.
무엇을: FLASEEK는 **메인 → 상품 리스트 → 상품 상세**가 핵심 흐름이고, 로그인은 따로 있어요. 결제·회원가입·간편 로그인처럼 시안에 없는 기능을 누르면 "시안이라 연결하지 않았어요" 토스트가 떠요.
왜: 시안이 "보이기만 하는 그림"이 아니라 실제로 눌러 보며 판단할 수 있는 화면이 되게 하려고요.

```
메인 #/flaseek
 ├─ 카테고리 카드 ───────▶ 리스트 ?cat=legwear|shapewear|set|laundry
 ├─ 두께 카드 ──────────▶ 리스트 ?thick=see-through|premium|napping
 ├─ BEST·더보기 ────────▶ 리스트 (전체)
 └─ 헤더 검색 ──────────▶ 리스트 ?q=검색어
리스트 #/flaseek/list   (탭·칩·필터·정렬, 8개씩 더보기)
 └─ 상품 카드 ──────────▶ 상세 #/flaseek/detail?id=N
상세   세트 칩(1·3·5·7매) · 타입 고르기 · 앵커 탭 · 접는 본문 · 리뷰 요약
 ├─ 장바구니 담기 → 헤더 수 +1, 토스트
 └─ 구매하기 → "시안이라 결제는 연결하지 않았어요"
로그인 #/flaseek/login   (헤더에서 진입. 모든 버튼은 시안 안내 토스트)
```

## 개발자 상세
| 화면 | 주소 | 파일 | PC (lg 이상) | MO |
|---|---|---|---|---|
| 메인 | `#/flaseek` | `pages/MainPage.tsx` | 히어로 슬라이더 + 카피 나란히 | 슬라이더 위, 카피 아래. 카테고리·두께는 가로 스크롤 |
| 리스트 | `#/flaseek/list?cat|q|thick` | `pages/ListPage.tsx` | 카드 4열, `FilterBox` | 카드 2열, `FilterSheet` 바텀시트(결과 수 표시) |
| 상세 | `#/flaseek/detail?id=` | `pages/DetailPage.tsx` | 상단 고정 구매바 | 하단 56px 고정 구매바, 세트 칩 2×2 |
| 로그인 | `#/flaseek/login` | `pages/LoginPage.tsx` | 가운데 384px 한 열 | 간편 로그인 아래 크게 |

- 라우팅: `FlaseekApp.tsx`가 `path`로 화면을 고르고, `params.toString()`을 `key`로 줘서 조건이 바뀌면 화면 상태를 처음부터 다시 시작해요.
- 피그마 기준 폭: PC 1440 · MO 390. 반응형 한 벌로 구현했어요.

### 포트폴리오 · Accio · 마에스트로
- (빈 템플릿) IA·유저플로우는 planning-advisory-panel 결과가 생기면 옮겨 와요.

최종 수정: 2026-10-25 · 관련: F-001
