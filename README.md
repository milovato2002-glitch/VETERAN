# VETERAN — HYROX for Masters Athletes

A wedge MVP: HYROX training built for athletes 40+. Recovery-first, injury-aware, life-stage-aware.

## What this is

A working prototype of a HYROX training app aimed at the Masters segment (40+). Built as a
competitor wedge against Roxbase and similar age-neutral training apps.

**This is a research preview, not a finished product.** The plan-generation logic is a
defensible heuristic — it is *not* a production-grade adaptive algorithm. Treat it as a
starting point to put in front of real athletes for feedback.

## What's in here

- **Landing page** (`/`) — typographic cover, no AI imagery. Photo slot is clearly marked
  for real licensed photography (HYROX press kit, commissioned shoot, or Unsplash with
  rights cleared).
- **Onboarding** (`/onboarding`) — branching flow. Racers and non-racers go through
  different question paths.
- **Plan** (`/plan`) — Week 01 generated from profile. Includes plan adjustments and
  cautions when relevant (e.g. "you requested 6 days, we recommend 5").
- **Profile** (`/profile`) — view and edit all inputs. Plan recalculates on the fly.
- **localStorage persistence** — profile survives page refresh. No backend yet.

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm (or pnpm/yarn)

### Setup

```bash
npm install
npm run dev
```

The app opens at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

## Pushing to GitHub from VS Code

This project is GitHub-ready. Quick workflow:

1. **In VS Code:** open this folder. Make sure the Git extension is enabled (it is by default).
2. **Initialize the repo** (terminal in VS Code: `` Ctrl+` ``):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VETERAN MVP"
   ```
3. **Create the GitHub repo.** Either:
   - On github.com → New repository → name it `veteran` (or whatever) → don't initialize with README
   - Or use the GitHub CLI: `gh repo create veteran --private --source=. --remote=origin`
4. **Push:**
   ```bash
   git branch -M main
   git remote add origin git@github.com:YOUR_USERNAME/veteran.git
   git push -u origin main
   ```
5. **For ongoing changes:** in VS Code's Source Control tab (Ctrl+Shift+G), stage changes
   with the `+` icon, type a commit message, hit the checkmark, then click `...` → Push.

### Recommended VS Code extensions

- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Prettier** (`esbenp.prettier-vscode`)
- **GitLens** (`eamodio.gitlens`)

## Project structure

```
veteran/
├── public/
├── src/
│   ├── components/      # Shared UI primitives
│   │   ├── ui.jsx       # Question, BigChoice, BigBlock, etc.
│   │   └── TimePicker.jsx
│   ├── lib/
│   │   ├── ProfileContext.jsx  # State + localStorage persistence
│   │   └── planEngine.js       # Plan generation logic (heuristic)
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Plan.jsx
│   │   └── Profile.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx          # Routes + route protection
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Differentiation vs. Roxbase

These are the questions VETERAN asks that Roxbase does not:

| Question | Why it matters |
|---|---|
| Age bracket (40-44, 45-49, 50-59, 60+) | Volume scales by bracket. Wedge gate. |
| Training age (years of consistent training) | A 50yo with 20yrs ≠ 50yo starting now |
| Injury history | Drives exercise substitution (knee → row, back → no deadlifts) |
| Current recovery state | Reduces volume in the active block, not next year |
| Hormonal / life stage | Tunes session structure (peri/post-meno = strength bias, shorter sessions) |

## Known limitations (be honest with users)

- **The plan engine is a heuristic.** It is not the adaptive algorithm Roxbase markets.
  Frame it accurately to early users: "starting point, refined with your feedback."
- **No backend yet.** Profile is stored in localStorage. Lose your browser, lose your data.
  Wire to Supabase or similar before public launch.
- **Only Week 01 is generated.** Full periodization across 12-16 weeks is not implemented.
- **Photo slot on landing is empty.** Drop in licensed Masters athlete photography before showing this to anyone outside the build team.
- **Strength-level question is intentionally absent.** We use training age + recovery state
  + injury history instead — more reliable signal than self-rating.

## Suggested next steps

In rough order:

1. **User research first.** Get this in front of 5 Masters HYROX athletes and watch them
   onboard. You will learn things in 30 minutes that 30 hours of building won't teach you.
2. **Source real photography** for the landing page photo slot.
3. **Wire to Supabase** for real persistence + auth.
4. **Build full periodization** (12-16 weeks, not just Week 01).
5. **Build the refinement flow** — currently stubbed with the "Refine Further" CTA.
6. **Recovery integration** (Apple Health, Whoop, Oura) for real-signal recovery state.

## Disclaimer

VETERAN is an independent training tool. Not affiliated with HYROX®. Plans are guidance,
not medical or coaching prescriptions. Athletes with serious or ongoing injuries should
consult a sports physio.

## License

Private / proprietary. All rights reserved.
