"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarPicker({ value, onChange }: StarPickerProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex -space-x-2 md:-space-x-4">
      {[1, 2, 3].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={48}
            className={`transition-all duration-500 ease-out transform ${
              star <= (hoverValue || value)
                ? "fill-accent text-accent scale-105 drop-shadow-[0_0_15px_rgba(245,197,24,0.4)]"
                : "text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
