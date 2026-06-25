@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === Branch ===
git branch --show-current
echo === Status ===
git status --short
echo === Tracked files ===
git ls-files
echo === Log ===
git log --oneline
endlocal