@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === git status ===
git status
echo.
echo === git log -3 ===
git log --oneline -3
echo.
echo === dir listing ===
dir
endlocal
