// GitHub 잔디 저장본 만들기(F-013) — 첫 화면의 GitHub 잔디는 이 파일이 만든 JSON 을 그린다.
// 브라우저에서 GitHub 를 직접 부르면 막히고(CORS) 바깥 이미지 서비스는 멈출 수 있어서, 받아 둔 저장본을 쓴다.
//
//   npm run github:sync     github.com 공개 잔디 페이지 → src/portfolio/githubContributions.json
//
// 받기에 실패하면 기존 파일을 그대로 두고 종료 코드 1 — 화면은 마지막 저장본으로 계속 그려진다.

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// src/portfolio/profile.ts 의 GITHUB_USER 와 같아야 한다 — npm run check 가 저장본의 user 와 비교한다
const USER = 'give-it-a-shottt'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'portfolio', 'githubContributions.json')

const res = await fetch(`https://github.com/users/${USER}/contributions`, {
  headers: { 'User-Agent': 'jsh-portfolio-github-sync' },
  signal: AbortSignal.timeout(20000),
}).catch((e) => {
  console.error(`받기 실패: ${e.message}`)
  process.exit(1)
})
if (!res.ok) {
  console.error(`받기 실패: HTTP ${res.status}`)
  process.exit(1)
}
const html = await res.text()

// 칸: data-date · id · data-level(0~4) / 툴팁: for=id 안에 "N contributions on …" 또는 "No contributions …"
const counts = new Map()
for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
  const n = /^(\d[\d,]*) contribution/.exec(text)
  counts.set(id, n ? Number(n[1].replace(/,/g, '')) : 0)
}
const days = []
for (const [, date, id, level] of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})" id="([^"]+)" data-level="(\d)"/g)) {
  days.push({ date, count: counts.get(id) ?? 0, level: Number(level) })
}
days.sort((a, b) => a.date.localeCompare(b.date))

// 300 은 checks/run.mjs 의 '잔디 저장본은 300일 이상' 과 같아야 한다
if (days.length < 300) {
  console.error(`칸이 ${days.length}개뿐이에요 — GitHub 페이지 구조가 바뀐 것 같아 저장하지 않아요.`)
  process.exit(1)
}

const total = days.reduce((sum, d) => sum + d.count, 0)
// 칸은 색이 있는데 기여 수가 모두 0이면 툴팁 형식이 바뀐 것 — 틀린 숫자를 저장하지 않는다
if (total === 0 && days.some((d) => d.level > 0)) {
  console.error('색이 있는 칸이 있는데 기여 수가 모두 0이에요 — 툴팁 형식이 바뀐 것 같아 저장하지 않아요.')
  process.exit(1)
}
writeFileSync(OUT, JSON.stringify({ user: USER, syncedAt: new Date().toISOString().slice(0, 10), total, days }) + '\n')
console.log(`저장: ${days.length}일 · 기여 ${total}건 → ${OUT}`)
