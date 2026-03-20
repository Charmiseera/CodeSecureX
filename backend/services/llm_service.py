import os
import json
import re
import logging
from typing import Any

from openai import OpenAI
from dotenv import load_dotenv

from utils.prompt_templates import vulnerability_analysis_prompt, fix_suggestion_prompt

# Explicitly load backend/.env relative to this file's location
ENV_PATH = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=ENV_PATH, override=True)

logger = logging.getLogger(__name__)

_api_key = os.getenv("NEBIUS_API_KEY", "").strip()

if _api_key:
    _client: OpenAI | None = OpenAI(
        api_key=_api_key,
        base_url="https://api.studio.nebius.ai/v1/",
        timeout=15.0,  # Strict timeout: fail fast and fallback if Nebius hangs
        max_retries=0, # Do not retry 2 times by default (prevents 45s cumulative hang)
    )
    logger.info("Nebius LLM client initialised with real API key.")
else:
    _client = None
    logger.warning("NEBIUS_API_KEY not set in backend/.env — running in demo mode.")

_MODEL = "meta-llama/Meta-Llama-3.1-8B-Instruct-fast"


def _extract_json(text: str) -> Any:
    """
    Robustly extract JSON from a string that might contain conversational text or markdown.
    Finds the first occurrence of '[' or '{' and the last occurrence of ']' or '}'.
    """
    # 1. Try simple clean first
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # 2. Find the JSON block boundaries
        first_bracket = text.find('[')
        first_brace = text.find('{')
        
        start = -1
        if first_bracket != -1 and (first_brace == -1 or first_bracket < first_brace):
            start = first_bracket
            end = text.rfind(']')
        elif first_brace != -1:
            start = first_brace
            end = text.rfind('}')
        
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end+1])
            except json.JSONDecodeError as e:
                logger.error("Failed to parse extracted JSON block: %s", e)
                logger.debug("Raw problematic text: %s", text)
        
        raise

def analyze_code_vulnerabilities(code: str, language: str) -> list[dict]:
    """
    Send code to Nebius LLM for vulnerability analysis.
    Falls back to demo data ONLY if NEBIUS_API_KEY is not set in .env.
    """
    if _client is None:
        logger.info("No API key — returning demo vulnerabilities.")
        
        # Simple heuristic to simulate returning a clean bill of health if the user pastes the fix
        code_lower = code.lower()
        if "fgets" in code_lower or "db.execute" in code_lower or "execute(query, " in code_lower or "parameterised" in code_lower or "?" in code:
            return []
            
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
                        "You ALWAYS respond with valid JSON only — no prose, no markdown fences."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=4096,
        )
        raw = (response.choices[0].message.content or "").strip()
        vulns = _extract_json(raw)
        if not isinstance(vulns, list):
            raise ValueError("LLM did not return a JSON array")
        return vulns

    except json.JSONDecodeError as exc:
        logger.error("LLM returned non-JSON: %s", exc)
        raise RuntimeError("LLM returned invalid JSON — please try again.") from exc
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
    """Fallback demo data — only used when NEBIUS_API_KEY is missing from .env."""
    if language in ("c", "cpp"):
        return [
            {
                "type": "Buffer Overflow",
                "severity": "High",
                "vulnerable_code": "char buffer[50];\ngets(buffer);",
                "explanation": (
                    f"The {language} code uses the unsafe function 'gets()' which does not check "
                    f"bounds, leading to buffer overflow vulnerabilities."
                ),
                "fix": "Use safe functions like 'fgets()' that allow specifying the maximum input length.\n\n// Example Fix:\nchar buffer[50];\nfgets(buffer, sizeof(buffer), stdin);",
            }
        ]

    return [
        {
            "type": "SQL Injection",
            "severity": "High",
            "vulnerable_code": "query = \"SELECT * FROM users WHERE id=\" + user_id",
            "explanation": (
                f"[DEMO — add NEBIUS_API_KEY to backend/.env for real AI analysis] "
                f"The {language} code concatenates user input directly into SQL."
            ),
            "fix": "Use parameterised queries or an ORM to prevent user input from executing as SQL.\n\n// Example Fix:\nconst query = 'SELECT * FROM users WHERE id = ?';\ndb.execute(query, [userId]);",
        }
    ]
