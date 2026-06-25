@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === npm install started at %date% %time% ===
npm install >install.log 2>&1
echo === npm install exit code: %errorlevel% ===
endlocal
