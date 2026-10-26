import type { PortfolioCase } from './data'

/**
 * 사례 중요도 — 결과 목록의 순서를 정하는 내부 값이다. 화면에는 보이지 않는다.
 * 작은 작업까지 전부 싣되, 보는 사람이 위의 몇 개만 읽어도 핵심이 보이게 한다.
 *   4  대표 프로젝트 — 결과 맨 위에 고정한다(분류마다 하나까지 — Front 는 Accio, Design 은 개인 디자인 시스템)
 *   3  실제 문제를 풀었고 결과가 분명한 것 — 대표 프로젝트, 수치로 말할 수 있는 해결
 *   2  의미 있는 설계 판단이 들어간 것
 *   1  작은 개선이나 운영 세팅
 */
export type Level = 1 | 2 | 3 | 4

/** 레벨 높은 순, 같은 레벨은 최신순. 날짜까지 같으면 data.ts 에 적은 순서를 지킨다(sort 는 안정 정렬) */
export function rankCases(cases: PortfolioCase[]) {
  return [...cases].sort((a, b) => b.level - a.level || b.date.localeCompare(a.date))
}
