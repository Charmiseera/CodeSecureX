@echo off
REM ─── SecureCodeAI Backend Startup Script (Windows) ───────────────────────
REM Run from the CodeSecureX/ root directory.
REM Before running: fill in NEBIUS_API_KEY in backend\.env

echo ─────────────────────────────────────────────────────────
echo  SecureCodeAI — Backend Startup
echo ─────────────────────────────────────────────────────────

REM If venv doesn't exist, create it and install deps
IF NOT EXIST "backend\venv\Scripts\python.exe" (
    echo [1/2] Creating virtual environment...
    python -m venv backend\venv
    echo [2/2] Installing dependencies...
    backend\venv\Scripts\pip install -r backend\requirements.txt
) ELSE (
    echo [OK] Virtual environment found.
)

echo.
echo Starting FastAPI server on http://localhost:8000
echo Swagger UI: http://localhost:8000/docs
echo.
echo NOTE: Set NEBIUS_API_KEY in backend\.env for real vulnerability scanning.
echo       Without it the server still works — returning demo data.
echo.

backend\venv\Scripts\uvicorn main:app --reload --port 8000 --app-dir backend
