import React, { useEffect, useState } from "react";

export default function MathsResults({ userId, weekNumber, dayNumber }) {
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const url = `${
          import.meta.env.VITE_DATABASE_URL
        }/maths/${userId}/week/${weekNumber}/day/${dayNumber}/results`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch maths results");

        const data = await response.json();
        setAccuracy(data.summary?.accuracy);
      } catch (error) {
        console.error("Error fetching maths results:", error);
      }
    };

    fetchResults();
  }, [userId, weekNumber, dayNumber]);

  const getEncouragingMessage = (percentage) => {
    if (percentage === null) return "Keep trying!";
    if (percentage === 100) return "Outstanding! You're a maths superstar!";
    if (percentage >= 95) return "Amazing! You aced it!";
    if (percentage >= 90) return "Fantastic work!";
    if (percentage >= 85) return "Great job! You're doing well!";
    if (percentage >= 80) return "Good effort! Keep it up!";
    if (percentage >= 75) return "Nice job! You're improving!";
    if (percentage >= 70) return "Well done! Keep practicing!";
    if (percentage >= 65) return "Good start! You can do even better!";
    if (percentage >= 60) return "You're on the right track!";
    if (percentage >= 55) return "Keep working hard!";
    if (percentage >= 50) return "You've got this! Keep trying!";
    return "Don't give up! Every attempt makes you better!";
  };

  return (
    <div className="maths-results-body">
      <div className="maths-results-container">
        <header className="maths-result-header">Maths Report</header>
        <section className="maths-results-section">
          <h3>
            Summary:{" "}
            {accuracy != null ? `${accuracy.toFixed(0)}%` : "Loading..."}
            <p>{getEncouragingMessage(accuracy)}</p>
          </h3>
        </section>
      </div>
    </div>
  );
}
