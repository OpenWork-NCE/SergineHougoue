@echo off
REM Create the feat/phase-1-foundation branch
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === Before branch creation ===
git branch --show-current
git status --short
echo === Creating branch ===
git checkout -b feat/phase-1-foundation
echo === After branch creation ===
git branch --show-current
git status --short
git log --oneline -3
endlocal