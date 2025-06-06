import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import randomColourProperty from "../utils/RandomColourProperty";
import { getWeekNumber } from "../utils/TimeUtils";
import MathsCard from "./MathsCard";
import MathsResults from "./MathsResults";

import DoggyLoader from "./loader/DoggySleeping";
import { triggerConfetti } from "../utils/confettiTrigger";

const QUESTIONS_PER_PAGE = 6;

export default function MathsQuestions() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());
  const { user } = useUser();

  const [weeklyMathsList, setMathsList] = useState([]);
  const [mathsStatuses, setMathsStatuses] = useState([]);
  const [localCurrentMathsIndex, setLocalCurrentMathsIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (finished) {
      triggerConfetti();
    }
  }, [finished]);

  // Check if a session already exists
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!user?.userId) return;

      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_DATABASE_URL}/maths/user-progress/${
          user.userId
        }`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        if (!response.ok) {
          setSessionInitialized(false);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const existingWeek = data.session.weeks.find(
          (w) => w.weekNumber === week
        );

        if (existingWeek) {
          setMathsList(existingWeek.questionList);
          setSessionInitialized(true);
        }
      } catch (err) {
        console.warn("Session check failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [user, week]);

  // Initialize maths session
  const initSession = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_DATABASE_URL}/maths/init`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.userId, weekNumber: week }),
      });
      const data = await response.json();
      const questionsList =
        data.session.weeks.find((w) => w.weekNumber === week)?.questionList ||
        [];
      setMathsList(questionsList);
      setQuestions(questionsList);
      setDisplayedQuestions(questionsList.slice(0, QUESTIONS_PER_PAGE));
      setSessionInitialized(true);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily maths questions statuses from backend
  useEffect(() => {
    if (!sessionInitialized || weeklyMathsList.length === 0 || !user?.userId)
      return;

    const fetchMathsStatus = async () => {
      try {
        const url = `${import.meta.env.VITE_DATABASE_URL}/maths/${
          user?.userId
        }/week/${week}/day/${today}/status`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch maths statuses");

        const data = await response.json();
        setMathsStatuses(data.questionStatuses);

        const incorrectQuestions = data.questionStatuses
          .filter((q) => !q.isCorrect)
          .map((q) => weeklyMathsList[q.index]);

        setQuestions(incorrectQuestions);
        setDisplayedQuestions(incorrectQuestions.slice(0, QUESTIONS_PER_PAGE));

        if (incorrectQuestions.length === 0) setFinished(true);
      } catch (error) {
        console.error("Status fetch error:", error);
        setLoadError("Failed to fetch today's maths progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchMathsStatus();
  }, [sessionInitialized, weeklyMathsList, user?.userId]);

  // Function to handle attempts
  // This function is called when the user attempts to answer a question
  const handleAttempt = async (id, userInput, isCorrect, correctAnswer) => {
    if (!user?.userId) return;

    try {
      await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/maths/${
          user.userId
        }/weeks/${week}/days/${today}/attempt/${id}`,
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
      const currentWeek = session.weeks.find((w) => w.weekNumber === week);
      const todayObj = currentWeek.days[today];

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
        <h2>Zzz...</h2>
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
      <MathsResults userId={user?.userId} weekNumber={week} dayNumber={today} />
    );
  }

  if (!sessionInitialized)
    return <button onClick={initSession}>Request Maths Questions</button>;

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
