#!/usr/bin/env python3
"""
SecureCodeAI GitHub Action Scanner
===================================
Scans changed files in a Pull Request for security vulnerabilities
using the SecureCodeAI API, then posts a formatted comment on the PR.

Environment Variables (set as GitHub secrets/variables):
  SECURECODEAI_URL   — Base URL of your SecureCodeAI API (e.g. https://api.securecodeai.com)
  SECURECODEAI_TOKEN — Your API token from securecodeai.com/github
  GITHUB_TOKEN       — Automatically provided by GitHub Actions
  REPO               — Repository in "owner/repo" format
  PR_NUMBER          — Pull request number
  BASE_SHA           — Base commit SHA (before changes)
  HEAD_SHA           — Head commit SHA (after changes)
"""

import os
import sys
import subprocess
import requests

# ─── Configuration ────────────────────────────────────────────────────────────

API_URL   = os.environ.get("SECURECODEAI_URL", "http://localhost:8000").rstrip("/")
API_TOKEN = os.environ.get("SECURECODEAI_TOKEN", "")
GH_TOKEN  = os.environ.get("GITHUB_TOKEN", "")
REPO      = os.environ.get("REPO", "")
PR_NUMBER = os.environ.get("PR_NUMBER", "")
BASE_SHA  = os.environ.get("BASE_SHA", "HEAD~1")
HEAD_SHA  = os.environ.get("HEAD_SHA", "HEAD")

SUPPORTED_EXTENSIONS = {
    ".py":   "python",
    ".js":   "javascript",
    ".ts":   "javascript",
    ".jsx":  "javascript",
    ".tsx":  "javascript",
    ".java": "java",
    ".php":  "php",
}

MAX_FILE_SIZE = 40_000  # characters — stay under API limit


# ─── Step 1: Get changed files from git diff ──────────────────────────────────

def get_changed_files() -> list[tuple[str, str]]:
    """Return list of (filepath, language) tuples for supported changed files."""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", BASE_SHA, HEAD_SHA],
            capture_output=True, text=True, check=True,
        )
        files = result.stdout.strip().split("\n")
    except subprocess.CalledProcessError as e:
        print(f"::warning::git diff failed: {e.stderr}")
        return []

    changed = []
    for f in files:
        if not f:
            continue
        ext = os.path.splitext(f)[1].lower()
        lang = SUPPORTED_EXTENSIONS.get(ext)
        if lang and os.path.isfile(f):
            changed.append((f, lang))

    return changed


# ─── Step 2: Call SecureCodeAI API ────────────────────────────────────────────

def scan_file(filepath: str, language: str) -> dict | None:
    """Send file content to SecureCodeAI and return vulnerabilities."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as fh:
            code = fh.read()
    except Exception as e:
        print(f"::warning::Could not read {filepath}: {e}")
        return None

    if not code.strip():
        return None

    code = code[:MAX_FILE_SIZE]  # truncate if too large

    pr_url = f"https://github.com/{REPO}/pull/{PR_NUMBER}" if REPO and PR_NUMBER else None

    try:
        resp = requests.post(
            f"{API_URL}/api/scan/analyze",
            json={
                "code": code,
                "language": language,
                "source": "github",
                "repo_name": REPO,
                "pr_url": pr_url,
            },
            headers={"X-Api-Token": API_TOKEN},
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        print(f"::warning::API call failed for {filepath}: {e}")
        return None


# ─── Step 3: Format PR comment ────────────────────────────────────────────────

SEVERITY_EMOJI = {
    "Critical": "🔴",
    "High":     "🟠",
    "Medium":   "🟡",
    "Low":      "🟢",
}


def build_pr_comment(results: list[dict]) -> str:
    """Build a rich markdown PR comment from scan results."""
    total_vulns = sum(len(r["vulnerabilities"]) for r in results)
    files_scanned = len(results)

    if total_vulns == 0:
        return (
            "## 🔐 SecureCodeAI Security Scan\n\n"
            f"✅ **No vulnerabilities found** across {files_scanned} file(s) scanned.\n\n"
            "*Powered by [SecureCodeAI](https://securecodeai.com)*"
        )

    lines = [
        "## 🔐 SecureCodeAI Security Scan\n",
        f"⚠️ Found **{total_vulns} vulnerability** across {files_scanned} file(s) scanned.\n",
        "<details><summary>📋 View Full Report</summary>\n",
    ]

    for r in results:
        if not r["vulnerabilities"]:
            continue
        lines.append(f"\n### 📄 `{r['filepath']}`\n")
        lines.append("| Severity | Type | Explanation | Fix |")
        lines.append("|----------|------|-------------|-----|")
        for v in r["vulnerabilities"]:
            emoji = SEVERITY_EMOJI.get(v["severity"], "⚪")
            sev   = v["severity"]
            type_ = v["type"]
            exp   = v["explanation"][:120].replace("|", "\\|")
            fix   = v["fix"][:120].replace("|", "\\|")
            lines.append(f"| {emoji} **{sev}** | {type_} | {exp} | {fix} |")

    lines.append("\n</details>\n")
    lines.append(f"\n*Scan ID: `{results[0].get('scan_id', 'n/a')}` — Powered by [SecureCodeAI](https://securecodeai.com)*")

    return "\n".join(lines)


# ─── Step 4: Post comment to GitHub PR ────────────────────────────────────────

def post_pr_comment(comment: str) -> bool:
    """Post the formatted comment on the Pull Request."""
    if not GH_TOKEN or not REPO or not PR_NUMBER:
        print("::warning::Missing GITHUB_TOKEN / REPO / PR_NUMBER — skipping PR comment")
        print("\n--- SCAN RESULTS ---")
        print(comment)
        return False

    url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
    resp = requests.post(
        url,
        json={"body": comment},
        headers={
            "Authorization": f"Bearer {GH_TOKEN}",
            "Accept": "application/vnd.github+json",
        },
        timeout=30,
    )
    if resp.status_code in (200, 201):
        print(f"✅ PR comment posted: {resp.json().get('html_url', '')}")
        return True
    else:
        print(f"::error::Failed to post PR comment: {resp.status_code} {resp.text}")
        return False


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"🔐 SecureCodeAI Scanner — API: {API_URL}")

    # Validate API connectivity
    try:
        health = requests.get(f"{API_URL}/health", timeout=10)
        health.raise_for_status()
        print(f"✅ API reachable — version: {health.json().get('version', '?')}")
    except Exception as e:
        print(f"::error::Cannot reach SecureCodeAI API at {API_URL}: {e}")
        print("Make sure SECURECODEAI_URL is set and the backend is accessible.")
        sys.exit(1)

    changed = get_changed_files()
    if not changed:
        print("ℹ️  No supported source files changed in this PR.")
        post_pr_comment(
            "## 🔐 SecureCodeAI Security Scan\n\n"
            "ℹ️ No supported source files (`.py`, `.js`, `.ts`, `.java`, `.php`) were changed in this PR.\n\n"
            "*Powered by [SecureCodeAI](https://securecodeai.com)*"
        )
        return

    print(f"📂 Scanning {len(changed)} file(s)...")

    all_results = []
    has_critical = False

    for filepath, language in changed:
        print(f"  → {filepath} ({language})")
        data = scan_file(filepath, language)
        if data:
            data["filepath"] = filepath
            all_results.append(data)
            critical_count = sum(
                1 for v in data["vulnerabilities"]
                if v["severity"] in ("Critical", "High")
            )
            if critical_count > 0:
                has_critical = True

    comment = build_pr_comment(all_results)
    post_pr_comment(comment)

    total = sum(len(r["vulnerabilities"]) for r in all_results)
    print(f"\n📊 Scan complete — {total} vulnerabilities found across {len(all_results)} files")

    if has_critical:
        print("::error::Critical or High severity vulnerabilities found! Please fix before merging.")
        sys.exit(1)   # fails the GitHub Action check if critical vulns found


if __name__ == "__main__":
    main()
