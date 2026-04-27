import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "veteran:profile:v1";
const ProfileContext = createContext(null);

const EMPTY_PROFILE = {
  complete: false,
  age: null,
  hasRace: null,
  format: null, // "singles" | "doubles" | "relay"
  raceMinutes: null,
  fiveKMinutes: null,
  fiveKSeconds: null,
  trainingAge: null,
  injuries: [],
  recoveryState: null,
  lifeStage: null,
  goalDate: null,
  days: null,
  equipment: null,
  limiter: null,
  // Race-experienced specifics
  stationStruggle: null, // which station hurt most last race
  // Non-racer specifics
  longestRun: null, // longest comfortable run (km)
};

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
    } catch {
      return EMPTY_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage may be unavailable in private mode — fail silently
    }
  }, [profile]);

  function setProfile(updater) {
    setProfileState((prev) =>
      typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
    );
  }

  function reset() {
    setProfileState(EMPTY_PROFILE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, reset }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
