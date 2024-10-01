import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SpellingPage from "./pages/SpellingPage";
import MathsPage from "./pages/MathsPage";
import SentencesPage from "./pages/SentencesPage";
import WordSearchPage from "./pages/WordSearchPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const journalRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <HomePage />
      </>
    ),
  },
  {
    path: "/spelling",
    element: (
      <>
        <Navbar />
        <SpellingPage />
      </>
    ),
  },
  {
    path: "/maths",
    element: (
      <>
        <Navbar />
        <MathsPage />
      </>
    ),
  },
  {
    path: "/sentences",
    element: (
      <>
        <Navbar />
        <SentencesPage />
      </>
    ),
  },
  {
    path: "/word-search",
    element: (
      <>
        <Navbar />
        <WordSearchPage />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <ProfilePage />
      </>
    ),
  },
  {
    path: "/settings",
    element: (
      <>
        <Navbar />
        <SettingsPage />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={journalRouter} />;
}

export default App;
