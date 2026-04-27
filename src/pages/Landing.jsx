import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body">
      <div className="grain min-h-screen">
        {/* Header */}
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent pulse-dot rounded-full" />
            <span className="font-display text-xl tracking-tight">VETERAN</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 hidden md:inline">
              / HYROX FOR ATHLETES 40+
            </span>
          </div>
          <Link
            to="/onboarding"
            className="font-mono text-xs tracking-[0.2em] text-zinc-300 hover:text-accent transition"
          >
            BUILD MY PLAN →
          </Link>
        </header>

        {/* Hero — typographic, no photo */}
        <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12">
          <div className="font-mono text-xs tracking-[0.2em] text-accent mb-6 inline-block border border-accent/40 px-3 py-1">
            EARLY ACCESS · MASTERS DIVISION
          </div>

          <h1 className="font-display text-6xl md:text-9xl leading-[0.85] tracking-tight mb-6">
            HYROX
            <br />
            <span className="text-accent">AFTER FORTY.</span>
            <br />
            BUILT RIGHT.
          </h1>

          <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl leading-relaxed mb-10">
            Most training plans are built for 25-year-olds with extra rest days bolted on. We
            built one from the ground up for athletes who've earned every year, every injury,
            and every PR.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              to="/onboarding"
              className="px-8 py-4 bg-accent text-zinc-950 font-mono text-sm tracking-[0.2em] hover:bg-yellow-300 transition text-center"
            >
              BUILD MY PLAN — FREE →
            </Link>
            <a
              href="#how"
              className="px-8 py-4 border border-zinc-700 font-mono text-sm tracking-[0.2em] text-zinc-300 hover:border-zinc-500 transition text-center"
            >
              HOW IT WORKS
            </a>
          </div>

          {/* Photo slot — clearly marked for real imagery */}
          <PhotoSlot
            label="HERO PHOTO · 1600×900"
            note="Real Masters athletes mid-race. Two images side-by-side: one woman, one man, both 45+, mid-effort. No stock fitness, no AI imagery. Source from HYROX press kit or commission."
          />
        </section>

        {/* The wedge */}
        <section className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="font-mono text-xs tracking-[0.2em] text-accent mb-4">
              WHY THIS EXISTS
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-4xl">
              Other plans treat 50 like 25 with a longer warmup. We don't.
            </h2>

            <div className="grid md:grid-cols-3 gap-px bg-zinc-800">
              <Pillar
                kicker="01"
                title="RECOVERY DRIVES THE PLAN"
                body="Sleep, soreness, and life stress aren't side notes — they reshape your week. Bad sleep doesn't get a guilt trip, it gets a smarter session."
              />
              <Pillar
                kicker="02"
                title="INJURIES ARE INPUTS"
                body="Knee, back, shoulder, hip, achilles — every history changes which exercises you see. We substitute automatically, not just remove."
              />
              <Pillar
                kicker="03"
                title="LIFE STAGE MATTERS"
                body="Peri-menopause changes training response. So does andropause. We ask, we use it, we don't pretend it doesn't exist."
              />
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section id="how" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="font-mono text-xs tracking-[0.2em] text-accent mb-4">
            BUILT DIFFERENT
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12">
            What we ask. What others skip.
          </h2>

          <div className="border border-zinc-800">
            <ComparisonRow ours title="Training age (years of consistent training)" detail="50 with 20 years of training ≠ 50 starting now." />
            <ComparisonRow ours title="Injury history with substitutions" detail="Knee → row instead of run. Back → no deadlifts this block." />
            <ComparisonRow ours title="Current recovery state" detail="Drives volume reduction this block, not next year." />
            <ComparisonRow ours title="Hormonal / life-stage context" detail="Optional. Used to tune session length and load." />
            <ComparisonRow title="Race experience or 5K time" detail="Both us and them — table stakes." both />
            <ComparisonRow title="Equipment access" detail="Both us and them — table stakes." both />
          </div>
        </section>

        {/* Honest disclaimer — for early access trust */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-zinc-800">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 mb-2">
                EARLY ACCESS — HONEST VERSION
              </div>
              <h3 className="font-display text-2xl mb-3">This is a research preview.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We're a small team building this with the first 50 Masters athletes. The plan
                you get is a strong starting point, not a finished algorithm. We want your
                feedback. In return, you get full access free.
              </p>
            </div>
            <div>
              <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 mb-2">
                NOT MEDICAL ADVICE
              </div>
              <h3 className="font-display text-2xl mb-3">If something hurts, stop.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Plans are guidance, not prescriptions. If you have ongoing or serious injuries,
                see a sports physio before training. We bake in caution; we can't replace a
                professional.
              </p>
            </div>
            <div>
              <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 mb-2">
                NOT AFFILIATED WITH HYROX®
              </div>
              <h3 className="font-display text-2xl mb-3">Independent. Built by fans.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                HYROX® is a trademark of its owners. We're an independent training tool built
                by athletes who love the sport.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
            <h2 className="font-display text-5xl md:text-7xl leading-[0.9] mb-8">
              You've earned a plan
              <br />
              <span className="text-accent">that knows it.</span>
            </h2>
            <Link
              to="/onboarding"
              className="inline-block px-10 py-5 bg-accent text-zinc-950 font-mono text-sm tracking-[0.2em] hover:bg-yellow-300 transition"
            >
              BUILD MY PLAN — FREE →
            </Link>
            <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 mt-6">
              90 SECONDS · NO CREDIT CARD · LEAVE ANYTIME
            </p>
          </div>
        </section>

        <footer className="border-t border-zinc-800 px-6 py-6 flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          <span>VETERAN / EARLY ACCESS · v0.1</span>
          <span>BUILT FOR ATHLETES 40+</span>
        </footer>
      </div>
    </div>
  );
}

function Pillar({ kicker, title, body }) {
  return (
    <div className="bg-zinc-950 p-8 md:p-10">
      <div className="font-mono text-xs tracking-[0.2em] text-accent mb-3">{kicker}</div>
      <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">{title}</h3>
      <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{body}</p>
    </div>
  );
}

function ComparisonRow({ ours, both, title, detail }) {
  return (
    <div className="grid grid-cols-12 border-b border-zinc-800 last:border-b-0 p-4 md:p-6 items-center gap-4">
      <div className="col-span-12 md:col-span-7">
        <div className="font-display text-base md:text-xl">{title}</div>
        <div className="text-xs md:text-sm text-zinc-500 mt-1">{detail}</div>
      </div>
      <div className="col-span-6 md:col-span-2 text-center">
        <div
          className={`font-mono text-[10px] tracking-[0.2em] py-2 ${
            ours || both ? "bg-accent text-zinc-950" : "bg-zinc-900 text-zinc-700"
          }`}
        >
          {ours || both ? "ASKED ✓" : "—"}
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-600 mt-1">VETERAN</div>
      </div>
      <div className="col-span-6 md:col-span-2 text-center">
        <div
          className={`font-mono text-[10px] tracking-[0.2em] py-2 ${
            both ? "bg-zinc-700 text-zinc-200" : "bg-zinc-900 text-zinc-700"
          }`}
        >
          {both ? "ASKED ✓" : "—"}
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-600 mt-1">OTHERS</div>
      </div>
    </div>
  );
}

function PhotoSlot({ label, note }) {
  return (
    <div className="border-2 border-dashed border-zinc-700 bg-zinc-900/30 p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[400px]">
      <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 mb-3">PHOTO SLOT</div>
      <div className="font-display text-2xl md:text-3xl text-zinc-400 mb-3">{label}</div>
      <p className="font-mono text-[11px] tracking-wide text-zinc-600 max-w-md leading-relaxed">
        {note}
      </p>
    </div>
  );
}
