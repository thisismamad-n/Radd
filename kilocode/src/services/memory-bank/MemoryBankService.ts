/**
 * Memory Bank Service for Radd Assistant
 * 
 * Manages project memory/context files that help the AI assistant
 * understand the project better across sessions.
 */

import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs/promises"

import { MEMORY_BANK_TEMPLATES, getMemoryBankInitContent, type MemoryBankTemplate } from "../../core/config/radd-defaults"
import { fileExistsAtPath } from "../../utils/fs"
import { getWorkspacePath } from "../../utils/path"

const MEMORY_BANK_DIR = ".kilocode"
const MEMORY_BANK_SUBDIR = "memory-bank"

export class MemoryBankService {
	private workspacePath: string | undefined

	constructor() {
		this.workspacePath = getWorkspacePath()
	}

	/**
	 * Get the memory bank directory path
	 */
	getMemoryBankPath(): string | undefined {
		if (!this.workspacePath) {
			return undefined
		}
		return path.join(this.workspacePath, MEMORY_BANK_DIR, MEMORY_BANK_SUBDIR)
	}

	/**
	 * Check if memory bank exists
	 */
	async exists(): Promise<boolean> {
		const memoryBankPath = this.getMemoryBankPath()
		if (!memoryBankPath) {
			return false
		}
		return fileExistsAtPath(memoryBankPath)
	}

	/**
	 * Initialize memory bank with template files
	 */
	async initialize(): Promise<{ success: boolean; message: string }> {
		const memoryBankPath = this.getMemoryBankPath()
		if (!memoryBankPath) {
			return {
				success: false,
				message: "No workspace folder open",
			}
		}

		try {
			// Create memory bank directory
			await fs.mkdir(memoryBankPath, { recursive: true })

			// Create README file
			const readmePath = path.join(memoryBankPath, "README.md")
			if (!(await fileExistsAtPath(readmePath))) {
				await fs.writeFile(readmePath, getMemoryBankInitContent(), "utf-8")
			}

			// Create template files
			for (const template of MEMORY_BANK_TEMPLATES) {
				const filePath = path.join(memoryBankPath, template.filename)
				if (!(await fileExistsAtPath(filePath))) {
					await fs.writeFile(filePath, template.template, "utf-8")
				}
			}

			return {
				success: true,
				message: `Memory bank initialized at ${memoryBankPath}`,
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error)
			return {
				success: false,
				message: `Failed to initialize memory bank: ${errorMessage}`,
			}
		}
	}

	/**
	 * Get list of memory bank files
	 */
	async getFiles(): Promise<string[]> {
		const memoryBankPath = this.getMemoryBankPath()
		if (!memoryBankPath || !(await this.exists())) {
			return []
		}

		try {
			const files = await fs.readdir(memoryBankPath)
			return files.filter(f => f.endsWith(".md"))
		} catch {
			return []
		}
	}

	/**
	 * Read a memory bank file
	 */
	async readFile(filename: string): Promise<string | undefined> {
		const memoryBankPath = this.getMemoryBankPath()
		if (!memoryBankPath) {
			return undefined
		}

		const filePath = path.join(memoryBankPath, filename)
		try {
			return await fs.readFile(filePath, "utf-8")
		} catch {
			return undefined
		}
	}

	/**
	 * Write to a memory bank file
	 */
	async writeFile(filename: string, content: string): Promise<boolean> {
		const memoryBankPath = this.getMemoryBankPath()
		if (!memoryBankPath) {
			return false
		}

		// Ensure directory exists
		await fs.mkdir(memoryBankPath, { recursive: true })

		const filePath = path.join(memoryBankPath, filename)
		try {
			await fs.writeFile(filePath, content, "utf-8")
			return true
		} catch {
			return false
		}
	}

	/**
	 * Get all memory bank content as a single string for context
	 */
	async getAllContent(): Promise<string> {
		const files = await this.getFiles()
		if (files.length === 0) {
			return ""
		}

		const contents: string[] = []
		for (const file of files) {
			if (file === "README.md") continue // Skip README
			const content = await this.readFile(file)
			if (content && content.trim()) {
				contents.push(`## ${file}\n\n${content}`)
			}
		}

		if (contents.length === 0) {
			return ""
		}

		return `# Project Memory Bank\n\n${contents.join("\n\n---\n\n")}`
	}

	/**
	 * Get available templates
	 */
	getTemplates(): MemoryBankTemplate[] {
		return [...MEMORY_BANK_TEMPLATES]
	}

	/**
	 * Add a new memory bank file from template
	 */
	async addFromTemplate(templateFilename: string): Promise<boolean> {
		const template = MEMORY_BANK_TEMPLATES.find(t => t.filename === templateFilename)
		if (!template) {
			return false
		}

		return this.writeFile(template.filename, template.template)
	}
}

// Singleton instance
let memoryBankServiceInstance: MemoryBankService | undefined

export function getMemoryBankService(): MemoryBankService {
	if (!memoryBankServiceInstance) {
		memoryBankServiceInstance = new MemoryBankService()
	}
	return memoryBankServiceInstance
}

export function resetMemoryBankService(): void {
	memoryBankServiceInstance = undefined
}
