import React from 'react';

/**
 * The flipping flashcard.
 * Clicking (or pressing space) flips it.
 */
const Flashcard = ({ card, isFlipped, onFlip, index, total }) => {
  return (
    <div
      className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? `Answer: ${card.back}` : `Question: ${card.front}. Click to reveal answer.`}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      {/* FRONT */}
      <div className="flashcard__face flashcard__face--front">
        <span className="flashcard__corner flashcard__corner--tl">Question</span>
        <span className="flashcard__corner flashcard__corner--tr">
          {index + 1} / {total}
        </span>
        <div className="flashcard__content">{card.front}</div>
        <span className="flashcard__corner flashcard__corner--br">↻ tap to flip</span>
      </div>

      {/* BACK */}
      <div className="flashcard__face flashcard__face--back">
        <span className="flashcard__corner flashcard__corner--tl">Answer</span>
        <span className="flashcard__corner flashcard__corner--tr">
          {index + 1} / {total}
        </span>
        <div className="flashcard__content">{card.back}</div>
        <span className="flashcard__corner flashcard__corner--br">grade yourself ↓</span>
      </div>
    </div>
  );
};

export default Flashcard;
