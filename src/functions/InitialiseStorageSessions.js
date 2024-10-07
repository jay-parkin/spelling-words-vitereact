export function initialiseSpellingSession(userId, week, today) {
  // Check if spelling sessions already exist in localStorage
  const existingSpellingSessions = JSON.parse(
    localStorage.getItem("spellingSessions")
  );

  if (!existingSpellingSessions) {
    // Create a blank session for the user if none exist
    const blankSpellingSession = {
      userId: userId,
      lastUpdated: new Date(),
      subject: "spelling",
      week: {},
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
