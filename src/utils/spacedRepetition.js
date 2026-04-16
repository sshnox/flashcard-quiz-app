// Simplified SM-2 (SuperMemo 2) Spaced Repetition Algorithm
//
// Each card tracks:
//   - interval: days until next review
//   - easeFactor: how easy the card is (starts at 2.5)
//   - repetitions: number of successful consecutive reviews
//   - nextReview: timestamp (ms) when the card should be reviewed next
//   - totalCorrect / totalWrong: session & lifetime stats
//
// When the user grades a card:
//   - "wrong"   -> quality 1 (reset repetitions, short interval)
//   - "hard"    -> quality 3
//   - "good"    -> quality 4
//   - "easy"    -> quality 5

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const createInitialCardState = (card, index) => ({
  id: `${card.front}-${index}`,
  front: card.front,
  back: card.back,
  interval: 0,          // in days
  easeFactor: 2.5,
  repetitions: 0,
  nextReview: Date.now(),
  totalCorrect: 0,
  totalWrong: 0,
  lastReviewed: null,
});

// Grade qualities: 1 = wrong, 3 = hard, 4 = good, 5 = easy
export const QUALITY = {
  WRONG: 1,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
};

/**
 * Applies the SM-2 algorithm to a card based on the user's grade.
 * Returns a new card state.
 */
export const reviewCard = (card, quality) => {
  let { interval, easeFactor, repetitions, totalCorrect, totalWrong } = card;

  if (quality < 3) {
    // Incorrect response — reset
    repetitions = 0;
    interval = 0; // Review again today (or very soon)
    totalWrong += 1;
  } else {
    // Correct response
    repetitions += 1;
    totalCorrect += 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Adjust ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  const nextReview = Date.now() + interval * MS_PER_DAY;

  return {
    ...card,
    interval,
    easeFactor,
    repetitions,
    nextReview,
    totalCorrect,
    totalWrong,
    lastReviewed: Date.now(),
  };
};

/**
 * Returns cards that are currently "due" for review.
 * Prioritizes cards with lowest nextReview time.
 */
export const getDueCards = (cards) => {
  const now = Date.now();
  return cards
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
};

/**
 * Compute a "mastery" percentage for the entire deck.
 * A card counts as mastered if it has at least 3 successful repetitions.
 */
export const computeMastery = (cards) => {
  if (!cards.length) return 0;
  const mastered = cards.filter((c) => c.repetitions >= 3).length;
  return Math.round((mastered / cards.length) * 100);
};

/**
 * Pretty-format the interval for UI.
 */
export const formatInterval = (days) => {
  if (days < 1) return 'today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
  const years = Math.round(days / 365);
  return `${years} year${years > 1 ? 's' : ''}`;
};
