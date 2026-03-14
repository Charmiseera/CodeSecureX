import logging
from fastapi import APIRouter, HTTPException, status

from schemas.scan_schema import ScanRequest, ScanResponse, ScanHistoryItem
from services.vulnerability_service import run_scan, get_scan_history

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/scan", tags=["Scan"])


@router.post("/analyze", response_model=ScanResponse, status_code=status.HTTP_200_OK)
async def analyze_code(request: ScanRequest):
    """
    Submit code for vulnerability analysis.
    Returns a list of detected vulnerabilities with severity and fix recommendations.
    """
    try:
        return await run_scan(code=request.code, language=request.language)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    except Exception:
        logger.exception("Unexpected error during scan")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again.",
        )


@router.get("/history", response_model=list[ScanHistoryItem])
async def scan_history(limit: int = 50):
    """Return the most recent scan history records."""
    try:
        return await get_scan_history(limit=min(limit, 200))
    except Exception:
        logger.exception("Failed to fetch scan history")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch scan history.",
        )
