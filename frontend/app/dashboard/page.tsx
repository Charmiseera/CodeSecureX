import Link from "next/link";
import { ScanLine } from "lucide-react";
import StatCards from "@/components/dashboard/StatCards";
import VulnerabilitiesChart from "@/components/dashboard/VulnerabilitiesChart";
import RecentScans from "@/components/dashboard/RecentScans";
import AdminRedirect from "@/components/auth/AdminRedirect";
import type { DashboardSummary } from "@/lib/dashboard-types";

// ─── Skeleton helpers ──────────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-5 h-28 skeleton" />
      ))}
    </div>
  );
}

function SkeletonChart() {
  return <div className="glass rounded-2xl h-72 skeleton" />;
}

function SkeletonTable() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 rounded-xl skeleton" />
      ))}
    </div>
  );
}

// ─── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="glass rounded-2xl p-4 border border-[hsl(0_72%_51%/0.3)] text-sm text-[hsl(0_72%_51%)]">
      ⚠️ {message}
    </div>
  );
}

// ─── Greeting helpers ──────────────────────────────────────────────────────────

function getGreeting(): string {
  // Use UTC+5:30 approximate (server renders in UTC; IST is UTC+5:30)
  const hour = new Date().getUTCHours();
  if (hour < 6 || hour >= 21) return "Good evening";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  let summary: DashboardSummary | null = null;
  let fetchError: string | null = null;

  try {
    // Server-to-server fetch (bypassing browser CORS) directly to FastAPI backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://codesecurex.onrender.com/api";
    const res = await fetch(`${baseUrl}/dashboard/summary`, { 
      cache: "no-store" 
    });
    if (!res.ok) {
      fetchError = `Backend returned HTTP ${res.status}. Make sure the API server is running.`;
    } else {
      summary = (await res.json()) as DashboardSummary;
    }
  } catch {
    fetchError =
      "Could not reach the backend API. Make sure it is running on port 8000.";
  }

  const greeting = getGreeting();
  const today = formatDate(new Date());

  return (
    <>
      <AdminRedirect />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, security lead.
          </h1>
          <p className="text-xs text-[hsl(215_16%_55%)] mt-1">
            {today} &nbsp;·&nbsp;{" "}
            <span
              className="inline-flex items-center gap-1 font-medium"
              style={{ color: "hsl(142 71% 45%)" }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              System Status: Operational
            </span>
          </p>
        </div>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:brightness-110 active:scale-95 whitespace-nowrap self-start"
          style={{
            background:
              "linear-gradient(135deg, hsl(210 100% 56%), hsl(210 100% 44%))",
            boxShadow: "0 0 20px hsl(210 100% 56% / 0.25)",
          }}
        >
          <ScanLine className="w-4 h-4" />
          Start New Scan
        </Link>
      </div>

      {/* ── Error ── */}
      {fetchError && <ErrorBanner message={fetchError} />}

      {/* ── Stat Cards ── */}
      {summary ? (
        <StatCards data={summary} />
      ) : (
        !fetchError && <SkeletonCards />
      )}

      {/* ── Chart ── */}
      {summary ? (
        <VulnerabilitiesChart data={summary.vulnerabilities_over_time} />
      ) : (
        !fetchError && <SkeletonChart />
      )}

      {/* ── Recent Scans ── */}
      {summary ? (
        <RecentScans scans={summary.recent_scans} />
      ) : (
        !fetchError && <SkeletonTable />
      )}
      </div>
    </>
  );
}

