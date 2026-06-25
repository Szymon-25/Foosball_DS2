"use client";

import useSWR from "swr";
import { useState } from "react";
import { Registration } from "@/lib/db";
import { Check, X, RotateCcw, LogOut, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data, error, mutate } = useSWR<{ registrations: Registration[] }>("/api/admin/registrations", fetcher);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const router = useRouter();

  if (error) return <div className="min-h-screen bg-[#0a2912] text-white p-8">Unauthorized</div>;
  if (!data) return <div className="min-h-screen bg-[#0a2912] text-white p-8">Loading...</div>;

  const allRegs = data.registrations || [];
  
  const stats = {
    total: allRegs.length,
    pending: allRegs.filter(r => r.status === "pending").length,
    accepted: allRegs.filter(r => r.status === "accepted").length,
    rejected: allRegs.filter(r => r.status === "rejected").length,
  };

  const filtered = filter === "all" ? allRegs : allRegs.filter(r => r.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  const handleLogout = async () => {
    // A simple hack to clear the cookie is to let the user clear it or have an api route,
    // but the spec doesn't explicitly ask for a logout API route. We can just set a client cookie to expire it.
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#0a2912] text-white flex flex-col">
      <div className="flex justify-between items-center p-8 border-b-4 border-white/10">
        <div className="flex gap-4">
          <div className="bg-white/10 px-8 py-4 text-3xl font-display uppercase tracking-widest">Total: {stats.total}</div>
          <div className="bg-white/10 px-8 py-4 text-3xl font-display uppercase tracking-widest text-accent">Pending: {stats.pending}</div>
          <div className="bg-white/10 px-8 py-4 text-3xl font-display uppercase tracking-widest text-green-400">Accepted: {stats.accepted}</div>
          <div className="bg-white/10 px-8 py-4 text-3xl font-display uppercase tracking-widest text-red-400">Rejected: {stats.rejected}</div>
        </div>
        <button onClick={handleLogout} className="text-white/50 hover:text-white hover:scale-110 transition-all" title="Logout">
          <LogOut size={48} />
        </button>
      </div>

      <div className="flex gap-4 p-8">
        {(["all", "pending", "accepted", "rejected"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-4 text-3xl font-display uppercase tracking-widest transition-all border-4 ${
              filter === f ? "bg-accent text-ink border-accent scale-105" : "bg-transparent text-white/50 border-white/20 hover:bg-white/5 hover:text-white hover:border-white/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto px-8 pb-8">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b-8 border-white/20 text-white/50 uppercase tracking-widest text-2xl font-display">
              <th className="py-6 px-4 font-normal">#</th>
              <th className="py-6 px-4 font-normal">Team</th>
              <th className="py-6 px-4 font-normal">Format</th>
              <th className="py-6 px-4 font-normal">Skill</th>
              <th className="py-6 px-4 font-normal">Secret Phrase</th>
              <th className="py-6 px-4 font-normal">Date</th>
              <th className="py-6 px-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-b-4 border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-6 px-4 font-display text-3xl text-white/50">{(i + 1).toString().padStart(2, '0')}</td>
                <td className="py-6 px-4 text-3xl font-display uppercase tracking-widest">{p.teamName}</td>
                <td className="py-6 px-4 font-display text-3xl text-accent">{p.format}</td>
                <td className="py-6 px-4">
                  <div className="flex gap-2 text-accent">
                    {Array.from({ length: p.skill }).map((_, j) => (
                      <Star key={j} size={20} className="fill-accent" />
                    ))}
                  </div>
                </td>
                <td className="py-6 px-4 font-mono text-xl text-white/50">{p.secretPhrase}</td>
                <td className="py-6 px-4 text-xl text-white/50 font-display tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="py-6 px-4 text-right">
                  <div className="flex justify-end gap-4">
                    {p.status !== 'accepted' && (
                      <button onClick={() => updateStatus(p.id, 'accepted')} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded transition-colors" title="Accept">
                        <Check size={20} />
                      </button>
                    )}
                    {p.status !== 'rejected' && (
                      <button onClick={() => updateStatus(p.id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded transition-colors" title="Reject">
                        <X size={20} />
                      </button>
                    )}
                    {p.status !== 'pending' && (
                      <button onClick={() => updateStatus(p.id, 'pending')} className="p-2 bg-white/10 text-white/70 hover:bg-white/20 rounded transition-colors" title="Reset to pending">
                        <RotateCcw size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-white/30 italic">No registrations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
