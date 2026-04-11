import logging
from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel
from typing import Optional

from models.token_model import Token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/github", tags=["GitHub Integration"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class TokenCreateRequest(BaseModel):
    label: str = "My Repo"


class TokenResponse(BaseModel):
    token: str
    label: str
    created_at: str


class SetupInstructions(BaseModel):
    step1: str
    step2: str
    step3: str
    workflow_yml: str
    scanner_url: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/token", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def create_token(body: TokenCreateRequest):
    """Generate a new API token for use with the GitHub Action or CLI."""
    try:
        token_value = Token.generate()
        token_doc = Token(token=token_value, label=body.label)
        await token_doc.insert()
        logger.info("New API token created — label=%s", body.label)
        return TokenResponse(
            token=token_value,
            label=body.label,
            created_at=token_doc.created_at.isoformat(),
        )
    except Exception as exc:
        logger.exception("Failed to create token")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate token.",
        )


@router.get("/token/validate")
async def validate_token(x_api_token: Optional[str] = Header(None)):
    """Validate an API token (used by GitHub Action to verify credentials)."""
    if not x_api_token:
        raise HTTPException(status_code=401, detail="Missing X-Api-Token header")
    try:
        token_doc = await Token.find_one(Token.token == x_api_token, Token.is_active == True)
        if not token_doc:
            raise HTTPException(status_code=401, detail="Invalid or inactive token")
        return {"valid": True, "label": token_doc.label}
    except HTTPException:
        raise
    except Exception:
        logger.exception("Token validation error")
        raise HTTPException(status_code=500, detail="Token validation failed")


@router.get("/setup", response_model=SetupInstructions)
async def get_setup_instructions():
    """Returns step-by-step setup instructions for the GitHub Action."""
    return SetupInstructions(
        step1="Generate an API token from the SecureCodeAI GitHub Integration page",
        step2="Add the token as a GitHub repo secret: Settings → Secrets → SECURECODEAI_TOKEN",
        step3="Copy the workflow YAML below into .github/workflows/securecodeai.yml in your repo",
        workflow_yml="""name: SecureCodeAI Security Scan

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  security-scan:
    name: 🔐 SecureCodeAI Scan
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install requests

      - name: Download scanner
        run: |
          curl -sSL https://raw.githubusercontent.com/YOUR_ORG/CodeSecureX/main/github-action/securecodeai_scan.py -o securecodeai_scan.py

      - name: Run SecureCodeAI scan
        env:
          SECURECODEAI_URL: ${{ vars.SECURECODEAI_URL }}
          SECURECODEAI_TOKEN: ${{ secrets.SECURECODEAI_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.number }}
          REPO: ${{ github.repository }}
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: python securecodeai_scan.py
""",
        scanner_url="https://raw.githubusercontent.com/YOUR_ORG/CodeSecureX/main/github-action/securecodeai_scan.py",
    )
