import os
import logging
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from beanie import PydanticObjectId

from models.report_model import Report
from schemas.report_schema import ReportRequest, ReportResponse
from services.report_service import generate_pdf_report, REPORTS_DIR

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/report", tags=["Report"])


@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(request: ReportRequest):
    """
    Generate a PDF security report for a given scan_id.
    Returns the report_id and a URL to download the PDF.
    """
    try:
        return await generate_pdf_report(scan_id=request.scan_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception:
        logger.exception("Failed to generate report for scan_id=%s", request.scan_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate PDF report.",
        )


@router.get("/{report_id}")
async def download_report(report_id: str):
    """Download a previously generated PDF report by report ID."""
    try:
        oid = PydanticObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid report ID")

    report = await Report.get(oid)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    filepath = os.path.join(REPORTS_DIR, report.pdf_filename)
    if not os.path.isfile(filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report file not found on disk. It may have been deleted.",
        )

    return FileResponse(path=filepath, media_type="application/pdf",
                        filename=report.pdf_filename)
