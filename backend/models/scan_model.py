import hashlib
from datetime import datetime, timezone
from typing import Optional, Literal
from beanie import Document, Indexed
from pydantic import Field


class Scan(Document):
    """MongoDB document — stores scan metadata + vulnerability results."""

    code_hash: Indexed(str)          # type: ignore[valid-type]
    language: str
    vulnerabilities_json: str = "[]"  # stored as JSON string
    source: Literal["web", "github", "cli"] = "web"  # where the scan came from
    repo_name: Optional[str] = None   # e.g. "owner/repo" for GitHub scans
    pr_url: Optional[str] = None      # PR link for GitHub scans
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "scans"               # MongoDB collection name

    @staticmethod
    def hash_code(code: str) -> str:
        return hashlib.sha256(code.encode()).hexdigest()
