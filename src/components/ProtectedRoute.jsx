import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // To handle loading state while checking authentication
  const [error, setError] = useState(null); // To store error message, if any
  const token = localStorage.getItem("jwt");

  // Function to fetch protected data
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("jwt"); // Or wherever you store the token

    if (!token) {
      setError("No token found. Please sign in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/protectedRoute", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use Authorization header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Protected data:", data.message);
      } else {
        setError("Token is invalid or expired. Please sign in again.");
        localStorage.removeItem("jwt"); // Optionally remove token if invalid
        navigate("/auth"); // Redirect to sign-in page
      }
    } catch (error) {
      setError("Error fetching protected data. Please try again later.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If token exists, try fetching protected data
    if (token) {
      fetchProtectedData();
    } else {
      // If no token, redirect to sign-in page
      setError("No token found. Please sign in.");
      navigate("/auth");
    }
  }, [token, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking or fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error if any
  }

  // If everything is valid, render the children (protected content)
  return children;
}
