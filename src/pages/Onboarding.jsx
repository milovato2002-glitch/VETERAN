import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../lib/ProfileContext.jsx";
import { Question, BigChoice, BigBlock, CheckChoice, PrimaryButton } from "../components/ui.jsx";
import TimePicker from "../components/TimePicker.jsx";

// Branching step graph. RACE answer determines next steps.
const RACER_PATH = [
  "AGE_GATE",
  "RACE",
  "FORMAT",
  "RACE_TIME",
  "STATION_STRUGGLE",
  "TRAINING_AGE",
  "INJURY",
  "RECOVERY",
  "LIFE_STAGE",
  "GOAL",
  "DAYS",
  "EQUIPMENT",
  "LIMITER",
];

const NEW_PATH = [
  "AGE_GATE",
  "RACE",
  "FORMAT",
  "FIVEK_TIME",
  "LONGEST_RUN",
  "TRAINING_AGE",
  "INJURY",
  "RECOVERY",
  "LIFE_STAGE",
  "GOAL",
  "DAYS",
  "EQUIPMENT",
  "LIMITER",
];

export default function Onboarding() {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);

  const path = profile.hasRace === false ? NEW_PATH : RACER_PATH;
  const step = path[stepIdx] || "AGE_GATE";
  const total = path.length;
  const progress = Math.round(((stepIdx + 1) / total) * 100);

  function next() {
    if (stepIdx < path.length - 1) setStepIdx(stepIdx + 1);
    else {
      setProfile({ complete: true });
      navigate("/plan");
    }
  }
  function back() {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  }
  const update = (k, v) => setProfile({ [k]: v });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body">
      <div className="grain min-h-screen">
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent pulse-dot rounded-full" />
            <span className="font-display tracking-tight">VETERAN</span>
          </div>
          <div className="font-mono text-xs tracking-[0.2em] text-zinc-500">
            {stepIdx + 1} / {total} · {progress}%
          </div>
        </header>

        <div className="h-[2px] bg-zinc-900">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <Step
            key={step}
            step={step}
            stepIdx={stepIdx}
            total={total}
            profile={profile}
            update={update}
            next={next}
            back={back}
            canBack={stepIdx > 0}
          />
        </main>
      </div>
    </div>
  );
}

function Step({ step, stepIdx, total, profile, update, next, back, canBack }) {
  switch (step) {
    case "AGE_GATE":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="How old are you?"
          subtext="This product is built specifically for athletes 40+. Training response, recovery, and injury risk all change after 40 — and most plans ignore that."
          onBack={canBack ? back : null}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { range: "40-44", min: 40 },
              { range: "45-49", min: 45 },
              { range: "50-59", min: 50 },
              { range: "60+", min: 60 },
            ].map((b) => (
              <BigBlock
                key={b.range}
                selected={profile.age === b.min}
                onClick={() => { update("age", b.min); next(); }}
                primary={b.range}
                secondary="YEARS"
              />
            ))}
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600 mt-6">
            UNDER 40? THIS ISN'T THE RIGHT PRODUCT FOR YOU YET.
          </p>
        </Question>
      );

    case "RACE":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Have you raced HYROX?"
          subtext="If yes, your finish time is the baseline. If not, we'll build from your running and we'll ask about your training base."
          onBack={back}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <BigChoice
              selected={profile.hasRace === true}
              onClick={() => { update("hasRace", true); next(); }}
              label="YES, I'VE RACED"
              detail="One or more HYROX finishes."
            />
            <BigChoice
              selected={profile.hasRace === false}
              onClick={() => { update("hasRace", false); next(); }}
              label="NOT YET"
              detail="Aiming for my first race."
            />
          </div>
        </Question>
      );

    case "FORMAT":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Which HYROX format are you training for?"
          subtext="Doubles and Relay aren't just Singles with friends — pacing, station strategy, and role specialization all change. We tune the plan accordingly."
          onBack={back}
        >
          <div className="space-y-3">
            <BigChoice
              wide
              selected={profile.format === "singles"}
              onClick={() => { update("format", "singles"); next(); }}
              label="SINGLES"
              detail="Solo race. Just you against the clock."
            />
            <BigChoice
              wide
              selected={profile.format === "doubles"}
              onClick={() => { update("format", "doubles"); next(); }}
              label="DOUBLES"
              detail="Two-person team. You split the work, share the running."
            />
            <BigChoice
              wide
              selected={profile.format === "relay"}
              onClick={() => { update("format", "relay"); next(); }}
              label="RELAY"
              detail="Four-person team. Specialists on different stations."
            />
          </div>
        </Question>
      );

    case "RACE_TIME":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Most recent finish time"
          subtext="Total time. We'll bucket against the global Masters distribution — not the open-age one. (You're not racing 25-year-olds.)"
          onBack={back}
        >
          <TimePicker
            minutes={parseInt(profile.raceMinutes, 10) || 90}
            seconds={parseInt(profile.raceSeconds, 10) || 0}
            onChange={({ minutes, seconds }) => {
              update("raceMinutes", minutes);
              update("raceSeconds", seconds);
            }}
            minRange={[55, 150]}
          />
          <div className="mt-6">
            <PrimaryButton onClick={next} disabled={!profile.raceMinutes}>
              CONTINUE →
            </PrimaryButton>
          </div>
        </Question>
      );

    case "STATION_STRUGGLE":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Last race — which station hurt most?"
          subtext="The one that broke your pace. Specific is better than honest-but-vague. We use this to weight which stations get extra work."
          onBack={back}
        >
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { id: "ski", label: "SKI ERG" },
              { id: "sled_push", label: "SLED PUSH" },
              { id: "sled_pull", label: "SLED PULL" },
              { id: "burpees", label: "BURPEE BROAD JUMPS" },
              { id: "row", label: "ROW" },
              { id: "carry", label: "FARMERS CARRY" },
              { id: "lunges", label: "SANDBAG LUNGES" },
              { id: "wall_balls", label: "WALL BALLS" },
              { id: "runs", label: "THE RUNS THEMSELVES" },
            ].map((s) => (
              <BigChoice
                key={s.id}
                selected={profile.stationStruggle === s.id}
                onClick={() => { update("stationStruggle", s.id); next(); }}
                label={s.label}
              />
            ))}
          </div>
        </Question>
      );

    case "FIVEK_TIME":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Your 5K time"
          subtext="Best honest effort in the last 3 months. No watch? Estimate — we'll re-test in week 1."
          onBack={back}
        >
          <TimePicker
            minutes={parseInt(profile.fiveKMinutes, 10) || 25}
            seconds={parseInt(profile.fiveKSeconds, 10) || 0}
            onChange={({ minutes, seconds }) => {
              update("fiveKMinutes", minutes);
              update("fiveKSeconds", seconds);
            }}
            minRange={[16, 45]}
          />
          <button
            className="w-full mt-2 px-4 py-3 border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition"
            onClick={() => {
              update("fiveKMinutes", 28);
              update("fiveKSeconds", 0);
              next();
            }}
          >
            Not sure? Use a sensible default
          </button>
          <div className="mt-6">
            <PrimaryButton onClick={next} disabled={!profile.fiveKMinutes}>
              CONTINUE →
            </PrimaryButton>
          </div>
        </Question>
      );

    case "LONGEST_RUN":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Longest run you've done in the last month"
          subtext="Need to know if HYROX's 8 × 1km is reasonable for you, or if we should build the engine first."
          onBack={back}
        >
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { id: "<3", label: "UNDER 3 KM", detail: "We start with engine building." },
              { id: "3-5", label: "3 - 5 KM", detail: "Solid base to build from." },
              { id: "5-10", label: "5 - 10 KM", detail: "You can handle race-distance work." },
              { id: "10+", label: "10+ KM", detail: "Engine's there — we focus on quality." },
            ].map((opt) => (
              <BigChoice
                key={opt.id}
                wide
                selected={profile.longestRun === opt.id}
                onClick={() => { update("longestRun", opt.id); next(); }}
                label={opt.label}
                detail={opt.detail}
              />
            ))}
          </div>
        </Question>
      );

    case "TRAINING_AGE":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="How long have you trained consistently?"
          subtext="Years matter more than age here. A 50-year-old with 20 years of training has a different ceiling than one starting now. Both are valid — we just load you differently."
          onBack={back}
        >
          <div className="space-y-3">
            <BigChoice
              wide
              selected={profile.trainingAge === "<2"}
              onClick={() => { update("trainingAge", "<2"); next(); }}
              label="LESS THAN 2 YEARS"
              detail="Newer to consistent strength + endurance training. We build conservatively."
            />
            <BigChoice
              wide
              selected={profile.trainingAge === "2-5"}
              onClick={() => { update("trainingAge", "2-5"); next(); }}
              label="2 - 5 YEARS"
              detail="Solid base. Progressive loading."
            />
            <BigChoice
              wide
              selected={profile.trainingAge === "5+"}
              onClick={() => { update("trainingAge", "5+"); next(); }}
              label="5+ YEARS"
              detail="Trained athlete. Plan respects your existing capacity."
            />
          </div>
        </Question>
      );

    case "INJURY":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Any injury history we should respect?"
          subtext="Anything that's flared in the last 12 months. We substitute exercises and load patterns automatically."
          onBack={back}
        >
          <div className="space-y-2">
            {[
              { id: "knee", label: "KNEE", detail: "Reduces impact, swaps run intervals for row/ski." },
              { id: "back", label: "LOWER BACK", detail: "Skips deadlifts and burpees this block." },
              { id: "shoulder", label: "SHOULDER", detail: "Removes overhead and pull-ups." },
              { id: "hip", label: "HIP", detail: "Adjusts lunge volume." },
              { id: "achilles", label: "ACHILLES / CALF", detail: "Reduces high-impact running, biases bike/ski." },
            ].map((inj) => {
              const checked = profile.injuries?.includes(inj.id);
              return (
                <CheckChoice
                  key={inj.id}
                  checked={checked}
                  onClick={() => {
                    const cur = profile.injuries || [];
                    update(
                      "injuries",
                      checked ? cur.filter((x) => x !== inj.id) : [...cur, inj.id]
                    );
                  }}
                  label={inj.label}
                  detail={inj.detail}
                />
              );
            })}
          </div>
          <div className="mt-6">
            <PrimaryButton onClick={next}>
              {profile.injuries?.length
                ? `CONTINUE WITH ${profile.injuries.length} →`
                : "NONE / CONTINUE →"}
            </PrimaryButton>
          </div>
        </Question>
      );

    case "RECOVERY":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Honest check — how's recovery right now?"
          subtext="Sleep, energy, soreness, life stress. The plan reduces load this block if you're not recovering — and increases it when you are."
          onBack={back}
        >
          <div className="space-y-3">
            <BigChoice
              wide
              selected={profile.recoveryState === "good"}
              onClick={() => { update("recoveryState", "good"); next(); }}
              label="GOOD"
              detail="Sleeping 7+ hrs. Energy is solid. Life is manageable."
            />
            <BigChoice
              wide
              selected={profile.recoveryState === "okay"}
              onClick={() => { update("recoveryState", "okay"); next(); }}
              label="OKAY"
              detail="Some nights are bad. Some weeks are heavy. Mostly functional."
            />
            <BigChoice
              wide
              selected={profile.recoveryState === "poor"}
              onClick={() => { update("recoveryState", "poor"); next(); }}
              label="POOR"
              detail="Sleep is off, stress is high, or you're already gassed. We dial it back."
            />
          </div>
        </Question>
      );

    case "LIFE_STAGE":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="One sensitive question — optional."
          subtext="Hormonal stage materially affects training response after 40. We tune session structure accordingly. Skip if you'd rather not answer."
          onBack={back}
        >
          <div className="space-y-2">
            {[
              { id: "pre_meno", label: "PRE-MENOPAUSAL (F)", detail: "Standard progression." },
              { id: "peri_meno", label: "PERI-MENOPAUSAL (F)", detail: "Heavier strength bias, shorter sessions." },
              { id: "post_meno", label: "POST-MENOPAUSAL (F)", detail: "Power + strength preservation focus." },
              { id: "male", label: "MALE", detail: "Recovery emphasis scaled by age." },
              { id: "skip", label: "SKIP THIS QUESTION", detail: "We use age-only defaults." },
            ].map((opt) => (
              <BigChoice
                key={opt.id}
                wide
                selected={profile.lifeStage === opt.id}
                onClick={() => { update("lifeStage", opt.id); next(); }}
                label={opt.label}
                detail={opt.detail}
              />
            ))}
          </div>
        </Question>
      );

    case "GOAL":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Race on the calendar?"
          subtext="Drives periodization. Masters athletes peak slower — we build longer ramps."
          onBack={back}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <BigChoice
              selected={profile.goalDate && profile.goalDate !== "none"}
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() + 4);
                update("goalDate", d.toISOString().slice(0, 10));
                next();
              }}
              label="YES, ~16 WEEKS OUT"
              detail="Masters-appropriate build. Longer than open-age plans."
            />
            <BigChoice
              selected={profile.goalDate === "none"}
              onClick={() => { update("goalDate", "none"); next(); }}
              label="NO RACE YET"
              detail="Sustainable base block. Add a date when ready."
            />
          </div>
        </Question>
      );

    case "DAYS":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="Days per week available"
          subtext="Honest number. We'd rather see 4 hard days executed than 6 planned and missed. We may also recommend fewer than you select."
          onBack={back}
        >
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((d) => (
              <BigBlock
                key={d}
                selected={profile.days === d}
                onClick={() => { update("days", d); next(); }}
                primary={d}
                secondary="DAYS"
              />
            ))}
          </div>
        </Question>
      );

    case "EQUIPMENT":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="What can you actually access?"
          subtext="No fantasy gym. We substitute aggressively."
          onBack={back}
        >
          <div className="space-y-3">
            <BigChoice
              wide
              selected={profile.equipment === "full"}
              onClick={() => { update("equipment", "full"); next(); }}
              label="FULL HYROX GYM"
              detail="Sled, ski erg, rower, wall balls, kettlebells, barbells."
            />
            <BigChoice
              wide
              selected={profile.equipment === "home"}
              onClick={() => { update("equipment", "home"); next(); }}
              label="HOME / MINIMAL"
              detail="Some weights, pull-up bar, open space."
            />
            <BigChoice
              wide
              selected={profile.equipment === "run"}
              onClick={() => { update("equipment", "run"); next(); }}
              label="RUNNING ONLY"
              detail="Hills, lunges, carries — converted plan."
            />
          </div>
        </Question>
      );

    case "LIMITER":
      return (
        <Question
          number={stepIdx + 1}
          total={total}
          prompt="What blows up first in a HYROX?"
          subtext="Last question. The single most useful HYROX-specific input — drives plan structure."
          onBack={back}
        >
          <div className="space-y-3">
            <BigChoice
              wide
              selected={profile.limiter === "running"}
              onClick={() => { update("limiter", "running"); next(); }}
              label="THE RUNS"
              detail="Stations are okay. The 8 × 1km kills you."
            />
            <BigChoice
              wide
              selected={profile.limiter === "strength"}
              onClick={() => { update("limiter", "strength"); next(); }}
              label="THE STATIONS"
              detail="Engine's fine. Sled, wall balls, burpees gas you."
            />
            <BigChoice
              wide
              selected={profile.limiter === "compromised"}
              onClick={() => { update("limiter", "compromised"); next(); }}
              label="RUN AFTER STATION"
              detail="Fresh you can run. After lunges or wall balls, legs are gone."
            />
          </div>
        </Question>
      );

    default:
      return null;
  }
}
