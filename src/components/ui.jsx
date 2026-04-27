export function Question({ number, total, prompt, subtext, children, onBack }) {
  return (
    <div className="slide-up">
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-xs tracking-[0.2em] text-accent">
          Q.{String(number).padStart(2, "0")}
          {total ? `/${String(total).padStart(2, "0")}` : ""}
        </span>
        {onBack && (
          <button
            onClick={onBack}
            className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition"
          >
            ← BACK
          </button>
        )}
      </div>
      <h1 className="font-display text-4xl md:text-6xl leading-[0.95] mb-4 text-balance">
        {prompt}
      </h1>
      {subtext && (
        <p className="text-zinc-400 mb-10 max-w-2xl text-sm md:text-base leading-relaxed">
          {subtext}
        </p>
      )}
      {children}
    </div>
  );
}

export function BigChoice({ selected, onClick, label, detail, wide }) {
  return (
    <button
      onClick={onClick}
      className={`group text-left border-2 p-5 transition-all duration-200 ${
        selected
          ? "border-accent bg-accent/5"
          : "border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/50"
      } ${wide ? "w-full" : ""}`}
    >
      <div className="font-display text-xl md:text-2xl mb-1 group-hover:text-yellow-300 transition">
        {label}
      </div>
      {detail && (
        <div className="text-xs md:text-sm text-zinc-400 leading-relaxed">{detail}</div>
      )}
    </button>
  );
}

export function BigBlock({ selected, onClick, primary, secondary }) {
  return (
    <button
      onClick={onClick}
      className={`border-2 py-7 transition-all ${
        selected ? "border-accent bg-accent/10" : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      <div className="font-display text-4xl md:text-5xl">{primary}</div>
      {secondary && (
        <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mt-1">
          {secondary}
        </div>
      )}
    </button>
  );
}

export function CheckChoice({ checked, onClick, label, detail }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border-2 p-4 transition-all ${
        checked ? "border-accent bg-accent/5" : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
            checked ? "border-accent bg-accent" : "border-zinc-600"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="w-3 h-3 text-zinc-950">
              <path d="M2 6 L5 9 L10 3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </div>
        <div>
          <div className="font-display text-lg md:text-xl">{label}</div>
          {detail && <div className="text-xs md:text-sm text-zinc-400 mt-1">{detail}</div>}
        </div>
      </div>
    </button>
  );
}

export function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-accent text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 font-mono text-xs tracking-[0.2em] hover:bg-yellow-300 transition"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 border border-zinc-700 font-mono text-xs tracking-[0.2em] text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition"
    >
      {children}
    </button>
  );
}
