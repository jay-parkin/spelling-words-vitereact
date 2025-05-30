import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import ProgressSection from "../components/ProgressSection";
import DoggyLoader from "../components/loader/DoggySleeping";

import "../styles/ClassroomAdminPage.css";

export default function ClassroomAdminPage() {
  const { user } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_DATABASE_URL}/classroom/teacher/${
            user.userId
          }`
        );
        const data = await res.json();
        setClassroom(data.classroom);

        const statsPromises = data.classroom.students.map(async (student) => {
          const spellingRes = await fetch(
            `${import.meta.env.VITE_DATABASE_URL}/spelling/user-progress/${
              student._id
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          const mathsRes = await fetch(
            `${import.meta.env.VITE_DATABASE_URL}/maths/user-progress/${
              student._id
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );

          const spellingData = await spellingRes.json();
          const mathsData = await mathsRes.json();

          const currentWeek = new Date();
          const weekNumber = getWeekNumber(currentWeek);

          const spellingWeek = spellingData.session.weeks.find(
            (w) => w.weekNumber === weekNumber
          );
          const mathsWeek = mathsData.session.weeks.find(
            (w) => w.weekNumber === weekNumber
          );

          return {
            student,
            spelling: spellingWeek?.weeklySummary ?? {},
            maths: mathsWeek?.weeklySummary ?? {},
          };
        });

        const results = await Promise.all(statsPromises);
        setStudentStats(results);
      } catch (err) {
        console.error("Failed to load classroom data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [user.userId]);

  const getWeekNumber = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <h2>Loading classroom...</h2>
        <DoggyLoader />
      </div>
    );
  }

  return (
    <section className="admin-classroom-page">
      <h1>Classroom: {classroom?.name}</h1>
      {studentStats.map(({ student, spelling, maths }) => (
        <div key={student._id} className="student-summary-card">
          <h3>{student.name}</h3>
          <div className="summary-columns">
            <div className="summary-section">
              <h4>Spelling</h4>
              <p>Total words: {spelling?.totalWords ?? 0}</p>
              <p>Correct words: {spelling?.correctWords ?? 0}</p>
              <p>Incorrect words: {spelling?.incorrectWords ?? 0}</p>
              <p>Accuracy: {spelling?.accuracy?.toFixed(0) ?? 0}%</p>
            </div>
            <div className="summary-section">
              <h4>Maths</h4>
              <p>Total questions: {maths?.totalQuestions ?? 0}</p>
              <p>Correct questions: {maths?.correctQuestions ?? 0}</p>
              <p>Incorrect questions: {maths?.incorrectQuestions ?? 0}</p>
              <p>Accuracy: {maths?.accuracy?.toFixed(0) ?? 0}%</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
