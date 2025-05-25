export default function SentenceResults({ week, day }) {
  return (
    <div className="results-screen">
      <h2>All sentences complete!</h2>
      <p>Nice work — you've finished today's writing challenge.</p>
      <p>
        Week {week}, Day {day}
      </p>
    </div>
  );
}
