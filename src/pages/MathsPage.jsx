import MathsQuestions from "../components/MathsQuestions";
import randomColourProperty from "../functions/RandomColourProperty";

export default function MathsPage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Let's Practice our Maths!
      </h1>
      <MathsQuestions />
    </>
  );
}
