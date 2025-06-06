import { useState } from "react";
import { Form } from "react-bootstrap";
import { TbMathSymbols } from "react-icons/tb";
import Button from "react-bootstrap/Button";

import "../styles/MathsPage.css";

export default function MathsCard({
  id,
  equation,
  answer,
  onDelete,
  onAttempt,
  designColour,
}) {
  // Local state to manage input field disabled state
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [localColourProperty] = useState(designColour);

  // Function to handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the input field value
  };

  // Check whether the input equals the equation's answer
  const handleNextEquation = () => {
    const isCorrect = parseInt(inputValue.trim()) === answer;

    if (onAttempt) {
      onAttempt(id, inputValue.trim(), isCorrect, answer);
    }

    if (isCorrect) {
      onDelete();
    }

    setInputValue(""); // Clear the input field
  };

  // Function to handle key down events
  const handleKeyDown = (e) => {
    if (isFocused && e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of the Enter key
      handleNextEquation(); // Submit the answer
    }
  };

  return (
    <div
      className="maths-card-container"
      style={{
        boxShadow: `5px 5px 5px ${localColourProperty}`,
        borderBottom: `1px solid ${localColourProperty}`,
        borderLeft: `1px solid ${localColourProperty}`,
      }}
    >
      <div
        className="maths-card-header"
        style={{
          backgroundColor: localColourProperty,
        }}
      >
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
            onKeyDown={handleKeyDown} // Listen for key presses
            onFocus={() => setIsFocused(true)} // Set focus state to true
            onBlur={() => setIsFocused(false)} // Set focus state to false
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
  );
}
