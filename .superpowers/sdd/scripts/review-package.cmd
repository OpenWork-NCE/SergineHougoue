@echo off
REM scripts/review-package.cmd BASE HEAD [output-path]
REM Writes a single review package (commit list, diff stat, full diff) to a file.
REM Usage from subagent (after cd to project root):
REM   call scripts\review-package.cmd <BASE> <HEAD>
REM Default output: .superpowers\sdd\review-<base7>-<head7>.diff
setlocal
set "BASE=%~1"
set "HEAD=%~2"
if "%BASE%"=="" set "BASE=HEAD~1"
if "%HEAD%"=="" set "HEAD=HEAD"

for /f "delims=" %%a in ('git rev-parse --short %BASE%') do set "BASE7=%%a"
for /f "delims=" %%a in ('git rev-parse --short %HEAD%') do set "HEAD7=%%a"

set "OUT=%~3"
if "%OUT%"=="" set "OUT=.superpowers\sdd\review-%BASE7%-%HEAD7%.diff"

if not exist .superpowers\sdd mkdir .superpowers\sdd >nul 2>&1

>  "%OUT%" echo === COMMITS (%BASE%..%HEAD%) ===
>> "%OUT%" git log --oneline %BASE%..%HEAD%
>> "%OUT%" echo.
>> "%OUT%" echo === DIFFSTAT ===
>> "%OUT%" git diff --stat %BASE%..%HEAD%
>> "%OUT%" echo.
>> "%OUT%" echo === DIFF (context=10) ===
>> "%OUT%" git diff -U10 %BASE%..%HEAD%

echo Review package: %OUT%
endlocal