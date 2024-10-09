import { useEffect, useState } from "react";
import ProgressStats from "../components/ProgressStats";
import randomColourProperty from "../functions/RandomColourProperty";

import {
  getDailyAccuracy,
  getWeeklyAccuracy,
  getDailyAttemptedPercent,
  getWeeklyAttemptedPercent,
  getWeeklySummary,
} from "../functions/SpellingSessionUtils";
import { getWeekNumber } from "../functions/TimeUtils";
import DadJokes from "../components/DadJokes";

export default function HomePage() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());

  const USER_ID = "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad";

  const spellingStats = {
    dailyAttemptPercentage: getDailyAttemptedPercent(USER_ID, week, today),
    dailyAccuracy: getDailyAccuracy(USER_ID, week, today),
    weeklyAttemptPercentage: getWeeklyAttemptedPercent(USER_ID, week, today),
    weeklyAccuracy: getWeeklyAccuracy(USER_ID, week),
  };

  const [weeklySummary, setWeeklySumarry] = useState([]);
  useEffect(() => {
    setWeeklySumarry(getWeeklySummary(USER_ID, week));
  }, []);

  return (
    <>
      <div className="page-title homepage-title">
        <h1 style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}>
          Welcome, Jason!
        </h1>

        <DadJokes />
      </div>

      <div className="home-container">
        {/* Return daily / week spelling stats */}
        <ProgressStats
          dailyAttemptPercentage={spellingStats.dailyAttemptPercentage}
          dailyAccuracy={spellingStats.dailyAccuracy}
          weeklyAttemptPercentage={spellingStats.weeklyAttemptPercentage}
          weeklyAccuracy={spellingStats.weeklyAccuracy}
          weeklySummary={weeklySummary}
        />
      </div>
    </>
  );
}
