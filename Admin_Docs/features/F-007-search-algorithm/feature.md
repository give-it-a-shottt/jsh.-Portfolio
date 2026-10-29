# F-007 검색 알고리즘 개선 (S0~S6)

## 한눈에 보기 (코드 몰라도 OK)
상태: [주의] S0~S6을 모두 마쳤어요. 리뷰(R1~R7) 전이에요.
- 검색: 상위 3 적중률 31% → 95%, 0건 비율 69% → 3%(시험지 39개). 규칙을 만든 뒤 정한 처음 보는 검색어 10개로는 50%예요.
- 자동완성: 기대한 제안이 목록에 나오는 비율 47% → 100%(처음 보는 입력 8개도 100%)
- 관련 검색어: 지금 결과와 관련 있는 추천 24% → 100%
- 남은 한계: 데이터와 다른 말로 쓴 질문("서버가 잠들어서 느린 문제"), 영문 도구의 한글 표기("도커")는 키워드 검색으로 못 찾아요. 최종 방향인 AI 검색(Gemini)의 출발점이에요.
무엇을: 포트폴리오 검색창을 단계별로 똑똑하게 만들어요. 먼저 "시험지"(검색어와 정답 목록)와 "채점기"를 만들고, 단계마다 점수가 얼마나 올랐는지 숫자로 남겨요. 체중계부터 사고 다이어트를 시작하는 것과 같아요.
왜: 검색 알고리즘을 직접 배우면서, 사이트 검색이 구글처럼 본문에 든 단어와 비슷한 단어까지 찾게 하려고요.

## 설계 의도 (사용자 확인 — 코드 작성 전에 채움, 문장 정리사 사용)
- 이 기능이 해결하는 문제: 검색 관련 코드 알고리즘을 학습하는 것이 목적이다. 지금 목표는 검색이 잘 되는 것이다. (사용자 확인)
- 완료 기준(무엇이 되면 끝인지): 구글 검색처럼 돌아가면 끝. 단어가 본문에 들어 있거나 비슷한 단어여도 찾아 준다. (사용자 확인)
- 최종 방향: 나중에는 Gemini API를 이용한 AI 검색 느낌으로 가고 싶다. (사용자 확인)
- 화면·컴포넌트: (비어 있음)
- API: (비어 있음)
- 데이터: (비어 있음)

## 단계
| 단계 | 내용 | 상태 | 트러블 |
|---|---|---|---|
| S0 | 측정 도구: 테스트셋 + 평가 스크립트 | 완료 · 상위 3 적중률 31%(39개 기준) | [T-001](../../troubleshooting/T-001-search-baseline.md) |
| S1 | 정규화: 대소문자·띄어쓰기·특수문자·NFC | 완료 · 상위 3 적중률 49% | [T-002](../../troubleshooting/T-002-search-normalize.md) |
| S2 | 토큰화·역색인: 한글 bigram, 조사 떼기, 본문 검색 | 완료 · 상위 3 적중률 67% | [T-003](../../troubleshooting/T-003-search-index-body.md) |
| S3 | 랭킹: BM25, 필드 가중치, 군더더기 말, minimum_should_match | 완료 · 상위 3 적중률 74% | [T-004](../../troubleshooting/T-004-search-ranking-bm25.md) |
| S4 | 오타·유사어: 자모 편집거리, 한영 자판, 동의어 | 완료 · 상위 3 적중률 95% (처음 보는 검색어 50%) | [T-005](../../troubleshooting/T-005-search-typo-synonym.md) |
| S5 | 자동완성: 초성, 조합 중 글자, 하이라이트 | 완료 · 목록에 나옴 47% → 100% | [T-006](../../troubleshooting/T-006-search-autocomplete.md) |
| S6 | 추천 검색어: 태그 동시 출현, "혹시 이걸 찾으셨나요?" | 완료 · 관련 있는 추천 24% → 100% | [T-007](../../troubleshooting/T-007-search-related.md) |

| 지표 (시험지 39개) | S0 | S1 | S2 | S3 | S4 | S5·S6 |
|---|---|---|---|---|---|---|
| 0건 비율 | 69% | 51% | 28% | 23% | 3% | 3% |
| 상위 3 적중률 | 31% | 49% | 67% | 74% | 95% | 95% |
| MRR | 0.29 | 0.47 | 0.67 | 0.73 | 0.94 | 0.94 |
| 엉뚱한 결과 | 0% | 0% | 0% | 0% | 0% | 0% |

💡 다시 재기: `cd Portfolio/frontend && npm run search:eval` (단계별 점수는 `search-eval/runs/`)

💡 2026-10-27: 검색 공부 노트를 올리자 노트 속 예시 오타 때문에 점수가 95% → 90%로 떨어졌어요. "드문 말도 흔한 쪽으로 고치기"로 다시 95%가 됐어요(`runs/S6b.json`, [T-008](../../troubleshooting/T-008-search-typo-in-data.md)).

## 결과 (AI 작성 — 구현 후)

### S0 측정 도구 (2026-10-26)
- 바뀐 파일
  - `Portfolio/frontend/search-eval/queries.json`: 시험지예요. 검색어 39개(정답 있음 36개, 정답 없어야 함 3개)를 10개 유형으로 나눴고, 유형마다 고칠 단계(stage)를 적었어요.
  - `Portfolio/frontend/search-eval/run.mjs`: 채점기예요. Vite로 사이트 검색 코드를 그대로 불러 채점해요(새 패키지 없음).
  - `Portfolio/frontend/search-eval/runs/S0.json`: 베이스라인 점수예요.
  - 시험지는 사용자 검토를 마쳤어요. "프론트"는 Front 노트도 정답으로 치기로 했어요.
  - `Portfolio/frontend/package.json`: `npm run search:eval` 추가
- 실제 구조
  - 채점 순서는 '전체' 탭에 보이는 순서예요. 사례 3개 → 노트 3개 → 나머지 사례 → 나머지 노트 순이고, SearchResults.tsx를 따라 했어요.
  - 지표: 0건 비율, 상위 3 적중률, MRR, 찾은 비율, 엉뚱한 결과 비율. 유형별 표도 함께 나와요.
  - 놓친 정답이 본문(사례 상세·노트의 배운 것)에는 있었는지도 따로 표시해요.
  - `--save 이름`으로 점수를 남기고, 다음 실행부터는 S0와 비교한 증감을 보여 줘요.
- 설계 의도와 다른 점
  - [주의] '전체' 탭 순서 규칙이 SearchResults.tsx와 run.mjs 두 곳에 있어요. S3에서 검색 함수를 한 파일로 모으면서 하나로 합쳐요.
  - 자동완성(초성 "ㄷㅈㅇ" 등)은 이 시험지에 없어요. S5에서 자동완성용 시험지를 따로 더해요.

### S1 정규화 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/searchText.ts`(새 파일): `normalize`, `queryTerms`, `containsAllTerms` — 검색 글자 규칙을 한 곳에 모음
  - `src/portfolio/data.ts`: `matchesQuery`·`getSuggestions`가 정규화된 글로 비교. 사례마다 검색 글을 미리 만들어 Map에 둠
  - `src/portfolio/notes.ts`: `matchesNote`·`getAllSuggestions` 같은 방식
  - `search-eval/queries.json`: 표기 차이 검색어 3개(Q40~Q42) 추가 → 42개. S0를 고치기 전 코드로 다시 잼
  - `search-eval/run.mjs`: 본문 검사도 사이트의 `normalize`를 씀
  - `search-eval/runs/S1.json`: S1 점수
- 실제 구조: 양쪽에서 공백·문장부호를 지우고 비교해요. 검색어는 여전히 공백으로 낱말을 나누고, 낱말이 모두 있어야 일치해요(AND).
- 설계 의도와 다른 점
  - [주의] 자동완성 굵게 표시는 아직 글자 그대로 비교해요(S5에서 고침).
  - 문장부호만 친 검색어("·")는 이제 0건이에요. 예전에는 "·"가 들어간 사례가 나왔어요.
- 💡 S2에서 `matchesQuery`·`matchesNote`는 search.ts의 `search()`로 바뀌었어요.

### S2 토큰화·역색인 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/caseStories.ts`(새 파일): 사례 상세의 글(문제·해결 포인트·결과)을 caseDetails.ts에서 떼어 옮김. 첫 화면에서 받음(사용자 결정)
  - `src/portfolio/caseDetails.ts`: 사용 기술·코드·팀 소개만 남음. 여전히 상세에서만 받음
  - `src/portfolio/EngineeringCaseDetail.tsx`: 두 파일을 합쳐 보여 줌
  - `src/portfolio/search.ts`(새 파일): 문서 127개, 두 글자 조각 역색인, `search(query)` → `{ cases, notes }`
  - `src/portfolio/searchText.ts`: 조사 목록과 `queryWords`(낱말마다 [그대로, 조사 뗀 모양])
  - `src/portfolio/SearchResults.tsx`: `search()` 사용. `data.ts`·`notes.ts`의 예전 검색 함수 삭제
  - `search-eval/run.mjs`: `search()` 사용. "놓친 정답이 어디 있었나" 검사는 검색이 아직 안 보는 글(코드 설명·팀 소개·노트의 써먹은 곳) 기준으로 바꿈
  - `search-eval/runs/S2.json`: S2 점수
- 실제 구조: 낱말의 조각 목록을 교집합해 후보를 고르고, 후보 글에서 낱말을 다시 확인해요. 낱말이 모두 있어야 일치(AND)하는 건 그대로예요. 순서도 그대로 레벨 순이에요.
- 설계 의도와 다른 점
  - [주의] 본문까지 찾으니 "프론트"의 첫 정답이 3위에서 6위로 밀렸어요. 순서가 아직 레벨 순이라서예요(S3).
  - 첫 화면 파일이 압축 기준 10KB 늘었어요(예상 8KB). 대신 상세 파일이 7.5KB 줄었어요.

### S3 랭킹 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/search.ts`: 문서를 제목·메타·요약·본문 네 칸으로 나눔. BM25F 점수(칸 무게 3 : 2 : 1.5 : 1, K1 1.2, B 0.75) × 레벨 덤(레벨당 +10%)으로 정렬. minimum_should_match(두 낱말까지 전부, 세 낱말부터 75%). 짧은 영어는 단어째로 비교. '전체' 탭 배치 값을 여기로 옮김
  - `src/portfolio/searchText.ts`: 군더더기 말 31개, `latinWords`, `isShortLatin`
  - `src/portfolio/SearchResults.tsx`: 배치 값을 search.ts에서 가져옴
  - `search-eval/run.mjs`: 배치 값을 search.ts에서 가져옴(복제 제거). `search-eval/runs/S3.json`
- 실제 구조: 낱말마다 [그대로, 조사 뗀 모양] → 목차로 후보 → 칸마다 횟수 → BM25F 점수 합 → 필요한 낱말 수를 못 채운 문서는 뺌 → 점수 순(같으면 레벨·날짜)
- 설계 의도와 다른 점
  - [주의] 순서가 레벨 순에서 점수 순으로 바뀌었어요(검색어가 있을 때만). 대표 프로젝트(레벨 4)는 점수에 30% 덤을 받지만, 관련이 덜하면 아래로 내려갈 수 있어요.
  - "서버가 잠들어서 느린 문제"처럼 다른 말로 적힌 검색어는 키워드 검색의 한계로 남겼어요(최종 방향인 AI 검색의 몫).

### S4 오타·유사어 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/synonyms.ts`(새 파일): 동의어 19묶음
  - `src/portfolio/hangul.ts`(새 파일): 자모 풀기·합치기, 두벌식 한영 자판 변환(양방향), Damerau 편집거리
  - `src/portfolio/search.ts`: 동의어로 함께 찾기, 띄어 쓴 동의어 합치기, 0건 낱말만 자판 → 편집거리로 고치기, `search()`가 `corrections`도 돌려줌. 분야를 메타 칸에 넣음
  - `src/portfolio/searchText.ts`: `queryWords`가 `{ raw, forms }`를 돌려줌(자판 변환에 친 그대로가 필요). `plainWords`, `stripJosa` 내보냄
  - `src/portfolio/SearchResults.tsx`: 요약 아래 "…(으)로 고쳐서 찾았어요" 안내
  - `search-eval/queries.json`: 처음 보는 검색어 10개(H01~H10, `heldOut`)와 없어야 함 3개(Q44~Q46) → 55개
  - `search-eval/run.mjs`: `heldOut`은 전체 점수에서 빼고 따로 출력. `runs/S4.json`
- 설계 의도와 다른 점
  - [주의] 시험지(39개)는 95%지만 처음 보는 검색어는 50%예요. 동의어 사전을 시험지를 보고 만들어서 생긴 차이예요. 숫자를 말할 때는 둘을 같이 말해요.
  - 결과 화면에 고친 낱말 안내 한 줄이 생겼어요(화면 변화).

### S5 자동완성 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/suggest.ts`(새 파일): 후보(키워드 → 사례 제목 → 노트 제목), 자모 앞부분 비교(조합 중), 초성 비교(낱말 첫 글자부터), 한영 자판 다시 보기, 맞은 범위를 `segments`로
  - `src/portfolio/hangul.ts`: `initialOf`, `isInitialsOnly`
  - `src/portfolio/SearchBox.tsx`: suggest.ts의 `segments`로 굵게 그림
  - `src/portfolio/data.ts`·`notes.ts`: 예전 `getSuggestions`·`getAllSuggestions`·`splitMatch` 삭제
  - `search-eval/suggest.json`(새 파일): 자동완성 시험지 19개 + 처음 보는 입력 8개
  - `search-eval/run.mjs`: 자동완성 채점(목록에 나옴, MRR) 추가. `runs/S5.json`. `runs/S4.json`은 자동완성 베이스라인을 넣어 다시 저장
- 설계 의도와 다른 점
  - 자동완성 후보는 키워드·제목만이에요. 본문 낱말은 제안하지 않아요.

### S6 추천 검색어 (2026-10-26)
- 바뀐 파일
  - `src/portfolio/related.ts`(새 파일): `relatedSearches`(결과 위쪽 태그 × 드문 정도), `didYouMean`(0건이면 결과 있는 낱말만 남기기, 2개 이상 남을 때만)
  - `src/portfolio/SearchResults.tsx`: 관련 검색어를 결과 태그로(없으면 추천 키워드). 모든 탭이 0건이면 "혹시 이걸 찾으셨나요?" 링크
  - `search-eval/run.mjs`: 추천 검색어 채점(유효·관련·새로움, 예전 방식과 나란히), '혹시' 채점. `runs/S6.json`
- 설계 의도와 다른 점
  - 관련 검색어 후보는 태그뿐이에요. 실제로 이어서 찾는 검색어는 검색 기록이 있어야 해서 S7(백엔드)로 넘겨요.

### 전체 구조 (S6 기준)
```
검색어 ─ searchText.ts  정규화 · 낱말 나누기 · 조사 떼기 · 군더더기 말
        └ search.ts     동의어 합치기(synonyms.ts) → 역색인으로 후보 → 칸별 BM25F × 레벨 덤
                        → 0건 낱말은 한영 자판 → 자모 편집거리(hangul.ts)로 고치기 → { cases, notes, corrections }
결과 화면 ─ SearchResults.tsx  결과 · 고친 낱말 안내 · 관련 검색어 · 혹시 이걸 찾으셨나요(related.ts)
검색창 ─ SearchBox.tsx  자동완성(suggest.ts: 자모 앞부분 · 초성 · 한영 자판 · 굵게)
채점 ─ search-eval/  queries.json(검색 55개) · suggest.json(자동완성 27개) · run.mjs · runs/S0~S6.json
```

## 리뷰
- (리뷰 전)

## 면접 예상 질문
- (리뷰 후 AI 작성)
- 답 (사용자 확인 — 문장 정리사 사용)

최종 수정: 2026-10-26 · 관련: F-003, F-004
