# ─── Run Frontend — SecureCodeAI ──────────────────────────────────────────────
# Run this script from the CodeSecureX/ root folder.

Write-Host ""
Write-Host "  SecureCodeAI — Frontend" -ForegroundColor Cyan
Write-Host "  Starting Next.js on http://localhost:3000" -ForegroundColor Green
Write-Host ""

Set-Location frontend
npm run dev
