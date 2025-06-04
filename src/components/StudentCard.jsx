import { useEffect, useState } from "react";

export default function StudentCard({ student, weekNumber, subject, onView }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
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
        setSummary(week?.weeklySummary);
      } catch (err) {
        console.error("Progress fetch failed for", student.name, err);
      }
    };

    fetchProgress();
  }, [student._id, weekNumber, subject]);

  return (
    <div className="student-card">
      <h3>{student.name}</h3>
      <p>
        <strong>Accuracy:</strong> {summary?.accuracy ?? 0}%
      </p>
      <p>
        <strong>Total:</strong>{" "}
        {summary?.totalWords ??
          summary?.totalQuestions ??
          summary?.totalSentences ??
          0}
      </p>
      <button onClick={onView}>View</button>
    </div>
  );
}
