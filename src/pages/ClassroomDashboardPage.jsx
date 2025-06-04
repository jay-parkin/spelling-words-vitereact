// ClassroomDashboard.jsx
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import StudentCard from "../components/StudentCard";
import StudentDetailModal from "../components/StudentDetailModal";
import "../styles/ClassroomDashboardPage.css";

import { getWeekNumber } from "../utils/TimeUtils";

export default function ClassroomDashboard() {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [weekNumber, setWeekNumber] = useState(getWeekNumber(new Date()));
  const [subject, setSubject] = useState("maths");

  useEffect(() => {
    const fetchClassroom = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_DATABASE_URL}/classroom/teacher/${user.userId}`
      );
      const data = await res.json();
      setStudents(data.classroom.students);
    };
    fetchClassroom();
  }, [user]);

  return (
    <div className="classroom-dashboard">
      <h1>Classroom Dashboard</h1>
      <div className="controls">
        <select
          value={weekNumber}
          onChange={(e) => setWeekNumber(Number(e.target.value))}
        >
          {[...Array(52)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>

        <div className="subject-tabs">
          {["maths", "spelling", "sentences"].map((subj) => (
            <button
              key={subj}
              className={subject === subj ? "active" : ""}
              onClick={() => setSubject(subj)}
            >
              {subj.charAt(0).toUpperCase() + subj.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="student-grid">
        {students.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            weekNumber={weekNumber}
            subject={subject}
            onView={() => setSelectedStudent(student)}
          />
        ))}
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          weekNumber={weekNumber}
          subject={subject}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
