"use client";

import { useEffect, useState } from "react";
import { fetchUsers, suspendUser, fetchAnalytics } from "@/services/api";
import type { AdminAnalytics } from "@/services/api";
import { Users, TrendingUp, UserX, ShieldAlert, BarChart3, Database } from "lucide-react";
import toast from "react-hot-toast";

type User = { id: string; email: string; is_active: boolean; created_at: string };

export default function AdminPage() {
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

  const handleSuspend = async (id: string, currentlyActive: boolean) => {
    setSuspending(id);
    try {
      if (currentlyActive) {
        await suspendUser(id);
        toast.success(`User ${id} suspended.`);
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: false } : u));
      } else {
        // Mock unsuspend
        toast.success(`User ${id} activated.`);
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: true } : u));
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setSuspending(null);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Management</h1>
          <p className="text-xs font-semibold tracking-widest text-[#aca1fd] opacity-80 uppercase">
            SYSTEM OVERVIEW & ADMINISTRATIVE CONTROLS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search system..."
            className="bg-[hsl(226,12%,14%)] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#aca1fd] transition-colors"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "TOTAL REGISTERED USERS", value: analytics?.total_users || 0, sub: "+12% this month", icon: Users },
          { label: "TOTAL SCANS PERFORMED", value: analytics?.total_scans || 0, sub: "99.9% uptime", icon: Database },
          { label: "TOP VULNERABILITY", value: analytics?.top_vulnerabilities[0]?.type.substring(0, 15) || "N/A", sub: "Priority: High", subColor: "text-[#f87171]", icon: ShieldAlert },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 p-6 rounded-2xl border border-white/5 shadow-xl glass">
            <stat.icon className="w-5 h-5 text-zinc-500 mb-2" />
            <p className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">{stat.label}</p>
            <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className={`text-xs font-bold ${stat.subColor || "text-[#aca1fd]"}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="glass rounded-2xl overflow-hidden shadow-xl mt-12 bg-white/5 border border-white/5">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold tracking-tight text-white">User Registry</h2>
          <div className="flex gap-4">
             <button className="px-4 py-2 rounded-lg bg-[hsl(226,12%,18%)] border border-white/5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-white/5 transition-colors">
              All Plans v
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-[#aca1fd] text-[#131418] hover:bg-[#c4bcff] transition-colors text-xs font-bold uppercase tracking-wider">
              Add New User
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}
          </div>
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-sm font-semibold tracking-wider uppercase text-zinc-500">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                <th className="px-6 py-4">USER IDENTITY</th>
                <th className="px-6 py-4">PLAN TYPE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ADMINISTRATIVE ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${u.email}&backgroundColor=e0e0e0`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.email}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Last login: 2h ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-zinc-600 tracking-wider">
                    {u.id % 2 === 0 ? "ENTERPRISE" : "PRO"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs font-bold tracking-wider">
                      <span className={`w-2 h-2 rounded-full ${u.is_active ? "bg-[#2dd4bf]" : "bg-[#f87171]"}`}></span>
                      <span className={u.is_active ? "text-[#2dd4bf]" : "text-[#f87171]"}>
                        {u.is_active ? "Active" : "Suspended"}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center justify-end gap-6 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <button className="hover:text-white transition-colors">Edit</button>
                      <button
                        onClick={() => handleSuspend(u.id, u.is_active)}
                        disabled={suspending === u.id}
                        className={`hover:text-white transition-colors ${!u.is_active ? "text-[#f87171]" : ""}`}
                      >
                        {suspending === u.id ? "…" : u.is_active ? "Suspend" : "Activate"}
                      </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
