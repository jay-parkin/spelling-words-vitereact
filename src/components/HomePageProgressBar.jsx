import React from "react";

import ProgressBar from "@ramonak/react-progress-bar";
import { getTodaysTotalWordsPercentage } from "../functions/SpellingSessionUtils";

// Fix this progress bar first!
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export default function Example() {
  const today = new Date().getDay();
  const week = getWeekNumber(new Date());

  const USER_ID = "4b1fcc21-9598-49ac-a6ec-06ebfc08f7ad";
  return (
    <ProgressBar
      completed={getTodaysTotalWordsPercentage(USER_ID, week, today)}
    />
  );
}
