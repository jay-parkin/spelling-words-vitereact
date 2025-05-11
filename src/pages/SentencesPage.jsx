import randomColourProperty from "../utils/RandomColourProperty";

export default function SentencesPage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Sentences Page
      </h1>
    </>
  );
}
