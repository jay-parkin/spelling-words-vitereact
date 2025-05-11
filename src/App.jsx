// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout";
import HomePage from "./pages/HomePage";
import SpellingPage from "./pages/SpellingPage";
import MathsPage from "./pages/MathsPage";
import SentencesPage from "./pages/SentencesPage";
import WordSearchPage from "./pages/WordSearchPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Header from "./components/Header";

import { useUser } from "./contexts/UserContext";

function App() {
  const { user } = useUser();
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<DashboardLayout />}>
            <Route index element={<HomePage user={user} />} />
            <Route path="spelling" element={<SpellingPage user={user} />} />
            <Route path="maths" element={<MathsPage />} />
            <Route path="sentences" element={<SentencesPage />} />
            <Route path="word-search" element={<WordSearchPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
