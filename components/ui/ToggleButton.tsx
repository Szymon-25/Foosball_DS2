"use client";

interface ToggleButtonProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function ToggleButton({ options, value, onChange }: ToggleButtonProps) {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-8 py-4 text-2xl font-display tracking-widest rounded-full transition-all duration-500 ease-out border ${
            value === option
              ? "bg-accent text-ink border-accent scale-105 shadow-[0_0_20px_rgba(245,197,24,0.3)]"
              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
