import React from "react";
import { useState } from "react";

import { LuChevronDown } from "react-icons/lu";

const Results = ({ correctAttempts, attempts }) => {
  // State to track the currently open index
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    // Toggle the accordion
    setOpenIndex(openIndex === index ? null : index);
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
              Summary: {correctAttempts}/{attempts.length}
              <p>Well Done! You gave it your all!</p>
            </h3>
          </section>

          <section className="spelling-results-section">
            <h3>Overview</h3>
            <p>Check out the overview of your report</p>
          </section>

          <section>
            <ul className="spelling-item-list">
              {attempts.map((attempt, index) => (
                <li key={index} className="accordion-item">
                  <div
                    onClick={() => handleToggle(index)}
                    className="accordion-header"
                  >
                    <div className="accordion-status">
                      <strong>{attempt.word}</strong>
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
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
                        {attempt.isCorrect
                          ? "Great job!"
                          : `Your answer: ${attempt.userInput}, Correct answer: ${attempt.word}`}
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

  // return (
  //   <div className="spelling-results-body">
  //     <div className="spelling-results-container">
  //       <div className="spelling-result-header">
  //         <h2>Spelling Report</h2>
  //       </div>

  //       <h3>
  //         Results: {correctAttempts}/{attempts.length}
  //       </h3>

  //       <ul>
  //         {attempts.map((attempt, index) => (
  //           <li key={index}>
  //             <strong>{attempt.word}</strong>:{" "}
  //             {attempt.isCorrect
  //               ? "Correct"
  //               : `Incorrect (Your answer: ${attempt.userInput}, Correct answer: ${attempt.word})`}
  //           </li>
  //         ))}
  //       </ul>

  //     </div>
  //   </div>
  // );
};

export default Results;
