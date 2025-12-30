# 🔧 Void Editor Build Errors - Fixed!

**Last Updated:** 2025-12-27 10:50

---

## ❌ Problems Encountered

### Error 1: Missing `out/main.js`
```
Error launching app  
Unable to find Electron app at D:\Radd\void
Cannot find module 'D:\Radd\void\out\main.js'
```

### Error 2: Missing Native Module `@vscode/policy-watcher`
```
Error: Could not locate the bindings file. Tried:
 × D:\Radd\void\node_modules\.pnpm\@vscode+policy-watcher@1.3.5\...
```

---

## ✅ Root Cause

The issue was that **`pnpm run compile` doesn't compile everything needed to run the Electron app**. Specifically:

1. **`src/main.ts`** wasn't compiled to `out/main.js`
2. Some native modules weren't fully built
3. The entry point for the Electron app was missing

---

## ✅ SOLUTION

### Method 1: Run `preLaunch.js` (Quickest)

This is what `code.bat` does automatically:

```powershell
cd d:\Radd\void
node build/lib/preLaunch.js
```

**What this does:**
- Downloads/verifies Electron
- Compiles `src/main.ts` to `out/main.js` 
- Syncs built-in extensions
- Ensures everything is ready to launch

**Then launch:**
```powershell
.\scripts\code.bat
```

### Method 2: Full Rebuild (Most Complete)

If you're still having issues:

```powershell
cd d:\Radd\void

# 1. Clean previous build
pnpm run gulp -- clean

# 2. Rebuild native modules
pnpm rebuild

# 3. Full compile
pnpm run compile

# 4. Run preLaunch
node build/lib/preLaunch.js

# 5. Launch
.\scripts\code.bat
```

---

## 🎯 Understanding the Build Process

### Build Stages

| Stage | Script | What It Does |
|-------|--------|--------------|
| **1. Dependencies** | `pnpm install` | Installs all packages |
| **2. Native Modules** | `pnpm rebuild` | Builds C++/native modules |
| **3. TypeScript Compile** | `pnpm run compile` | Compiles `src/` to `out/` |
| **4. Pre-Launch** | `node build/lib/preLaunch.js` | Final prep for Electron |
| **5. Launch** | `.\scripts\code.bat` | Runs the Electron app |

### Why `pnpm run compile` Isn't Enough

`pnpm run compile` runs the `compile` gulp task which:
- ✅ Compiles most TypeScript in `src/vs/`
- ✅ Compiles extensions
- ❌ **Does NOT compile `src/main.ts`** (Electron entry point)
- ❌ **Does NOT download Electron**
- ❌ **Does NOT verify all native modules**

The `build/lib/preLaunch.js` script handles the missing pieces.

---

## 🔄 Correct Development Workflow

### First Time Setup
```powershell
cd d:\Radd\void

# 1. Install dependencies
pnpm install

# 2. Compile everything
pnpm run compile

# 3. Run preLaunch (creates main.js, gets Electron)
node build/lib/preLaunch.js

# 4. Launch Void Editor
.\scripts\code.bat
```

### Daily Development

**Option A: Just Run (Simplest)**
```powershell
.\scripts\code.bat
```
This automatically runs `preLaunch.js` for you!

**Option B: Watch Mode (For Active Development)**

Terminal 1 - Watch & Compile:
```powershell
pnpm run watch
```

Terminal 2 - Launch:
```powershell
$env:VSCODE_SKIP_PRELAUNCH = "1"  # Skip pre-launch since watch handles it
.\scripts\code.bat
```

---

## 📝 What Files Are Created

After a successful build:

```
d:\Radd\void\
├── .build\
│   └── electron\                # Downloaded Electron binaries
│       └── Code - OSS.exe      # The Electron executable
├── out\
│   ├── main.js                 # 🔑 Entry point (was missing!)
│   ├── main.js.map
│   ├── bootstrap-esm.js
│   ├── bootstrap-meta.js
│   ├── bootstrap-node.js
│   ├── nls.messages.json
│   └── vs\                     # All the compiled VS Code source
│       ├── base\
│       ├── code\
│       ├── editor\
│       ├── platform\
│       └── workbench\
└── extensions\                  # Compiled built-in extensions
```

---

## 🐛 Debugging Tips

### Check if `main.js` exists
```powershell
Test-Path d:\Radd\void\out\main.js
```
Should return `True`

### Check if Electron was downloaded
```powershell
Test-Path "d:\Radd\void\.build\electron\Code - OSS.exe"
```
Should return `True`

### View what `code.bat` does
It runs these steps:
1. Runs `node build/lib/preLaunch.js` (unless `VSCODE_SKIP_PRELAUNCH` is set)
2. Finds the Electron executable in `.build/electron/`
3. Launches Electron with the current directory as the app root

### If it Still Fails

1. **Check you're in the right directory:**
   ```powershell
   pwd  # Should be d:\Radd\void
   ```

2. **Verify Node version:**
   ```powershell
   node --version  # Should be v20.x or v22.x
   ```

3. **Check for errors in compile:**
   ```powershell
   pnpm run compile 2>&1 | Select-String "error"
   ```

4. **Nuclear option - Full clean rebuild:**
   ```powershell
   # Delete build artifacts
   Remove-Item out -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item .build -Recurse -Force -ErrorAction SilentlyContinue
   
   # Rebuild
   pnpm run compile
   node build/lib/preLaunch.js
   .\scripts\code.bat
   ```

---

## ✅ Verification Checklist

After fixing, you should be able to:

- ✅ Run `.\scripts\code.bat` without errors
- ✅ See Void Editor window open
- ✅ Window title shows "Code - OSS Development"
- ✅ File > Open Folder works
- ✅ Extensions panel loads

---

## 🎯 Summary

**Problem:** `pnpm run compile` doesn't create `out/main.js` or download Electron

**Solution:** Always run `node build/lib/preLaunch.js` before first launch, or just use `.\scripts\code.bat` which does it automatically

**Best Practice:** Use `.\scripts\code.bat` for launching - it handles everything!

---

**Status:** ✅ Issue resolved - `main.js` created, Void Editor launching successfully!
