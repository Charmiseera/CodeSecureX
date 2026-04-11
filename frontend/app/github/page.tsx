"use client";

import { useState } from "react";
import {
  Github, Key, Copy, Check, ChevronRight, Terminal,
  ShieldCheck, GitPullRequest, Zap, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Token Generator ──────────────────────────────────────────────────────────

function TokenGenerator() {
  const [label, setLabel]     = useState("my-repo");
  const [token, setToken]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/github/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setToken(data.token);
      toast.success("API token generated!");
    } catch {
      toast.error("Failed to generate token. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Token copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Key className="w-5 h-5 text-[hsl(210,100%,56%)]" />
        <h2 className="font-bold text-lg">Generate API Token</h2>
      </div>

      <p className="text-sm text-[hsl(215,16%,55%)]">
        Your token authenticates the GitHub Action to call your SecureCodeAI API.
        Keep it secret — treat it like a password.
      </p>

      <div className="flex gap-3">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Token label (e.g. my-api-project)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[hsl(222,47%,8%)] border border-[hsl(222,47%,14%)] text-sm text-[hsl(213,31%,91%)] placeholder-[hsl(215,16%,40%)] focus:outline-none focus:border-[hsl(210,100%,56%)/0.5] transition-colors"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="px-5 py-2.5 bg-[hsl(210,100%,56%)] hover:bg-[hsl(210,100%,48%)] text-white font-semibold rounded-xl glow transition-all disabled:opacity-50 text-sm"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {token && (
        <div className="mt-3 p-4 rounded-xl bg-[hsl(222,47%,6%)] border border-[hsl(142,71%,45%)/0.3] space-y-2">
          <p className="text-xs text-[hsl(142,71%,45%)] font-medium">✅ Token Generated — Copy it now, it won&apos;t be shown again</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-[hsl(213,31%,85%)] break-all">{token}</code>
            <button
              onClick={copyToken}
              className="p-2 rounded-lg bg-[hsl(222,47%,12%)] hover:bg-[hsl(222,47%,16%)] transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-[hsl(142,71%,45%)]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Setup Step ───────────────────────────────────────────────────────────────

function SetupStep({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(210,100%,56%)/0.15] border border-[hsl(210,100%,56%)/0.3] text-[hsl(210,100%,56%)] text-sm font-bold flex items-center justify-center">
        {num}
      </div>
      <div className="flex-1 pb-6 border-b border-[hsl(222,47%,14%)] last:border-0">
        <p className="font-semibold mb-2">{title}</p>
        {children}
      </div>
    </div>
  );
}


// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, language = "yaml" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-3 rounded-xl overflow-hidden border border-[hsl(222,47%,14%)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(222,47%,8%)] border-b border-[hsl(222,47%,14%)]">
        <span className="text-xs text-[hsl(215,16%,55%)]">{language}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-[hsl(215,16%,55%)] hover:text-[hsl(213,31%,91%)] transition-colors">
          {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-[hsl(213,31%,80%)] overflow-x-auto bg-[hsl(222,47%,6%)] leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  );
}


// ─── PR Comment Preview ───────────────────────────────────────────────────────

function PRCommentPreview() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <GitPullRequest className="w-5 h-5 text-[hsl(210,100%,56%)]" />
        <h2 className="font-bold text-lg">What the PR Comment Looks Like</h2>
      </div>

      <div className="rounded-xl border border-[hsl(222,47%,20%)] overflow-hidden">
        {/* GitHub-style PR comment header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(222,47%,10%)] border-b border-[hsl(222,47%,20%)]">
          <div className="w-7 h-7 rounded-full bg-[hsl(210,100%,56%)/0.2] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[hsl(210,100%,56%)]" />
          </div>
          <span className="text-sm font-medium">securecodeai-bot</span>
          <span className="text-xs text-[hsl(215,16%,55%)]">commented just now</span>
        </div>

        {/* Comment body */}
        <div className="p-5 bg-[hsl(222,47%,7%)] text-sm space-y-3">
          <p className="font-bold text-base">🔐 SecureCodeAI Security Scan</p>
          <p className="text-[hsl(0,72%,65%)]">⚠️ Found <strong>2 vulnerabilities</strong> across 1 file(s) scanned.</p>

          <div className="rounded-lg border border-[hsl(222,47%,16%)] overflow-hidden">
            <div className="px-3 py-2 bg-[hsl(222,47%,10%)] text-xs font-mono text-[hsl(215,16%,55%)]">📄 login.py</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[hsl(222,47%,14%)]">
                  <th className="text-left px-3 py-2 text-[hsl(215,16%,55%)]">Severity</th>
                  <th className="text-left px-3 py-2 text-[hsl(215,16%,55%)]">Type</th>
                  <th className="text-left px-3 py-2 text-[hsl(215,16%,55%)]">Fix</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[hsl(222,47%,12%)]">
                  <td className="px-3 py-2 text-[hsl(0,72%,60%)] font-bold">🟠 High</td>
                  <td className="px-3 py-2">SQL Injection</td>
                  <td className="px-3 py-2 text-[hsl(215,16%,65%)]">Use parameterized queries</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[hsl(38,92%,60%)] font-bold">🟡 Medium</td>
                  <td className="px-3 py-2">XSS</td>
                  <td className="px-3 py-2 text-[hsl(215,16%,65%)]">Sanitize user input before rendering</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[hsl(215,16%,45%)]">Scan ID: <code>sca_abc123…</code> — Powered by SecureCodeAI</p>
        </div>
      </div>
    </div>
  );
}


// ─── Workflow YAML ─────────────────────────────────────────────────────────────

const WORKFLOW_YAML = `name: SecureCodeAI Security Scan

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  security-scan:
    name: 🔐 SecureCodeAI Vulnerability Scan
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - run: pip install requests

      - name: Run SecureCodeAI scan
        env:
          SECURECODEAI_URL: \${{ vars.SECURECODEAI_URL }}
          SECURECODEAI_TOKEN: \${{ secrets.SECURECODEAI_TOKEN }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: \${{ github.event.number }}
          REPO: \${{ github.repository }}
          BASE_SHA: \${{ github.event.pull_request.base.sha }}
          HEAD_SHA: \${{ github.event.pull_request.head.sha }}
        run: python github-action/securecodeai_scan.py`;


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GitHubIntegrationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(210,100%,56%)/0.15] border border-[hsl(210,100%,56%)/0.3] flex items-center justify-center">
            <Github className="w-5 h-5 text-[hsl(210,100%,56%)]" />
          </div>
          <h1 className="text-3xl font-bold">GitHub Action Integration</h1>
        </div>
        <p className="text-[hsl(215,16%,55%)] text-lg">
          Automatically scan every Pull Request for security vulnerabilities — zero manual steps.
        </p>
      </div>

      {/* How it works */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-[hsl(38,92%,50%)]" />
          <h2 className="font-bold text-lg">How It Works</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            "PR Opened / Updated",
            "GitHub Action Triggers",
            "Changed Files Scanned",
            "SecureCodeAI API Called",
            "Comment Posted on PR",
            "Results in Dashboard",
          ].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-[hsl(222,47%,10%)] border border-[hsl(222,47%,16%)] text-[hsl(213,31%,85%)]">
                {step}
              </span>
              {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-[hsl(215,16%,45%)]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 — Token */}
      <TokenGenerator />

      {/* Step 2 — Setup Instructions */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-[hsl(142,71%,45%)]" />
          <h2 className="font-bold text-lg">Setup Instructions</h2>
        </div>

        <SetupStep num={1} title="Add your API token as a GitHub Secret">
          <p className="text-sm text-[hsl(215,16%,55%)]">
            In your GitHub repo, go to <strong>Settings → Secrets and variables → Actions → New repository secret</strong>
          </p>
          <CodeBlock language="text" code={`Name:  SECURECODEAI_TOKEN\nValue: (paste the token you generated above)`} />
        </SetupStep>

        <SetupStep num={2} title="Add your API URL as a GitHub Variable">
          <p className="text-sm text-[hsl(215,16%,55%)]">
            Go to <strong>Settings → Secrets and variables → Actions → Variables → New repository variable</strong>
          </p>
          <CodeBlock language="text" code={`Name:  SECURECODEAI_URL\nValue: http://YOUR-API-URL (e.g. https://your-api.railway.app)`} />
          <p className="text-xs text-[hsl(215,16%,45%)] mt-2">
            💡 For local testing, use <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer" className="text-[hsl(210,100%,56%)] hover:underline">ngrok</a> to tunnel localhost:8000 to a public URL.
          </p>
        </SetupStep>

        <SetupStep num={3} title="Add the workflow file to your repository">
          <p className="text-sm text-[hsl(215,16%,55%)]">
            Create the file <code className="text-[hsl(210,100%,65%)]">.github/workflows/securecodeai.yml</code> in your repo:
          </p>
          <CodeBlock language="yaml" code={WORKFLOW_YAML} />
        </SetupStep>

        <SetupStep num={4} title="Open a Pull Request and watch it work!">
          <p className="text-sm text-[hsl(215,16%,55%)]">
            Create or update any PR in your repo. The Action will automatically scan changed <code>.py</code>, <code>.js</code>, <code>.ts</code>, <code>.java</code>, and <code>.php</code> files.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[hsl(142,71%,45%)]">
            <Check className="w-4 h-4" />
            If Critical/High vulnerabilities are found, the action will <strong>block the merge</strong> until fixed.
          </div>
        </SetupStep>
      </div>

      {/* PR Comment Preview */}
      <PRCommentPreview />

      {/* Footer links */}
      <div className="flex items-center gap-4 text-sm text-[hsl(215,16%,55%)]">
        <a
          href="https://docs.github.com/en/actions"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[hsl(210,100%,56%)] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          GitHub Actions Docs
        </a>
        <span>·</span>
        <a
          href="https://ngrok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[hsl(210,100%,56%)] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          ngrok (local tunnel)
        </a>
      </div>
    </div>
  );
}
