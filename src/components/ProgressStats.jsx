import { ProgressBar } from "react-progressbar-fancy";
import ProgressProvider from "../contexts/ProgressProvider";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressStats(props) {
  const {
    dailyAttemptPercentage,
    dailyAccuracy,
    weeklyAttemptPercentage,
    weeklyAccuracy,
    weeklySummary,
  } = props;

  return (
    <>
      {
        <div className="stats-container">
          <h3>Spelling</h3>
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
              <h5>Weekly Words Attempted</h5>
              <ProgressProvider
                valueStart={0}
                valueEnd={weeklyAttemptPercentage}
              >
                {(value) => (
                  <CircularProgressbar
                    value={value}
                    text={`${value}%`}
                    circleRatio={1}
                    // counterClockwise={true}
                    className="stats-circle-progress"
                    ballStrokeWidth={20}
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
                    text={`${value}%`}
                    circleRatio={1}
                    // counterClockwise={true}
                    className="stats-circle-progress"
                    ballStrokeWidth={20}
                  />
                )}
              </ProgressProvider>
            </div>

            <div className="stats-summary-container">
              <h5>Weekly Summary</h5>
              <div className="stats-weekly-summary">
                <h6>Most Commonly Misspelt:</h6>
                {weeklySummary.mostCommonlyMisspelt}
              </div>
              <div className="stats-weekly-summary">
                <h6>Total Words:</h6>
                {weeklySummary.totalWords}
              </div>
              <div className="stats-weekly-summary">
                <h6>Correct:</h6>
                {weeklySummary.correctWords}
              </div>
              <div className="stats-weekly-summary">
                <h6>Incorrect:</h6>
                {weeklySummary.incorrectWords}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
