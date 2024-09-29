import React from "react";

const Results = ({ correctAttempts, attempts, onRestart }) => {
  return (
    <div>
      <h2>Completed! You've seen all the words.</h2>
      <h3>
        Results: {correctAttempts}/{attempts.length}
      </h3>
      <ul>
        {attempts.map((attempt, index) => (
          <li key={index}>
            <strong>{attempt.word}</strong>:{" "}
            {attempt.isCorrect
              ? "Correct"
              : `Incorrect (Your answer: ${attempt.userInput}, Correct answer: ${attempt.word})`}
          </li>
        ))}
      </ul>
      <button className="restart-button" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
};

export default Results;
