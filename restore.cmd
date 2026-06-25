@echo off
move .gitignore.stash-by-sdd .gitignore
move .run.cmd.stash-by-sdd .run.cmd
move branch.cmd.stash-by-sdd branch.cmd
echo Restored.
git status --short
endlocal