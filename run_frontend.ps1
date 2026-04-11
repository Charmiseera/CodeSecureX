# ─── Run Frontend — SecureCodeAI ──────────────────────────────────────────────
# Run this script from the CodeSecureX/ root folder.

Write-Host "`n  SecureCodeAI — Frontend" -ForegroundColor Cyan
Write-Host "  Starting Next.js on http://localhost:3000`n" -ForegroundColor Green

Set-Location frontend
npm run dev
