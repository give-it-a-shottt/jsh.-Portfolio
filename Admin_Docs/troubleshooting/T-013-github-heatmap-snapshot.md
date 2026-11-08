# T-013 GitHub 잔디 이미지 서비스가 응답하지 않음 — 저장본으로 그리기

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과]
무엇이 문제였나: 첫 화면에 GitHub 잔디를 넣으려고, 잔디를 그림 한 장으로 만들어 주는 바깥 무료 사이트(ghchart)를 시험했어요. 응답이 오지 않았어요. 이 사이트에 기대면 사이트가 멈출 때 우리 첫 화면도 같이 깨져요.
어떻게 해결했나: GitHub 공개 잔디 페이지를 개발자가 손으로 받아 파일(저장본)로 남기고, 첫 화면은 그 파일을 우리 코드로 그려요. 받기에 실패하면 예전 파일을 그대로 둬서 화면은 안 깨져요.

## 개발자 상세

### 증상 (2026-11-08, F-013 구현 중)
```
curl https://ghchart.rshah.org/40c463/<GitHub 사용자> → HTTP 000 (응답 없음)
```
- 같은 시각 `https://github.com/users/<GitHub 사용자>/contributions`는 200이었어요.

### 원인
- 잔디 이미지는 남이 운영하는 무료 서비스라 가용성을 우리가 보장할 수 없어요.
- GitHub 잔디 페이지를 브라우저에서 바로 부르는 방법은 막혀요(다른 사이트 요청 제한, CORS). 그래서 "화면에서 실시간으로 받기"도 어려웠어요.

### 해결
- [github-sync.mjs](../../Portfolio/frontend/scripts/github-sync.mjs)(`npm run github:sync`)가 GitHub 잔디 페이지를 받아 날마다 `{ date, count, level }`를 뽑고 [githubContributions.json](../../Portfolio/frontend/src/portfolio/githubContributions.json)에 저장해요.
- [GitHubHeatmap.tsx](../../Portfolio/frontend/src/portfolio/GitHubHeatmap.tsx)가 저장본을 한 열 = 한 주로 그려요.
- 저장하지 않는 경우(종료 코드 1, 기존 파일 유지): 받기 실패 · HTTP 오류 · 20초 초과 · 칸 300개 미만 · 색 칸이 있는데 기여 수가 모두 0(툴팁 형식이 바뀐 경우).

### 재발 방지
- `npm run check`가 저장본을 검사해요: 주인 = 화면의 GitHub 사용자, 300일 이상, 날짜 오름차순, 진하기 0~4, 합계 = 날마다 기여 수의 합.
- 잔디는 저절로 바뀌지 않아요. 가끔 `npm run github:sync`를 돌리고 커밋해요.

### 배운 것
- 화면의 핵심 영역은 남의 무료 서비스에 실시간으로 기대지 않는다. 받아 둔 저장본 + 실패하면 예전 값 유지가 더 안전하다.

최종 수정: 2026-11-08 · 관련: F-013, D-007
