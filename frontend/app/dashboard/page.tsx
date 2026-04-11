"use client";

import { useEffect, useState } from "react";
import { getScanHistory, fetchAnalytics } from "@/services/api";
import type { ScanHistoryItem, AdminAnalytics } from "@/services/api";
import {
  LayoutDashboard, ScanLine, Shield, AlertTriangle, Clock, RefreshCw, Globe, Github, Terminal,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: string | number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-[hsl(215,16%,55%)] font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function SeverityBar({ type, count, max }: { type: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[hsl(215,16%,55%)] w-32 truncate">{type}</span>
      <div className="flex-1 h-1.5 bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[hsl(210,100%,56%)] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-5 text-right">{count}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [history, setHistory]     = useState<ScanHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [h, a] = await Promise.all([getScanHistory(10), fetchAnalytics()]);
      setHistory(h);
      setAnalytics(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const maxCount = analytics?.top_vulnerabilities[0]?.count ?? 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[hsl(210,100%,56%)]" />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[hsl(222,47%,12%)] border border-[hsl(222,47%,14%)] text-[hsl(215,16%,55%)] hover:text-[hsl(213,31%,91%)] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-4 border border-[hsl(0,72%,51%)/0.3] text-sm text-[hsl(0,72%,51%)]">
          Failed to load data. Make sure the backend is running on port 8000.
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass rounded-2xl p-5 h-20 skeleton" />
          ))}
        </div>
      ) : analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Scans"    value={analytics.total_scans}   icon={ScanLine}      color="hsl(210,100%,56%)" />
          <StatCard label="Total Users"    value={analytics.total_users}   icon={Shield}        color="hsl(142,71%,45%)" />
          <StatCard label="Active Users"   value={analytics.active_users}  icon={AlertTriangle} color="hsl(38,92%,50%)" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(215,16%,55%)]" />
              <h2 className="font-semibold">Recent Scans</h2>
            </div>
            <Link href="/scan" className="text-xs text-[hsl(210,100%,56%)] hover:underline">
              New Scan →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl skeleton" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-[hsl(215,16%,55%)] py-4 text-center">No scans yet. <Link href="/scan" className="text-[hsl(210,100%,56%)] underline">Run your first scan</Link></p>
          ) : (
            <div className="space-y-2">
              {history.map((s) => {
                const SourceIcon = s.source === "github" ? Github : s.source === "cli" ? Terminal : Globe;
                const sourceLabel = s.source === "github" ? "GitHub" : s.source === "cli" ? "CLI" : "Web";
                const sourceColor = s.source === "github" ? "hsl(210,100%,56%)" : s.source === "cli" ? "hsl(270,60%,65%)" : "hsl(142,71%,45%)";
                return (
                  <div key={s.scan_id} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(222,47%,8%)] hover:bg-[hsl(222,47%,10%)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${sourceColor}18`, border: `1px solid ${sourceColor}30` }}>
                        <SourceIcon className="w-3.5 h-3.5" style={{ color: sourceColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium capitalize">{s.language}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${sourceColor}15`, color: sourceColor }}>{sourceLabel}</span>
                          {s.repo_name && <span className="text-xs text-[hsl(215,16%,45%)] font-mono">{s.repo_name}</span>}
                        </div>
                        <p className="text-xs text-[hsl(215,16%,55%)]">
                          {new Date(s.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      s.vulnerability_count === 0 ? "badge-low" :
                      s.vulnerability_count <= 2  ? "badge-medium" :
                                                    "badge-high"
                    }`}>
                      {s.vulnerability_count} issue{s.vulnerability_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Vulnerabilities */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[hsl(215,16%,55%)]" />
            <h2 className="font-semibold">Top Vulnerability Types</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-5 rounded skeleton" />)}
            </div>
          ) : !analytics || analytics.top_vulnerabilities.length === 0 ? (
            <p className="text-sm text-[hsl(215,16%,55%)] py-4 text-center">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.top_vulnerabilities.map((v) => (
                <SeverityBar key={v.type} type={v.type} count={v.count} max={maxCount} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
