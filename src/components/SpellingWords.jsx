import React, { useState, useEffect } from "react";
import WordCard from "./WordCard";
import Results from "./SpellingResults";
import wordSet from "../data/WordsList";

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

export default function SpellingWords() {
  // Initialise state to hold the 10 random words
  const [randomWords, setRandomWords] = useState([]);
  // State to keep track of the current word index
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState([]);

  // Populate the state with random words when the component mounts
  useEffect(() => {
    const selectedWords = getRandomWords(wordSet);
    setRandomWords(selectedWords);
    setCurrentWordIndex(0); // Ensure index starts from 0
  }, []);

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => {
      if (prevIndex < randomWords.length - 1) {
        return prevIndex + 1;
      } else {
        // Optional: Handle completion message or reset
        console.log("All words completed!");
        return prevIndex; // Return the same index to stay on the last word
      }
    });
  };

  const handleAttempt = (word, userInput, isCorrect) => {
    setAttempts((prevAttempts) => [
      ...prevAttempts,
      { word, userInput, isCorrect },
    ]);
  };

  // Reset the state to start the app again
  const handleRestart = () => {
    const selectedWords = getRandomWords(wordSet);
    setRandomWords(selectedWords);
    setCurrentWordIndex(0);
    setAttempts([]);
  };

  // Calculate results
  const correctAttempts = attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  // Render Results if all words are completed
  if (randomWords.length > 0 && currentWordIndex === randomWords.length - 1) {
    return (
      <Results
        correctAttempts={correctAttempts}
        attempts={attempts}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <section>
      {/* Display the current word */}
      {randomWords.length > 0 && currentWordIndex < randomWords.length ? (
        <WordCard
          word={randomWords[currentWordIndex].word}
          definition={randomWords[currentWordIndex].definition}
          onNextWord={handleNextWord}
          onAttempt={handleAttempt}
        />
      ) : (
        <p>All words completed!</p>
      )}
    </section>
  );
}
