# React + TypeScript + Vite

## Accio v1 (`public/accio-v1/`)

Accio 팀 프로젝트 원본 프론트를 `/accio-v1/` 로 붙인 **정적 빌드 결과물**이다. 서버·데이터 서버가 닫혀 있어 원본에 들어 있는 목 모드(`src/mock`)로만 돈다.
원본 소스(`add_/`)는 백엔드·`.env` 때문에 git 에서 제외했고, 여기에는 빌드 결과만 커밋한다.

v1 을 고쳤을 때 순서 — `add_/` 는 git 이 안 보므로 소스만 고쳐서는 아무것도 안 올라간다. 빌드해서 이 폴더가 바뀌어야 커밋할 게 생긴다.

1. `add_/frontend` 소스를 고친다
2. `add_/frontend` 에서 아래 명령으로 빌드한다 → `public/accio-v1/` 이 새 결과물로 바뀐다
3. 바뀐 `public/accio-v1/` 을 커밋한다

```sh
# Git Bash 는 /accio-v1/ 을 윈도 경로로 바꿔 버리므로 MSYS_NO_PATHCONV=1 이 필요하다
MSYS_NO_PATHCONV=1 npx vite build --mode v1 --base=/accio-v1/ --outDir ../../Portfolio/frontend/public/accio-v1 --emptyOutDir
rm -rf ../../Portfolio/frontend/public/accio-v1/Fonts   # CSS 가 이미 번들한 폰트의 중복본
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
