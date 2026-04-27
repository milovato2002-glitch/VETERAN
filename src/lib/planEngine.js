// ============================================================================
// Plan generation. Heuristic — meant to be replaced with a real algorithm
// once we have user data. Treat this as a starting point.
// ============================================================================

export function levelFromProfile(profile) {
  const m = parseInt(profile.raceMinutes, 10);
  if (profile.hasRace && m) {
    // Masters-aware bucketing — these are slower than open-age cutoffs
    if (m <= 75) return "elite";
    if (m <= 85) return "strong";
    if (m <= 100) return "mid";
    return "developing";
  }
  // 5K-based for non-racers
  const totalSeconds =
    (parseInt(profile.fiveKMinutes, 10) || 0) * 60 +
    (parseInt(profile.fiveKSeconds, 10) || 0);
  if (totalSeconds && totalSeconds <= 22 * 60) return "strong";
  if (totalSeconds && totalSeconds <= 27 * 60) return "mid";
  return "developing";
}

export function ageBracket(age) {
  if (age >= 60) return "60+";
  if (age >= 50) return "50-59";
  if (age >= 45) return "45-49";
  return "40-44";
}

export function generatePlan(profile) {
  const level = levelFromProfile(profile);
  const bracket = ageBracket(profile.age);

  const ageVolMult = { "40-44": 1.0, "45-49": 0.92, "50-59": 0.85, "60+": 0.75 }[bracket];
  const trainingFactor =
    profile.trainingAge === "<2" ? 0.8 : profile.trainingAge === "2-5" ? 0.9 : 1.0;
  const recoveryFactor =
    profile.recoveryState === "poor" ? 0.8 : profile.recoveryState === "okay" ? 0.95 : 1.0;

  // Format adjustments:
  //  - Doubles: ~15% lower total volume (partner shares running + stations), but
  //    intensity per session is higher because efforts are shorter and harder.
  //  - Relay: ~20% lower running volume since each athlete only runs their leg —
  //    we redirect that capacity toward station specialization.
  const formatVolMult =
    profile.format === "doubles" ? 0.85 : profile.format === "relay" ? 0.80 : 1.0;

  const baseSessions = { developing: 3, mid: 4, strong: 5, elite: 6 }[level];
  const dayCap = profile.age >= 60 ? 4 : profile.age >= 50 ? 5 : 6;
  const recommendedDays = Math.min(
    profile.days || baseSessions,
    dayCap,
    Math.max(3, Math.round(baseSessions * trainingFactor * recoveryFactor))
  );

  const baseRunKm = { developing: 18, mid: 25, strong: 35, elite: 45 }[level];
  const runKm = Math.round(
    baseRunKm * ageVolMult * trainingFactor * recoveryFactor * formatVolMult
  );

  const week = buildWeek({ ...profile, level, bracket, recommendedDays, runKm });
  const cautions = buildCautions(profile, recommendedDays);

  return {
    level,
    bracket,
    runKm,
    recommendedDays,
    userRequestedDays: profile.days,
    week,
    cautions,
    deloadEveryWeeks: profile.age >= 50 ? 3 : 4,
  };
}

function buildWeek({ recommendedDays, limiter, injuries = [], age, runKm, format, stationStruggle }) {
  const hasKnee = injuries.includes("knee");
  const hasBack = injuries.includes("back");
  const hasShoulder = injuries.includes("shoulder");
  const hasAchilles = injuries.includes("achilles");
  const isDoubles = format === "doubles";
  const isRelay = format === "relay";

  const lib = {
    mobility: {
      title: "MOBILITY + ACTIVATION",
      detail: "20min: hips, t-spine, ankles. Non-negotiable before any training session this week.",
      tag: "MOBILITY",
    },
    threshold: {
      title: hasKnee || hasAchilles ? "THRESHOLD ROW/SKI" : "THRESHOLD RUN",
      detail:
        hasKnee || hasAchilles
          ? isDoubles
            ? "5 × 800m row @ threshold+, 60s rest. 10min easy warmup. Doubles intervals run shorter and harder."
            : "4 × 1000m row @ threshold, 90s rest. 10min easy warmup."
          : isDoubles
            ? "5 × 600m @ threshold+, 60s rest. 15min easy warmup. Shorter, harder — matches doubles run splits."
            : "4 × 800m @ threshold pace, 90s rest. 15min easy warmup first.",
      tag: "ENGINE",
    },
    longAerobic: {
      title: hasKnee ? "LONG ZONE 2 BIKE/SKI" : "LONG AEROBIC RUN",
      detail: hasKnee
        ? `${Math.round(runKm * 0.8)}min Z2 on bike or ski erg.`
        : `${Math.round(runKm * 0.35)}km easy. Conversational pace.`,
      tag: "ENGINE",
    },
    compromisedRun: {
      title: "COMPROMISED RUN INTERVALS",
      detail: hasKnee
        ? "8 × (400m row + 50m walking lunges). Rest 60s. Run-after-station feel without knee load."
        : "6 × (400m run + 40m lunges). Rest 90s. Builds run-after-station legs.",
      tag: "HYBRID",
    },
    // Doubles-specific replacement for compromisedRun. Mimics the back-and-forth
    // of a doubles race: you're cooling from station work, then partner taps
    // out and you sprint into a run. Different physiological demand than
    // singles' compromised running.
    compromisedPacing: {
      title: "PARTNER-AWARE COMPROMISED PACING",
      detail: hasKnee
        ? "8 rounds: 30s ski (hard) + 200m row (race-pace) + 60s rest. Simulates partner hand-offs."
        : "8 rounds: 30s wall balls (race pace) + 400m run (target split) + 60s rest. Run starts mid-station-fatigue, like a real doubles tag.",
      tag: "HYBRID",
    },
    stationCircuit: {
      title: "STATION CIRCUIT",
      detail: hasBack
        ? "3 rounds: 40 wall balls, 60m sled push (light), 80m farmers carry. No burpees this block."
        : "3 rounds: 50 wall balls, 80m sled push, 100m farmers carry, 50 burpee broad jumps. 3min rest between rounds.",
      tag: "STATIONS",
    },
    // Relay specialist block — leans hard on whichever station the athlete
    // flagged as their weak point. In a 4-person relay each athlete typically
    // owns a subset of stations, so we over-train the limiter rather than
    // generalising.
    relaySpecialist: relaySpecialistSession(stationStruggle, hasBack, hasShoulder),
    strengthLower: {
      title: hasBack ? "LOWER STRENGTH (BACK-SAFE)" : "POSTERIOR CHAIN STRENGTH",
      detail: hasBack
        ? "Goblet squat 4×8, hip thrust 4×10, hamstring curl 3×12. No deadlifts this block."
        : "Trap bar deadlift 4×6, Bulgarian split squat 3×8/leg, hamstring curl 3×12.",
      tag: "STRENGTH",
    },
    strengthUpper: {
      title: hasShoulder ? "UPPER PULL (SHOULDER-SAFE)" : "UPPER PULL + CORE",
      detail: hasShoulder
        ? "Ring rows 4×8, face pulls 3×15, deadbug 3×10/side. No overhead this block."
        : "Pull-ups 4×6, ring rows 3×10, hanging leg raise 3×12, plank 3×60s.",
      tag: "STRENGTH",
    },
    activeRecovery: {
      title: "ACTIVE RECOVERY",
      detail: "30-45min walk, easy bike, or yoga. Drives recovery — not optional after age 45.",
      tag: "RECOVERY",
    },
    fullRest: {
      title: "FULL REST",
      detail: "Sleep priority. Hydrate. The plan only works if you actually rest.",
      tag: "RECOVERY",
    },
  };

  // For doubles, swap the compromisedRun template entry for the partner-aware
  // version so any limiter path that surfaces it gets the doubles flavor.
  if (isDoubles) lib.compromisedRun = lib.compromisedPacing;

  let template;
  if (isDoubles) {
    // Doubles always gets one compromised-pacing session regardless of limiter
    // — it's a feature of the format, not a weakness fix.
    template = [lib.threshold, lib.activeRecovery, lib.compromisedPacing, lib.strengthLower, lib.longAerobic, lib.strengthUpper];
  } else if (isRelay) {
    // Relay leans on station specialization. Replace the generic station
    // circuit with the targeted specialist block, keep one running session,
    // bias the rest toward strength and station work.
    template = [lib.relaySpecialist, lib.strengthLower, lib.activeRecovery, lib.threshold, lib.relaySpecialist, lib.strengthUpper];
  } else if (limiter === "compromised") {
    template = [lib.threshold, lib.activeRecovery, lib.compromisedRun, lib.strengthLower, lib.longAerobic, lib.strengthUpper];
  } else if (limiter === "strength") {
    template = [lib.strengthLower, lib.activeRecovery, lib.threshold, lib.stationCircuit, lib.longAerobic, lib.strengthUpper];
  } else {
    template = [lib.threshold, lib.strengthLower, lib.activeRecovery, lib.longAerobic, lib.stationCircuit, lib.strengthUpper];
  }

  const minRestDays = age >= 50 ? 2 : 1;
  const active = template.slice(0, recommendedDays);
  const restCount = 7 - recommendedDays;
  const recoveryDays = [];
  for (let i = 0; i < restCount; i++) {
    recoveryDays.push(i < minRestDays ? lib.fullRest : lib.activeRecovery);
  }
  return [lib.mobility, ...active, ...recoveryDays].slice(0, 7);
}

function relaySpecialistSession(stationStruggle, hasBack, hasShoulder) {
  const focus = {
    ski: {
      title: "SKI SPECIALIST",
      detail: "5 × 500m ski erg @ race pace, 90s rest. Then 3 × 250m all-out, 2min rest. Own this station for your team.",
    },
    sled_push: {
      title: "SLED PUSH SPECIALIST",
      detail: "6 × 25m heavy sled push, 90s rest. Then 4 × 50m moderate at race tempo. Drive through the floor.",
    },
    sled_pull: {
      title: "SLED PULL SPECIALIST",
      detail: "6 × 25m heavy sled pull, 90s rest. Then 4 × 50m at race tempo. Hip hinge, low stance.",
    },
    burpees: hasBack
      ? {
          title: "BURPEE STAND-IN (BACK-SAFE)",
          detail: "Step-down burpees, no jump. 8 × 20 reps, 60s rest. Work the bend pattern without spinal load.",
        }
      : {
          title: "BURPEE BROAD JUMP SPECIALIST",
          detail: "8 × 15 burpee broad jumps, 60s rest. Then 4 × 20m broad jumps for power. Chest-down, full hip extension.",
        },
    row: {
      title: "ROW SPECIALIST",
      detail: "5 × 500m row @ race pace, 90s rest. Then 3 × 250m all-out, 2min rest. Drive legs first, hands second.",
    },
    carry: {
      title: "FARMERS CARRY SPECIALIST",
      detail: "6 × 100m heavy carry, 2min rest. Then 4 × 50m at race weight, fast. Grip + trunk endurance.",
    },
    lunges: {
      title: "SANDBAG LUNGE SPECIALIST",
      detail: "5 × 50m heavy walking lunges, 2min rest. Then 4 × 25m unloaded for speed. Knee tracks toes.",
    },
    wall_balls: {
      title: "WALL BALL SPECIALIST",
      detail: hasShoulder
        ? "8 × 25 wall balls @ race-target height, 60s rest. Lighter ball, lower target — no shoulder flare-up."
        : "10 × 25 wall balls @ race-target height, 60s rest. Then 3 × 30 unbroken. Stand tall, full extension.",
    },
    runs: {
      title: "RELAY RUN-LEG SPECIALIST",
      detail: "4 × 1km @ goal pace, 2min rest. Each rep simulates your race-day leg. Negative-split the last one.",
    },
  }[stationStruggle];

  if (focus) return { ...focus, tag: "STATIONS" };

  // No stationStruggle selected — fall back to a balanced station block.
  return {
    title: "RELAY STATION BLOCK",
    detail: "3 rounds: 40 wall balls, 60m sled push, 80m farmers carry, 30 burpee broad jumps. 2min rest. Find your specialty.",
    tag: "STATIONS",
  };
}

function buildCautions(profile, recommendedDays) {
  const cautions = [];
  const formatNote = buildFormatNote(profile);
  if (formatNote) cautions.push(formatNote);
  if (profile.recoveryState === "poor") {
    cautions.push("Recovery markers are low — plan reduced this block. Re-check in 7 days.");
  }
  if (profile.injuries?.length) {
    cautions.push(`Substitutions made for: ${profile.injuries.join(", ")}. Adjust further in profile.`);
  }
  if (profile.days && profile.days > recommendedDays) {
    cautions.push(
      `You requested ${profile.days} days but we recommend ${recommendedDays} for your profile. Sustainable beats heroic.`
    );
  }
  if (profile.lifeStage === "peri_meno" || profile.lifeStage === "post_meno") {
    cautions.push("Plan emphasizes strength + power retention. Heavier loads, shorter sessions.");
  }
  return cautions;
}

function buildFormatNote(profile) {
  if (profile.format === "doubles") {
    return "Plan tuned for HYROX Doubles — reduced total volume, higher intensity, partner-aware sessions.";
  }
  if (profile.format === "relay") {
    const struggle = profile.stationStruggle;
    const focus = struggle && struggle !== "runs" ? ` Extra weight on ${stationLabel(struggle)}.` : "";
    return `Plan tuned for HYROX Relay — running volume reduced, station specialization prioritized.${focus}`;
  }
  return null;
}

function stationLabel(id) {
  return {
    ski: "ski erg",
    sled_push: "sled push",
    sled_pull: "sled pull",
    burpees: "burpee broad jumps",
    row: "row",
    carry: "farmers carry",
    lunges: "sandbag lunges",
    wall_balls: "wall balls",
    runs: "the runs",
  }[id] || id;
}
