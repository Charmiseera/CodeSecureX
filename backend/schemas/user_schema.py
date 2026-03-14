from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: str               # MongoDB ObjectId as string
    email: str
    is_active: bool
    created_at: str


class SuspendRequest(BaseModel):
    user_id: str          # MongoDB ObjectId as string
