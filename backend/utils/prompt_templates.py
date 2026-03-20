def vulnerability_analysis_prompt(code: str, language: str) -> str:
    """
    Generates a structured prompt instructing the LLM to return a JSON array
    of vulnerability objects.
    """
    return f"""You are a senior application security engineer performing a code security audit.

Analyze the following {language} code for security vulnerabilities.

CRITICAL: Return ONLY a valid JSON array. Do not include any conversational text, explanations outside the JSON, or markdown fences. No preamble ("Here is the JSON...") or postscript.

Structure:
[
  {{
    "type": "<vulnerability name>",
    "severity": "<Low|Medium|High|Critical>",
    "vulnerable_code": "<the exact lines of flawed code>",
    "explanation": "<detailed explanation with line references>",
    "fix": "<detailed fix steps and code snippet>"
  }}
]

If there are multiple issues, treat each thoroughly. If NO vulnerabilities, return: []

Code to analyze:
{code}
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
