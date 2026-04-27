import { Routes, Route, Navigate } from "react-router-dom";
import { ProfileProvider, useProfile } from "./lib/ProfileContext.jsx";
import Landing from "./pages/Landing.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Plan from "./pages/Plan.jsx";
import Profile from "./pages/Profile.jsx";

function RequireProfile({ children }) {
  const { profile } = useProfile();
  if (!profile?.complete) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/plan"
          element={
            <RequireProfile>
              <Plan />
            </RequireProfile>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProfileProvider>
  );
}
