@echo off
setlocal
echo === port 5173 check ===
netstat -ano | findstr ":5173"
echo.
echo === port 3000 check ===
netstat -ano | findstr ":3000"
endlocal
