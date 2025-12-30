# Project Structure

## Root Layout
```
/
├── docs/              # Project documentation and analysis
├── kilocode/          # AI extension (pnpm monorepo)
├── void/              # VS Code fork (Electron app)
└── .kiro/             # Kiro configuration
```

## Kilocode Monorepo (kilocode/)

### Workspace Packages
```
kilocode/
├── src/               # Main extension source
│   ├── core/          # Core functionality and tools
│   ├── services/      # Service implementations
│   ├── api/           # API integrations
│   ├── integrations/  # External integrations
│   ├── i18n/          # Internationalization
│   ├── utils/         # Utility functions
│   └── extension.ts   # Extension entry point
├── webview-ui/        # React frontend UI
├── cli/               # CLI tool
├── apps/              # Applications
│   ├── kilocode-docs/ # Documentation site
│   ├── storybook/     # Component stories
│   ├── vscode-e2e/    # E2E tests
│   └── playwright-e2e/# Playwright tests
├── packages/          # Shared packages
│   ├── types/         # TypeScript types
│   ├── build/         # Build utilities
│   ├── config-eslint/ # ESLint config
│   ├── config-typescript/ # TS config
│   ├── telemetry/     # Telemetry
│   └── ipc/           # IPC utilities
└── jetbrains/         # JetBrains plugin
```

### Key Files
- `turbo.json` - Turbo build configuration
- `pnpm-workspace.yaml` - Workspace packages
- `.husky/` - Git hooks (pre-commit, pre-push)
- `.changeset/` - Changeset files for versioning

## Void Editor (void/)

### Source Structure
```
void/
├── src/
│   ├── vs/            # VS Code source
│   │   └── workbench/contrib/void/  # Void-specific code
│   ├── main.ts        # Main process entry
│   └── bootstrap-*.ts # Bootstrap files
├── extensions/        # Built-in extensions
│   └── radd-assistant/# AI assistant extension
├── build/             # Build scripts
├── scripts/           # Dev scripts
├── cli/               # Rust CLI
└── resources/         # Icons, assets
```

### Key Concepts
- `browser/` folders - Browser process code (can use window)
- `electron-main/` folders - Main process code (can use node_modules)
- `common/` folders - Shared code (no special imports)
- Services are singletons registered with `registerSingleton`
- Actions/Commands registered for keybindings

## Localization
- Kilocode: `src/package.nls.*.json` files
- Void: Standard VS Code i18n system
- Target: Persian (Farsi) with RTL support
