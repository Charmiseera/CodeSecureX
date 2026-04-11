Write-Host "`n  SecureCodeAI — Backend" -ForegroundColor Cyan
Write-Host "  Reads config from: backend\.env`n" -ForegroundColor DarkGray

if (-not (Test-Path "backend\venv\Scripts\python.exe")) {
    Write-Host "[Setup] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv backend\venv
    Write-Host "[Setup] Installing dependencies..." -ForegroundColor Yellow
    backend\venv\Scripts\pip install -r backend\requirements.txt --quiet
}

Write-Host "  Starting FastAPI on http://localhost:8000" -ForegroundColor Green
Write-Host "  Swagger UI: http://localhost:8000/docs`n" -ForegroundColor Green

backend\venv\Scripts\uvicorn main:app --reload --port 8000 --app-dir backend
