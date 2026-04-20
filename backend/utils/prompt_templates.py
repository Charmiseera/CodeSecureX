def vulnerability_analysis_prompt(code: str, language: str) -> str:
    """
    Generates a structured prompt instructing the LLM to return a JSON array
    of vulnerability objects with concise remediation guidance.
    """
    return f"""You are a senior application security engineer performing a code security audit.

Analyze the following {language} code for security vulnerabilities.

CRITICAL: Return ONLY a valid JSON array. No conversational text, no markdown fences, no preamble, no postscript.

Each element MUST have these fields:
[
  {{
    "type": "<vulnerability name>",
    "severity": "<Low|Medium|High|Critical>",
    "explanation": "<concise explanation with line references when possible>",
    "fix": "<specific concise fix guidance>",
    "fixed_code": "<optional corrected function or short snippet only when the fix is small>"
  }}
]

Rules for fixed_code:
- Include fixed_code only if the corrected snippet is under 80 lines.
- If the fix is broad or architectural, set fixed_code to null.
- Do NOT wrap fixed_code in markdown fences inside the JSON string.
- Escape any double-quotes inside the code as \\".

If NO vulnerabilities exist, return: []

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
