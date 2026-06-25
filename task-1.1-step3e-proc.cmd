@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
echo === full tasklist of node.exe ===
tasklist /V /FI "IMAGENAME eq node.exe" /FO LIST
endlocal
