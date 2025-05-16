import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUserFromToken } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // set loading animation
    setStatus("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt", data.jwt); // Store JWT token in localStorage
        refreshUserFromToken();
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
        <span>or create a new account</span>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <Link to="/forgot-password">Forgot your password?</Link>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
