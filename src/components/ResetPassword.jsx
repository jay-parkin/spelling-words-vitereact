import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Optionally, verify token on page load (e.g., check if it's expired or valid)
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    if (response.ok) {
      setMessage("Your password has been reset successfully.");
    } else {
      setMessage("Error resetting password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="password">New Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ResetPassword;
