import { useState } from "react";

export default function SentenceWordCard({
  word,
  definition,
  designColour,
  onSelect,
  isSelected,
  onSentenceChange,
  sentenceValue = "",
  isLocked = false,
}) {
  const displayColour = isSelected ? designColour : "#ccc"; // Default color if not selected

  const handleInputChange = (e) => {
    onSentenceChange(word, e.target.value);
  };

  return (
    <div
      className={`sentence-word-card-container ${
        isSelected ? "selected" : ""
      } ${isLocked ? "locked" : ""}`}
      style={{
        boxShadow: `5px 5px 5px ${displayColour}`,
        borderBottom: `1px solid ${displayColour}`,
        borderLeft: `1px solid ${displayColour}`,
        cursor: "pointer",
      }}
      onClick={() => !isLocked && onSelect(word)}
    >
      <div
        className="sentence-word-card-header"
        style={{
          backgroundColor: displayColour,
        }}
      >
        <h3>{word}</h3>
      </div>
      <div className="sentence-word-card-body">
        <div className="sentence-word-card-text">
          <p>{definition}</p>
        </div>
        <div className="sentence-word-card-input">
          <textarea
            className="sentence-textarea"
            autoComplete="off"
            type="text"
            placeholder="Write your sentence..."
            value={sentenceValue}
            onClick={(e) => e.stopPropagation()}
            onChange={handleInputChange}
            disabled={isLocked}
            style={{
              border: `1px solid ${displayColour}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
