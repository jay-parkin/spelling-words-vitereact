import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import randomColourProperty from "../utils/RandomColourProperty.js";
import { getWeekNumber } from "../utils/TimeUtils.js";

import DoggyLoader from "./loader/DoggySleeping.jsx";

import SentenceWordCard from "./SentenceWordCard.jsx";

export default function WeeklyWordList() {
  const { user } = useUser();
  const [wordList, setWordList] = useState([]);

  const today = new Date().getDay();
  const weekNumber = getWeekNumber(new Date());

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(true);

  // Fetch the attempted word list for the current week
  useEffect(() => {
    if (!user?.userId) return;

    const fetchAttemptedWordList = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const url = `${import.meta.env.VITE_DATABASE_URL}/sentences/${
          user.userId
        }/week/${weekNumber}/day/${today}`;

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 403 || response.status === 404) {
            setLoadError("You're not assigned to a classroom yet.");
          } else {
            setLoadError("Failed to initialize sentences session.");
          }
          return;
        }

        const data = await response.json();

        setWordList(data.words || []);
      } catch (err) {
        console.error("Failed to fetch classroom:", err);
        setLoadError("Network or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedWordList();
  }, [user]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <h2>Zzz...</h2>
        <DoggyLoader />
      </div>
    );
  }

  if (wordList.length === 0)
    return (
      <div className="error-container">
        <h2>📚 Uh-oh!</h2>
        <DoggyLoader />
        <p>{loadError}</p>
        <p>Please ask your teacher to assign you to a classroom.</p>
      </div>
    );

  return (
    <section className="weekly-word-list">
      <div className="word-list-header">
        <h2 className="list-heading">
          This Week’s Word List (Week {weekNumber})
        </h2>
        <button className="toggle-btn" onClick={() => setVisible(!visible)}>
          {visible ? "Hide" : "Show"} Words
        </button>
      </div>

      {visible && (
        <div className="sentence-word-body ">
          {wordList.map((wordObj, index) => (
            <SentenceWordCard
              key={index}
              word={wordObj.word}
              definition={wordObj.definition}
              designColour={randomColourProperty()}
            />
          ))}
        </div>
      )}
    </section>
  );
}
