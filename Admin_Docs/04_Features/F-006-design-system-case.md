# F-006 개인 디자인 시스템 사례 (#/case/jsh-design-system)

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] 구현은 끝났고, 설계 의도를 받은 뒤 리뷰해요.
무엇을: Figma로 만든 개인 디자인 시스템(27개 페이지)을 Design 사례 하나로 올렸어요. 사례집 맨 앞 장에 "내가 쓰는 기준"을 꽂아 두는 것과 같아요. Design 탭 맨 위와 홈 "먼저 보면 좋은 사례" 첫 칸에 보여요.
왜: ❓ (설계 의도를 받은 뒤 채워요)

## 설계 의도 (사용자 작성 — 코드 작성 전에 채움)
- 이 기능이 해결하는 문제:
- 완료 기준(무엇이 되면 끝인지):
- 화면·컴포넌트:
- API: 없음 (정적 데이터)
- 데이터:

## 결과 (AI 작성 — 구현 후)
- 바뀐 파일
  - `Portfolio/frontend/src/portfolio/data.ts` — `DesignSection` 타입과 `DesignCase.sections` 추가, `jsh-design-system` 사례 추가(level 4)
  - `Portfolio/frontend/src/portfolio/DesignCaseDetail.tsx` — `sections`를 머리말 바로 아래에 칸별로 그림(기존 `ScreenSection` 재사용)
  - `Portfolio/frontend/src/portfolio/rank.ts` — level 4 설명을 "분류마다 하나까지"로 바꿈
  - `Portfolio/frontend/src/portfolio/assets/design/jsh-ds/` — 이미지 41장(webp, 약 5MB)
- 실제 구조
  - 칸 순서: 표지·목차 → A 기초 → B 기본 컴포넌트 → C 조합 → D·E 레이아웃·콘텐츠 → F 상태 → G PC 샘플 → G 모바일 샘플
  - 각 페이지의 문서 프레임만 실음. 컴포넌트 라이브러리 시트(변형 격자)와 참고자료 페이지는 뺌
  - 순서 장치: level 4 + 날짜(2026.10)라서 전체·Design 탭·홈 첫 칸에 옴. Accio(level 4, 2025.11)는 전체에서 두 번째로 내려감
  - 목록 썸네일은 가운데가 잘려 표지 왼쪽만 남긴 `00-thumb.webp`를 따로 씀
- 설계 의도와 다른 점: (설계 의도를 받은 뒤 비교해요)

## 리뷰
- (리뷰 전 · 범위 예정: R1~R7, 화면 변경)

## 면접 예상 질문
- (리뷰 후 AI 작성)
- 답 (사용자 작성)

최종 수정: 2026-10-26 · 관련: F-001, F-003
