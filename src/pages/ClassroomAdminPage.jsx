import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import ProgressSection from "../components/ProgressSection";
import DoggyLoader from "../components/loader/DoggySleeping";

import "../styles/ClassroomAdminPage.css";
import { getWeekNumber } from "../utils/TimeUtils";

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
          let spelling = {};
          let maths = {};

          try {
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
            if (spellingRes.ok) {
              const spellingData = await spellingRes.json();
              const currentWeek = getWeekNumber(new Date());
              const spellingWeek = spellingData.session.weeks.find(
                (w) => w.weekNumber === currentWeek
              );
              spelling = spellingWeek?.weeklySummary ?? {};
            }
          } catch (err) {
            console.warn(`No spelling data for ${student.name}`);
          }

          try {
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
            if (mathsRes.ok) {
              const mathsData = await mathsRes.json();
              const currentWeek = getWeekNumber(new Date());
              const mathsWeek = mathsData.session.weeks.find(
                (w) => w.weekNumber === currentWeek
              );
              maths = mathsWeek?.weeklySummary ?? {};
            }
          } catch (err) {
            console.warn(`No maths data for ${student.name}`);
          }

          return {
            student,
            spelling,
            maths,
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
