/**
 * Radd Application Default Settings
 * 
 * This file contains all default settings for the Radd business workspace.
 * These settings are optimized for Persian-speaking business users.
 * 
 * Settings are organized by category and include both VS Code workbench
 * settings and Radd-specific configurations.
 */

/**
 * Workbench settings for business-friendly UI
 */
export const WORKBENCH_SETTINGS = {
	// Startup
	"workbench.startupEditor": "welcomePage",
	"workbench.welcomePage.walkthroughs.openOnInstall": true,
	
	// Theme
	"workbench.colorTheme": "Default Dark+",
	"workbench.iconTheme": "vs-seti",
	
	// Activity Bar & Sidebar
	"workbench.activityBar.location": "default",
	"workbench.activityBar.visible": true,
	"workbench.sideBar.location": "right", // RTL-friendly: sidebar on right
	
	// Panel
	"workbench.panel.defaultLocation": "bottom",
	"workbench.panel.opensMaximized": "never",
	
	// Editor Tabs
	"workbench.editor.showTabs": "multiple",
	"workbench.editor.enablePreview": true,
	"workbench.editor.highlightModifiedTabs": true,
	"workbench.editor.tabCloseButton": "right",
	"workbench.editor.tabSizing": "fit",
	
	// Status Bar & Layout
	"workbench.statusBar.visible": true,
	"workbench.layoutControl.enabled": false,
	"workbench.tips.enabled": false,
	
	// Tree View
	"workbench.tree.indent": 16,
	"workbench.tree.renderIndentGuides": "always",
} as const;

/**
 * Editor settings optimized for document viewing
 */
export const EDITOR_SETTINGS = {
	// Font - Vazirmatn is a Persian-friendly font
	"editor.fontSize": 14,
	"editor.fontFamily": "Vazirmatn, Consolas, 'Courier New', monospace",
	"editor.fontLigatures": false,
	
	// Word Wrap - essential for document viewing
	"editor.wordWrap": "on",
	"editor.wordWrapColumn": 120,
	
	// Simplified UI for business users
	"editor.minimap.enabled": false,
	"editor.lineNumbers": "off",
	"editor.glyphMargin": false,
	"editor.folding": false,
	"editor.renderWhitespace": "none",
	"editor.bracketPairColorization.enabled": false,
	
	// Cursor & Scrolling
	"editor.cursorBlinking": "smooth",
	"editor.cursorStyle": "line",
	"editor.smoothScrolling": true,
	"editor.mouseWheelZoom": true,
	
	// Editing Features
	"editor.linkedEditing": true,
	"editor.autoClosingBrackets": "languageDefined",
	"editor.autoClosingQuotes": "languageDefined",
	"editor.autoIndent": "full",
	"editor.detectIndentation": true,
	"editor.insertSpaces": false,
	"editor.tabSize": 4,
	
	// Suggestions
	"editor.suggest.showStatusBar": true,
	"editor.quickSuggestions": {
		"other": true,
		"comments": false,
		"strings": false,
	},
	"editor.acceptSuggestionOnEnter": "on",
	"editor.tabCompletion": "on",
	
	// Formatting
	"editor.formatOnPaste": false,
	"editor.formatOnSave": false,
	
	// Unicode - important for Persian text
	"editor.unicodeHighlight.ambiguousCharacters": false,
	"editor.unicodeHighlight.invisibleCharacters": false,
} as const;

/**
 * Terminal settings
 */
export const TERMINAL_SETTINGS = {
	"terminal.integrated.defaultProfile.windows": "PowerShell",
	"terminal.integrated.fontSize": 13,
	"terminal.integrated.fontFamily": "Vazirmatn, Consolas, 'Courier New', monospace",
	"terminal.integrated.hideOnStartup": "whenEmpty",
	"terminal.integrated.cursorBlinking": true,
	"terminal.integrated.cursorStyle": "line",
	"terminal.integrated.scrollback": 5000,
	"terminal.integrated.enablePersistentSessions": true,
	"terminal.integrated.confirmOnExit": "hasChildProcesses",
	"terminal.integrated.copyOnSelection": true,
} as const;

/**
 * File and search settings
 */
export const FILE_SETTINGS = {
	// File Associations for business documents
	"files.associations": {
		"*.txt": "plaintext",
		"*.log": "log",
		"*.md": "markdown",
		"*.json": "json",
		"*.csv": "csv",
		"*.xml": "xml",
		"*.html": "html",
		"*.htm": "html",
	},
	
	// Auto Save
	"files.autoSave": "afterDelay",
	"files.autoSaveDelay": 1000,
	
	// Encoding
	"files.encoding": "utf8",
	"files.eol": "auto",
	
	// Whitespace handling
	"files.trimTrailingWhitespace": false,
	"files.insertFinalNewline": false,
	"files.trimFinalNewlines": false,
	
	// Hot Exit
	"files.hotExit": "onExitAndWindowClose",
	"files.defaultLanguage": "plaintext",
	
	// Exclude patterns
	"files.exclude": {
		"**/.git": true,
		"**/.DS_Store": true,
		"**/.svn": true,
		"**/.hg": true,
		"**/CVS": true,
		"**/.radd": true,
		"**/Thumbs.db": true,
		"**/desktop.ini": true,
	},
	
	// Watcher exclusions
	"files.watcherExclude": {
		"**/.git/objects/**": true,
		"**/.git/subtree-cache/**": true,
		"**/node_modules/**": true,
		"**/.hg/store/**": true,
		"**/.radd/**": true,
	},
} as const;

/**
 * Search settings
 */
export const SEARCH_SETTINGS = {
	"search.exclude": {
		"**/node_modules": true,
		"**/.git": true,
		"**/.kilocode": true,
		"**/.radd": true,
		"**/bower_components": true,
		"**/*.code-search": true,
	},
	"search.useIgnoreFiles": true,
	"search.useGlobalIgnoreFiles": true,
	"search.showLineNumbers": true,
	"search.smartCase": true,
} as const;

/**
 * Explorer settings
 */
export const EXPLORER_SETTINGS = {
	"explorer.compactFolders": false,
	"explorer.confirmDelete": true,
	"explorer.confirmDragAndDrop": true,
	"explorer.decorations.badges": true,
	"explorer.decorations.colors": true,
	"explorer.sortOrder": "default",
	"explorer.autoReveal": true,
	"breadcrumbs.enabled": false,
	"outline.showVariables": false,
	"outline.showProperties": false,
	"outline.showFunctions": true,
	"outline.showClasses": true,
} as const;

/**
 * Git and SCM settings
 */
export const GIT_SETTINGS = {
	"git.enabled": true,
	"git.decorations.enabled": true,
	"git.autofetch": false,
	"git.confirmSync": true,
	"git.enableSmartCommit": true,
	"git.showPushSuccessNotification": true,
	"scm.defaultViewMode": "tree",
	"scm.alwaysShowRepositories": false,
	"scm.autoReveal": true,
} as const;

/**
 * Debug settings (hidden for business users)
 */
export const DEBUG_SETTINGS = {
	"debug.console.fontSize": 13,
	"debug.showInStatusBar": "never",
	"debug.openDebug": "neverOpen",
	"debug.internalConsoleOptions": "neverOpen",
} as const;

/**
 * Window settings with Persian branding
 * NOTE: Some window settings are application-level (in APPLICATION_SETTINGS)
 */
export const WINDOW_SETTINGS = {
	"window.title": "${dirty}${activeEditorShort}${separator}${rootName}${separator}راد",
	"window.autoDetectColorScheme": false,
	"window.zoomLevel": 0,
} as const;

/**
 * Zen Mode settings for focused work
 */
export const ZEN_MODE_SETTINGS = {
	"zenMode.hideLineNumbers": true,
	"zenMode.hideTabs": true,
	"zenMode.hideStatusBar": true,
	"zenMode.hideActivityBar": true,
	"zenMode.centerLayout": true,
	"zenMode.fullScreen": true,
} as const;

/**
 * Security and privacy settings
 * NOTE: These are application-level settings configured in product.json
 */
export const SECURITY_SETTINGS = {
	"telemetry.telemetryLevel": "off",
	"security.workspace.trust.enabled": false,
} as const;

/**
 * Application-level settings (configured in product.json, not extension)
 * These settings require application-level configuration
 */
export const APPLICATION_SETTINGS = {
	"window.titleBarStyle": "custom",
	"window.menuBarVisibility": "classic",
	"window.enableMenuBarMnemonics": true,
	"window.newWindowDimensions": "default",
	"window.restoreWindows": "all",
	"files.hotExit": "onExitAndWindowClose",
	"update.mode": "manual",
	"extensions.autoUpdate": false,
	"extensions.autoCheckUpdates": false,
} as const;

/**
 * Accessibility settings
 */
export const ACCESSIBILITY_SETTINGS = {
	"accessibility.signals.sounds.volume": 50,
	"accessibility.underlineLinks": true,
	"problems.showCurrentInStatus": true,
	"problems.decorations.enabled": true,
	"problems.autoReveal": true,
} as const;

/**
 * All default settings combined (extension-level only)
 * Application-level settings are in APPLICATION_SETTINGS
 */
export const ALL_RADD_SETTINGS = {
	...WORKBENCH_SETTINGS,
	...EDITOR_SETTINGS,
	...TERMINAL_SETTINGS,
	...FILE_SETTINGS,
	...SEARCH_SETTINGS,
	...EXPLORER_SETTINGS,
	...GIT_SETTINGS,
	...DEBUG_SETTINGS,
	...WINDOW_SETTINGS,
	...ZEN_MODE_SETTINGS,
	...SECURITY_SETTINGS,
	...ACCESSIBILITY_SETTINGS,
} as const;

/**
 * All settings including application-level
 */
export const ALL_SETTINGS_WITH_APPLICATION = {
	...ALL_RADD_SETTINGS,
	...APPLICATION_SETTINGS,
} as const;

/**
 * Settings categories for UI organization
 */
export const SETTINGS_CATEGORIES = {
	appearance: {
		titlePersian: "ظاهر",
		titleEnglish: "Appearance",
		settings: ["workbench.colorTheme", "workbench.iconTheme", "editor.fontSize", "editor.fontFamily"],
	},
	editor: {
		titlePersian: "ویرایشگر",
		titleEnglish: "Editor",
		settings: ["editor.wordWrap", "editor.minimap.enabled", "editor.lineNumbers"],
	},
	files: {
		titlePersian: "فایل‌ها",
		titleEnglish: "Files",
		settings: ["files.autoSave", "files.encoding", "files.associations"],
	},
	terminal: {
		titlePersian: "ترمینال",
		titleEnglish: "Terminal",
		settings: ["terminal.integrated.fontSize", "terminal.integrated.fontFamily"],
	},
	privacy: {
		titlePersian: "حریم خصوصی",
		titleEnglish: "Privacy",
		settings: ["telemetry.telemetryLevel", "security.workspace.trust.enabled"],
	},
} as const;

export default ALL_RADD_SETTINGS;
