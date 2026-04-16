import React, { useState, useEffect, useCallback } from 'react';
import Flashcard from './Flashcard';
import { reviewCard, QUALITY, getDueCards, formatInterval, createInitialCardState } from '../utils/spacedRepetition';

/**
 * The main study session view.
 * Shows the current card, lets the user flip and grade it.
 */
const StudySession = ({ deck, savedCardStates, onUpdateStates, onExit }) => {
  // Initialize card states (either from saved progress or fresh)
  const [cards, setCards] = useState(() => {
    if (savedCardStates && savedCardStates.length === deck.cards.length) {
      return savedCardStates;
    }
    return deck.cards.map((c, i) => createInitialCardState(c, i));
  });

  // Queue of cards due for this session
  const [queue, setQueue] = useState(() => {
    const initial = savedCardStates && savedCardStates.length === deck.cards.length
      ? savedCardStates
      : deck.cards.map((c, i) => createInitialCardState(c, i));
    const due = getDueCards(initial);
    return due.length ? due : [...initial].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    wrong: 0,
    seen: 0,
    total: queue.length,
  });
  const [isComplete, setIsComplete] = useState(queue.length === 0);

  const currentCard = queue[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const handleGrade = useCallback(
    (quality) => {
      if (!currentCard) return;

      // Update the card in our cards array using SM-2
      const updated = reviewCard(currentCard, quality);
      const newCards = cards.map((c) => (c.id === currentCard.id ? updated : c));
      setCards(newCards);
      onUpdateStates(newCards);

      // Track session stats
      setSessionStats((s) => ({
        ...s,
        correct: quality >= 3 ? s.correct + 1 : s.correct,
        wrong: quality < 3 ? s.wrong + 1 : s.wrong,
        seen: s.seen + 1,
      }));

      // If wrong, push back onto the queue at a random later position
      let nextQueue = [...queue];
      let totalGrew = false;
      if (quality < 3) {
        // Put it 2-4 cards later (or at the end if queue is short)
        const offset = Math.min(
          nextQueue.length - currentIndex - 1,
          Math.floor(Math.random() * 3) + 2
        );
        const newPos = currentIndex + 1 + offset;
        nextQueue.splice(newPos, 0, updated);
        totalGrew = true;
      }
      setQueue(nextQueue);

      // If we re-queued, also bump the total so progress stays accurate
      if (totalGrew) {
        setSessionStats((s) => ({ ...s, total: s.total + 1 }));
      }

      // Advance
      setIsFlipped(false);
      setTimeout(() => {
        if (currentIndex + 1 >= nextQueue.length) {
          setIsComplete(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 250);
    },
    [currentCard, cards, queue, currentIndex, onUpdateStates]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (isComplete) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleGrade(QUALITY.WRONG);
        else if (e.key === '2') handleGrade(QUALITY.HARD);
        else if (e.key === '3') handleGrade(QUALITY.GOOD);
        else if (e.key === '4') handleGrade(QUALITY.EASY);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleFlip, handleGrade, isFlipped, isComplete]);

  const handleRestart = () => {
    const fresh = deck.cards.map((c, i) => createInitialCardState(c, i));
    const shuffled = [...fresh].sort(() => Math.random() - 0.5);
    setCards(fresh);
    setQueue(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, wrong: 0, seen: 0, total: shuffled.length });
    setIsComplete(false);
    onUpdateStates(fresh);
  };

  const handleContinue = () => {
    // Start a new round with all cards (for non-spaced-repetition review)
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, wrong: 0, seen: 0, total: shuffled.length });
    setIsComplete(false);
  };

  // ==========================================================
  // SUMMARY VIEW
  // ==========================================================
  if (isComplete) {
    const accuracy = sessionStats.seen > 0
      ? Math.round((sessionStats.correct / sessionStats.seen) * 100)
      : 0;

    const upNext = cards
      .filter((c) => c.lastReviewed)
      .sort((a, b) => a.nextReview - b.nextReview)[0];

    return (
      <div className="study">
        <div className="study__top">
          <button className="back-btn" onClick={onExit}>
            ← back to library
          </button>
        </div>

        <div className="summary">
          <div className="summary__eyebrow">Session complete</div>
          <h2 className="summary__title">Well done.</h2>

          <div className="summary__stats">
            <div>
              <div className="summary__stat-num" style={{ color: 'var(--forest-deep)' }}>
                {sessionStats.correct}
              </div>
              <div className="summary__stat-label">Correct</div>
            </div>
            <div>
              <div className="summary__stat-num" style={{ color: 'var(--rust-deep)' }}>
                {sessionStats.wrong}
              </div>
              <div className="summary__stat-label">Missed</div>
            </div>
            <div>
              <div className="summary__stat-num">{accuracy}%</div>
              <div className="summary__stat-label">Accuracy</div>
            </div>
          </div>

          {upNext && (
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--ink-soft)',
              marginBottom: '1.5rem',
              fontSize: '1rem',
            }}>
              Next review in {formatInterval(upNext.interval || 0)}.
            </p>
          )}

          <div className="summary__actions">
            <button className="btn btn--primary" onClick={handleContinue}>
              Study again
            </button>
            <button className="btn btn--secondary" onClick={handleRestart}>
              Reset progress
            </button>
            <button className="btn btn--secondary" onClick={onExit}>
              Back to library
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // STUDY VIEW
  // ==========================================================
  const progressPercent = sessionStats.total > 0
    ? (sessionStats.seen / sessionStats.total) * 100
    : 0;

  return (
    <div className="study">
      <div className="study__top">
        <button className="back-btn" onClick={onExit}>
          ← back to library
        </button>

        <div className="study__info">
          <div className="study__stat">
            <span className="study__stat-num">{sessionStats.seen}</span>
            <span>/ {sessionStats.total}</span>
          </div>
          <div className="study__stat study__stat--correct">
            <span className="study__stat-num">{sessionStats.correct}</span>
            <span>correct</span>
          </div>
          <div className="study__stat study__stat--wrong">
            <span className="study__stat-num">{sessionStats.wrong}</span>
            <span>missed</span>
          </div>
        </div>
      </div>

      <div className="progress-bar" aria-label="Session progress">
        <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="card-stage">
        {currentCard && (
          <Flashcard
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            index={sessionStats.seen}
            total={sessionStats.total}
          />
        )}

        {!isFlipped ? (
          <div className="flip-prompt">
            <span className="flip-prompt__kbd">Space</span>
            <span>or tap the card to flip</span>
          </div>
        ) : (
          <div className="grade-controls" role="group" aria-label="Grade your answer">
            <button
              className="grade-btn grade-btn--wrong"
              onClick={() => handleGrade(QUALITY.WRONG)}
            >
              <span className="grade-btn__label">Wrong</span>
              <span className="grade-btn__hint">1</span>
            </button>
            <button
              className="grade-btn grade-btn--hard"
              onClick={() => handleGrade(QUALITY.HARD)}
            >
              <span className="grade-btn__label">Hard</span>
              <span className="grade-btn__hint">2</span>
            </button>
            <button
              className="grade-btn grade-btn--good"
              onClick={() => handleGrade(QUALITY.GOOD)}
            >
              <span className="grade-btn__label">Good</span>
              <span className="grade-btn__hint">3</span>
            </button>
            <button
              className="grade-btn grade-btn--easy"
              onClick={() => handleGrade(QUALITY.EASY)}
            >
              <span className="grade-btn__label">Easy</span>
              <span className="grade-btn__hint">4</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
