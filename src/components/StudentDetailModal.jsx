import { useEffect, useState } from "react";

export default function StudentDetailModal({
  student,
  subject,
  weekNumber,
  onClose,
}) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/${subject}/user-progress/${
            student._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const week = data.session.weeks.find(
          (w) => w.weekNumber === weekNumber
        );
        setDays(week?.days || []);
      } catch (err) {
        console.error("Detail fetch failed for", student.name, err);
      }
    };

    fetchDetail();
  }, [student._id, subject, weekNumber]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          x
        </button>
        <h2>
          {student.name} - {subject}
        </h2>
        <h4>Week {weekNumber}</h4>

        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Total</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Accuracy</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, idx) => (
              <>
                <tr key={day.day}>
                  <td>{day.dayName}</td>
                  <td>
                    {day.dailySummary?.totalQuestions ??
                      day.dailySummary?.totalWords ??
                      day.dailySummary?.totalSentences ??
                      0}
                  </td>
                  <td>
                    {day.dailySummary?.correctQuestions ??
                      day.dailySummary?.correctWords ??
                      day.dailySummary?.validSentences ??
                      0}
                  </td>
                  <td>
                    {day.dailySummary?.incorrectQuestions ??
                      day.dailySummary?.incorrectWords ??
                      day.dailySummary?.invalidSentences ??
                      0}
                  </td>
                  <td>{(day.dailySummary?.accuracy ?? 0).toFixed(0)}%</td>
                  <td>
                    <button
                      onClick={() =>
                        setSelectedDay(selectedDay === idx ? null : idx)
                      }
                    >
                      {selectedDay === idx ? "-" : "+"}
                    </button>
                  </td>
                </tr>

                {selectedDay === idx && (
                  <tr>
                    <td colSpan="6">
                      <ul>
                        {subject === "maths" &&
                          day.questions?.map((q, i) => (
                            <li key={i}>
                              {q.history?.length > 0 && (
                                <div className="history-entry">
                                  <h3>
                                    {q.equation} = {q.correctAnswer}
                                  </h3>

                                  <div className="attempt-list">
                                    {q.history.map((h, j) => (
                                      <div
                                        key={j}
                                        className={`attempt-item ${
                                          h.isCorrect ? "correct" : "incorrect"
                                        }`}
                                      >
                                        <div
                                          key={j}
                                          className={`attempt-item ${
                                            h.isCorrect
                                              ? "correct"
                                              : "incorrect"
                                          }`}
                                        >
                                          {h.isCorrect ? "✔️" : "✖️"} Attempt{" "}
                                          {j + 1}: {h.input} —{" "}
                                          {h.isCorrect
                                            ? "Correct"
                                            : "Incorrect"}{" "}
                                          (
                                          {new Date(
                                            h.attemptedAt
                                          ).toLocaleString()}
                                          )
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}

                        {subject === "spelling" &&
                          day.words?.map((w, i) => (
                            <li key={i}>
                              {w.history?.length > 0 ? (
                                <div className="history-entry">
                                  <h3>{w.word}</h3>
                                  <div className="attempt-list">
                                    {w.history.map((h, j) => (
                                      <div
                                        key={j}
                                        className={`attempt-item ${
                                          h.isCorrect ? "correct" : "incorrect"
                                        }`}
                                      >
                                        <div
                                          key={j}
                                          className={`attempt-item ${
                                            h.isCorrect
                                              ? "correct"
                                              : "incorrect"
                                          }`}
                                        >
                                          {h.isCorrect ? "✔️" : "✖️"} Attempt{" "}
                                          {j + 1}: {h.input} —{" "}
                                          {h.isCorrect
                                            ? "Correct"
                                            : "Incorrect"}{" "}
                                          (
                                          {new Date(
                                            h.attemptedAt
                                          ).toLocaleString()}
                                          )
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p>No attempts yet</p>
                              )}
                            </li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
