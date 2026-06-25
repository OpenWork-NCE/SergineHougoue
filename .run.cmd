@echo off
REM .run.cmd - reusable shell shim for SDD subagents
REM Sets PATH (node + git), cd's to project root, prints diagnostics.
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === Environment ===
echo CWD: %CD%
git --version
node --version
npm --version
echo === Repo state ===
git rev-parse --abbrev-ref HEAD
git status --short
git log --oneline -3
endlocal