import { useState, useEffect } from "react";
import MathsCard from "./MathsCard"; // Ensure this matches the exported name
import randomColourProperty from "../functions/RandomColourProperty";

const TOTAL_EQUATIONS = 20;
const QUESTIONS_PER_PAGE = 6;

export default function MathsQuestions() {
  // Array to hold all questions
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [finished, setFinished] = useState(false);

  let idCounter = 0;

  // Function to generate random equations and answers
  const generateRandomEquation = (id) => {
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    let equation;
    let answer;

    // Construct equation string and get the answer
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

    // Return an object with the equation, answer, and unique id
    return { id, equation, answer };
  };

  // Generate all questions with unique IDs
  const generateAllQuestions = () => {
    const newQuestions = Array.from({ length: TOTAL_EQUATIONS }, () =>
      generateRandomEquation(idCounter++)
    );

    setQuestions(newQuestions);
    setDisplayedQuestions(newQuestions.slice(0, QUESTIONS_PER_PAGE));
  };

  // Run when the component first loads to generate the questions
  useEffect(() => {
    generateAllQuestions();
  }, []);

  // Method to delete (remove) a question based on its ID
  const deleteQuestion = (id) => {
    // Remove the question from questions based on its id
    const updatedQuestions = questions.filter((question) => question.id !== id);

    setQuestions(updatedQuestions); // Update all questions

    // If all questions are answered, mark as finished
    if (updatedQuestions.length === 0) {
      setFinished(true);
    } else {
      // Update the displayed questions based on the current questions
      const newDisplayedQuestions = updatedQuestions.slice(
        0,
        QUESTIONS_PER_PAGE
      );
      setDisplayedQuestions(newDisplayedQuestions);
    }
  };

  return (
    <section className="maths-body">
      {finished ? (
        <h2>Congratulations! You've answered all questions!</h2>
      ) : (
        <>
          {displayedQuestions.map((question) => (
            <MathsCard
              key={question.id}
              equation={question.equation}
              answer={question.answer}
              onDelete={() => deleteQuestion(question.id)}
              designColour={randomColourProperty()}
            />
          ))}
        </>
      )}
    </section>
  );
}
