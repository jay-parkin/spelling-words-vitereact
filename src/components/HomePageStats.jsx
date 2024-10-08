import ProgressBar from "../components/HomePageProgressBar";

export default function HomePageStats() {
  return (
    <>
      {
        <div className="stats-body">
          <div className="stats-container">
            <h4>Spelling</h4>

            <div className="progress">
              <ProgressBar />
            </div>
          </div>
        </div>
      }
    </>
  );
}
