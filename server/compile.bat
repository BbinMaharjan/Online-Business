@echo off
cd "C:\MyWork\Other\MyGitRepositorie\onlineBusiness\workspace"
npx tsc --noEmit 2>typescript-errors.txt
if exist typescript-errors.txt (
    type typescript-errors.txt
    del typescript-errors.txt
)