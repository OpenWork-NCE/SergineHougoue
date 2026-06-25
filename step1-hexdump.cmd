@echo off
setlocal
call "C:\Program Files\nodejs\nodevars.bat" >nul 2>&1
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\bin;%PATH%"
cd /d "C:\Users\AM\Documents\Workspace\DHC\immo"
echo === plan line 307 bytes ===
powershell -NoProfile -Command "$lines = Get-Content -Encoding UTF8 'docs\superpowers\plans\2026-06-24-sergine-hougoue-immo.md'; for ($i=306; $i -lt 310; $i++) { $line = $lines[$i]; $hex = ($line.ToCharArray() | ForEach-Object { '{0:X2}' -f [int]$_ }) -join ' '; Write-Output ('L' + ($i+1) + ': ' + $hex) }"
echo.
echo === readme line 1 bytes ===
powershell -NoProfile -Command "$lines = Get-Content -Encoding UTF8 'README.md'; for ($i=0; $i -lt 3; $i++) { $line = $lines[$i]; $hex = ($line.ToCharArray() | ForEach-Object { '{0:X2}' -f [int]$_ }) -join ' '; Write-Output ('L' + ($i+1) + ': ' + $hex) }"
endlocal
