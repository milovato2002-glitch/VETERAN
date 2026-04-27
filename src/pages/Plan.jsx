import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../lib/ProfileContext.jsx";
import { generatePlan } from "../lib/planEngine.js";

export default function Plan() {
  const { profile } = useProfile();
  const plan = useMemo(() => generatePlan(profile), [profile]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body">
      <div className="grain min-h-screen">
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent pulse-dot rounded-full" />
            <span className="font-display tracking-tight">VETERAN</span>
          </Link>
          <Link
            to="/profile"
            className="font-mono text-xs tracking-[0.2em] text-zinc-300 hover:text-accent transition"
          >
            PROFILE →
          </Link>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 slide-up">
          <div className="font-mono text-xs tracking-[0.2em] text-accent mb-3">PLAN.GENERATED</div>
          <h1 className="font-display text-4xl md:text-7xl leading-[0.85] mb-3">
            WEEK 01<br />
            <span className="text-zinc-500">READY.</span>
          </h1>
          <p className="text-zinc-400 mb-8 max-w-xl text-sm md:text-base">
            Built for the {plan.bracket} bracket. Recovery-weighted, injury-aware. Deload every {plan.deloadEveryWeeks} weeks.
          </p>

          {plan.cautions.length > 0 && (
            <div className="border-l-4 border-accent bg-accent/5 p-4 mb-8 space-y-2">
              <div className="font-mono text-[10px] tracking-[0.2em] text-accent">PLAN ADJUSTMENTS</div>
              {plan.cautions.map((c, i) => (
                <p key={i} className="text-sm text-zinc-200">{c}</p>
              ))}
            </div>
          )}

          <div className="border border-zinc-800 mb-10 grid grid-cols-2 md:grid-cols-4">
            <SummaryCell label="LEVEL" value={plan.level.toUpperCase()} />
            <SummaryCell
              label="DAYS / WEEK"
              value={
                plan.recommendedDays !== plan.userRequestedDays
                  ? `${plan.recommendedDays} (was ${plan.userRequestedDays})`
                  : `${plan.recommendedDays}`
              }
            />
            <SummaryCell label="RUN VOLUME" value={`~${plan.runKm} km`} />
            <SummaryCell label="DELOAD" value={`EVERY ${plan.deloadEveryWeeks} WK`} highlight />
          </div>

          <div className="space-y-2 mb-10">
            {plan.week.map((session, i) => (
              <DayRow key={i} day={i + 1} session={session} />
            ))}
          </div>

          <div className="border-2 border-zinc-800 p-6 md:p-8">
            <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 mb-2">
              OPTIONAL · POST-PLAN
            </div>
            <h2 className="font-display text-2xl md:text-4xl mb-2">REFINE FURTHER</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-xl">
              Add station PRs, sleep tracker integration, mobility baseline test. Tunes the next 11
              weeks. Or start training and refine later.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Link
                to="/profile"
                className="px-6 py-3 bg-accent text-zinc-950 font-mono text-xs tracking-[0.2em] hover:bg-yellow-300 transition text-center"
              >
                EDIT PROFILE →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, highlight }) {
  return (
    <div
      className={`p-4 ${highlight ? "bg-accent/5" : ""} border-r border-b border-zinc-800 last:border-r-0`}
    >
      <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mb-1">{label}</div>
      <div className={`text-sm font-medium ${highlight ? "text-accent" : "text-zinc-100"}`}>{value}</div>
    </div>
  );
}

function DayRow({ day, session }) {
  const tagStyles = {
    ENGINE: "bg-accent/10 text-accent",
    STRENGTH: "bg-zinc-100 text-zinc-950",
    HYBRID: "bg-accent text-zinc-950",
    STATIONS: "bg-orange-400/20 text-orange-300",
    MOBILITY: "bg-zinc-800 text-zinc-300",
    RECOVERY: "bg-zinc-900 text-zinc-600",
  };
  const isLowKey = session.tag === "RECOVERY" || session.tag === "MOBILITY";

  return (
    <div
      className={`border ${isLowKey ? "border-zinc-900" : "border-zinc-800"} p-4 md:p-5 grid grid-cols-12 gap-4 items-center`}
    >
      <div className="col-span-2 md:col-span-1">
        <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">DAY</div>
        <div className="font-display text-2xl md:text-3xl">{String(day).padStart(2, "0")}</div>
      </div>
      <div className="col-span-7 md:col-span-8">
        <div className={`font-display text-base md:text-xl ${isLowKey ? "text-zinc-500" : ""}`}>
          {session.title}
        </div>
        <div
          className={`text-xs md:text-sm mt-1 leading-relaxed ${
            isLowKey ? "text-zinc-700" : "text-zinc-400"
          }`}
        >
          {session.detail}
        </div>
      </div>
      <div className="col-span-3 text-right">
        <span
          className={`font-mono text-[10px] tracking-[0.2em] px-2 py-1 ${tagStyles[session.tag]}`}
        >
          {session.tag}
        </span>
      </div>
    </div>
  );
}
