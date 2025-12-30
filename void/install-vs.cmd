@echo off
REM Setup Visual Studio 2022 environment and install dependencies
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -no_logo

set GYP_MSVS_VERSION=2022

echo Installing pnpm dependencies...
pnpm install

echo.
echo Installation complete! You can now run: pnpm run compile
