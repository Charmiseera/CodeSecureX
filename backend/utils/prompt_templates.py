def vulnerability_analysis_prompt(code: str, language: str) -> str:
    """
    Generates a structured prompt instructing Gemini to return a JSON array
    of vulnerability objects. The response must be parseable JSON — no prose.
    """
    return f"""You are a senior application security engineer performing a code security audit.

Analyze the following {language} code for security vulnerabilities.

Return ONLY a valid JSON array (no markdown, no prose, no code fences) with this exact structure:
[
  {{
    "type": "<vulnerability name, e.g. SQL Injection>",
    "severity": "<one of: Low | Medium | High | Critical>",
    "explanation": "<clear explanation of why this is a vulnerability>",
    "fix": "<concrete fix recommendation>"
  }}
]

If there are NO vulnerabilities, return an empty array: []

Supported severity levels:
- Low: minor issues, low risk
- Medium: potential risk under certain conditions
- High: likely exploitable, needs immediate attention
- Critical: actively exploitable, must fix before deployment

Code to analyze:
```{language}
{code}
```
"""


def fix_suggestion_prompt(vuln_type: str, explanation: str) -> str:
    """Generates a prompt for an expanded, step-by-step fix recommendation."""
    return f"""You are a secure coding expert.

Vulnerability type: {vuln_type}
Description: {explanation}

Provide a detailed, step-by-step fix recommendation in plain text.
Include:
1. Root cause
2. Specific code changes needed
3. Best-practice pattern to apply
4. Any relevant library or framework recommendation

Be concise but complete.
"""
