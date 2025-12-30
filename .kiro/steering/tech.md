# Tech Stack & Build System

## Kilocode Extension

### Stack
- TypeScript/JavaScript
- Node.js v20.19.2
- pnpm (package manager)
- Turbo (monorepo build orchestration)
- esbuild (bundling)
- Vitest (testing)
- ESLint + Prettier (linting/formatting)
- React (webview UI)
- Husky (git hooks)

### Common Commands
```bash
# Install dependencies
pnpm install

# Build extension (.vsix)
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type checking
pnpm check-types

# Format code
pnpm format

# Clean build artifacts
pnpm clean

# Install built extension
pnpm install:vsix
```

### Development
- Press F5 in VS Code to launch extension in debug mode
- Hot reload for webview UI changes
- Core extension changes auto-reload in dev mode

## Void Editor

### Stack
- TypeScript
- Electron (desktop shell)
- Node.js v20.x
- npm (package manager)
- Gulp (build system)
- Webpack (bundling)
- Mocha (testing)
- React (AI sidebar UI)
- Tailwind CSS

### Common Commands
```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch

# Build React components
npm run buildreact

# Run tests
npm run test-node
npm run test-browser

# Lint
npm run eslint
npm run stylelint
```

### Development
- Use `scripts/code.sh` or `scripts/code.bat` to run
- React UI in `src/vs/workbench/contrib/void/browser/react/`

## Shared Technologies
- Git LFS (large file storage)
- TypeScript 5.x
- ESLint 9.x
- Prettier
