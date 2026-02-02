# ============================================================
# Radd Complete Build Script
# ============================================================
# This script builds both Kilocode (AI Extension) and Void (Editor)
# Run from d:\Radd root directory
# ============================================================

param(
    [switch]$SkipKilocode,
    [switch]$SkipVoid,
    [switch]$CleanBuild,
    [switch]$RunAfterBuild
)

$ErrorActionPreference = "Stop"
$RootDir = $PSScriptRoot
$KilocodeDir = Join-Path $RootDir "kilocode"
$VoidDir = Join-Path $RootDir "void"
$ExtensionTarget = Join-Path $VoidDir "extensions\radd-assistant"

# Colors for output
function Write-Step { param($msg) Write-Host "`n========================================" -ForegroundColor Cyan; Write-Host "  $msg" -ForegroundColor Cyan; Write-Host "========================================" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[SUCCESS] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Yellow }
function Write-ErrorMsg { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Start timer
$totalTimer = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host @"

    ____            __    __
   / __ \____ _____/ /___/ /
  / /_/ / __ `/ __  / __  / 
 / _, _/ /_/ / /_/ / /_/ /  
/_/ |_|\__,_/\__,_/\__,_/   
                            
        Build System v1.0

"@ -ForegroundColor Magenta

Write-Host "Root Directory: $RootDir" -ForegroundColor Gray
Write-Host "Kilocode Directory: $KilocodeDir" -ForegroundColor Gray
Write-Host "Void Directory: $VoidDir" -ForegroundColor Gray
Write-Host ""

# ============================================================
# Pre-flight Checks
# ============================================================
Write-Step "Running Pre-flight Checks"

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-ErrorMsg "Node.js not found! Please install Node.js v20+"
    exit 1
}

# Check pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Success "pnpm found: $pnpmVersion"
} catch {
    Write-ErrorMsg "pnpm not found! Installing pnpm..."
    npm install -g pnpm
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm found: $npmVersion"
} catch {
    Write-ErrorMsg "npm not found! Please install Node.js"
    exit 1
}

# ============================================================
# Clean Build (Optional)
# ============================================================
if ($CleanBuild) {
    Write-Step "Cleaning Previous Build Artifacts"
    
    Write-Info "Cleaning Kilocode..."
    Set-Location $KilocodeDir
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue }
    if (Test-Path "bin") { Remove-Item -Recurse -Force "bin" -ErrorAction SilentlyContinue }
    if (Test-Path "bin-unpacked") { Remove-Item -Recurse -Force "bin-unpacked" -ErrorAction SilentlyContinue }
    if (Test-Path ".turbo") { Remove-Item -Recurse -Force ".turbo" -ErrorAction SilentlyContinue }
    
    Write-Info "Cleaning Void..."
    Set-Location $VoidDir
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue }
    if (Test-Path "out") { Remove-Item -Recurse -Force "out" -ErrorAction SilentlyContinue }
    
    Write-Success "Clean complete!"
}

# ============================================================
# PHASE 1: Build Kilocode (AI Extension)
# ============================================================
if (-not $SkipKilocode) {
    Write-Step "PHASE 1: Building Kilocode Extension"
    
    Set-Location $KilocodeDir
    
    # Step 1.1: Install dependencies
    Write-Info "Installing Kilocode dependencies..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    pnpm install
    if ($LASTEXITCODE -ne 0) { Write-ErrorMsg "pnpm install failed!"; exit 1 }
    $timer.Stop()
    Write-Success "Dependencies installed in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    
    # Step 1.2: Run linting (optional but recommended)
    Write-Info "Running type check..."
    pnpm check-types
    if ($LASTEXITCODE -ne 0) { 
        Write-ErrorMsg "Type check failed! Continuing anyway..."
    } else {
        Write-Success "Type check passed!"
    }
    
    # Step 1.3: Build the extension
    Write-Info "Building extension bundle..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    pnpm build
    if ($LASTEXITCODE -ne 0) { Write-ErrorMsg "pnpm build failed!"; exit 1 }
    $timer.Stop()
    Write-Success "Extension built in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    
    # Step 1.4: Find and unpack the VSIX
    Write-Info "Locating built VSIX file..."
    $vsixFile = Get-ChildItem -Path "bin" -Filter "*.vsix" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $vsixFile) {
        Write-ErrorMsg "No VSIX file found in bin/ directory!"
        exit 1
    }
    Write-Success "Found VSIX: $($vsixFile.Name)"
    
    # Step 1.5: Unpack VSIX for Void integration
    Write-Info "Unpacking VSIX..."
    if (Test-Path "bin-unpacked") { Remove-Item -Recurse -Force "bin-unpacked" }
    New-Item -ItemType Directory -Path "bin-unpacked" -Force | Out-Null
    
    # Use Expand-Archive for .vsix (it's just a zip)
    Expand-Archive -Path $vsixFile.FullName -DestinationPath "bin-unpacked" -Force
    Write-Success "VSIX unpacked to bin-unpacked/"
    
    # Step 1.6: Copy extension to Void
    Write-Info "Copying extension to Void..."
    $sourceExtension = Join-Path $KilocodeDir "bin-unpacked\extension"
    
    if (-not (Test-Path $sourceExtension)) {
        Write-ErrorMsg "Unpacked extension not found at $sourceExtension"
        exit 1
    }
    
    # Clear existing extension files (but keep the folder)
    if (Test-Path $ExtensionTarget) {
        Get-ChildItem -Path $ExtensionTarget -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    } else {
        New-Item -ItemType Directory -Path $ExtensionTarget -Force | Out-Null
    }
    
    # Copy new extension files
    Copy-Item -Path "$sourceExtension\*" -Destination $ExtensionTarget -Recurse -Force
    Write-Success "Extension copied to $ExtensionTarget"
    
} else {
    Write-Info "Skipping Kilocode build (--SkipKilocode flag set)"
}

# ============================================================
# PHASE 2: Build Void (Editor)
# ============================================================
if (-not $SkipVoid) {
    Write-Step "PHASE 2: Building Void Editor"
    
    Set-Location $VoidDir
    
    # Step 2.1: Install dependencies (with workaround for broken extensions)
    Write-Info "Installing Void dependencies..."
    Write-Info "Using --ignore-scripts to avoid broken extension dependencies..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    
    # First install without postinstall scripts (avoids broken simple-socks in open-remote-ssh)
    npm install --ignore-scripts
    if ($LASTEXITCODE -ne 0) { Write-ErrorMsg "npm install failed!"; exit 1 }
    
    # Manually run safe parts of postinstall
    Write-Info "Running filtered postinstall (skipping broken extensions)..."
    
    # Extensions to skip (have broken git dependencies)
    $SkipExtensions = @("open-remote-ssh", "open-remote-wsl")
    
    # Get all extension directories that need npm install
    $extensionDirs = @(
        Get-ChildItem -Path "extensions" -Directory | Where-Object { 
            (Test-Path (Join-Path $_.FullName "package.json")) -and 
            ($_.Name -notin $SkipExtensions)
        }
        Get-ChildItem -Path ".vscode/extensions" -Directory -ErrorAction SilentlyContinue | Where-Object { 
            Test-Path (Join-Path $_.FullName "package.json")
        }
    )
    
    foreach ($extDir in $extensionDirs) {
        $packageJson = Join-Path $extDir.FullName "package.json"
        $packageLock = Join-Path $extDir.FullName "package-lock.json"
        
        # Only run npm install if package.json has dependencies
        $pkg = Get-Content $packageJson -Raw | ConvertFrom-Json
        if ($pkg.dependencies -or $pkg.devDependencies) {
            Write-Host "  Installing deps for: $($extDir.Name)" -ForegroundColor Gray
            Push-Location $extDir.FullName
            npm install --no-audit --no-fund 2>&1 | Out-Null
            Pop-Location
        }
    }
    
    $timer.Stop()
    Write-Success "Dependencies installed in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    Write-Info "Note: Skipped extensions with broken deps: $($SkipExtensions -join ', ')"
    
    # Step 2.1.5: Download built-in extensions (One Dark Pro, Material Icon Theme)
    Write-Info "Downloading built-in extensions (themes)..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    npm run download-builtin-extensions
    if ($LASTEXITCODE -ne 0) { 
        Write-ErrorMsg "Download built-in extensions failed! Continuing anyway..."
    } else {
        Write-Success "Built-in extensions downloaded in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    }
    
    # Step 2.2: Build React UI (Sidebar/Dashboard)
    Write-Info "Building React UI..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    npm run buildreact
    if ($LASTEXITCODE -ne 0) { Write-ErrorMsg "React build failed!"; exit 1 }
    $timer.Stop()
    Write-Success "React UI built in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    
    # Step 2.3: Compile Electron App
    Write-Info "Compiling Electron application..."
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    npm run compile
    if ($LASTEXITCODE -ne 0) { Write-ErrorMsg "Compile failed!"; exit 1 }
    $timer.Stop()
    Write-Success "Electron app compiled in $([math]::Round($timer.Elapsed.TotalSeconds, 2))s"
    
} else {
    Write-Info "Skipping Void build (--SkipVoid flag set)"
}

# ============================================================
# Build Complete
# ============================================================
$totalTimer.Stop()
Set-Location $RootDir

Write-Host ""
Write-Step "BUILD COMPLETE!"
Write-Host ""
Write-Host "  Total build time: $([math]::Round($totalTimer.Elapsed.TotalMinutes, 2)) minutes" -ForegroundColor Green
Write-Host ""
Write-Host "  To run Radd:" -ForegroundColor Yellow
Write-Host "    cd void" -ForegroundColor White
Write-Host "    .\scripts\code.bat" -ForegroundColor White
Write-Host ""

# ============================================================
# Run After Build (Optional)
# ============================================================
if ($RunAfterBuild) {
    Write-Step "Launching Radd..."
    Set-Location $VoidDir
    & ".\scripts\code.bat"
}
