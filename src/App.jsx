import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/App.css";
import HomePage from "./pages/HomePage";
import SpellingPage from "./pages/SpellingPage";
import MathsPage from "./pages/MathsPage";
import SentencesPage from "./pages/SentencesPage";
import WordSearchPage from "./pages/WordSearchPage";
import NavigationBar from "./components/NavigationBar";
import ProfilePage from "./pages/ProfilePage";

const journalRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavigationBar />
        <HomePage />
      </>
    ),
  },
  {
    path: "/spelling",
    element: (
      <>
        <NavigationBar />
        <SpellingPage />
      </>
    ),
  },
  {
    path: "/maths",
    element: (
      <>
        <NavigationBar />
        <MathsPage />
      </>
    ),
  },
  {
    path: "/sentences",
    element: (
      <>
        <NavigationBar />
        <SentencesPage />
      </>
    ),
  },
  {
    path: "/word-search",
    element: (
      <>
        <NavigationBar />
        <WordSearchPage />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <NavigationBar />
        <ProfilePage />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={journalRouter} />;
}

export default App;
