import { useState, useEffect } from "react";
import MathsCard from "./MathsCard"; // Ensure this matches the exported name

const TOTAL_EQUATIONS = 10;

export default function MathsQuestions() {
  const [currentEquation, setCurrentEquation] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState(0);

  // Function to generate random equations and answers
  const generateRandomEquation = () => {
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    let equation;
    let answer;

    // Construct equation string and compute the answer
    switch (operator) {
      case "+":
        equation = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case "-":
        equation = `${num1} - ${num2}`;
        answer = num1 - num2;
        break;
      case "*":
        equation = `${num1} x ${num2}`;
        answer = num1 * num2;
        break;
      case "/":
        equation = `${num1 * num2} / ${num1}`;
        answer = num2;
        break;
      default:
        break;
    }

    setCurrentEquation(equation);
    setCurrentAnswer(answer);
  };

  // Run when the component first loads to generate the first equation
  useEffect(() => {
    generateRandomEquation();
  }, []);

  return (
    <section>
      <MathsCard
        equation={currentEquation}
        answer={currentAnswer}
        onNextEquation={generateRandomEquation}
      />
    </section>
  );
}
