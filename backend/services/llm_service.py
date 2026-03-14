import os
import json
import re
import logging
from typing import Any

from openai import OpenAI
from dotenv import load_dotenv

from utils.prompt_templates import vulnerability_analysis_prompt, fix_suggestion_prompt

load_dotenv()

logger = logging.getLogger(__name__)

# Nebius AI Studio is OpenAI-compatible — we just point the client at their endpoint
_api_key = os.getenv("NEBIUS_API_KEY", "")
_PLACEHOLDER = "your_nebius_api_key_here"

if _api_key and _api_key != _PLACEHOLDER:
    _client: OpenAI | None = OpenAI(
        api_key=_api_key,
        base_url="https://api.studio.nebius.ai/v1/",
    )
    logger.info("Nebius LLM client initialised.")
else:
    _client = None
    logger.warning("NEBIUS_API_KEY not set — LLM calls will return demo data.")

# Best open-source model available on Nebius for code analysis
_MODEL = "meta-llama/Meta-Llama-3.1-70B-Instruct"


def _extract_json(text: str) -> Any:
    """Strip markdown fences if the model wraps its response in ```json ... ```."""
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


def analyze_code_vulnerabilities(code: str, language: str) -> list[dict]:
    """
    Send code to Nebius LLM for vulnerability analysis.
    Returns a list of vulnerability dicts matching VulnerabilityItem schema.
    Falls back to demo data when API key is missing.
    """
    if _client is None:
        return _demo_vulnerabilities(language)

    prompt = vulnerability_analysis_prompt(code, language)
    try:
        response = _client.chat.completions.create(
            model=_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert application security engineer. "
                        "You ALWAYS respond with valid JSON only — no prose, no markdown."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,   # low temperature = deterministic, structured output
            max_tokens=4096,
        )
        raw = response.choices[0].message.content or ""
        raw = raw.strip()
        vulns = _extract_json(raw)
        if not isinstance(vulns, list):
            raise ValueError("Expected a JSON array from LLM")
        return vulns
    except json.JSONDecodeError as exc:
        logger.error("LLM returned non-JSON response: %s", exc)
        raise RuntimeError("LLM returned invalid JSON. Please try again.") from exc
    except Exception as exc:
        logger.error("Nebius API error: %s", exc)
        raise RuntimeError(f"LLM service error: {exc}") from exc


def explain_vulnerability(vuln_type: str, explanation: str) -> str:
    """Return an expanded fix recommendation for a specific vulnerability."""
    if _client is None:
        return "Set NEBIUS_API_KEY in backend/.env to get detailed fix recommendations."

    prompt = fix_suggestion_prompt(vuln_type, explanation)
    try:
        response = _client.chat.completions.create(
            model=_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1024,
        )
        return (response.choices[0].message.content or "").strip()
    except Exception as exc:
        logger.error("Nebius explain error: %s", exc)
        raise RuntimeError(f"LLM service error: {exc}") from exc


def _demo_vulnerabilities(language: str) -> list[dict]:
    """Demo data returned when no API key is configured."""
    return [
        {
            "type": "SQL Injection",
            "severity": "High",
            "explanation": (
                f"[DEMO MODE — set NEBIUS_API_KEY to enable real analysis] "
                f"The {language} code appears to concatenate user input "
                "directly into a SQL query, making it vulnerable to SQL injection."
            ),
            "fix": "Use parameterized queries or an ORM to prevent SQL injection.",
        }
    ]
