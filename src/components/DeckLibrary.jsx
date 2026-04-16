import React, { useState, useMemo } from 'react';
import { computeMastery } from '../utils/spacedRepetition';

const DeckLibrary = ({ decks, onSelectDeck, onCreateDeck, onDeleteDeck, cardStates }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(decks.map((d) => d.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [decks]);

  const filteredDecks = useMemo(() => {
    if (activeCategory === 'All') return decks;
    return decks.filter((d) => (d.category || 'Uncategorized') === activeCategory);
  }, [decks, activeCategory]);

  return (
    <div>
      <div className="library-header">
        <div className="library-header__eyebrow">An index of decks, ready to study</div>
        <h2 className="library-header__title">
          Choose a subject, <em>flip some cards,</em> and commit it to memory.
        </h2>
      </div>

      <div className="library-actions">
        <div className="category-filter" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="deck-grid">
        {/* Custom "create" card always first */}
        <button
          className="deck-card deck-card--create"
          onClick={onCreateDeck}
          aria-label="Create a custom deck"
        >
          <div className="deck-card--create-content">
            <span className="deck-card--create-plus">+</span>
            Create a custom deck
          </div>
        </button>

        {filteredDecks.map((deck) => {
          const states = cardStates[deck.id] || [];
          const mastery = computeMastery(states.length ? states : deck.cards.map(() => ({ repetitions: 0 })));

          return (
            <button
              key={deck.id}
              className="deck-card"
              onClick={() => onSelectDeck(deck)}
              style={{ '--deck-color': deck.color }}
              aria-label={`Study ${deck.name}`}
            >
              {deck.isCustom && (
                <span
                  className="deck-card__delete"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${deck.name}"? This can't be undone.`)) {
                      onDeleteDeck(deck.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      if (confirm(`Delete "${deck.name}"? This can't be undone.`)) {
                        onDeleteDeck(deck.id);
                      }
                    }
                  }}
                  aria-label={`Delete ${deck.name}`}
                >
                  ×
                </span>
              )}
              <span className="deck-card__icon" aria-hidden="true">
                {deck.icon || '📇'}
              </span>
              <div className="deck-card__category">{deck.category || 'Custom'}</div>
              <div className="deck-card__title">{deck.name}</div>
              <div className="deck-card__desc">{deck.description}</div>
              <div className="deck-card__footer">
                <span>{deck.cards.length} cards</span>
                <span className="deck-card__mastery">
                  <span className="mastery-bar">
                    <span
                      className="mastery-bar__fill"
                      style={{ width: `${mastery}%` }}
                    />
                  </span>
                  {mastery}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeckLibrary;
