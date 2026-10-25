# 서비스 지도

## 한눈에 보기 (코드 몰라도 OK)
상태: [통과] 사용자 확인 완료 (2026-10-25)
무엇을: **검색하듯 둘러보는 포트폴리오**예요. 첫 화면은 검색창이고, 키워드를 넣으면 작업 사례(Front·Back·Design)와 공부 노트(Study)가 중요한 순서대로 결과처럼 나와요. 사례 안에서 프로젝트를 바로 실행해 볼 수 있어요.
비유: 백화점 안내 데스크(검색창)에 물으면 매장(사례)을 알려 주고, 몇몇 매장은 들어가서 직접 체험(실행 화면)할 수 있는 구조예요.
왜: 이력서 링크 하나로 "무엇을 했고 어떻게 생각했는지"를 바로 찾아보고 직접 눌러 보게 하려고요.

```
           ┌──────────── 포트폴리오 (#/) ────────────┐
           │ 검색 홈 → 검색 결과(탭) → 사례 상세 / 노트 상세 │
           └──────┬─────────┬──────────┬────────────┘
                  │ 실행해 보기 링크                    
     ┌────────────┼─────────┼──────────┬──────────────┐
  마에스트로     Accio      FLASEEK     Accio v1 원본
  #/maestro    #/accio    #/flaseek   /accio-v1/
  (해커톤)     (팀→리디자인) (리뉴얼 시안) (팀 원본 정적 빌드)
     │            │
  마에스트로 API  Accio API (지금은 헬스 체크만)
```

## 개발자 상세

| 서비스 | 주소 | 무엇 | 서버 | 코드 |
|---|---|---|---|---|
| 포트폴리오 | `#/`, `#/search?q=`, `#/case/{slug}`, `#/study/{slug}` | 검색형 포트폴리오. 사례·노트 데이터는 코드 안의 정적 데이터 | 없음 | `Portfolio/frontend/src/portfolio/` |
| 마에스트로 | `#/maestro/…` | 틀어진 일정의 플랜 B를 짜 주는 서비스 (YUMITHON 2026) | 마에스트로 API(헤이유미 API 중계, mock/real) | `src/projects/maestro/`, `backend/maestro/` |
| Accio | `#/accio/…` | AI 자연어 검색 쇼핑몰. 팀 프로젝트를 Figma 리디자인으로 다시 만든 화면 | 프론트만 동작(목 데이터). 백엔드는 뼈대 | `src/projects/accio/`, `backend/accio/` |
| FLASEEK | `#/flaseek/…` | 보정속옷·압박스타킹 자사몰 리뉴얼 시안. 메인·리스트·상세·로그인 | 없음(정적 데이터, 이번 방문 동안만 상태 유지) | `src/projects/flaseek/` |
| Accio v1 | `/accio-v1/` | 팀 프로젝트 원본 프론트를 정적 빌드로 보존. 목 모드로만 동작 | 없음 | `public/accio-v1/` (빌드 결과만) |

- 💡 프론트는 **Vite 앱 하나**예요. 프로젝트마다 주소의 `#` 뒤 첫 마디로 나뉘어요. 자세한 내용은 [architecture.md](architecture.md), [D-001](../03_Decisions/D-001-single-vite-hash-routing.md)에 있어요.
- 앞으로(사용자 구술 정리): remind·PlanForMe 디자인 페이지를 같은 방식으로 추가할 수 있어요. Accio와 마에스트로는 별도 서비스로 분리하고, 이 지도에는 디자인 사례와 링크만 남아요([D-001](../03_Decisions/D-001-single-vite-hash-routing.md)).
- 사례 데이터: `portfolio/data.ts`(목록), `portfolio/caseDetails.ts`(Front·Back 상세), `portfolio/noteData/`(공부 노트)

최종 수정: 2026-10-25 · 관련: D-001, F-001~F-005
