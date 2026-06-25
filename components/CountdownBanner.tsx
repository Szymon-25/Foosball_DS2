"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/config/event";
import { Clock } from "lucide-react";

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const deadline = new Date(eventConfig.registrationDeadline).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!isClient || !timeLeft) return null;

  const isClosed = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className={`sticky top-0 z-50 w-full backdrop-blur-md px-4 py-3 border-b transition-colors duration-500 ${isClosed ? 'bg-red-900/80 border-red-500/50 text-white' : 'bg-accent/90 border-accent/50 text-ink'}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-2">
        <div className="flex items-center gap-2 font-display uppercase tracking-widest text-sm md:text-lg">
          <Clock size={20} />
          <span>Registration closes 20:45 26.06</span>
        </div>
        
        <div className="font-display text-xl md:text-3xl tracking-wide flex items-center gap-2">
          {isClosed ? (
            <span className="font-bold">Registration Closed</span>
          ) : (
            <>
              <span className="font-bold">
                {timeLeft.hours.toString().padStart(2, '0')}:
                {timeLeft.minutes.toString().padStart(2, '0')}:
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-sm md:text-lg opacity-80 uppercase tracking-widest">Remaining</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
