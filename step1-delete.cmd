@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
del /F /Q "task-1.1-step3-install.cmd" 2>nul
del /F /Q "task-1.1-step3b-check.cmd" 2>nul
del /F /Q "task-1.1-step3c-waitcheck.cmd" 2>nul
del /F /Q "task-1.1-step3d-deepcheck.cmd" 2>nul
del /F /Q "task-1.1-step3e-proc.cmd" 2>nul
del /F /Q "task-1.1-step3f-kill.cmd" 2>nul
del /F /Q "01-branch.cmd" 2>nul
del /F /Q "probe.cmd" 2>nul
del /F /Q "restore.cmd" 2>nul
del /F /Q "status.cmd" 2>nul
del /F /Q "status-check.cmd" 2>nul
del /F /Q "wait-25s.cmd" 2>nul
del /F /Q "wait-30s.cmd" 2>nul
del /F /Q "install.log" 2>nul
endlocal
