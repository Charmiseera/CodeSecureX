import secrets
from datetime import datetime, timezone
from beanie import Document, Indexed
from pydantic import Field


class Token(Document):
    """MongoDB document — API tokens for CLI / GitHub Action access."""

    token: Indexed(str, unique=True)   # type: ignore[valid-type]
    label: str = "Default"            # user-defined label e.g. "my-repo"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "tokens"               # MongoDB collection name

    @staticmethod
    def generate() -> str:
        """Generate a cryptographically secure 32-byte hex token."""
        return "sca_" + secrets.token_hex(32)
