import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../lib/ProfileContext.jsx";

export default function Profile() {
  const { profile, setProfile, reset } = useProfile();
  const navigate = useNavigate();

  function handleReset() {
    if (confirm("This will clear your profile and plan. Are you sure?")) {
      reset();
      navigate("/");
    }
  }

  const fields = [
    { label: "AGE BRACKET", value: ageBracketLabel(profile.age), key: "age" },
    { label: "RACE EXPERIENCE", value: profile.hasRace === true ? "Raced HYROX" : profile.hasRace === false ? "Not yet" : "—" },
    { label: "BASELINE", value: baselineLabel(profile) },
    { label: "TRAINING AGE", value: profile.trainingAge ? trainingAgeLabel(profile.trainingAge) : "—" },
    { label: "INJURIES", value: profile.injuries?.length ? profile.injuries.join(", ").toUpperCase() : "NONE" },
    { label: "RECOVERY STATE", value: profile.recoveryState ? profile.recoveryState.toUpperCase() : "—" },
    { label: "LIFE STAGE", value: profile.lifeStage ? lifeStageLabel(profile.lifeStage) : "—" },
    { label: "RACE GOAL", value: profile.goalDate === "none" ? "No race scheduled" : profile.goalDate || "—" },
    { label: "DAYS / WEEK", value: profile.days ? `${profile.days}` : "—" },
    { label: "EQUIPMENT", value: profile.equipment ? equipmentLabel(profile.equipment) : "—" },
    { label: "PRIMARY LIMITER", value: profile.limiter ? limiterLabel(profile.limiter) : "—" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body">
      <div className="grain min-h-screen">
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent pulse-dot rounded-full" />
            <span className="font-display tracking-tight">VETERAN</span>
          </Link>
          <Link
            to="/plan"
            className="font-mono text-xs tracking-[0.2em] text-zinc-300 hover:text-accent transition"
          >
            ← BACK TO PLAN
          </Link>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 md:py-16 slide-up">
          <div className="font-mono text-xs tracking-[0.2em] text-accent mb-3">PROFILE</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.9] mb-4">
            Your inputs.<br />
            <span className="text-zinc-500">All editable.</span>
          </h1>
          <p className="text-zinc-400 mb-10 max-w-xl text-sm md:text-base">
            Anything change? Update it. Plan recalculates automatically.
          </p>

          <div className="border border-zinc-800 mb-10">
            {fields.map((f, i) => (
              <Row key={i} label={f.label} value={f.value} last={i === fields.length - 1} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-12">
            <Link
              to="/onboarding"
              className="px-6 py-3 bg-accent text-zinc-950 font-mono text-xs tracking-[0.2em] hover:bg-yellow-300 transition text-center"
            >
              EDIT PROFILE →
            </Link>
            <Link
              to="/plan"
              className="px-6 py-3 border border-zinc-700 font-mono text-xs tracking-[0.2em] text-zinc-300 hover:border-zinc-500 transition text-center"
            >
              VIEW PLAN
            </Link>
          </div>

          <div className="border-t border-zinc-800 pt-8">
            <h3 className="font-display text-xl mb-2">Danger zone</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Clear all profile data. Cannot be undone.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-red-900 font-mono text-xs tracking-[0.2em] text-red-400 hover:bg-red-950/30 hover:border-red-700 transition"
            >
              RESET PROFILE
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div
      className={`grid grid-cols-12 gap-4 p-4 md:p-5 ${
        last ? "" : "border-b border-zinc-800"
      } items-center`}
    >
      <div className="col-span-12 md:col-span-4 font-mono text-[10px] tracking-[0.2em] text-zinc-500">
        {label}
      </div>
      <div className="col-span-12 md:col-span-8 font-display text-base md:text-lg">
        {value || "—"}
      </div>
    </div>
  );
}

function ageBracketLabel(age) {
  if (!age) return "—";
  if (age >= 60) return "60+ YEARS";
  if (age >= 50) return "50-59 YEARS";
  if (age >= 45) return "45-49 YEARS";
  return "40-44 YEARS";
}
function baselineLabel(p) {
  if (p.hasRace && p.raceMinutes) {
    return `RACE: ${p.raceMinutes}:${String(p.raceSeconds || 0).padStart(2, "0")}`;
  }
  if (p.fiveKMinutes) {
    return `5K: ${p.fiveKMinutes}:${String(p.fiveKSeconds || 0).padStart(2, "0")}`;
  }
  return "—";
}
function trainingAgeLabel(t) {
  return { "<2": "UNDER 2 YEARS", "2-5": "2-5 YEARS", "5+": "5+ YEARS" }[t] || t;
}
function lifeStageLabel(l) {
  return {
    pre_meno: "PRE-MENOPAUSAL",
    peri_meno: "PERI-MENOPAUSAL",
    post_meno: "POST-MENOPAUSAL",
    male: "MALE",
    skip: "PREFERRED NOT TO ANSWER",
  }[l] || l;
}
function equipmentLabel(e) {
  return { full: "FULL HYROX GYM", home: "HOME / MINIMAL", run: "RUNNING ONLY" }[e] || e;
}
function limiterLabel(l) {
  return { running: "THE RUNS", strength: "THE STATIONS", compromised: "RUN AFTER STATION" }[l] || l;
}
