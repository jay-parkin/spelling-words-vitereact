import randomColourProperty from "../functions/RandomColourProperty";

export default function WordSearchPage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Word Search Page
      </h1>
    </>
  );
}
