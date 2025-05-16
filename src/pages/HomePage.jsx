import { useEffect, useState } from "react";
import ProgressStats from "../components/ProgressStats";
import randomColourProperty from "../utils/RandomColourProperty";
import { useUser } from "../contexts/UserContext";
import { getWeekNumber } from "../utils/TimeUtils";
import DadJokes from "../components/DadJokes";

export default function HomePage() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());
  const { user } = useUser();

  const [weeklySummary, setWeeklySummary] = useState(null);
  const [dailyStats, setDailyStats] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchProgress = async () => {
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

        setWeeklySummary(weekData.weeklySummary);

        const todayData = weekData.days?.[today];
        if (todayData?.dailySummary) {
          setDailyStats(todayData.dailySummary);
        }
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };

    fetchProgress();
  }, [user, week, today]);

  return (
    <>
      {/*TODO: Make this a component */}
      <div className="page-title homepage-title">
        <h1 style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}>
          Welcome, {user?.name}!
        </h1>
        <DadJokes />
      </div>

      <div className="home-container">
        {weeklySummary && dailyStats && (
          <ProgressStats
            dailyAttemptPercentage={
              dailyStats.totalWords > 0
                ? ((dailyStats.correctWords + dailyStats.incorrectWords) /
                    dailyStats.totalWords) *
                  100
                : 0
            }
            dailyAccuracy={dailyStats.accuracy}
            weeklyAttemptPercentage={
              weeklySummary.totalWords > 0
                ? ((weeklySummary.correctWords + weeklySummary.incorrectWords) /
                    weeklySummary.totalWords) *
                  100
                : 0
            }
            weeklyAccuracy={weeklySummary.accuracy}
            weeklySummary={weeklySummary}
          />
        )}
      </div>
    </>
  );
}
