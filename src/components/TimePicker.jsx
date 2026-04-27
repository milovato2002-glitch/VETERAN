import { useRef, useEffect } from "react";

/**
 * Scroll-wheel time picker (minutes : seconds).
 * Pattern inspired by Roxbase's onboarding — better UX than typing
 * a number for time inputs on mobile. Keyboard fallback included.
 */
export default function TimePicker({
  minutes,
  seconds,
  onChange,
  minRange = [15, 60],
  secRange = [0, 59],
  step = 1,
}) {
  const minOptions = range(minRange[0], minRange[1], step);
  const secOptions = range(secRange[0], secRange[1], 5);

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <Wheel
        options={minOptions}
        value={minutes}
        onChange={(v) => onChange({ minutes: v, seconds })}
        ariaLabel="Minutes"
      />
      <div className="font-display text-4xl text-accent">:</div>
      <Wheel
        options={secOptions}
        value={seconds}
        onChange={(v) => onChange({ minutes, seconds: v })}
        ariaLabel="Seconds"
        format={(v) => String(v).padStart(2, "0")}
      />
    </div>
  );
}

function Wheel({ options, value, onChange, ariaLabel, format = (v) => v }) {
  const containerRef = useRef(null);
  const itemHeight = 50;

  useEffect(() => {
    if (!containerRef.current) return;
    const idx = options.indexOf(value);
    if (idx >= 0) {
      containerRef.current.scrollTop = idx * itemHeight;
    }
  }, [value, options]);

  function handleScroll(e) {
    const idx = Math.round(e.target.scrollTop / itemHeight);
    const newValue = options[Math.max(0, Math.min(options.length - 1, idx))];
    if (newValue !== value) onChange(newValue);
  }

  return (
    <div className="relative w-24 h-[150px] border-2 border-zinc-800 bg-zinc-900/50">
      {/* selection band */}
      <div
        className="absolute left-0 right-0 border-y border-accent/40 bg-accent/5 pointer-events-none"
        style={{ top: itemHeight, height: itemHeight }}
      />
      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        <div style={{ height: itemHeight }} aria-hidden />
        {options.map((opt) => (
          <div
            key={opt}
            className={`h-[50px] flex items-center justify-center font-display text-3xl snap-center transition ${
              opt === value ? "text-accent" : "text-zinc-600"
            }`}
            style={{ scrollSnapAlign: "center" }}
          >
            {format(opt)}
          </div>
        ))}
        <div style={{ height: itemHeight }} aria-hidden />
      </div>
    </div>
  );
}

function range(start, end, step) {
  const out = [];
  for (let i = start; i <= end; i += step) out.push(i);
  return out;
}
