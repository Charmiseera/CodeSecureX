"""Admin routes — JWT-protected, admin role required."""

import json
import logging
from fastapi import APIRouter, HTTPException, status, Depends
from beanie import PydanticObjectId

from models.user_model import User
from models.scan_model import Scan
from schemas.user_schema import UserResponse, SuspendRequest
from utils.dependencies import require_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=list[UserResponse])
async def list_users(_: User = Depends(require_admin)):
    """Return all registered users. Admin only."""
    users = await User.find().sort(-User.created_at).to_list()
    return [
        UserResponse(
            id=str(u.id),
            username=u.username,
            email=u.email,
            role=u.role,
            is_active=u.is_active,
            created_at=u.created_at.isoformat(),
        )
        for u in users
    ]


@router.post("/suspend", status_code=status.HTTP_200_OK)
async def suspend_user(request: SuspendRequest, _: User = Depends(require_admin)):
    """Suspend a user account. Admin only."""
    try:
        oid = PydanticObjectId(request.user_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

    user = await User.get(oid)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not user.is_active:
        return {"message": f"User {request.user_id} is already suspended"}

    user.is_active = False
    await user.save()
    return {"message": f"User {request.user_id} has been suspended"}


@router.get("/analytics")
async def get_analytics(_: User = Depends(require_admin)):
    """Return aggregated platform analytics. Admin only."""
    total_scans = await Scan.count()
    total_users = await User.count()
    active_users = await User.find(User.is_active == True).count()  # noqa: E712

    all_scans = await Scan.find_all().to_list()
    vuln_counter: dict[str, int] = {}
    for s in all_scans:
        try:
            vulns = json.loads(s.vulnerabilities_json or "[]")
            for v in vulns:
                vtype = v.get("type", "Unknown")
                vuln_counter[vtype] = vuln_counter.get(vtype, 0) + 1
        except json.JSONDecodeError:
            continue

    top_vulns = sorted(vuln_counter.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "total_scans":        total_scans,
        "total_users":        total_users,
        "active_users":       active_users,
        "top_vulnerabilities": [{"type": t, "count": c} for t, c in top_vulns],
    }
