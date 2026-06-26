@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
npm run test -- tests/unit/server/sitemap-robots.test.ts > task-4.2-test-red.log 2>&1
endlocal & exit /b %ERRORLEVEL%