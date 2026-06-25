@echo off
REM scripts/task-brief.cmd PLAN_FILE TASK_NUMBER
REM Extracts a task section to a brief file. Usage:
REM   call scripts\task-brief.cmd docs\superpowers\plans\2026-06-24-sergine-hougoue-immo.md 1.1
setlocal
set "PLAN=%~1"
set "TASK=%~2"
if "%TASK%"=="" (
  echo Usage: task-brief.cmd PLAN_FILE TASK_NUMBER
  exit /b 1
)
set "OUT=.superpowers\sdd\task-%TASK%-brief.md"

REM Find start line of "## Task %TASK%"
set "START="
for /f "delims=" %%a in ('findstr /N /R /C:"^## Task %TASK%:" "%PLAN%"') do (
  set "LINE=%%a"
  for /f "tokens=1 delims=:" %%n in ("%%a") do set "START=%%n"
)
if "%START%"=="" (
  echo Task %TASK% not found in %PLAN%
  exit /b 1
)

REM Find next "## Task" line after start
set "END="
for /f "delims=" %%b in ('findstr /N /R /C:"^## Task " "%PLAN%"') do (
  for /f "tokens=1 delims=:" %%m in ("%%b") do (
    if %%m gtr %START% if "%END%"=="" set "END=%%m"
  )
)
if "%END%"=="" set "END=99999"

REM Write header to brief, then extract lines
>  "%OUT%" echo # Task %TASK% brief (auto-generated)
>> "%OUT%" echo.
>> "%OUT%" echo Source: %PLAN% lines %START%-end
>> "%OUT%" echo.
>> "%OUT%" echo --- BEGIN PLAN EXCERPT ---
set /a END-=1
(for /f "skip=%START% tokens=1* delims=:" %%a in ('findstr /N /R "^" "%PLAN%"') do (
  set /a "LINENO=%%a" >nul
  if !LINENO! lss %END% if !LINENO! geq %START% echo(%%b
)) >> "%OUT%"

echo Brief written: %OUT%
endlocal