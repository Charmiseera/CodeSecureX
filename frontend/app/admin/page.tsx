"use client";

import { useEffect, useState } from "react";
import { fetchUsers, suspendUser, fetchAnalytics } from "@/services/api";
import type { AdminAnalytics } from "@/services/api";
import { Settings, Users, TrendingUp, UserX, RefreshCw, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { withAuth } from "@/lib/withAuth";

type User = { id: string; username: string; email: string; role: string; is_active: boolean; created_at: string };

function AdminPage() {
  const [users, setUsers]         = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading]     = useState(true);
  const [suspending, setSuspending] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [u, a] = await Promise.all([fetchUsers(), fetchAnalytics()]);
      setUsers(u);
      setAnalytics(a);
    } catch {
      toast.error("Failed to load admin data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id: string) => {
    setSuspending(id);
    try {
      await suspendUser(id);
      toast.success(`User ${id} suspended.`);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: false } : u));
    } catch {
      toast.error("Failed to suspend user.");
    } finally {
      setSuspending(null);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[hsl(210,100%,56%)]" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[hsl(222,47%,12%)] border border-[hsl(222,47%,14%)] text-[hsl(215,16%,55%)] hover:text-[hsl(213,31%,91%)] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Scans", value: analytics.total_scans, icon: TrendingUp, color: "hsl(210,100%,56%)" },
            { label: "Total Users", value: analytics.total_users, icon: Users, color: "hsl(142,71%,45%)" },
            { label: "Active Users", value: analytics.active_users, icon: ShieldAlert, color: "hsl(38,92%,50%)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-[hsl(215,16%,55%)] font-medium">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[hsl(222,47%,14%)] flex items-center gap-2">
          <Users className="w-4 h-4 text-[hsl(215,16%,55%)]" />
          <h2 className="font-semibold">Users</h2>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl skeleton" />)}
          </div>
        ) : users.length === 0 ? (
          <p className="p-8 text-center text-sm text-[hsl(215,16%,55%)]">No users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[hsl(215,16%,55%)] uppercase tracking-wider">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[hsl(222,47%,14%)] hover:bg-[hsl(222,47%,8%)] transition-colors">
                  <td className="px-5 py-3 text-[hsl(215,16%,55%)]">#{u.id}</td>
                  <td className="px-5 py-3 font-medium">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? "badge-low" : "badge-high"}`}>
                      {u.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[hsl(215,16%,55%)] text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {u.is_active && (
                      <button
                        onClick={() => handleSuspend(u.id)}
                        disabled={suspending === u.id}
                        className="flex items-center gap-1 text-xs text-[hsl(0,72%,51%)] hover:underline disabled:opacity-50"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        {suspending === u.id ? "…" : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Top vulnerabilities */}
      {analytics && analytics.top_vulnerabilities.length > 0 && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">Most Common Vulnerabilities</h2>
          <div className="space-y-2">
            {analytics.top_vulnerabilities.map((v, i) => (
              <div key={v.type} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[hsl(210,100%,56%)/0.1] border border-[hsl(210,100%,56%)/0.3] flex items-center justify-center text-xs text-[hsl(210,100%,56%)] font-bold">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm">{v.type}</span>
                <span className="text-sm font-bold text-[hsl(210,100%,56%)]">{v.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminPage, "admin");
