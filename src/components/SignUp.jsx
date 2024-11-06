import React, { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event
    if (name === "name") {
      setName(value); // Update the `name` state
    } else if (name === "gamertag") {
      setGamertag(value); // Update the `gamerTag` state
    } else if (name === "password") {
      setPassword(value); // Update the `password` state
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8080/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gamertag, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Sign-up successful");

        // Clear the input fields after successful sign up
        setName("");
        setGamertag("");
        setPassword("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error connecting to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="gamertag"
          value={gamertag}
          onChange={handleChange}
          placeholder="Gamer Tag"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}
