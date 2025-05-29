import React from "react";
import { useNavigate } from "react-router-dom";
import TypeWriter from "./Typewriter";
import "./MissingProgressLoader.css";

export default function MissingProgressLoader() {
  const navigate = useNavigate();

  return (
    <div className="mpl-outer-wrapper">
      <div className="mpl-card">
        <TypeWriter />
        <p className="mpl-message">
          Your weekly learning progress hasn't been set up yet. Please ask your
          teacher to assign you, or head over to a lesson to initialize
          progress.
        </p>
        <button className="mpl-button" onClick={() => navigate("/spelling")}>
          Go to Spelling
        </button>
      </div>
    </div>
  );
}
