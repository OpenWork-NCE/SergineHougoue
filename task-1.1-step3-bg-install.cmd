@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === launching npm install in background via PowerShell Start-Process ===
echo Timestamp: %date% %time%
powershell -NoProfile -Command "Start-Process -FilePath 'npm.cmd' -ArgumentList 'install' -WorkingDirectory 'C:\Users\AM\Documents\Workspace\DHC\immo' -RedirectStandardOutput 'install-stdout.log' -RedirectStandardError 'install-stderr.log' -NoNewWindow -PassThru | Select-Object Id" > install-pid.log 2>&1
type install-pid.log
echo === launched; check install logs periodically ===
endlocal
