import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import SpellingResults from "./SpellingResults";
import randomColourProperty from "../utils/RandomColourProperty.js";
import { getWeekNumber } from "../utils/TimeUtils.js";

import { useUser } from "../contexts/UserContext";

import DoggyLoader from "./loader/DoggySleeping.jsx";

export default function SpellingWords() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());
  const { user } = useUser();

  const [weeklyWordList, setWordList] = useState([]);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [localCurrentWordIndex, setLocalCurrentWordIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Initialize spelling session
  useEffect(() => {
    if (!user?.userId) return;

    const initSession = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const url = `${import.meta.env.VITE_DATABASE_URL}/spelling/init`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.userId,
            weekNumber: week,
          }),
        });

        if (!response.ok) {
          if (response.status === 403 || response.status === 404) {
            setLoadError("You're not assigned to a classroom yet.");
          } else {
            setLoadError("Failed to initialize spelling session.");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        const wordList =
          data.session.weeks.find((w) => w.weekNumber === week)?.wordList || [];

        setWordList(wordList);
      } catch (error) {
        console.error("Init error:", error);
        setLoadError("Network or server error.");
      }
    };

    initSession();
  }, [user, week]);

  // Fetch daily word statuses from backend
  useEffect(() => {
    if (weeklyWordList.length === 0 || !user?.userId) return;

    const fetchWordStatus = async () => {
      try {
        const url = `${import.meta.env.VITE_DATABASE_URL}/spelling/${
          user?.userId
        }/week/${week}/day/${today}/status`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch word statuses");

        const data = await response.json();
        setWordStatuses(data.wordStatuses);

        const nextIndex =
          data.wordStatuses.find((w) => !w.isCorrect)?.index ??
          weeklyWordList.length;

        if (nextIndex !== localCurrentWordIndex) {
          setLocalCurrentWordIndex(nextIndex);
        }
      } catch (error) {
        console.error("Status fetch error:", error);
        setLoadError("Failed to fetch today's spelling progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchWordStatus();
  }, [user?.userId, weeklyWordList]);

  // Attempt handler (send to backend + update status)
  const handleAttempt = async (userInput) => {
    const currentWordData = weeklyWordList[localCurrentWordIndex];
    const isCorrect =
      userInput.trim().toLowerCase() === currentWordData.word.toLowerCase();

    try {
      const url = `${import.meta.env.VITE_DATABASE_URL}/spelling/attempt`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId,
          weekNumber: week,
          day: today,
          wordIndex: localCurrentWordIndex,
          userInput,
          isCorrect,
        }),
      });

      if (isCorrect) {
        setWordStatuses((prev) =>
          prev.map((entry) =>
            entry.index === localCurrentWordIndex
              ? { ...entry, isCorrect: true }
              : entry
          )
        );
      }
    } catch (error) {
      console.error("Attempt submit error:", error);
    }
  };

  // Move to next incomplete word
  const handleNextWord = () => {
    for (let i = 1; i <= weeklyWordList.length; i++) {
      const nextIndex = (localCurrentWordIndex + i) % weeklyWordList.length;
      if (!wordStatuses[nextIndex]?.isCorrect) {
        setLocalCurrentWordIndex(nextIndex);
        return;
      }
    }

    // All correct
    setLocalCurrentWordIndex(weeklyWordList.length);
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
        <h2>🐶 Zzz...</h2>
        <DoggyLoader />
        <p>{loadError}</p>
        <p>Please ask your teacher to assign you to a classroom.</p>
      </div>
    );
  }

  // Check if session is complete
  const allCorrect =
    wordStatuses.length > 0 && wordStatuses.every((w) => w.isCorrect);

  if (allCorrect) {
    return (
      <SpellingResults
        userId={user?.userId}
        weekNumber={week}
        dayNumber={today}
      />
    );
  }

  return (
    <section className="spelling-body">
      {weeklyWordList.length > 0 &&
      localCurrentWordIndex < weeklyWordList.length ? (
        <WordCard
          word={weeklyWordList[localCurrentWordIndex].word}
          definition={weeklyWordList[localCurrentWordIndex].definition}
          onNextWord={handleNextWord}
          onAttempt={handleAttempt}
          designColour={randomColourProperty}
        />
      ) : (
        <p>All words completed or loading...</p>
      )}
    </section>
  );
}
