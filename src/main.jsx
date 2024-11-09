import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Header from "./components/Header.jsx";

// import all css files
import "./styles/HomePage.css";
import "./styles/Index.css";
import "./styles/Navbar.css";
import "./styles/AuthPage.css";
import "./styles/PasswordContainer.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
