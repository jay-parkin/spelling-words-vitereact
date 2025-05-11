import { useEffect, useState } from "react";
import ProgressStats from "../components/ProgressStats";
import randomColourProperty from "../functions/RandomColourProperty";

import { useUser } from "../contexts/UserContext";

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
  const { user } = useUser();
  const [USER_ID] = useState(user.id);

  const spellingStats = {
    dailyAttemptPercentage: getDailyAttemptedPercent(USER_ID, week, today),
    dailyAccuracy: getDailyAccuracy(USER_ID, week, today),
    weeklyAttemptPercentage: getWeeklyAttemptedPercent(USER_ID, week, today),
    weeklyAccuracy: getWeeklyAccuracy(USER_ID, week),
  };

  const [weeklySummary, setWeeklySummary] = useState([]);
  useEffect(() => {
    setWeeklySummary(getWeeklySummary(USER_ID, week));
  }, []);

  return (
    <>
      <div className="page-title homepage-title">
        <h1 style={{ textShadow: `2px 2px 5pxclear ${randomColourProperty()}` }}>
          Welcome, {user.name}!
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
