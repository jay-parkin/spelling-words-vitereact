import SpellingWords from "../components/SpellingWords";
import randomColourProperty from "../utils/RandomColourProperty";

import "../styles/SpellingPage.css";

export default function SpellingPage() {
  return (
    <>
      <h1
        className="page-title"
        style={{ textShadow: `2px 2px 5px ${randomColourProperty()}` }}
      >
        Let's Practice our Spelling!
      </h1>
      <SpellingWords />
    </>
  );
}
