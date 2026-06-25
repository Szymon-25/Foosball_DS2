"use client";

import useSWR from "swr";
import { Star } from "lucide-react";
import { Registration } from "@/lib/db";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ParticipantsTable() {
  const { data, error } = useSWR<{ registrations: Registration[] }>("/api/registrations", fetcher, { refreshInterval: 30000 });

  if (error) return null;
  if (!data) return null;

  const participants = data.registrations;

  if (participants.length === 0) {
    return (
      <div className="py-12 text-center text-white/50 italic text-xl">
        No teams yet. Be first.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto py-12">
      <h2 className="text-5xl md:text-[6vw] leading-none font-display uppercase tracking-tighter mb-8 md:mb-12 text-center text-white/80">Lineup</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/20 text-sm md:text-xl font-display uppercase tracking-widest text-white/40">
            <th className="py-2 px-2 md:py-4 md:px-4 font-normal">#</th>
            <th className="py-2 px-2 md:py-4 md:px-4 font-normal">Team</th>
            <th className="py-2 px-2 md:py-4 md:px-4 font-normal">Format</th>
            <th className="py-2 px-2 md:py-4 md:px-4 font-normal">Skill</th>
            <th className="py-2 px-2 md:py-4 md:px-4 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, i) => (
            <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-500">
              <td className="py-3 px-2 md:py-6 md:px-4 font-display text-lg md:text-2xl text-white/20">{(i + 1).toString().padStart(2, '0')}</td>
              <td className="py-3 px-2 md:py-6 md:px-4 text-xl md:text-3xl font-display tracking-wide text-white leading-none">{p.teamName}</td>
              <td className="py-3 px-2 md:py-6 md:px-4 font-display text-lg md:text-xl text-accent">{p.format}</td>
              <td className="py-3 px-2 md:py-6 md:px-4">
                <div className="flex gap-1 md:gap-2 text-accent">
                  {Array.from({ length: p.skill }).map((_, j) => (
                    <Star key={j} className="fill-accent w-4 h-4 md:w-5 md:h-5" />
                  ))}
                </div>
              </td>
              <td className="py-3 px-2 md:py-6 md:px-4 font-display text-sm md:text-xl tracking-wide">
                {p.status === 'accepted' ? (
                  <span className="text-green-400">Accepted</span>
                ) : (
                  <span className="text-white/30">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
