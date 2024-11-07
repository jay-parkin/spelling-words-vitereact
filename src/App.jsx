import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SpellingPage from "./pages/SpellingPage";
import MathsPage from "./pages/MathsPage";
import SentencesPage from "./pages/SentencesPage";
import WordSearchPage from "./pages/WordSearchPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

const journalRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <HomePage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/spelling",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <SpellingPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/maths",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <MathsPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sentences",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <SentencesPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/word-search",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <WordSearchPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <ProfilePage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <SettingsPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: (
      <>
        <AuthPage />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={journalRouter} />;
}

export default App;
