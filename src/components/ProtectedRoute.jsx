import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import isTokenExpired from "../utils/authUtils";
import DoggyLoader from "./loader/DoggySleeping.jsx";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt");

  const { user, userLoaded } = useUser();

  // Function to fetch protected data
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/protectedRoute`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Protected data:", data.message);
      } else {
        setError("Token is invalid or expired. Please sign in again.");
        localStorage.removeItem("jwt");
        navigate("/auth");
      }
    } catch (error) {
      setError("Error fetching protected data. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwt");
      setError("Session expired. Please sign in again.");
      navigate("/auth");
      return;
    }

    fetchProtectedData(); // Token is valid and not expired
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <h2>Zzz...</h2>
        <DoggyLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>📚 Uh-oh!</h2>
        <DoggyLoader />
        <p>{error}</p>
      </div>
    );
  }

  if (!userLoaded) {
    return <p>Loading session...</p>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // If everything is valid, render the children (protected content)
  return children;
}
