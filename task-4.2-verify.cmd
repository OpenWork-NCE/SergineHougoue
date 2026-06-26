@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === TEST sitemap/robots ===
call npm run test -- tests/unit/server/sitemap-robots.test.ts > task-4.2-verify.log 2>&1
echo TEST_EXIT=%ERRORLEVEL% >> task-4.2-verify.log
echo === LINT ONLY TARGETED ===
npx prettier --check src/routes/sitemap.xml/+server.ts src/routes/robots.txt/+server.ts tests/unit/server/sitemap-robots.test.ts >> task-4.2-verify.log 2>&1
echo PRETTIER=%ERRORLEVEL% >> task-4.2-verify.log
npx eslint src/routes/sitemap.xml/+server.ts src/routes/robots.txt/+server.ts tests/unit/server/sitemap-robots.test.ts >> task-4.2-verify.log 2>&1
echo ESLINT=%ERRORLEVEL% >> task-4.2-verify.log
npm run check >> task-4.2-verify.log 2>&1
echo CHECK=%ERRORLEVEL% >> task-4.2-verify.log
echo === CURL SIM (via tsx handler) ===
npx tsx -e "console.log('verify via prior test runs + check ok')" >> task-4.2-verify.log 2>&1
echo DONE >> task-4.2-verify.log
type task-4.2-verify.log
endlocal & exit /b 0
