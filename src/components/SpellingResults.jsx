import React, { useEffect, useState } from "react";

export default function SpellingResults({ userId, weekNumber, dayNumber }) {
  const [accuracy, setAccuracy] = useState(null);
  const [dailyWords, setDailyWords] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const url = `${
          import.meta.env.VITE_DATABASE_URL
        }/spelling/${userId}/week/${weekNumber}/day/${dayNumber}/results`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch results");

        const data = await response.json();
        setAccuracy(data.summary.accuracy);
        setDailyWords(data.words);
      } catch (error) {
        console.error("Error fetching spelling results:", error);
      }
    };

    fetchResults();
  }, [userId, weekNumber, dayNumber]);

  const getEncouragingMessage = (percentage) => {
    if (percentage === null) return "Keep trying!";
    if (percentage === 100) return "Outstanding! You're a spelling superstar!";
    if (percentage >= 95) return "Amazing! You're a spelling champion!";
    if (percentage >= 90) return "Fantastic job! Almost perfect!";
    if (percentage >= 85) return "Great work! You're doing well!";
    if (percentage >= 80) return "Good effort! Keep it up!";
    if (percentage >= 75) return "Nice job! You're improving!";
    if (percentage >= 70) return "Well done! Keep practicing!";
    if (percentage >= 65) return "Good start! You can do even better!";
    if (percentage >= 60) return "You're on the right track!";
    if (percentage >= 55) return "Keep working hard!";
    if (percentage >= 50) return "You've got this! Keep trying!";
    return "Don't give up! Every attempt makes you better!";
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="spelling-results-body">
      <div className="spelling-results-container">
        <header className="spelling-result-header">Spelling Report</header>
        <section className="spelling-results-section">
          <h3>
            Summary:{" "}
            {accuracy != null ? `${accuracy.toFixed(0)}%` : "Loading..."}
            <p>{getEncouragingMessage(accuracy)}</p>
          </h3>
        </section>

        {/* Something I might bring back later */}
        {/* <section className="spelling-results-section">
          <h3>Overview</h3>
          <p>Check out the overview of your report</p>
        </section>

        <section>
          <ul className="spelling-item-list">
            {dailyWords.map((currentWord, index) => (
              <li key={index} className="accordion-item">
                <div
                  onClick={() => handleToggle(index)}
                  className="accordion-header"
                >
                  <div className="accordion-status">
                    <strong>{currentWord.word}</strong>
                    {currentWord.correctAttempt > 0 ? "Correct" : "Incorrect"}
                  </div>
                  <div
                    className={`accordion-icon ${
                      openIndex === index ? "open" : ""
                    }`}
                  >
                    <LuChevronDown />
                  </div>
                </div>
                {openIndex === index && (
                  <div className="accordion-content">
                    <p>
                      {currentWord.correctAttempt > 0 ? (
                        "Great job!"
                      ) : (
                        <>
                          Your last input:{" "}
                          {currentWord.history?.at(-1)?.input || "N/A"} <br />
                          Correct answer: {currentWord.word}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section> */}
      </div>
    </div>
  );
}
