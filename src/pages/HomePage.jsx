import { useEffect, useState } from "react";
import randomColourProperty from "../utils/RandomColourProperty";
import { useUser } from "../contexts/UserContext";
import { getWeekNumber } from "../utils/TimeUtils";
import DadJokes from "../components/DadJokes";
import ProgressSection from "../components/ProgressSection";

export default function HomePage() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());
  const { user } = useUser();

  const [weeklySpellingSummary, setWeeklySpellingSummary] = useState(null);
  const [dailySpellingStats, setDailySpellingStats] = useState(null);
  const [spellingAttemptedPercentage, setSpellingAttemptedPercentage] =
    useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const [weeklyMathsSummary, setWeeklyMathsSummary] = useState(null);
  const [dailyMathsStats, setDailyMathsStats] = useState(null);
  const [mathsAttemptedPercentage, setMathsAttemptedPercentage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const calculateMathsWeeklyAttemptPercentage = (weekData) => {
    if (!weekData?.questionList?.length || !weekData?.days?.length) return 0;

    const totalQuestions = weekData.questionList.length;
    setTotalQuestions(totalQuestions); // set for daily completed percentage
    const expectedBase = totalQuestions * weekData.days.length;

    let actualAttempts = 0;
    let totalIncorrectAttempts = 0;

    weekData.days.forEach((day) => {
      day.questions.forEach((q) => {
        const correct = q.correctAttempt || 0;
        const incorrect = q.incorrectAttempt || 0;
        actualAttempts += correct + incorrect;
        totalIncorrectAttempts += incorrect;
      });
    });

    const expectedTotal = expectedBase + totalIncorrectAttempts;

    return expectedTotal > 0
      ? Math.round((actualAttempts / expectedTotal) * 100)
      : 0;
  };

  const calculateSpellingWeeklyAttemptPercentage = (weekData) => {
    if (!weekData?.wordList?.length || !weekData?.days?.length) return 0;

    const totalWords = weekData.wordList.length;
    setTotalWords(totalWords); // set for daily completed percentage
    const expectedBase = totalWords * weekData.days.length;

    let actualAttempts = 0;
    let totalIncorrectAttempts = 0;

    weekData.days.forEach((day) => {
      day.words.forEach((word) => {
        const correct = word.correctAttempt || 0;
        const incorrect = word.incorrectAttempt || 0;
        actualAttempts += correct + incorrect;
        totalIncorrectAttempts += incorrect;
      });
    });

    const expectedTotal = expectedBase + totalIncorrectAttempts;

    return expectedTotal > 0
      ? Math.round((actualAttempts / expectedTotal) * 100)
      : 0;
  };

  // Pull spelling session
  useEffect(() => {
    if (!user?.userId) return;

    const fetchSpellingProgress = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/spelling/user-progress/${
            user.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user progress");
        const data = await response.json();

        const weekData = data.session.weeks.find((w) => w.weekNumber === week);
        if (!weekData) return;

        setWeeklySpellingSummary(weekData.weeklySummary);
        const todayData = weekData.days?.[today];
        if (todayData?.dailySummary) {
          setDailySpellingStats(todayData.dailySummary);
        }

        setSpellingAttemptedPercentage(
          calculateSpellingWeeklyAttemptPercentage(weekData)
        );
      } catch (err) {
        console.error("Error loading spelling progress:", err);
      }
    };

    fetchSpellingProgress();
  }, [user, week, today]);

  // Pull maths session
  useEffect(() => {
    if (!user?.userId) return;

    const fetchMathsProgress = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/maths/user-progress/${
            user.userId
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user progress");
        const data = await response.json();

        const weekData = data.session.weeks.find((w) => w.weekNumber === week);
        if (!weekData) return;

        setWeeklyMathsSummary(weekData.weeklySummary);
        const todayData = weekData.days?.[today];

        if (todayData?.dailySummary) {
          setDailyMathsStats(todayData.dailySummary);
        }

        setMathsAttemptedPercentage(
          calculateMathsWeeklyAttemptPercentage(weekData)
        );
      } catch (err) {
        console.error("Error loading maths progress:", err);
      }
    };

    fetchMathsProgress();
  }, [user, week, today]);

  return (
    <>
      <div className="page-title homepage-title">
        <h1 style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}>
          Welcome, {user?.name}!
        </h1>
        <DadJokes />
      </div>

      <div className="home-container">
        {weeklySpellingSummary && dailySpellingStats && (
          <ProgressSection
            title="Spelling"
            dailyAttemptPercentage={Math.round(
              totalWords > 0
                ? ((dailySpellingStats.correctWords +
                    dailySpellingStats.incorrectWords) /
                    (totalWords + dailySpellingStats.incorrectWords)) *
                    100
                : 0
            )}
            dailyAccuracy={dailySpellingStats.accuracy}
            weeklyAttemptPercentage={spellingAttemptedPercentage}
            weeklyAccuracy={weeklySpellingSummary.accuracy}
            weeklySummary={weeklySpellingSummary}
          />
        )}

        {weeklyMathsSummary && dailyMathsStats && (
          <ProgressSection
            title="Maths"
            dailyAttemptPercentage={Math.round(
              totalQuestions > 0
                ? ((dailyMathsStats.correctQuestions +
                    dailyMathsStats.incorrectQuestions) /
                    (totalQuestions + dailyMathsStats.incorrectQuestions)) *
                    100
                : 0
            )}
            dailyAccuracy={dailyMathsStats.accuracy}
            weeklyAttemptPercentage={mathsAttemptedPercentage}
            weeklyAccuracy={weeklyMathsSummary.accuracy}
            weeklySummary={weeklyMathsSummary}
          />
        )}
      </div>
    </>
  );
}
