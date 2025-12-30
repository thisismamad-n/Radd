# 📋 Business Playground - Project Context Document

## Project Overview

**Project Name:** Business Playground (working title)
**Type:** Windows Desktop Application
**Base Technology:** Void Editor (VS Code Fork) + Kilo Code (AI Agent Extension)
**Target Users:** Business professionals, analysts, managers, and teams who need AI-powered document analysis and automation

---

## 🎯 Vision Statement

Create an **AI-powered business workspace for Windows** where companies can:
- Organize their business data in folders (like a file system)
- Have an AI agent that understands and can access ALL their data
- Ask questions and get intelligent answers with citations
- Automate research, analysis, and reporting tasks
- Execute long-running workflows with checkpointing
- Extend capabilities through plugins/extensions

**Think of it as:** "VS Code for business data, with an AI that never forgets"

---

## 🏗️ Technical Foundation

### Base Projects

| Project | Repository | License | Purpose |
|---------|------------|---------|---------|
| **Void Editor** | `voideditor/void` | Apache 2.0 | VS Code fork - provides the desktop shell, file explorer, terminal, extension system |
| **Kilo Code** | `Kilo-Org/kilocode` | Apache 2.0 | AI agent extension - provides RAG, memory, checkpoints, web search, browser automation |

### Why These Projects?

1. **Void Editor** is an open-source VS Code fork specifically designed for AI integration
2. **Kilo Code** is the most feature-complete agentic AI extension, combining best features from Cline, Roo Code, and more
3. Both are Apache 2.0 licensed - full commercial rights
4. Together they provide ~90% of required features out of the box

---

## 🎨 Product Concept

### User Experience Vision

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📁 BUSINESS PLAYGROUND                                    ─ □ ✕       │
├──────────────┬──────────────────────────────────┬───────────────────────┤
│              │                                  │                       │
│  EXPLORER    │         MAIN PANEL               │     AI ASSISTANT      │
│              │                                  │                       │
│  📁 Projects │  ┌─────────────────────────────┐ │  ┌─────────────────┐  │
│  ├─📁 Acme   │  │                             │ │  │ 🤖 حالت: تحلیل  │  │
│  │ ├─📄 Q4   │  │    Document Viewer          │ │  │                 │  │
│  │ ├─📊 Sales│  │    or                       │ │  │ سلام! من دستیار│  │
│  │ └─📋 Plan │  │    Task Dashboard           │ │  │ کسب و کار شما  │  │
│  ├─📁 Beta   │  │                             │ │  │ هستم. چطور     │  │
│  │ └─...     │  │                             │ │  │ کمکتان کنم؟    │  │
│  │           │  │                             │ │  │                 │  │
│  📁 Knowledge│  └─────────────────────────────┘ │  │ ───────────────│  │
│  ├─📄 Policies                                  │  │                 │  │
│  └─📄 SOPs   │  ┌─────────────────────────────┐ │  │ سوال خود را    │  │
│              │  │                             │ │  │ بنویسید...     │  │
│  🔍 Search   │  │    Terminal (hidden by      │ │  │                 │  │
│              │  │    default, power users)    │ │  │ [ارسال]        │  │
│              │  │                             │ │  │                 │  │
│              │  └─────────────────────────────┘ │  └─────────────────┘  │
│              │                                  │                       │
├──────────────┴──────────────────────────────────┴───────────────────────┤
│  📊 Status: آماده  |  🧠 Memory: فعال  |  ⏳ Tasks: 0  |  🔌 Connected  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key UI Principles

1. **Simple by default** - Hide developer/technical features
2. **Persian interface** - All UI text in Farsi
3. **Business-focused** - Icons, labels, and metaphors for business users
4. **AI-first** - Agent panel always visible and accessible
5. **Folder-centric** - Projects organized as folders, not code repositories

---

## 🔧 Features Breakdown

### Core Features (From Kilo Code - Ready to Use)

| Feature | Technical Implementation | User-Facing Name |
|---------|-------------------------|------------------|
| Semantic Search | Codebase indexing with embeddings | "جستجوی هوشمند" |
| Memory Bank | Markdown files in `.kilocode/` | "حافظه پروژه" |
| Checkpointing | Shadow Git repository | "ذخیره خودکار" |
| Plan Mode | Architect mode | "حالت برنامه‌ریزی" |
| Long-running Tasks | Cloud Agents + Sessions | "وظایف بلندمدت" |
| Web Search | MCP server | "جستجوی اینترنت" |
| Web Scraping | Browser automation (Puppeteer) | "استخراج داده وب" |
| Terminal | PowerShell/CMD integration | "خط فرمان" |
| PDF Parsing | read_file tool | "خواندن PDF" |
| Word Parsing | read_file tool | "خواندن Word" |
| Excel Parsing | read_file tool | "خواندن Excel" |

### Agent Modes (To Configure)

| Mode | Persian Name | Purpose |
|------|--------------|---------|
| Ask | پرسش و پاسخ | Simple Q&A on documents |
| Analyst | تحلیلگر | Business analysis and insights |
| Researcher | پژوهشگر | Web research and synthesis |
| Planner | برنامه‌ریز | Create plans and strategies |
| Writer | نویسنده | Create reports and documents |
| Custom | سفارشی | User-defined modes |

### Extension Capabilities (MCP Servers)

| Extension Type | Status | Priority |
|----------------|--------|----------|
| File System | ✅ Built-in | - |
| Web Browser | ✅ Built-in | - |
| Web Search | ✅ Available | MVP |
| Terminal | ✅ Built-in | - |
| Email (Outlook) | ⏳ To build | Post-MVP |
| Calendar | ⏳ To build | Post-MVP |
| Accounting | ⏳ To build | Post-MVP |
| Database SQL | 🟢 Available | Post-MVP |

---

## 🌍 Localization Strategy

### Persian (Farsi) First

All user-facing text will be in Persian:
- Menu items
- Button labels
- Tooltips
- Error messages
- AI assistant responses
- Documentation

### RTL Support

- VS Code already has RTL support
- Ensure all custom UI respects RTL
- Test thoroughly with Persian content

### Translation Approach

1. Create translation files for all strings
2. Use VS Code's i18n system
3. Default to Persian, English as fallback

---

## 🎯 Target User Personas

### Persona 1: کارشناس مالی (Financial Analyst)

- **Name:** سارا احمدی
- **Role:** Senior Financial Analyst
- **Needs:** Analyze financial reports, create summaries, compare data
- **Pain Points:** Manual data extraction, repetitive report generation
- **How We Help:** AI reads all financial docs, answers questions, generates reports

### Persona 2: مدیر پروژه (Project Manager)

- **Name:** علی محمدی
- **Role:** Project Manager
- **Needs:** Track project docs, find information quickly, create status reports
- **Pain Points:** Information scattered across files, hard to find history
- **How We Help:** Centralized knowledge base, instant search, auto-summaries

### Persona 3: مشاور کسب و کار (Business Consultant)

- **Name:** مریم کریمی
- **Role:** Independent Consultant
- **Needs:** Research companies, analyze markets, prepare presentations
- **Pain Points:** Time-consuming research, manual synthesis
- **How We Help:** Web research + document analysis + report generation

---

## 📊 Success Metrics

### MVP Success Criteria

| Metric | Target |
|--------|--------|
| Time to first AI response | < 30 seconds after install |
| PDF text extraction accuracy | > 95% |
| Memory persistence across sessions | 100% |
| Agent task completion rate | > 80% |
| Application crash rate | < 1% |
| App startup time | < 5 seconds |

### User Satisfaction Goals

- Users can ask questions about their documents without training
- AI remembers context from previous sessions
- Long-running tasks can be paused and resumed
- Extensions are easy to install and configure

---

## 🔐 Security & Privacy Considerations

### Data Privacy

| Aspect | Approach |
|--------|----------|
| Document Storage | 100% local on user's machine |
| AI API Keys | Encrypted local storage |
| Memory Bank | Local files, not synced |
| Checkpoints | Local shadow Git, not remote |

### Network Security

| Feature | Implementation |
|---------|----------------|
| AI Providers | User chooses (local Ollama or cloud) |
| Web Requests | User-initiated only |
| Extension Downloads | Signed packages preferred |
| Updates | Optional, user-controlled |

### User Control

- Users can delete all AI data with one click
- Transparent about what data goes to AI providers
- Option to use fully local AI (Ollama)

---

## 🛠️ Development Environment

### Required Tools

```
- Git (with Git LFS)
- Node.js v20.x
- Python 3.11+ (for build scripts)
- pnpm (package manager)
- Visual Studio 2022 Build Tools (for native modules)
- Windows 10/11 SDK
```

### Repository Structure

```
business-playground/
├── .github/                    # GitHub workflows
├── build/                      # Build scripts and configs
├── extensions/
│   └── business-agent/         # Modified Kilo Code
├── resources/                  # Icons, logos, branding
├── src/
│   └── vs/                     # VS Code source (modified)
├── i18n/
│   └── fa/                     # Persian translations
├── docs/                       # Documentation
├── product.json                # Product configuration
├── package.json
└── README.md
```

---

## 📅 Project Timeline

### Phase 1: Foundation (Week 1)
- Fork repositories
- Set up development environment
- Verify builds work
- Initial rebranding

### Phase 2: Customization (Week 2)
- UI simplification
- Persian localization
- Agent mode configuration
- Default settings

### Phase 3: Polish (Week 3)
- Onboarding flow
- Testing
- Bug fixes
- Performance optimization

### Phase 4: Release (Week 4)
- Documentation
- Installer creation
- Beta testing
- Initial release

---

## 🔗 Related Documents

- `business-playground-analysis.md` - Technical analysis
- `options-comparison.md` - Framework comparison
- `void-kilocode-gap-analysis.md` - Gap analysis
- `todo-list.md` - Detailed implementation tasks

---

## 📝 Naming & Branding (To Decide)

### Potential Names

| Option | Persian | Notes |
|--------|---------|-------|
| Business Playground | زمین بازی کسب و کار | Current working title |
| BizHub | بیزهاب | Short, modern |
| DataDesk | میز داده | Descriptive |
| KnowledgeBase | پایگاه دانش | Clear purpose |
| WorkMind | ذهن کار | AI-focused |

### Branding Elements Needed

- [ ] Application name (final)
- [ ] Logo design
- [ ] Icon set (application, file types)
- [ ] Color palette
- [ ] Splash screen
- [ ] Welcome graphics
