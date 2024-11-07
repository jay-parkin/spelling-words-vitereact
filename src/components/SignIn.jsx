import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const [name, setName] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gamertag") {
      setGamertag(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // set loading animation
    setStatus("");

    try {
      const response = await fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gamertag, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt", data.jwt); // Store JWT token in localStorage

        // Redirect to the homepage after sign-in
        navigate("/");
      } else {
        setStatus(data.message);
      }
    } catch (err) {
      setStatus("Error connecting to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <span>or use your account</span>
        <input
          type="text"
          name="gamertag"
          placeholder="Gamertag"
          value={gamertag}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <a href="/forgot-password">Forgot your password?</a>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
