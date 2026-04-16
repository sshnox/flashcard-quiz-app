import React, { useState, useMemo } from 'react';
import DeckLibrary from './components/DeckLibrary';
import StudySession from './components/StudySession';
import CreateDeckModal from './components/CreateDeckModal';
import { PREDEFINED_DECKS } from './data/predefinedDecks';
import { useLocalStorage } from './hooks/useLocalStorage';

const App = () => {
  const [customDecks, setCustomDecks] = useLocalStorage('flashcard:custom-decks', []);
  const [cardStates, setCardStates] = useLocalStorage('flashcard:card-states', {});
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // All decks — predefined plus user-created
  const allDecks = useMemo(() => {
    return [...PREDEFINED_DECKS, ...customDecks];
  }, [customDecks]);

  const activeDeck = useMemo(() => {
    return allDecks.find((d) => d.id === activeDeckId);
  }, [allDecks, activeDeckId]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSelectDeck = (deck) => {
    setActiveDeckId(deck.id);
  };

  const handleExitSession = () => {
    setActiveDeckId(null);
  };

  const handleCreateDeck = (newDeck) => {
    setCustomDecks([...customDecks, newDeck]);
    setShowCreateModal(false);
  };

  const handleDeleteDeck = (deckId) => {
    setCustomDecks(customDecks.filter((d) => d.id !== deckId));
    // Also clear its saved card states
    const newStates = { ...cardStates };
    delete newStates[deckId];
    setCardStates(newStates);
  };

  const handleUpdateStates = (deckId, states) => {
    setCardStates({ ...cardStates, [deckId]: states });
  };

  return (
    <div className="app">
      <header className="masthead">
        <h1 className="masthead__title">
          <span>Flash</span>card <em>Quiz</em>
        </h1>
        <div className="masthead__meta">
          <span>Vol. 1 · Issue 01</span>
          <span className="masthead__meta-date">{today}</span>
        </div>
      </header>

      {!activeDeck && (
        <>
          <DeckLibrary
            decks={allDecks}
            cardStates={cardStates}
            onSelectDeck={handleSelectDeck}
            onCreateDeck={() => setShowCreateModal(true)}
            onDeleteDeck={handleDeleteDeck}
          />

          <div className="ornament">· · · ✦ · · ·</div>

          <footer style={{
            textAlign: 'center',
            color: 'var(--ink-faint)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            marginTop: '1rem',
          }}>
            Built with spaced repetition · Progress saves locally · {allDecks.length} decks, {allDecks.reduce((sum, d) => sum + d.cards.length, 0)} cards
          </footer>
        </>
      )}

      {activeDeck && (
        <StudySession
          deck={activeDeck}
          savedCardStates={cardStates[activeDeck.id]}
          onUpdateStates={(states) => handleUpdateStates(activeDeck.id, states)}
          onExit={handleExitSession}
        />
      )}

      {showCreateModal && (
        <CreateDeckModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDeck}
        />
      )}
    </div>
  );
};

export default App;
