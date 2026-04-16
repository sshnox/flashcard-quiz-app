import React, { useState } from 'react';

const EXAMPLE_INPUT = `What is the capital of France? | Paris
Largest planet in our solar system | Jupiter
Author of "1984" | George Orwell`;

const ICONS = ['📇', '📚', '🎯', '🧠', '⭐', '🔥', '💡', '🎨', '🎵', '🏛️', '🌱', '✨'];

const CreateDeckModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rawCards, setRawCards] = useState('');
  const [icon, setIcon] = useState('📇');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please give your deck a name.');
      return;
    }

    // Parse the cards — one per line, "front | back"
    const lines = rawCards.split('\n').map((l) => l.trim()).filter(Boolean);
    const cards = [];

    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) continue;
      cards.push({ front: parts[0], back: parts.slice(1).join(' | ') });
    }

    if (cards.length === 0) {
      setError('Please add at least one card in the format "front | back".');
      return;
    }

    onCreate({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `${cards.length} custom cards`,
      category: 'Custom',
      icon,
      color: '#7a5c3f',
      cards,
      isCustom: true,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <h3 className="modal__title" id="modal-title">Create a new deck</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal__body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label" htmlFor="deck-name">Deck name</label>
              <input
                id="deck-name"
                className="field__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. French Vocabulary, Biology 101"
                maxLength={60}
                autoFocus
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="deck-desc">Description (optional)</label>
              <input
                id="deck-desc"
                className="field__input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this deck about?"
                maxLength={120}
              />
            </div>

            <div className="field">
              <label className="field__label">Choose an icon</label>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    style={{
                      width: 40,
                      height: 40,
                      fontSize: '1.2rem',
                      border: `1.5px solid ${icon === i ? 'var(--ink)' : 'var(--border-strong)'}`,
                      borderRadius: 4,
                      background: icon === i ? 'var(--card-front)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                    aria-label={`Icon ${i}`}
                    aria-pressed={icon === i}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="deck-cards">
                Cards — one per line, in format: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8em' }}>front | back</code>
              </label>
              <textarea
                id="deck-cards"
                className="field__textarea"
                value={rawCards}
                onChange={(e) => setRawCards(e.target.value)}
                placeholder={EXAMPLE_INPUT}
                rows={10}
              />
              <div className="field__help">
                Use the pipe character (<code>|</code>) to separate the question from the answer.
              </div>
            </div>

            {error && (
              <div style={{
                color: 'var(--rust-deep)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <div className="modal__actions">
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Create deck
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDeckModal;
