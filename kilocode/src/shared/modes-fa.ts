/**
 * Persian (Farsi) Mode Definitions for Radd Assistant
 * حالت‌های فارسی برای دستیار راد
 * 
 * NOTE: This file is deprecated. Use business-modes.ts instead.
 * The business modes have been redesigned with:
 * - English system prompts for optimal LLM performance
 * - Persian UI labels for user-facing text
 * - Proper tool group restrictions
 * - Mode-specific rules files
 * 
 * @deprecated Use BUSINESS_MODES from './business-modes' instead
 */

import type { ModeConfig } from "@roo-code/types"

// Re-export from business-modes for backward compatibility
export { BUSINESS_MODES as PERSIAN_BUSINESS_MODES, DEFAULT_BUSINESS_MODE } from "./business-modes"

// Legacy export - kept for backward compatibility
import { BUSINESS_MODES } from "./business-modes"
export default BUSINESS_MODES