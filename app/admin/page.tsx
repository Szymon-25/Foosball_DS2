"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a2912] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full bg-white/5 border-b-2 px-4 py-4 text-2xl text-white placeholder-white/30 focus:outline-none transition-all ${
            error ? "border-red-500 focus:border-red-500 focus:bg-white/10" : "border-white/20 focus:border-accent focus:bg-white/10"
          }`}
        />
        <button
          type="submit"
          className="w-full bg-white text-ink py-4 text-2xl font-display uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
