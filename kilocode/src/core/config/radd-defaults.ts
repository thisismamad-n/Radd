/**
 * Radd Assistant Default Configuration
 * 
 * This file contains default settings for the Radd business assistant.
 * These settings are optimized for Persian-speaking business users.
 */

import type { ModeConfig } from "@roo-code/types"
import { BUSINESS_MODES, DEFAULT_BUSINESS_MODE } from "../../shared/business-modes"

/**
 * Default settings for Radd Assistant
 */
export interface RaddDefaultSettings {
	/** Default mode when starting a new conversation */
	defaultMode: string
	/** Default language for responses */
	language: string
	/** Whether to show terminal by default */
	showTerminal: boolean
	/** Whether to enable auto-checkpoint */
	autoCheckpoint: boolean
	/** Whether to enable memory bank features */
	memoryBankEnabled: boolean
	/** Default AI provider */
	defaultProvider: string
}

/**
 * Default configuration values
 */
export const RADD_DEFAULTS: RaddDefaultSettings = {
	defaultMode: DEFAULT_BUSINESS_MODE,
	language: "fa",
	showTerminal: false,
	autoCheckpoint: true,
	memoryBankEnabled: true,
	defaultProvider: "openai", // Can be changed to "ollama" for local AI
}

/**
 * Memory Bank template structure for business projects
 */
export interface MemoryBankTemplate {
	filename: string
	title: string
	titlePersian: string
	description: string
	template: string
}

/**
 * Memory Bank templates for business use
 */
export const MEMORY_BANK_TEMPLATES: MemoryBankTemplate[] = [
	{
		filename: "project-overview.md",
		title: "Project Overview",
		titlePersian: "نمای کلی پروژه",
		description: "High-level overview of the project or workspace",
		template: `# نمای کلی پروژه
# Project Overview

## توضیحات / Description
<!-- توضیح کوتاه درباره این پروژه یا فضای کاری -->
<!-- Brief description of this project or workspace -->


## اهداف اصلی / Main Objectives
<!-- اهداف کلیدی که می‌خواهید به آنها برسید -->
<!-- Key goals you want to achieve -->

1. 
2. 
3. 

## ذینفعان / Stakeholders
<!-- افراد یا تیم‌های مرتبط با این پروژه -->
<!-- People or teams involved with this project -->

- 

## وضعیت فعلی / Current Status
<!-- وضعیت کنونی پروژه -->
<!-- Current state of the project -->


## یادداشت‌های مهم / Important Notes
<!-- هر نکته مهمی که دستیار باید بداند -->
<!-- Any important points the assistant should know -->

`,
	},
	{
		filename: "key-concepts.md",
		title: "Key Concepts",
		titlePersian: "مفاهیم کلیدی",
		description: "Important terms, concepts, and domain knowledge",
		template: `# مفاهیم کلیدی
# Key Concepts

## اصطلاحات تخصصی / Domain Terms
<!-- اصطلاحات خاص این حوزه کاری -->
<!-- Terms specific to this business domain -->

| اصطلاح | توضیح |
|--------|-------|
|        |       |

## مفاهیم مهم / Important Concepts
<!-- مفاهیمی که برای درک این پروژه ضروری هستند -->
<!-- Concepts essential for understanding this project -->

### 

## اختصارات / Abbreviations
<!-- اختصارات رایج در این پروژه -->
<!-- Common abbreviations used in this project -->

| اختصار | معنی |
|--------|------|
|        |      |

## منابع مرجع / Reference Sources
<!-- منابع معتبر برای اطلاعات بیشتر -->
<!-- Authoritative sources for more information -->

- 

`,
	},
	{
		filename: "important-files.md",
		title: "Important Files",
		titlePersian: "فایل‌های مهم",
		description: "Index of key files and their purposes",
		template: `# فایل‌های مهم
# Important Files

## ساختار پوشه‌ها / Folder Structure
<!-- توضیح ساختار اصلی پوشه‌ها -->
<!-- Explanation of main folder structure -->

\`\`\`
/
├── 
├── 
└── 
\`\`\`

## فایل‌های کلیدی / Key Files
<!-- فایل‌های مهم و کاربرد آنها -->
<!-- Important files and their purposes -->

| فایل | توضیح | آخرین بروزرسانی |
|------|-------|-----------------|
|      |       |                 |

## گزارش‌های دوره‌ای / Periodic Reports
<!-- گزارش‌هایی که به صورت منظم تولید می‌شوند -->
<!-- Reports that are generated regularly -->

- 

## الگوها / Templates
<!-- فایل‌های الگو برای استفاده مجدد -->
<!-- Template files for reuse -->

- 

`,
	},
	{
		filename: "decisions-log.md",
		title: "Decisions Log",
		titlePersian: "سوابق تصمیمات",
		description: "Record of important decisions and their rationale",
		template: `# سوابق تصمیمات
# Decisions Log

## تصمیمات اخیر / Recent Decisions

### [تاریخ] - [عنوان تصمیم]
<!-- Date - Decision Title -->

**زمینه / Context:**
<!-- چرا این تصمیم لازم بود؟ -->
<!-- Why was this decision needed? -->


**تصمیم / Decision:**
<!-- چه تصمیمی گرفته شد؟ -->
<!-- What was decided? -->


**دلایل / Rationale:**
<!-- چرا این گزینه انتخاب شد؟ -->
<!-- Why was this option chosen? -->


**پیامدها / Consequences:**
<!-- نتایج مورد انتظار -->
<!-- Expected outcomes -->


---

## الگوی ثبت تصمیم / Decision Template

\`\`\`markdown
### [تاریخ] - [عنوان]

**زمینه:**

**تصمیم:**

**دلایل:**

**پیامدها:**
\`\`\`

`,
	},
	{
		filename: "workflows.md",
		title: "Workflows",
		titlePersian: "فرآیندهای کاری",
		description: "Common workflows and procedures",
		template: `# فرآیندهای کاری
# Workflows

## فرآیندهای روزانه / Daily Workflows

### 


## فرآیندهای هفتگی / Weekly Workflows

### 


## فرآیندهای ماهانه / Monthly Workflows

### 


## چک‌لیست‌ها / Checklists

### چک‌لیست [نام]
- [ ] 
- [ ] 
- [ ] 

## نمودار فرآیند / Process Diagram

\`\`\`mermaid
flowchart TD
    A[شروع] --> B[مرحله ۱]
    B --> C{تصمیم}
    C -->|بله| D[مرحله ۲]
    C -->|خیر| E[مرحله ۳]
    D --> F[پایان]
    E --> F
\`\`\`

`,
	},
]

/**
 * Get memory bank initialization content
 */
export function getMemoryBankInitContent(): string {
	return `# حافظه پروژه - Memory Bank

این پوشه حاوی اطلاعات مهم پروژه است که دستیار راد از آن برای درک بهتر زمینه کاری شما استفاده می‌کند.

This folder contains important project information that Radd Assistant uses to better understand your work context.

## فایل‌های موجود / Available Files

${MEMORY_BANK_TEMPLATES.map(t => `- **${t.filename}**: ${t.titlePersian} / ${t.title}`).join('\n')}

## نحوه استفاده / How to Use

1. فایل‌های مورد نیاز را ویرایش کنید
2. اطلاعات پروژه خود را اضافه کنید
3. دستیار راد به صورت خودکار از این اطلاعات استفاده می‌کند

1. Edit the files you need
2. Add your project information
3. Radd Assistant will automatically use this information
`
}

/**
 * Mode-specific API configuration suggestions
 */
export const MODE_API_SUGGESTIONS: Record<string, { provider: string; model: string; reason: string }> = {
	ask: {
		provider: "openai",
		model: "gpt-4o-mini",
		reason: "Fast and cost-effective for Q&A tasks",
	},
	analyst: {
		provider: "openai",
		model: "gpt-4o",
		reason: "Strong analytical and reasoning capabilities",
	},
	researcher: {
		provider: "openai",
		model: "gpt-4o",
		reason: "Good at synthesizing information from multiple sources",
	},
	planner: {
		provider: "openai",
		model: "gpt-4o",
		reason: "Excellent at structured planning and organization",
	},
	writer: {
		provider: "anthropic",
		model: "claude-3-5-sonnet-20241022",
		reason: "Superior writing quality and style",
	},
}

export default RADD_DEFAULTS
