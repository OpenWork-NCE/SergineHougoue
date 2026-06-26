@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
npx prettier --check src/routes/sitemap.xml/+server.ts src/routes/robots.txt/+server.ts tests/unit/server/sitemap-robots.test.ts > task-4.2-lint-only.log 2>&1
set PRETTIER=%ERRORLEVEL%
npx eslint src/routes/sitemap.xml/+server.ts src/routes/robots.txt/+server.ts tests/unit/server/sitemap-robots.test.ts >> task-4.2-lint-only.log 2>&1
set ESLINT=%ERRORLEVEL%
npm run check >> task-4.2-lint-only.log 2>&1
set CHECK=%ERRORLEVEL%
echo PRETTIER=%PRETTIER% ESLINT=%ESLINT% CHECK=%CHECK% >> task-4.2-lint-only.log
endlocal & exit /b %CHECK%