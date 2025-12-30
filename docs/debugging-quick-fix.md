# 🐛 Debugging Quick Fix - F5 Issue

## Problem
When pressing F5, you see: **"You don't have an extension for debugging 'JSON with Comments'"**

## Cause
You have `launch.json` (or another JSON/non-code file) active/focused when pressing F5. VS Code tries to debug that file instead of running your launch configuration.

## ✅ Solutions

### Solution 1: Close the JSON File (Quickest)
1. Close the `launch.json` tab
2. Press **F5** again
3. ✅ Void Editor should launch

### Solution 2: Use Run and Debug Panel (Most Reliable)
1. Press **Ctrl+Shift+D** (or click Run and Debug icon on left)
2. At the top, select **"VS Code"** from dropdown
3. Click the **green play button** ▶️
4. ✅ Void Editor launches with full debugging

### Solution 3: Switch to a Code File First
1. Open any `.ts` file in `src/` (e.g., `src/vs/code/electron-main/main.ts`)
2. Make sure that tab is active
3. Press **F5**
4. ✅ Launch configuration runs

---

## 🎯 Recommended Launch Configurations

| Configuration | Purpose | When to Use |
|--------------|---------|-------------|
| **"VS Code"** | Full debugging (all processes) | **Recommended for most debugging** |
| "Launch VS Code Internal" | Quick launch without full debug | Testing without debugging |
| "Main Process" | Debug Electron main only | Debugging native/main process issues |

---

## 🚀 Quick Launch Commands (No F5 Needed)

If you just want to run Void Editor without debugging:

```powershell
cd d:\Radd\void
.\scripts\code.bat
```

This launches instantly without needing VS Code's debugger.

---

## ✅ Best Practice

**Always make sure a TypeScript file is active before pressing F5**, or use the Run and Debug panel dropdown to explicitly select your configuration.
