import { useEffect, useState } from "react";
import ProgressStats from "../components/ProgressStats";
import randomColourProperty from "../utils/RandomColourProperty";

import { useUser } from "../contexts/UserContext";

import {
  getDailyAccuracy,
  getWeeklyAccuracy,
  getDailyAttemptedPercent,
  getWeeklyAttemptedPercent,
  getWeeklySummary,
} from "../utils/SpellingSessionUtils";

import { getWeekNumber } from "../utils/TimeUtils";
import DadJokes from "../components/DadJokes";

export default function HomePage() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());
  const { user } = useUser();

  const spellingStats = {
    dailyAttemptPercentage: getDailyAttemptedPercent(user?.userId, week, today),
    dailyAccuracy: getDailyAccuracy(user?.userId, week, today),
    weeklyAttemptPercentage: getWeeklyAttemptedPercent(
      user?.userId,
      week,
      today
    ),
    weeklyAccuracy: getWeeklyAccuracy(user?.userId, week),
  };

  const [weeklySummary, setWeeklySummary] = useState([]);
  useEffect(() => {
    setWeeklySummary(getWeeklySummary(user?.userId, week));
  }, []);

  return (
    <>
      <div className="page-title homepage-title">
        <h1
          style={{ textShadow: `2px 2px 5pxclear ${randomColourProperty()}` }}
        >
          Welcome, {user?.name}!
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
