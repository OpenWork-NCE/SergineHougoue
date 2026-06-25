@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === root listing ===
dir /B
echo === src listing (if any) ===
dir /B src 2>nul
echo === node_modules size ===
if exist node_modules (
  echo node_modules EXISTS
  dir /B node_modules | find /C "" 
) else (
  echo node_modules does NOT exist
)
endlocal
