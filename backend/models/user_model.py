from datetime import datetime, timezone
from beanie import Document, Indexed
from pydantic import EmailStr, Field


class User(Document):
    """MongoDB document — platform user (admin-view, no auth in V1)."""

    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"             # MongoDB collection name
