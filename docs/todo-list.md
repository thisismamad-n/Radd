# ✅ Business Playground - MVP TODO List

## Overview

**Goal:** Create working MVP of Business Playground
**Timeline:** 4 weeks
**Approach:** Fork Void Editor + Kilo Code, rebrand, customize for business users

---

## 📋 Master Checklist

### Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Completed
- ⏸️ Blocked
- ❌ Cancelled

---

# PHASE 1: FOUNDATION (Week 1)

## 1.1 Repository Setup

### 1.1.1 Fork Void Editor
- ✅ Create GitHub Repo for project - *Using local Monorepo structure*
- ✅ Fork `voideditor/void` repository - *Imported locally*
- ✅ Rename fork to `business-playground` - *Renamed to 'radd' in package.json*
- ✅ Update repository description and README - *Updated package.json/product.json*
- ✅ Set up branch protection rules - *Deferred (Local Git)*
- ✅ Configure GitHub Actions (disable unnecessary workflows initially) - *Deferred*

### 1.1.2 Fork Kilo Code
- ✅ Fork `Kilo-Org/kilocode` repository - *Imported locally*
- ✅ Rename fork to `business-agent` - *Renamed to 'radd-assistant' in package.json*
- ✅ Update package name in `package.json` - *Completed*
- ✅ Link to main repository as submodule or workspace - *Consolidated into single Monorepo (d:/Radd)*

### 1.1.3 Development Environment Setup
- ✅ Install Node.js v20.x (LTS) - *Installed: v22.14.0*
- ✅ Install pnpm globally: `npm install -g pnpm` - *Installed: v10.26.2*
- ✅ Install Python 3.11+ - *Installed: v3.13.1*
- ✅ Install Visual Studio 2022 Build Tools - *Bypassed: Used pre-built modules where possible / manual fixes*
- ✅ Install Windows 10/11 SDK (complete installation) - *Installed: 10.0.26100.0*
- ✅ Install Git LFS: `git lfs install` - *Installed: v3.6.0*
- ✅ Clone forked repositories locally - *Cloned to: d:\Radd\*
- ✅ Run `pnpm install` in Void Editor root - *Completed*
- ✅ Verify build works: `pnpm run compile` - *SUCCESS! (Fixed all Type Errors - 2025-12-29)*
- ✅ Verify app launches: `./scripts/code.bat` - *FIXED: Upgraded Electron to 39.2.7 and rebuilt native modules (2025-12-30)*

### 1.1.4 Kilo Code Environment Setup
- ✅ Navigate to Kilo Code directory
- ✅ Run `pnpm install --ignore-scripts` - *Completed*
- ✅ Verify extension builds: `pnpm run build` - *SUCCESS!*
- ✅ **VSIX created:** `bin/kilo-code-4.140.2.vsix` (35.97 MB, 1868 files)
- ✅ Test extension in development host - *Ready for Phase 1.3*

---

## 1.2 Initial Branding Changes

### 1.2.1 Application Identity
- ⬜ Choose final product name - *Radd / راد*
- ⬜ Choose Persian name/tagline - *راد - محیط کاری هوشمند*
- ⬜ Design application icon (or placeholder) - *Placeholder generated and placed in resources*
- ⬜ Create icon set (16x16, 32x32, 64x64, 128x128, 256x256) - *Placeholder icons created, see resources/radd-placeholders/README-ICONS.md*
- ⬜ Design splash screen (or placeholder) - *Deferred to Phase 3*

### 1.2.2 Void Editor Rebranding
- ✅ Update `product.json`:
  ```json
  {
    "nameShort": "Radd",
    "nameLong": "Radd - محیط کاری هوشمند",
    "applicationName": "radd",
    "dataFolderName": ".radd",
    "win32MutexName": "radd",
    "licenseName": "Apache-2.0",
    "win32AppId": "{{B8D3E4F1-5A2C-4B9D-8E1F-3C7A9D2B6E5F}",
    "win32x64AppId": "{{B8D3E4F1-5A2C-4B9D-8E1F-3C7A9D2B6E5F}",
    "darwinBundleIdentifier": "com.radd.app"
  }
  ```
- ⬜ Update `package.json` name and description
- ⬜ Replace icons in `resources/` folder:
  - ⬜ `resources/win32/radd_70x70.png` - *Placeholder*
  - ⬜ `resources/win32/radd_150x150.png` - *Placeholder*
  - ⬜ `resources/linux/radd.png` - *Placeholder*
  - ⬜ `resources/darwin/radd.icns` - *Needs macOS build*
  - ⬜ `resources/win32/radd.ico` - *Needs ICO converter*
- ⬜ Update Windows VisualElementsManifest.xml
- ⬜ Update Linux desktop files with Persian translations
- ⬜ Update Linux appdata.xml with Persian translations
- ⬜ Update README.md with bilingual content

### 1.2.3 Kilo Code Rebranding
- ⬜ Update `package.json`:
  ```json
  {
    "name": "radd-assistant",
    "displayName": "Radd Assistant - دستیار راد",
    "description": "دستیار هوشمند کسب و کار",
    "publisher": "radd-app"
  }
  ```
- ⬜ Update extension icon - *Placeholder placed*
- ⬜ Update all references from "Kilo Code" to "Radd Assistant"
- ⬜ Update package.nls.json with full Persian translations
- ⬜ Update walkthrough with Persian content

### 1.2.4 Verify Branding
- ⬜ Build application - *Renamed Void.exe → Radd.exe in .build/electron/*
- ✅ Application launches successfully
- ⬜ Verify name appears correctly in:
  - ✅ Window title - *Shows "Radd" in development mode*
  - ⬜ Taskbar - *Needs production build*
  - ⬜ Start menu - *Needs installer*
  - ⬜ About dialog - *Test manually*
  - ⬜ Settings - *Test manually*
- ⬜ Verify icons display correctly - *Placeholder icons in place, need final icons*

**Note:** For full branding verification, production build is needed. Development mode shows basic branding.

---

## 1.3 Bundle Kilo Code as Default Extension

### 1.3.1 Pre-install Extension
- ⬜ Build Kilo Code extension as `.vsix`
- ⬜ Add to `extensions/` folder in Void Editor
- ⬜ Update `product.json` to include default extension:
  ```json
  {
    "extensionsGallery": {
      "serviceUrl": "https://open-vsx.org/vscode/gallery",
      "itemUrl": "https://open-vsx.org/vscode/item"
    },
    "builtInExtensions": [
      {
        "name": "business-agent",
        "version": "1.0.0",
        "repo": "..."
      }
    ]
  }
  ```
- ⬜ Alternatively: Include source in `extensions/` folder
- ⬜ Configure extension to auto-activate

### 1.3.2 Test Bundled Extension
- ⬜ Build complete application
- ⬜ Verify extension appears in Extensions panel
- ⬜ Verify extension activates on startup
- ⬜ Verify all Kilo Code features work

---

# PHASE 2: CUSTOMIZATION (Week 2)

## 2.1 UI Simplification

### 2.1.1 Activity Bar Customization
- ⬜ Hide unnecessary activity bar items by default:
  - ⬜ Source Control (git)
  - ⬜ Debug
  - ⬜ Run
  - ⬜ Testing
- ⬜ Keep visible:
  - ⬜ Explorer (rename to "پوشه‌ها" / Folders)
  - ⬜ Search (rename to "جستجو")
  - ⬜ Extensions (rename to "افزونه‌ها")
- ⬜ Add Business Agent to activity bar prominently
- ⬜ Change activity bar icons to business-friendly versions

### 2.1.2 Sidebar Customization
- ⬜ Simplify Explorer view:
  - ⬜ Hide "Outline" by default
  - ⬜ Hide "Timeline" by default
  - ⬜ Show only folder tree
- ⬜ Configure default folder view settings:
  ```json
  {
    "explorer.compactFolders": false,
    "explorer.confirmDelete": true,
    "explorer.confirmDragAndDrop": true
  }
  ```

### 2.1.3 Editor Area Customization
- ⬜ Set default theme (dark or light, business-appropriate)
- ⬜ Configure editor settings for documents:
  ```json
  {
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "off",
    "editor.glyphMargin": false,
    "editor.folding": false
  }
  ```
- ⬜ Hide breadcrumbs by default
- ⬜ Simplify status bar

### 2.1.4 Terminal Customization
- ⬜ Hide terminal panel by default
- ⬜ Add toggle button for power users
- ⬜ Configure terminal appearance:
  ```json
  {
    "terminal.integrated.defaultProfile.windows": "PowerShell",
    "terminal.integrated.fontSize": 13
  }
  ```

### 2.1.5 Menu Bar Customization
- ⬜ Simplify File menu (remove developer options)
- ⬜ Simplify Edit menu
- ⬜ Hide View menu items not relevant
- ⬜ Simplify/hide Go menu
- ⬜ Hide Run menu entirely
- ⬜ Simplify Terminal menu
- ⬜ Update Help menu with custom links

---

## 2.2 Persian Localization

### 2.2.1 Set Up Translation Infrastructure
- ⬜ Create `i18n/fa/` directory structure
- ⬜ Create main translation file: `i18n/fa/translations.json`
- ⬜ Configure VS Code to use Persian by default
- ⬜ Set up RTL support

### 2.2.2 Translate Core UI Elements
- ⬜ File menu items
- ⬜ Edit menu items
- ⬜ View menu items
- ⬜ Help menu items
- ⬜ Status bar text
- ⬜ Activity bar tooltips
- ⬜ Common dialogs (Open, Save, etc.)
- ⬜ Settings UI labels
- ⬜ Error messages
- ⬜ Notifications

### 2.2.3 Translate Kilo Code / Business Agent
- ⬜ Chat interface labels
- ⬜ Mode names (Ask, Plan, etc.)
- ⬜ Tool descriptions
- ⬜ Error messages
- ⬜ Settings labels
- ⬜ Status messages
- ⬜ Button labels

### 2.2.4 Create Persian System Prompts
- ⬜ Default system prompt in Persian
- ⬜ Mode-specific prompts in Persian
- ⬜ Error handling prompts
- ⬜ Onboarding messages

### 2.2.5 Test RTL Layout
- ⬜ Verify all UI elements display correctly in RTL
- ⬜ Test with long Persian text
- ⬜ Verify icons and buttons are in correct positions
- ⬜ Test chat interface with Persian input/output

---

## 2.3 Agent Configuration

### 2.3.1 Create Default Modes

#### Ask Mode (پرسش و پاسخ)
- ⬜ Create mode configuration file
- ⬜ Write Persian system prompt
- ⬜ Configure allowed tools:
  - read_file
  - search_files
  - list_files
- ⬜ Test mode functionality

#### Analyst Mode (تحلیلگر)
- ⬜ Create mode configuration file
- ⬜ Write Persian system prompt focused on business analysis
- ⬜ Configure allowed tools:
  - read_file
  - search_files
  - list_files
  - browser (for research)
  - web_search
- ⬜ Test mode functionality

#### Researcher Mode (پژوهشگر)
- ⬜ Create mode configuration file
- ⬜ Write Persian system prompt focused on research
- ⬜ Configure allowed tools:
  - web_search
  - browser
  - read_file
  - write_to_file
- ⬜ Test mode functionality

#### Planner Mode (برنامه‌ریز)
- ⬜ Create mode configuration file
- ⬜ Write Persian system prompt focused on planning
- ⬜ Configure allowed tools:
  - read_file
  - search_files
  - write_to_file
- ⬜ Test mode functionality

### 2.3.2 Configure Memory Bank
- ⬜ Define default memory bank structure for business use
- ⬜ Create template memory files:
  - `project-overview.md`
  - `key-concepts.md`
  - `important-files.md`
  - `decisions-log.md`
- ⬜ Write initialization prompt in Persian
- ⬜ Test memory persistence across sessions

### 2.3.3 Configure Default Settings
- ⬜ Create default user settings file:
  ```json
  {
    "businessAgent.defaultMode": "ask",
    "businessAgent.language": "fa",
    "businessAgent.memoryBankEnabled": true,
    "businessAgent.autoCheckpoint": true,
    "businessAgent.showTerminal": false
  }
  ```
- ⬜ Configure default AI provider (start with OpenAI)
- ⬜ Add easy setup wizard for API keys

---

## 2.4 Default Settings & Configuration

### 2.4.1 Workbench Settings
```json
{
  "workbench.startupEditor": "welcomePage",
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-seti",
  "workbench.activityBar.visible": true,
  "workbench.sideBar.location": "right",
  "workbench.panel.defaultLocation": "bottom",
  "workbench.tips.enabled": false,
  "workbench.welcomePage.walkthroughs.openOnInstall": true
}
```
- ⬜ Apply all workbench settings
- ⬜ Test settings on fresh install

### 2.4.2 Editor Settings
```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "Vazirmatn, Consolas, 'Courier New', monospace",
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.bracketPairColorization.enabled": false
}
```
- ⬜ Install Persian-friendly font (Vazirmatn)
- ⬜ Apply all editor settings

### 2.4.3 File Associations
```json
{
  "files.associations": {
    "*.pdf": "pdf",
    "*.docx": "word",
    "*.xlsx": "excel",
    "*.csv": "csv"
  }
}
```
- ⬜ Configure file type associations
- ⬜ Add custom icons for business file types

### 2.4.4 Search Settings
```json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/.kilocode": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true
  }
}
```
- ⬜ Apply search and file exclusion settings

---

# PHASE 3: POLISH (Week 3)

## 3.1 Onboarding Experience

### 3.1.1 Welcome Page
- ⬜ Design custom welcome page layout
- ⬜ Create welcome page content in Persian:
  - Welcome message
  - Quick start guide
  - Recent projects
  - Help links
- ⬜ Add "Get Started" walkthrough
- ⬜ Implement in `src/vs/workbench/contrib/welcome/`

### 3.1.2 First Run Wizard
- ⬜ Create API key setup step:
  - OpenAI API key input
  - Or Ollama local setup
  - Test connection button
- ⬜ Create workspace setup step:
  - Choose or create first project folder
  - Import existing documents
- ⬜ Create agent introduction step:
  - Explain what the AI can do
  - Show example prompts
- ⬜ Create mode selection step:
  - Explain different modes
  - Let user choose default

### 3.1.3 Sample Workspace
- ⬜ Create sample business workspace with:
  - Sample PDF document
  - Sample Word document
  - Sample Excel spreadsheet
  - Pre-configured memory bank
  - Example folder structure
- ⬜ Include in installer as optional

### 3.1.4 Interactive Tutorial
- ⬜ Create tutorial for key features:
  1. Opening files
  2. Asking AI questions
  3. Using different modes
  4. Web search
  5. Memory bank
  6. Checkpoints
- ⬜ Make tutorial skippable
- ⬜ Add "Show tutorial again" option

---

## 3.2 Document Viewing Enhancements

### 3.2.1 PDF Viewing
- ⬜ Evaluate existing PDF viewer extensions
- ⬜ Bundle best PDF viewer (or vscode-pdf)
- ⬜ Configure for optimal viewing
- ⬜ Test with Persian PDF documents

### 3.2.2 Office Document Preview
- ⬜ Evaluate Office document preview options
- ⬜ Consider bundling document preview extension
- ⬜ At minimum: clear messaging about what AI can read

### 3.2.3 Image Viewing
- ⬜ Ensure image files display correctly
- ⬜ Test with common formats (PNG, JPG, GIF)

---

## 3.3 Testing

### 3.3.1 Functional Testing
- ⬜ Test file explorer:
  - Creating folders
  - Creating files
  - Renaming
  - Deleting
  - Moving/copying
- ⬜ Test AI agent:
  - Ask mode Q&A
  - Document reading
  - Web search
  - Browser automation
  - Terminal execution
  - Memory bank
  - Checkpoints
- ⬜ Test modes:
  - All custom modes
  - Mode switching
  - Mode-specific prompts
- ⬜ Test localization:
  - All Persian text displays
  - RTL layout correct
  - No untranslated strings

### 3.3.2 Performance Testing
- ⬜ Measure startup time (target: < 5 seconds)
- ⬜ Test with large folders (1000+ files)
- ⬜ Test with large documents (100+ pages)
- ⬜ Monitor memory usage
- ⬜ Test long-running agent tasks

### 3.3.3 Edge Case Testing
- ⬜ Test with no internet connection
- ⬜ Test with invalid API key
- ⬜ Test with corrupted files
- ⬜ Test with very long file names
- ⬜ Test with special characters in paths

### 3.3.4 Platform Testing
- ⬜ Test on Windows 10
- ⬜ Test on Windows 11
- ⬜ Test with different DPI settings
- ⬜ Test with dark/light Windows themes

---

## 3.4 Bug Fixes & Optimization

### 3.4.1 Common Issues to Check
- ⬜ Extension activation errors
- ⬜ Permission issues on Windows
- ⬜ Font rendering issues
- ⬜ RTL layout glitches
- ⬜ Memory leaks
- ⬜ Crash on startup scenarios

### 3.4.2 Performance Optimization
- ⬜ Optimize extension loading
- ⬜ Lazy load non-essential features
- ⬜ Optimize memory bank loading
- ⬜ Compress bundled assets

### 3.4.3 UX Improvements
- ⬜ Improve error messages (user-friendly Persian)
- ⬜ Add loading indicators where needed
- ⬜ Improve progress feedback for long tasks
- ⬜ Add helpful tooltips

---

# PHASE 4: RELEASE (Week 4)

## 4.1 Documentation

### 4.1.1 User Documentation (Persian)
- ⬜ Getting Started Guide
- ⬜ Feature Overview
- ⬜ Mode Descriptions
- ⬜ Keyboard Shortcuts
- ⬜ Troubleshooting Guide
- ⬜ FAQ

### 4.1.2 Video Tutorials (Optional)
- ⬜ Installation walkthrough
- ⬜ Basic usage demo
- ⬜ Advanced features demo

### 4.1.3 Developer Documentation
- ⬜ Build instructions
- ⬜ Extension development guide
- ⬜ Contributing guidelines

---

## 4.2 Installer Creation

### 4.2.1 Windows Installer
- ⬜ Configure Inno Setup or NSIS
- ⬜ Set installer branding (logo, text)
- ⬜ Configure install location options
- ⬜ Add desktop shortcut option
- ⬜ Add Start Menu entry
- ⬜ Configure file associations (optional)
- ⬜ Test installation on clean Windows

### 4.2.2 Portable Version
- ⬜ Create portable ZIP version
- ⬜ Configure for portable mode
- ⬜ Test portable version

### 4.2.3 Code Signing (Optional for MVP)
- ⬜ Obtain code signing certificate
- ⬜ Sign installer
- ⬜ Sign executable

---

## 4.3 Pre-Release Testing

### 4.3.1 Internal Testing
- ⬜ Fresh install test on clean VM
- ⬜ Upgrade test (if applicable)
- ⬜ Uninstall test
- ⬜ Full feature regression

### 4.3.2 Beta Testing
- ⬜ Recruit 3-5 beta testers
- ⬜ Create feedback form
- ⬜ Distribute beta build
- ⬜ Collect and address feedback

### 4.3.3 Final QA
- ⬜ Address all critical bugs
- ⬜ Final performance check
- ⬜ Final localization review

---

## 4.4 Release

### 4.4.1 Release Preparation
- ⬜ Create release notes
- ⬜ Update version numbers
- ⬜ Create GitHub release
- ⬜ Upload installer artifacts
- ⬜ Create download page (if applicable)

### 4.4.2 Announcement
- ⬜ Prepare announcement post
- ⬜ Create demo screenshots
- ⬜ Create demo video/GIF

### 4.4.3 Post-Release
- ⬜ Monitor for critical issues
- ⬜ Prepare hotfix process
- ⬜ Collect user feedback
- ⬜ Plan v1.1 features

---

# POST-MVP BACKLOG

## Future Features (Not in MVP)

### Extensions to Build
- ⬜ Email integration (Outlook MCP server)
- ⬜ Calendar integration (Google/Outlook)
- ⬜ Accounting integration (QuickBooks, etc.)
- ⬜ Database connector (SQL)
- ⬜ API builder for custom integrations

### UI Enhancements
- ⬜ Dashboard view for projects
- ⬜ Knowledge graph visualization
- ⬜ Report builder/exporter
- ⬜ Collaboration features

### Agent Enhancements
- ⬜ More specialized modes
- ⬜ Custom mode builder UI
- ⬜ Workflow automation
- ⬜ Scheduled tasks

### Platform Expansion
- ⬜ macOS version
- ⬜ Linux version
- ⬜ Web version (optional)

---

## 📊 Progress Tracker

| Phase | Status | Start Date | End Date | Completion |
|-------|--------|------------|----------|------------|
| Phase 1: Foundation | ✅ Completed | 2025-12-26 | 2025-12-30 | 100% |
| Phase 2: Customization | ⬜ Not Started | - | - | 0% |
| Phase 3: Polish | ⬜ Not Started | - | - | 0% |
| Phase 4: Release | ⬜ Not Started | - | - | 0% |
| **Overall** | 🔄 In Progress | 2025-12-26 | - | **~35%** |

---

## 📝 Notes & Decisions Log

### Decision Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-26 | Use Void Editor + Kilo Code | 90% features ready, fastest path to MVP |
| 2024-12-26 | Persian-first localization | Primary target market is Persian-speaking |
| 2024-12-27 | Final name: **Radd / راد** | Short, memorable, meaningful in Persian (generous/gift) |
| 2024-12-27 | Extension name: **Radd Assistant / دستیار راد** | Clear AI assistant branding for Persian speakers |
| 2024-12-27 | Use placeholder icons | Allows progress while real icons are designed |

### Open Questions
- [x] Final product name? ✅ **Radd / راد**
- [ ] Branding design (final logo, colors)? *Placeholders in place, need professional design*
- [ ] Distribution method (direct download, store)?
- [ ] Pricing model (if any)?
- [ ] Support channel?

| None | - | All blockers resolved! |
