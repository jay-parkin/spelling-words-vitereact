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
  const [coloursMap, setColoursMap] = useState({});
  const [selectedWords, setSelectedWords] = useState(() => {
    const stored = localStorage.getItem("selectedWords");
    return stored ? JSON.parse(stored) : [];
  });
  const [sentenceInputs, setSentenceInputs] = useState(() => {
    const stored = localStorage.getItem("sentenceInputs");
    return stored ? JSON.parse(stored) : {};
  });

  const [lockedWords, setLockedWords] = useState(() => {
    const stored = localStorage.getItem("lockedWords");
    return stored ? JSON.parse(stored) : [];
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem("lastUsedDate");

    if (lastUsed !== today) {
      localStorage.removeItem("sentenceInputs");
      localStorage.removeItem("selectedWords");
      localStorage.removeItem("lockedWords");
      localStorage.setItem("lastUsedDate", today);

      setSentenceInputs({});
      setSelectedWords([]);
      setLockedWords([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lockedWords", JSON.stringify(lockedWords));
  }, [lockedWords]);

  useEffect(() => {
    localStorage.setItem("sentenceInputs", JSON.stringify(sentenceInputs));
  }, [sentenceInputs]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("selectedWords", JSON.stringify(selectedWords));
  }, [selectedWords]);

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

        const words = data.words || [];
        setWordList(words);

        // assign each word a color
        const newColours = {};
        words.forEach((w) => (newColours[w.word] = randomColourProperty()));
        setColoursMap(newColours);
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

  const handleSelect = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else if (selectedWords.length < 3) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSentenceChange = (word, sentence) => {
    setSentenceInputs((prev) => ({
      ...prev,
      [word]: sentence,
    }));
  };

  const submitSentences = async () => {
    const selectedWordObjects = wordList.filter((w) =>
      selectedWords.includes(w.word)
    );

    if (selectedWordObjects.length !== 3) {
      alert("Please select exactly 3 words before submitting.");
      return;
    }

    const missing = selectedWordObjects.find(
      (w) => !sentenceInputs[w.word]?.trim()
    );
    if (missing) {
      alert(`Please enter a sentence for: ${missing.word}`);
      return;
    }

    try {
      for (let wordObj of selectedWordObjects) {
        const payload = {
          userId: user.userId,
          weekNumber,
          day: today,
          word: wordObj.word,
          sentence: sentenceInputs[wordObj.word],
          isValid: true,
        };

        console.log("➡️ Sending payload to /sentences/attempt:", payload);

        const response = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/sentences/attempt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const resBody = await response.json();
        console.log("⬅️ Received response for", wordObj.word, ":", resBody);

        if (!response.ok) {
          console.error(
            "❌ Error submitting",
            wordObj.word,
            response.status,
            resBody
          );
          alert(`Error submitting sentence for "${wordObj.word}"`);
          return;
        }
      }

      alert("Sentences submitted successfully!");

      setLockedWords((prev) => [...prev, ...selectedWords]);
      setSubmissionSuccess(true);
    } catch (err) {
      console.error("❗ Submission error:", err);
      alert("There was a problem submitting your sentences.");
    }
  };

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
        <button
          className={`toggle-btn ${submissionSuccess ? "success" : ""}`}
          onClick={submitSentences}
          disabled={submissionSuccess}
        >
          {submissionSuccess ? "Submit Success" : "Submit Sentences"}
        </button>
      </div>

      {visible && (
        <div className="sentence-word-body ">
          {wordList.map((wordObj, index) => (
            <SentenceWordCard
              key={index}
              word={wordObj.word}
              definition={wordObj.definition}
              designColour={coloursMap[wordObj.word]}
              isSelected={selectedWords.includes(wordObj.word)}
              onSelect={handleSelect}
              onSentenceChange={handleSentenceChange}
              sentenceValue={sentenceInputs[wordObj.word] || ""}
              isLocked={lockedWords.includes(wordObj.word)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
