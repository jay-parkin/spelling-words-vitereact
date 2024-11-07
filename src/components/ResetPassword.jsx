import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally, you can verify the token on page load,
    // or perform any other necessary checks.
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

      localStorage.removeItem("jwt");
      navigate("/");
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
}
