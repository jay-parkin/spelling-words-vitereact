/*
  Utils to help out saving and 
  storaging the user's current session
*/

export function incrementCurrentWordIndex(userId, weekNumber, dayNumber) {
  // Retrieve the spelling sessions from localStorage
  const spellingSessions = JSON.parse(localStorage.getItem("spellingSessions"));

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];
    const weekWordListLength = week.wordList.length;

    if (week) {
      // Access the specified day
      const day = week.days[dayNumber];

      if (day) {
        // if (prevIndex < randomWords.length - 1)
        if (day.currentWordIndex < weekWordListLength - 1)
          // Increment the current word index
          day.currentWordIndex += 1;
        // Save the updated session back to localStorage
        localStorage.setItem(
          "spellingSessions",
          JSON.stringify(spellingSessions)
        );
      }
    }
  }
}

export function getDailyWordList(userId, weekNumber, dayNumber) {
  // Retrieve the spelling sessions from localStorage
  let spellingSessions = localStorage.getItem("spellingSessions");

  // Check if it needs parsing
  if (typeof spellingSessions === "string") {
    // Only parse if it's a string
    spellingSessions = JSON.parse(spellingSessions);
  }

  // Handle case when no data is found
  if (!spellingSessions) {
    console.log("No spelling sessions found.");
    return [];
  }

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  // If user session exists
  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];

    if (week) {
      // Access the specified day
      const day = week.days[dayNumber];

      if (day) {
        // Return the current word index
        return day.words;
      }
    }
  }

  // If no valid data was found, return an empty array
  return [];
}

export function getWeekWordList(userId, weekNumber) {
  // Retrieve the spelling sessions from localStorage
  let spellingSessions = localStorage.getItem("spellingSessions");

  // Check if it needs parsing
  if (typeof spellingSessions === "string") {
    // Only parse if it's a string
    spellingSessions = JSON.parse(spellingSessions);
  }

  // Handle case when no data is found
  if (!spellingSessions) {
    console.log("No spelling sessions found.");
    return [];
  }

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  // If user session exists
  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];

    // If the week exists, return its wordList, otherwise return an empty array
    if (week && Array.isArray(week.wordList)) {
      return week.wordList;
    }
  }

  // If no valid data was found, return an empty array
  return [];
}

export function getCurentWordIndex(userId, weekNumber, dayNumber) {
  // Retrieve the spelling sessions from localStorage
  const spellingSessions = JSON.parse(localStorage.getItem("spellingSessions"));

  // Check if spellingSessions exists and is not null
  if (!spellingSessions) {
    return 0; // Return a default value if no sessions exist
  }

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  // If the user session exists
  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];

    if (week) {
      // Access the specified day
      const day = week.days[dayNumber];

      if (day) {
        // Return the current word index
        return day.currentWordIndex;
      }
    }
  }

  // Return a default value if nothing is found
  return 0;
}

export function saveToDailyWordList(
  userId,
  weekNumber,
  dayNumber,
  word,
  definition,
  userInput,
  isCorrect
) {
  // Retrieve the spelling sessions from localStorage
  const spellingSessions = JSON.parse(localStorage.getItem("spellingSessions"));

  // Check if spellingSessions exists and is not null
  if (!spellingSessions) {
    console.error("No spelling sessions found.");
    return;
  }

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  // If the user session exists
  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];

    if (week) {
      // Access the specified day
      const day = week.days[dayNumber];

      if (day) {
        // Push the current word to the daily word list
        day.words.push({
          word,
          definition,
          userInput,
          isCorrect,
        });

        // Update the daily summary
        day.dailySummary = submitDailySummary(day.dailySummary, isCorrect);
      }

      week.weeklySummary = submitWeeklySummary(week.weeklySummary,)

      // Update the lastUpdated timestamp
      userSession.lastUpdated = new Date().toISOString();

      // Save the updated session back to localStorage
      localStorage.setItem(
        "spellingSessions",
        JSON.stringify(spellingSessions)
      );
    }
  }
}

function submitDailySummary(dailySummary, isCorrect) {
  const totalWords = dailySummary.totalWords + 1;
  const correctWords = dailySummary.correctWords + (isCorrect ? 1 : 0);
  const incorrectWords = dailySummary.incorrectWords + (isCorrect ? 0 : 1);

  // Calculate accuracy as a percentage
  const accuracy = totalWords === 0 ? 0 : (correctWords / totalWords) * 100;

  return {
    totalWords,
    correctWords,
    incorrectWords,
    accuracy,
  };
}

function submitWeeklySummary(dailySummary, isCorrect) {
  const totalWords = dailySummary.totalWords + 1;
  const correctWords = dailySummary.correctWords + (isCorrect ? 1 : 0);
  const incorrectWords = dailySummary.incorrectWords + (isCorrect ? 0 : 1);

  // Calculate accuracy as a percentage
  const accuracy = totalWords === 0 ? 0 : (correctWords / totalWords) * 100;

  return {
    totalWords,
    mostCommonlyMispelled,
    correctWords,
    incorrectWords,
    accuracy,
  };
}

export function getDailyPercentage(userId, weekNumber, dayNumber) {
  // Retrieve the spelling sessions from localStorage
  const spellingSessions = JSON.parse(localStorage.getItem("spellingSessions"));

  // Check if spellingSessions exists and is not null
  if (!spellingSessions) {
    console.error("No spelling sessions found.");
    return;
  }

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  // If the user session exists
  if (userSession) {
    // Access the specified week
    const week = userSession.weeks[weekNumber];

    if (week) {
      // Access the specified day
      const day = week.days[dayNumber];

      if (day) {
        // return the daily summary percentage
        return day.dailySummary.accuracy;
      }
    }
  }
  return null;
}

export function initialiseSpellingSession(userId) {
  // Check if spelling sessions already exist in localStorage
  const existingSpellingSessions = JSON.parse(
    localStorage.getItem("spellingSessions")
  );

  if (!existingSpellingSessions) {
    // Create a blank session for the user if none exist
    const blankSpellingSession = {
      userId: userId,
      lastUpdated: new Date().toISOString(),
      subject: "spelling",
      weeks: {},
    };

    // Save the blank session to localStorage
    localStorage.setItem(
      "spellingSessions",
      JSON.stringify([blankSpellingSession])
    );
    console.log("Initialized blank spelling.json for user:", userId);
  } else {
    console.log("Spelling session already exists for user:", userId);
  }
}

export function addWeekAndDay(userId, weekNumber, dayNumber, wordList) {
  const spellingSessions = JSON.parse(localStorage.getItem("spellingSessions"));

  // Find the user's session
  const userSession = spellingSessions.find(
    (session) => session.userId === userId
  );

  if (userSession) {
    // Ensure weeks is initialised
    if (!userSession.weeks) {
      userSession.weeks = {};
    }

    // Ensure the week exists
    if (!userSession.weeks[weekNumber]) {
      // Initialise the week with a weeklysummary
      userSession.weeks[weekNumber] = {
        wordList: wordList,
        weeklySummary: {
          totalWords: 0,
          mostCommonlyMispelled: "",
          correctWords: 0,
          incorrectWords: 0,
          accuracy: 0,
        },
        // Initialise an empty days array
        days: [],
      };
      console.log("Adding a new week to user: ", userId);
    }

    // Add a new day to the week if it doesn't exist
    if (!userSession.weeks[weekNumber].days[dayNumber]) {
      userSession.weeks[weekNumber].days[dayNumber] = {
        day: dayNumber,
        dayName: getDayName(dayNumber),
        currentWordIndex: 0,
        words: [],
        dailySummary: {
          totalWords: 0,
          correctWords: 0,
          incorrectWords: 0,
          accuracy: 0,
        },
      };
      console.log("Adding a new day to user: ", userId);
    }

    // Update the lastUpdated timestamp
    userSession.lastUpdated = new Date().toISOString();

    // Save the updated session to localStorage
    localStorage.setItem("spellingSessions", JSON.stringify(spellingSessions));
  }
}

function getDayName(today) {
  const daysOfWeek = [
    "Sunday", // 0
    "Monday", // 1
    "Tuesday", // 2
    "Wednesday", // 3
    "Thursday", // 4
    "Friday", // 5
    "Saturday", // 6
  ];

  // Validate the day number and return the corresponding day name
  if (today >= 0 && today < daysOfWeek.length) {
    return daysOfWeek[today];
  } else {
    // Handle invalid input
    return "Invalid day number";
  }
}
