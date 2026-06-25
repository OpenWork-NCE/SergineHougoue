@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === process tree (parent chain of PID 15232) ===
wmic process where "Name='node.exe'" get ProcessId,ParentProcessId,CommandLine /format:list 2>nul
echo.
echo === network connections by node ===
netstat -ano | findstr "15232 12736 13824" | findstr "ESTABLISHED"
echo.
echo === node_modules subdirs (top level) ===
if exist node_modules (dir /B node_modules | findstr /R /C:".") else (echo no node_modules)
echo.
echo === install.log size ===
if exist install.log (for %%I in (install.log) do echo size=%%~zI bytes) else (echo no install.log)
endlocal
