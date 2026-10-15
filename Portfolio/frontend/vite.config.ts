import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // 사례 상세가 백엔드·배포 설정 파일을 원문 그대로(?raw) 보여준다 — 개발 서버가 그 폴더까지 읽게 연다
      allow: ['.', '../backend', '../../.github', '../../render.yaml'],
    },
  },
})
