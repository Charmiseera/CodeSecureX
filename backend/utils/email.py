import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", ""),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@codesecurex.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_reset_email(email: EmailStr, reset_link: str):
    html = f"""
    <p>Hi,</p>
    <p>You requested to reset your password for CodeSecureX.</p>
    <p>Click the link below to reset it (valid for 15 minutes):</p>
    <a href="{reset_link}">{reset_link}</a>
    <p>If you didn't request this, please ignore this email.</p>
    """
    
    message = MessageSchema(
        subject="Password Reset Request - CodeSecureX",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
