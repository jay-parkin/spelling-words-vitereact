import React, { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event
    if (name === "name") {
      setName(value); // Update the `name` state
    } else if (name === "email") {
      setEmail(value); // Update the `email` state
    } else if (name === "gamertag") {
      setGamertag(value); // Update the `gamerTag` state
    } else if (name === "password") {
      setPassword(value); // Update the `password` state
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${process.env.DATABASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, gamertag, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setStatus("Sign-up successful");

        // Clear the input fields after successful sign up
        setName("");
        setEmail("");
        setGamertag("");
        setPassword("");
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
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span>or use your gamertag for registration</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
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
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
