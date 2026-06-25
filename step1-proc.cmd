@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
echo === node.exe processes ===
tasklist /V /FI "IMAGENAME eq node.exe" /FO LIST
echo.
echo === npm.cmd processes ===
tasklist /V /FI "IMAGENAME eq npm.cmd" /FO LIST
echo.
echo === cmd.exe processes ===
tasklist /V /FI "IMAGENAME eq cmd.exe" /FO LIST
endlocal
