import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import SpellingResults from "./SpellingResults";
import SpellingSession from "./SpellingSession";
import wordSet from "../data/WordsList";

import randomColourProperty from "../functions/RandomColourProperty";

const TOTAL_WORDS = 10;

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
  }));
}


export default function SpellingWords({ userId }) {
  // Get week and day for localstorage name
  const today = new Date().getDay();
  const week = new Date().getWeek();

  // Get the spelling list for the week from localStorage or create a new one
  const storedWordList = localStorage.getItem(`spellingWordsWeek`);
  const initialWordList = storedWordList
    ? JSON.parse(storedWordList)
    : getRandomWords(wordSet);

  // Initialise state to hold the words for today
  const [randomWords, setRandomWords] = useState(initialWordList);

  // Retrieve and parse the data from localStorage
  const storedStatusData = localStorage.getItem("spellingIsDone");
  const spellingIsDone = storedStatusData ? JSON.parse(storedStatusData) : null;

  // State to keep track of the current word index
  const [currentWordIndex, setCurrentWordIndex] = useState(() => {
    const storedIndex = localStorage.getItem(`currentWordIndex`);
    return storedIndex ? parseInt(storedIndex, 10) : 0; // Default to 0 if not found
  });

  const [attempts, setAttempts] = useState([]);

  // Store the current word index in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`currentWordIndex`, currentWordIndex);
  }, [currentWordIndex, today]);

  // Store the word list in localStorage for the week
  useEffect(() => {
    localStorage.setItem(`spellingWordsWeek`, JSON.stringify(randomWords));
  }, [randomWords, week]);

  // create a function to reset the spelling status and index
  // useEffect(() => {
  //   // Save the spelling as false
  //   const spellingIsDone = {
  //     date: new Date().toISOString(),
  //     status: false,
  //   };

  //   localStorage.setItem("spellingIsDone", JSON.stringify(spellingIsDone));
  // }, [today]);

  // // Populate the state with random words when the component mounts
  // useEffect(() => {
  //   const selectedWords = getRandomWords(wordSet);
  //   setRandomWords(selectedWords);
  //   setCurrentWordIndex(0); // Ensure index starts from 0
  // }, []);

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => {
      if (prevIndex < randomWords.length - 1) {
        return prevIndex + 1;
      } else {
        console.log("All words completed!");
        // Return the same index to stay on the last word
        return prevIndex;
      }
    });
  };

  const handleAttempt = (word, userInput, isCorrect) => {
    setAttempts((prevAttempts) => [
      ...prevAttempts,
      { word, userInput, isCorrect },
    ]);
  };

  // Access the status directly
  const isStatusDone = spellingIsDone ? spellingIsDone.status : false;
  console.log(isStatusDone);
  if (spellingIsDone && spellingIsDone.status) {
    return (
      <SpellingResults
        correctAttempts={attempts.filter((a) => a.isCorrect).length}
        attempts={attempts}
      />
    );
  }

  // Render Results if all words are completed
  if (randomWords.length > 0 && currentWordIndex === randomWords.length - 1) {
    return (
      <>
        <SpellingResults
          correctAttempts={attempts.filter((a) => a.isCorrect).length}
          attempts={attempts}
        />
        <SpellingSession
          userId={userId}
          attempts={attempts}
          setAttempts={setAttempts}
        />
      </>
    );
  }

  return (
    <section className="spelling-body">
      {/* Display the current word */}
      {randomWords.length > 0 && currentWordIndex < randomWords.length ? (
        <WordCard
          word={randomWords[currentWordIndex].word}
          definition={randomWords[currentWordIndex].definition}
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
