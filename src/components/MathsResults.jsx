import React, { useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function MathsResults({ userId, weekNumber, dayNumber }) {
  const [summary, setSummary] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const url = `${
          import.meta.env.VITE_DATABASE_URL
        }/maths/${userId}/week/${weekNumber}/day/${dayNumber}/results`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch maths results");

        const data = await response.json();
        setSummary(data.summary);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching maths results:", error);
      }
    };

    fetchResults();
  }, [userId, weekNumber, dayNumber]);

  const getEncouragingMessage = (accuracy) => {
    if (accuracy === null || accuracy === undefined) return "Keep trying!";
    if (accuracy === 100) return "Outstanding! You're a maths superstar!";
    if (accuracy >= 95) return "Amazing! You aced it!";
    if (accuracy >= 90) return "Fantastic work!";
    if (accuracy >= 85) return "Great job! You're doing well!";
    if (accuracy >= 80) return "Good effort! Keep it up!";
    if (accuracy >= 75) return "Nice job! You're improving!";
    if (accuracy >= 70) return "Well done! Keep practicing!";
    if (accuracy >= 65) return "Good start! You can do even better!";
    if (accuracy >= 60) return "You're on the right track!";
    if (accuracy >= 55) return "Keep working hard!";
    if (accuracy >= 50) return "You've got this! Keep trying!";
    return "Don't give up! Every attempt makes you better!";
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="maths-results-body">
      <div className="maths-results-container">
        <header className="maths-result-header">Maths Report</header>

        <section className="maths-results-section">
          <h3>
            Summary:{" "}
            {summary ? `${summary.accuracy.toFixed(0)}%` : "Loading..."}
            <p>{getEncouragingMessage(summary?.accuracy)}</p>
          </h3>
        </section>

        <section>
          <ul className="maths-item-list">
            {questions.map((q, index) => (
              <li key={index} className="accordion-item">
                <div
                  onClick={() => handleToggle(index)}
                  className="accordion-header"
                >
                  <div className="accordion-status">
                    <strong>{q.equation}</strong> –{" "}
                    {q.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                  </div>
                  <LuChevronDown
                    className={`accordion-icon ${
                      openIndex === index ? "open" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <div className="accordion-content">
                    <p>
                      {q.isCorrect ? (
                        "Great job!"
                      ) : (
                        <>
                          Your last input: {q.history?.at(-1)?.input || "N/A"}{" "}
                          <br />
                          Correct answer: {q.correctAnswer}
                        </>
                      )}
                    </p>
                    <p>
                      <strong>Attempts:</strong>
                    </p>
                    <ul>
                      {q.history.map((h, i) => (
                        <li key={i}>
                          {h.input} – {h.isCorrect ? "✅" : "❌"} (
                          {new Date(h.attemptedAt).toLocaleString("en-GB")})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
