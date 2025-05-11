import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// import all css files
import "./styles/HomePage.css";
import "./styles/Index.css";
import "./styles/Navbar.css";
import "./styles/AuthPage.css";
import "./styles/PasswordContainer.css";

import { UserProvider } from "./contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
