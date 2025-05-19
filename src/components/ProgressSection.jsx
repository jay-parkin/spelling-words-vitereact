import { ProgressBar } from "react-progressbar-fancy";
import ProgressProvider from "../contexts/ProgressProvider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressSection({
  title,
  dailyAttemptPercentage,
  dailyAccuracy,
  weeklyAttemptPercentage,
  weeklyAccuracy,
  weeklySummary,
}) {
  return (
    <div className="stats-container">
      <h3>{title}</h3>
      <div className="stats-inner-container">
        <div className="progress">
          <h5>Daily Completed</h5>
          <ProgressBar score={dailyAttemptPercentage} />
        </div>

        <div className="progress">
          <h5>Daily Accuracy</h5>
          <ProgressBar score={dailyAccuracy} progressColor="blue" />
        </div>
      </div>
      <div className="stats-inner-container">
        <div className="stats-progress-container">
          <h5>Weekly Attempted</h5>
          <ProgressProvider valueStart={0} valueEnd={weeklyAttemptPercentage}>
            {(value) => (
              <CircularProgressbar
                value={value}
                text={`${value.toFixed(0)}%`}
                circleRatio={1}
                className="stats-circle-progress"
              />
            )}
          </ProgressProvider>
        </div>

        <div className="stats-progress-container">
          <h5>Weekly Accuracy</h5>
          <ProgressProvider valueStart={0} valueEnd={weeklyAccuracy}>
            {(value) => (
              <CircularProgressbar
                value={value}
                text={`${value.toFixed(0)}%`}
                circleRatio={1}
                className="stats-circle-progress"
              />
            )}
          </ProgressProvider>
        </div>

        <div className="stats-summary-container">
          <h5>Weekly Summary</h5>
          <div className="stats-weekly-summary">
            <h6>Most Commonly Incorrect:</h6>
            {weeklySummary?.mostCommonlyIncorrect ?? "N/A"}
          </div>
          <div className="stats-weekly-summary">
            <h6>Total:</h6>
            {weeklySummary?.totalWords ?? weeklySummary?.totalQuestions ?? 0}
          </div>
          <div className="stats-weekly-summary">
            <h6>Correct:</h6>
            {title === "Maths"
              ? weeklySummary?.correctQuestions ??
                weeklySummary?.correctAnswers ??
                0
              : weeklySummary?.correctWords ??
                weeklySummary?.correctAnswers ??
                0}
          </div>
          <div className="stats-weekly-summary">
            <h6>Incorrect:</h6>
            {title === "Maths"
              ? weeklySummary?.incorrectQuestions ??
                weeklySummary?.incorrectAnswers ??
                0
              : weeklySummary?.incorrectWords ??
                weeklySummary?.incorrectAnswers ??
                0}
          </div>
        </div>
      </div>
    </div>
  );
}
