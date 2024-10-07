import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import SpellingResults from "./SpellingResults";

import {
  incrementCurrentWordIndex,
  getCurentWordIndex,
  initialiseSpellingSession,
  addWeekAndDay,
  getWeekWordList,
  saveToDailyWordList,
} from "../functions/SpellingSessionUtils";
import wordSet from "../data/WordsList";

import randomColourProperty from "../functions/RandomColourProperty";

const TOTAL_WORDS = 10;
const USER_ID = "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad";

// when the first opens the spelling they set a session with a date.
// - any time the user comes back, the date is checked.
// 	- if date exists continue the same sessions,
// 	- if not date for today, starts a new session.

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

function getRandomWords(wordSet, count = TOTAL_WORDS) {
  const words = Object.keys(wordSet);

  // Shuffle the words array
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }

  // Select the first 'count' words and map them to an array of objects
  return words.slice(0, count + 1).map((word) => ({
    word,
    definition: wordSet[word],
    incorrectAttempt: 0,
    correctAttempt: 0,
  }));
}

export default function SpellingWords({ userId }) {
  // Get week and day for localstorage name
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());

  const [localCurrentWordIndex, setLocalCurrentWordIndex] = useState(0);
  const [weeklyWordList, setWordList] = useState([]);
  const [attempts, setAttempts] = useState([]);

  // Check or initialise user session
  useEffect(() => {
    initialiseSpellingSession(USER_ID);
    const storedWordList = getWeekWordList(USER_ID, week);

    // Check if the word list exists and if the week is the same
    if (storedWordList.length === 0) {
      const initialWordList = getRandomWords(wordSet);
      addWeekAndDay(USER_ID, week, today, initialWordList);

      // Set the word list in state
      setWordList(initialWordList);
    } else {
      // Load the existing word list
      setWordList(storedWordList);
    }

    // make sure the wordlist is created
    addWeekAndDay(USER_ID, week, today, storedWordList);
  }, [today, week]);

  useEffect(() => {
    const currentWordIndex = getCurentWordIndex(USER_ID, week, today);
    setLocalCurrentWordIndex(currentWordIndex);
  }, [weeklyWordList]);

  const handleNextWord = () => {
    incrementCurrentWordIndex(USER_ID, week, today);
    setLocalCurrentWordIndex(getCurentWordIndex(USER_ID, week, today));
  };

  const handleAttempt = (userInput) => {
    // Get the current word and its definition
    const currentWordData = getWeekWordList(USER_ID, week)[
      localCurrentWordIndex
    ];

    const word = currentWordData.word;
    const definition = currentWordData.definition;

    // Check if the user's input is correct
    const isCorrect = userInput.trim().toLowerCase() === word.toLowerCase();

    // Call the function to save attempts and word information
    saveToDailyWordList(
      USER_ID,
      week,
      today,
      word,
      definition,
      userInput,
      isCorrect
    );
  };

  // Render Results if all words are completed
  if (
    weeklyWordList.length > 0 &&
    localCurrentWordIndex === weeklyWordList.length - 1
  ) {
    return (
      <>
        <SpellingResults userId={USER_ID} weekNumber={week} dayNumber={today} />
      </>
    );
  }

  return (
    <section className="spelling-body">
      {/* Display the current word */}
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
        <p>All words completed!</p>
      )}
    </section>
  );
}
