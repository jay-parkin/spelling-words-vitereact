import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import wordSet from "../data/WordsList";

export default function SpellingSession({ userId, attempts, setAttempts }) {
  const [localSessionId, setLocalSessionId] = useState(null);
  const [localSessionDate, setLocalSessionDate] = useState(null);
  //   const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    setLocalSessionId(uuidv4);
    setLocalSessionDate(new Date().toISOString());
  }, []);

  const updateWordStats = (attempts) => {
    // Retrieve existing word stats or initialise empty object
    let wordStats = JSON.parse(localStorage.getItem("wordStats")) || {};

    const updatedAttempts = attempts.map((attempt) => {
      const { word, isCorrect } = attempt;

      // Initialise stats for the word if it doesn't exist
      if (!wordStats[word]) {
        wordStats[word] = {
          correctCount: 0,
          incorrectCount: 0,
          definition: wordSet[word],
        };
      }

      // Update counts based on correctness
      if (isCorrect) {
        wordStats[word].correctCount += 1;
      } else {
        wordStats[word].incorrectCount += 1;
      }

      // Return the updated attempt with the counts included
      return {
        ...attempt,
        definition: wordStats[word].definition,
        correctCount: wordStats[word].correctCount,
        incorrectCount: wordStats[word].incorrectCount,
      };
    });

    // Save updated word stats back to localStorage
    localStorage.setItem("wordStats", JSON.stringify(wordStats));

    return updatedAttempts;
  };

  const saveSpellingSession = () => {
    // Update word stats with current attempts
    const updatedAttempts = updateWordStats(attempts);

    // Calculate summary data
    const totalWords = updatedAttempts.length;
    const correctWords = updatedAttempts.filter((a) => a.isCorrect).length;
    const incorrectWords = totalWords - correctWords;
    const accuracy = (correctWords / totalWords).toFixed(2);

    // Create session data object
    const sessionData = {
      id: localSessionId,
      date: localSessionDate,
      type: "spelling",
      userId: userId,
      words: updatedAttempts,
      summary: {
        totalWords: totalWords,
        correctWords: correctWords,
        incorrectWords: incorrectWords,
        accuracy: parseFloat(accuracy),
      },
    };

    // Save session data to localStorage
    const existingSessions =
      JSON.parse(localStorage.getItem("spellingSessions")) || [];
    existingSessions.push(sessionData);
    localStorage.setItem("spellingSessions", JSON.stringify(existingSessions));

    // setAttempts([]);
  };

  return (
    <div>
      <button onClick={saveSpellingSession}>Save Session</button>
    </div>
  );
}
