"use client";

import { useState, useEffect } from "react";
import { StarPicker } from "./ui/StarPicker";
import { ToggleButton } from "./ui/ToggleButton";
import { Lock } from "lucide-react";
import { mutate } from "swr";
import { eventConfig } from "@/config/event";

export function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [format, setFormat] = useState("Solo");
  const [skill, setSkill] = useState(0);
  const [secretPhrase, setSecretPhrase] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const deadline = new Date(eventConfig.registrationDeadline).getTime();
    const checkClosed = () => {
      setIsClosed(new Date().getTime() >= deadline);
    };
    checkClosed();
    const interval = setInterval(checkClosed, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, format, skill, secretPhrase }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Error.");
        return;
      }

      mutate("/api/registrations");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Error.");
    }
  };

  if (status === "success") {
    return (
      <div className="py-24 text-center">
        <p className="text-5xl md:text-6xl font-display uppercase tracking-wider text-accent drop-shadow-lg">You&apos;re in.<br/><span className="text-white">See you on the pitch.</span></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12 max-w-2xl mx-auto py-24">
      <h2 className="text-6xl md:text-8xl leading-none font-display uppercase tracking-tighter text-center">Join</h2>
      
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            required
            maxLength={30}
            disabled={isClosed}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-2xl md:text-3xl font-display tracking-wide text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-colors duration-500 disabled:opacity-50"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 px-4 text-center">Add a surname or adjective to make it unique</span>
          {status === "error" && errorMessage === "Name taken." && (
            <span className="text-accent text-lg font-bold text-center">Name taken.</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-xl font-bold uppercase tracking-widest text-white/50">What is your team size?</span>
          <ToggleButton options={["Solo", "2 people"]} value={format} onChange={setFormat} />
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <span className="text-xl font-bold uppercase tracking-widest text-white/50">What is your skill?</span>
          <StarPicker value={skill} onChange={setSkill} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Lock size={24} className="text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Secret phrase"
              required
              disabled={isClosed}
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-20 pr-8 py-6 text-2xl md:text-3xl font-display tracking-wide text-white placeholder-white/30 focus:outline-none focus:border-accent focus:bg-white/10 transition-colors duration-500 disabled:opacity-50"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 px-4 text-center">Come up with sth to protect your spot</span>
        </div>

        <button
          type="submit"
          disabled={status === "submitting" || skill === 0 || isClosed}
          className={`mt-4 w-full py-6 rounded-2xl text-3xl md:text-4xl font-display uppercase tracking-widest transition-all duration-500 ease-out ${
            isClosed
              ? "bg-red-900/80 text-white cursor-not-allowed opacity-80"
              : "bg-accent text-ink hover:bg-white hover:scale-[1.02] shadow-[0_0_30px_rgba(245,197,24,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-accent disabled:shadow-none"
          }`}
        >
          {isClosed ? "Registration Closed" : "Register"}
        </button>
      </div>
    </form>
  );
}
