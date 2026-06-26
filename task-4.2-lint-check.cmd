@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
npm run lint > task-4.2-lint.log 2>&1
set LINT_EXIT=%ERRORLEVEL%
npm run check > task-4.2-check.log 2>&1
set CHECK_EXIT=%ERRORLEVEL%
echo LINT_EXIT=%LINT_EXIT% > task-4.2-lint-check.log
echo CHECK_EXIT=%CHECK_EXIT% >> task-4.2-lint-check.log
endlocal & exit /b %CHECK_EXIT%