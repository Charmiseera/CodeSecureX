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
    hoverClass: "card-lightning"
  },
  {
    icon: AlertTriangle,
    title: "Multi-Severity Detection",
    desc: "Finds Critical, High, Medium and Low severity vulnerabilities.",
    color: "hsl(0,72%,51%)",
    hoverClass: "card-warning"
  },
  {
    icon: CheckCircle2,
    title: "Fix Suggestions",
    desc: "Each vulnerability comes with a concrete, actionable fix.",
    color: "hsl(142,71%,45%)",
    hoverClass: "card-check"
  },
  {
    icon: FileText,
    title: "PDF Reports",
    desc: "Generate professional security reports — downloadable instantly.",
    color: "hsl(38,92%,50%)",
    hoverClass: "card-doc"
  },
  {
    icon: Code2,
    title: "4 Languages",
    desc: "Python, JavaScript, Java, and PHP — with Monaco code editor.",
    color: "hsl(270,60%,65%)",
    hoverClass: "card-code"
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Code is never stored — only a SHA-256 hash is kept in the database.",
    color: "hsl(210,100%,56%)",
    hoverClass: "card-lock"
  },
];

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .homeWrapper {
          min-height: calc(100vh - 64px);
          background-color: #05050f;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99, 57, 255, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(56, 128, 255, 0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 90%, rgba(120, 40, 200, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 60%, rgba(30, 80, 200, 0.10) 0%, transparent 50%);
          background-attachment: fixed;
        }
        .heroSection {
          position: relative;
        }
        .heroSection::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse at center, rgba(56, 128, 255, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .heroSection > * {
          position: relative;
          z-index: 1;
        }
        .featureCard {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 28px 24px;
          cursor: default;
          transition:
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .featureCard:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 57, 255, 0.5);
          box-shadow:
            0 0 0 1px rgba(99, 57, 255, 0.2),
            0 8px 32px rgba(99, 57, 255, 0.15),
            0 2px 8px rgba(0, 0, 0, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }
        .featureCard::after {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: radial-gradient(ellipse at 30% 30%, rgba(99, 57, 255, 0.08) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 0;
        }
        .featureCard:hover::after {
          opacity: 1;
        }
        .featureCard > div {
          position: relative;
          z-index: 1;
        }
        .cardIcon {
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            filter 0.3s ease;
          display: inline-block;
        }
        .featureCard:hover .cardIcon {
          transform: scale(1.2) rotate(-5deg);
          filter: brightness(1.3);
        }
        /* Specific card glow overrides */
        .card-lightning:hover {
          border-color: rgba(56, 128, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(56, 128, 255, 0.2), 0 8px 32px rgba(56, 128, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-lightning::after { background: radial-gradient(ellipse at 30% 30%, rgba(56, 128, 255, 0.08) 0%, transparent 65%); }
        
        .card-warning:hover {
          border-color: rgba(220, 60, 60, 0.5);
          box-shadow: 0 0 0 1px rgba(220, 60, 60, 0.2), 0 8px 32px rgba(220, 60, 60, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-warning::after { background: radial-gradient(ellipse at 30% 30%, rgba(220, 60, 60, 0.08) 0%, transparent 65%); }

        .card-check:hover {
          border-color: rgba(40, 180, 100, 0.5);
          box-shadow: 0 0 0 1px rgba(40, 180, 100, 0.2), 0 8px 32px rgba(40, 180, 100, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-check::after { background: radial-gradient(ellipse at 30% 30%, rgba(40, 180, 100, 0.08) 0%, transparent 65%); }

        .card-doc:hover {
          border-color: rgba(220, 140, 40, 0.5);
          box-shadow: 0 0 0 1px rgba(220, 140, 40, 0.2), 0 8px 32px rgba(220, 140, 40, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-doc::after { background: radial-gradient(ellipse at 30% 30%, rgba(220, 140, 40, 0.08) 0%, transparent 65%); }

        .card-code:hover {
          border-color: rgba(140, 80, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(140, 80, 255, 0.2), 0 8px 32px rgba(140, 80, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-code::after { background: radial-gradient(ellipse at 30% 30%, rgba(140, 80, 255, 0.08) 0%, transparent 65%); }

        .card-lock:hover {
          border-color: rgba(56, 128, 255, 0.5);
          box-shadow: 0 0 0 1px rgba(56, 128, 255, 0.2), 0 8px 32px rgba(56, 128, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .card-lock::after { background: radial-gradient(ellipse at 30% 30%, rgba(56, 128, 255, 0.08) 0%, transparent 65%); }
      `}} />
      <div className="homeWrapper flex flex-col">
        {/* Hero */}
        <section className="heroSection flex-1 flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
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
          {FEATURES.map(({ icon: Icon, title, desc, color, hoverClass }) => (
            <div
              key={title}
              className={`featureCard ${hoverClass} group`}
            >
              <div
                className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5 cardIcon" style={{ color }} />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-[hsl(215,16%,55%)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
