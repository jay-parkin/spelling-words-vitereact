import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { TbMathSymbols } from "react-icons/tb";
import Button from "react-bootstrap/Button";

import "../styles/MathsPage.css";

export default function MathsCard(props) {
  const { equation, answer, onNextEquation } = props;
  // Local state to manage input field disabled state
  const [inputValue, setInputValue] = useState("");

  // Function to handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the input field value
  };

  // Check whether the input equals the equation's answer
  const handleNextEquation = () => {
    const isCorrect = parseInt(inputValue.trim()) === answer;

    if (isCorrect) {
      onNextEquation();
    }

    setInputValue(""); // Clear the input field
  };

  return (
    <div className="maths-body">
      <div className="maths-card-container">
        <div className="maths-card-header">
          <TbMathSymbols size={40} color="white" />
        </div>
        <div className="maths-card-body">
          <div className="maths-card-text">
            <h1>{equation ? equation : "5 x 5"}</h1>
          </div>
          <div className="maths-input-group">
            <Form.Control
              className="maths-form-input"
              value={inputValue} // Bind value to the input field
              onChange={handleInputChange} // Handle input changes
              autoComplete="off"
              autoCorrect="off" // Disable auto-correct
              placeholder="" // Adding a placeholder might also help
            />

            <Button
              className="maths-submit-btn"
              variant="primary"
              onClick={handleNextEquation}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
