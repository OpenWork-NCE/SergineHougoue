@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo BEFORE-LOG
git rev-parse --abbrev-ref HEAD
echo MIDDLE-LOG
git status --short
echo AFTER-LOG
git log --oneline -3
echo END-OF-SCRIPT
endlocal
exit /b 0