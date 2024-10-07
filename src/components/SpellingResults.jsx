import React, { useEffect } from "react";
import { useState } from "react";

import {
  getDailyPercentage,
  getDailyWordList,
} from "../functions/SpellingSessionUtils";

import { LuChevronDown } from "react-icons/lu";

export default function SpellingResults(props) {
  const { userId, weekNumber, dayNumber } = props;

  // Pull accuracy from localstorage
  const [localStoragePercentage] = useState(() => {
    const percentage = getDailyPercentage(userId, weekNumber, dayNumber);
    return percentage;
  });

  // Pull the daily word list from localstorage
  const [localStorageDailyWords] = useState(() => {
    const dailyWords = getDailyWordList(userId, weekNumber, dayNumber);
    return dailyWords;
  });

  // State to track the currently open index
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    // Toggle the accordion
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to get encouraging message based on percentage
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

  return (
    <div className="spelling-results-body">
      <div className="spelling-results-container-outline">
        <div className="spelling-results-container">
          <header className="spelling-result-header">Spelling Report</header>

          {/* <div className="spacer"></div> */}

          <section className="spelling-results-section">
            <h3>
              {/* Add a summary from an object of a 
              bunch of different inspiring words.
              Summary must be out of a percent of correct answers*/}
              Summary: {localStoragePercentage}%
              <p>{getEncouragingMessage(localStoragePercentage)}</p>
            </h3>
          </section>

          <section className="spelling-results-section">
            <h3>Overview</h3>
            <p>Check out the overview of your report</p>
          </section>

          <section>
            <ul className="spelling-item-list">
              {localStorageDailyWords.map((currentWord, index) => (
                <li key={index} className="accordion-item">
                  <div
                    onClick={() => handleToggle(index)}
                    className="accordion-header"
                  >
                    <div className="accordion-status">
                      <strong>{currentWord.word}</strong>
                      {currentWord.isCorrect ? "Correct" : "Incorrect"}
                    </div>
                    <div
                      className={`accordion-icon ${
                        openIndex === index ? "open" : ""
                      }`}
                    >
                      <LuChevronDown />
                    </div>
                  </div>
                  {/* Show details if this index is open */}
                  {openIndex === index && (
                    <div className="accordion-content">
                      <p>
                        {currentWord.isCorrect ? (
                          "Great job!"
                        ) : (
                          <>
                            Your answer: {currentWord.userInput} <br />
                            Correct answer: {currentWord.word}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
