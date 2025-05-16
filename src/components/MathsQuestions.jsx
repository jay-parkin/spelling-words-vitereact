import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import randomColourProperty from "../utils/RandomColourProperty";
import { getWeekNumber } from "../utils/TimeUtils";
import MathsCard from "./MathsCard";
import MathsResults from "./MathsResults";

import DoggyLoader from "./loader/DoggySleeping";

const QUESTIONS_PER_PAGE = 6;

export default function MathsQuestions() {
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [finished, setFinished] = useState(false);
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const today = new Date().getDay();
  const weekNumber = getWeekNumber(new Date());

  // Step 1: Initialize maths session
  useEffect(() => {
    if (!user?.userId) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/maths/${user.userId}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            // No session found — treat as user not yet assigned
            setLoadError("You're not assigned to a classroom yet.");
          } else {
            setLoadError("Unexpected error fetching your session.");
          }
          setLoading(false);
          return;
        }

        const session = await res.json();
        const week = session.weeks.find((w) => w.weekNumber === weekNumber);
        if (!week) {
          setLoadError("No data available for this week.");
          setLoading(false);
          return;
        }

        const todayObj = week.days[today];
        let todayQuestions = todayObj.questions || [];

        if (todayQuestions.length === 0) {
          // Generate placeholder questions
          const generatedQuestions = Array.from({ length: 6 }).map(() => {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            return {
              equation: `${a} + ${b}`,
              correctAnswer: a + b,
            };
          });

          // Send to backend to fill today
          await fetch(
            `${import.meta.env.VITE_DATABASE_URL}/maths/${
              user.userId
            }/weeks/${weekNumber}/fill-today`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ questions: generatedQuestions }),
            }
          );

          // Refetch session
          const retryRes = await fetch(
            `${import.meta.env.VITE_DATABASE_URL}/maths/${user.userId}`
          );
          const retrySession = await retryRes.json();
          const retryWeek = retrySession.weeks.find(
            (w) => w.weekNumber === weekNumber
          );
          const retryToday = retryWeek?.days[today];
          todayQuestions = retryToday?.questions || [];
        }

        const unansweredQuestions = todayQuestions.filter((q) => !q.isCorrect);

        setQuestions(unansweredQuestions);
        setDisplayedQuestions(unansweredQuestions.slice(0, QUESTIONS_PER_PAGE));
        if (unansweredQuestions.length === 0) setFinished(true);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setLoadError("There was a network or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user?.userId, weekNumber, today]);

  // Function to handle attempts
  // This function is called when the user attempts to answer a question
  const handleAttempt = async (id, userInput, isCorrect, correctAnswer) => {
    if (!user?.userId) return;

    try {
      await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/maths/${
          user.userId
        }/weeks/${weekNumber}/days/${today}/attempt/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput }),
        }
      );

      const res = await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/maths/${user.userId}`
      );
      const session = await res.json();
      const week = session.weeks.find((w) => w.weekNumber === weekNumber);
      const todayObj = week.days[today];

      const updatedQuestions = todayObj.questions || [];
      const remaining = updatedQuestions.filter((q) => !q.isCorrect);

      setQuestions(remaining);
      setDisplayedQuestions(remaining.slice(0, QUESTIONS_PER_PAGE));
      if (remaining.length === 0) setFinished(true);
    } catch (err) {
      console.error("Failed to save maths attempt:", err);
    }
  };

  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q._id !== id);
    setQuestions(updated);
    setDisplayedQuestions(updated.slice(0, QUESTIONS_PER_PAGE));
    if (updated.length === 0) setFinished(true);
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <DoggyLoader />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="error-container">
        <h2>📚 Uh-oh!</h2>
        <DoggyLoader />
        <p>{loadError}</p>
        <p>Please ask your teacher to assign you to a classroom.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <MathsResults
        userId={user?.userId}
        weekNumber={weekNumber}
        dayNumber={today}
      />
    );
  }

  return (
    <section className="maths-body">
      {displayedQuestions.map((question) => (
        <MathsCard
          key={question._id}
          id={question._id}
          equation={question.equation}
          answer={question.correctAnswer}
          onDelete={() => deleteQuestion(question._id)}
          onAttempt={handleAttempt}
          designColour={randomColourProperty()}
        />
      ))}
    </section>
  );
}
