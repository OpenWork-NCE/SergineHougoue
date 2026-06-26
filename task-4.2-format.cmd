@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
npm run format > task-4.2-format.log 2>&1
endlocal & exit /b %ERRORLEVEL%