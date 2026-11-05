import React, { useState } from 'react';
import { Flashcard } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onToggleKnown: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, onToggleKnown }) => {
  const [selectedDeck, setSelectedDeck] = useState<string>('All');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredCards = selectedDeck === 'All' ? cards : cards.filter((c) => c.deckName === selectedDeck);
  const currentCard = filteredCards[cardIndex % Math.max(1, filteredCards.length)] || cards[0];

  const handleNextCard = (markKnown?: boolean) => {
    setIsFlipped(false);
    if (markKnown && currentCard) {
      onToggleKnown(currentCard.id);
    }
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
    }, 150);
  };

  const knownCount = filteredCards.filter((c) => c.isKnown).length;

  return (
    <div className="space-y-6">
      <WavyHero
        title="Flashcards"
        subtitle="3D flip card recall for active memory retention."
        quote="Revise little, revise often. That is how memory sticks."
      />

      {/* Deck Picker */}
      <div className="tabs">
        {['All', 'Physics', 'Chemistry', 'Biology'].map((d) => (
          <button
            key={d}
            className={`tb ${selectedDeck === d ? 'on' : ''}`}
            onClick={() => {
              setSelectedDeck(d);
              setCardIndex(0);
              setIsFlipped(false);
            }}
          >
            {d === 'All' ? 'All Decks' : d}
          </button>
        ))}
      </div>

      {/* Card Arena */}
      <div className="fcd space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span>Card {cardIndex + 1} of {filteredCards.length}</span>
          <span>{knownCount} / {filteredCards.length} Mastered</span>
        </div>

        <div className="bar">
          <i style={{ width: `${filteredCards.length ? (knownCount / filteredCards.length) * 100 : 0}%` }} />
        </div>

        {/* 3D Flip Card */}
        <div
          className={`fcc ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="fcs fr flex flex-col justify-center items-center p-6">
            <small className="text-slate-400 text-xs uppercase tracking-wide mb-3 block">
              QUESTION • Tap to flip 🔄
            </small>
            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-emerald-50">
              {currentCard ? currentCard.front : 'No flashcards available.'}
            </p>
          </div>

          <div className="fcs bk flex flex-col justify-center items-center p-6">
            <small className="text-emerald-100 text-xs uppercase tracking-wide mb-3 block">
              ANSWER 💡
            </small>
            <p className="text-lg md:text-xl font-bold text-white">
              {currentCard ? currentCard.back : 'No answer'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            className="btn o flex-1"
            onClick={() => handleNextCard(false)}
          >
            ↻ Review Again
          </button>
          <button
            className="btn flex-1 bg-emerald-600 text-white"
            onClick={() => handleNextCard(true)}
          >
            ✓ Mark Known
          </button>
        </div>
      </div>
    </div>
  );
};
