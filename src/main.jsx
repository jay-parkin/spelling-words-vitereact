import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <App />
  </StrictMode>
);
