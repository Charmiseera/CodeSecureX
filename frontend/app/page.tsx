import Link from "next/link";
import {
  Shield, ScanLine, Zap, FileText, ChevronRight, Code2,
  AlertTriangle, CheckCircle2, Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "Powered by Nebius LLM — paste code and get results in seconds.",
    color: "hsl(210,100%,56%)",
  },
  {
    icon: AlertTriangle,
    title: "Multi-Severity Detection",
    desc: "Finds Critical, High, Medium and Low severity vulnerabilities.",
    color: "hsl(0,72%,51%)",
  },
  {
    icon: CheckCircle2,
    title: "Fix Suggestions",
    desc: "Each vulnerability comes with a concrete, actionable fix.",
    color: "hsl(142,71%,45%)",
  },
  {
    icon: FileText,
    title: "PDF Reports",
    desc: "Generate professional security reports — downloadable instantly.",
    color: "hsl(38,92%,50%)",
  },
  {
    icon: Code2,
    title: "4 Languages",
    desc: "Python, JavaScript, Java, and PHP — with Monaco code editor.",
    color: "hsl(270,60%,65%)",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Code is never stored — only a SHA-256 hash is kept in the database.",
    color: "hsl(210,100%,56%)",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(210,100%,56%)] rounded-full opacity-5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(210,100%,56%)/0.1] border border-[hsl(210,100%,56%)/0.3] text-[hsl(210,100%,56%)] text-sm font-medium">
            <Shield className="w-3.5 h-3.5" />
            LLM-Powered Security Scanner
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Secure Your Code
            <br />
            <span className="text-[hsl(210,100%,56%)]">Before Attackers Do</span>
          </h1>

          <p className="text-lg text-[hsl(215,16%,55%)] max-w-xl mx-auto leading-relaxed">
            Paste your code, and our AI instantly detects vulnerabilities — SQL injection,
            XSS, insecure auth, and more — with clear explanations and fixes.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/scan"
              className="flex items-center gap-2 px-7 py-3 bg-[hsl(210,100%,56%)] hover:bg-[hsl(210,100%,48%)] text-white font-semibold rounded-xl glow transition-all hover:scale-105"
            >
              <ScanLine className="w-4 h-4" />
              Start Code Analysis
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-7 py-3 bg-[hsl(222,47%,12%)] hover:bg-[hsl(222,47%,16%)] text-[hsl(213,31%,91%)] border border-[hsl(222,47%,14%)] font-semibold rounded-xl transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-4 pb-24 max-w-6xl mx-auto w-full">
        <h2 className="text-center text-2xl font-bold mb-10">
          Everything you need for secure code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="glass rounded-2xl p-5 hover:border-[hsl(210,100%,56%)/0.3] transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-[hsl(215,16%,55%)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
