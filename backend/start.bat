@echo off
echo Starting CodeSecureX Backend...
echo.

REM Use exact Python path that has all packages installed
set PYTHON=C:\Users\navya\AppData\Local\Programs\Python\Python314\python.exe

echo [OK] Using Python: && %PYTHON% --version
echo.

REM Start uvicorn via python -m (guarantees correct interpreter)
%PYTHON% -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

pause
