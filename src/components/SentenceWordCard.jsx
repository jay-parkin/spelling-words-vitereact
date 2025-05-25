import { useState } from "react";

export default function SentenceWordCard({ word, definition, designColour }) {
  const [localColourProperty] = useState(designColour);

  return (
    <div
      className="sentence-word-card-container"
      style={{
        boxShadow: `5px 5px 5px ${localColourProperty}`,
        borderBottom: `1px solid ${localColourProperty}`,
        borderLeft: `1px solid ${localColourProperty}`,
      }}
    >
      <div
        className="sentence-word-card-header"
        style={{
          backgroundColor: localColourProperty,
        }}
      >
        <h3>{word}</h3>
      </div>
      <div className="sentence-word-card-body">
        <div className="sentence-word-card-text">
          <p>{definition}</p>
        </div>
      </div>
    </div>
  );
}
