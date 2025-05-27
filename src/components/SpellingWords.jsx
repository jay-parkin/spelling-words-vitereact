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
  const [initSuccess, setInitSuccess] = useState(false);

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

  const allCorrect =
    wordStatuses.length > 0 && wordStatuses.every((w) => w.isCorrect);

  // INIT sentence session once all spelling words are correct
  useEffect(() => {
    if (!allCorrect || initSuccess || !user?.userId) return;

    const initSentenceSession = async () => {
      try {
        const selectedWords = weeklyWordList
          .filter((w, i) => wordStatuses[i]?.isCorrect)
          .map((w) => ({
            word: w.word,
            definition: w.definition,
          }));

        const wordCount = selectedWords.length;

        console.log("Selected words for sentence session:", selectedWords);

        const url = `${import.meta.env.VITE_DATABASE_URL}/sentences/init`;
        const body = JSON.stringify({
          userId: user.userId,
          weekNumber: week,
          day: today,
          selectedWords,
          wordCount,
          // isValid: true,
        });

        console.log("➡️ Sending init request to /sentences/init:", body);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: body,
        });

        if (res.ok) {
          setInitSuccess(true);
          console.log("✅ Sentence session initialized.");
        } else {
          console.warn("Sentence session init failed.");
        }
      } catch (err) {
        console.error("Sentence session init error:", err);
      }
    };

    initSentenceSession();
  }, [allCorrect, initSuccess, user?.userId]);

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
      </div>
    );
  }

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
