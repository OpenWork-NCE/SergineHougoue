@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === running node processes ===
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
echo.
echo === last 30 lines of install.log ===
if exist install.log (
  powershell -NoProfile -Command "Get-Content -Path 'install.log' -Tail 30"
) else (
  echo no install.log yet
)
echo.
echo === node_modules present? ===
if exist node_modules (echo YES) else (echo NO)
echo.
echo === package-lock.json present? ===
if exist package-lock.json (echo YES) else (echo NO)
endlocal
