import React, { useState, useEffect } from 'react';
import { Question } from '../types/neetbuddy';

interface QuizViewProps {
  testTitle: string;
  questions: Question[];
  isTimed: boolean;
  timeLimitSeconds: number;
  onSubmitSession: (userAnswers: Record<number, number | null>, durationSeconds: number) => void;
  onQuitSession: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  testTitle,
  questions,
  isTimed,
  timeLimitSeconds,
  onSubmitSession,
  onQuitSession
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer Tick
  useEffect(() => {
    if (!isTimed) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSubmitSession(answers, timeLimitSeconds - prev);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimed, answers]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentIndex];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: prev[currentIndex] === optionIndex ? null : optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setVisited((prev) => ({ ...prev, [nextIdx]: true }));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    setBookmarks((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
    handleNext();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Stats for palette
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const markedCount = Object.values(bookmarks).filter(Boolean).length;
  const unvisitedCount = totalQuestions - Object.keys(visited).length;

  return (
    <div className="qzw min-h-screen">
      {/* Top Fixed Bar */}
      <div className="qzh border-b border-slate-200 dark:border-slate-800 pb-2">
        <button className="qx" onClick={onQuitSession} aria-label="Exit">
          ✕
        </button>
        <div className="qzt">
          <b className="text-base font-extrabold">{testTitle}</b>
          <small className="block text-slate-500">
            Q {currentIndex + 1} of {totalQuestions} • {answeredCount} Answered
          </small>
        </div>

        {isTimed && (
          <b className={`qtm font-mono ${timeRemaining <= 120 ? 'low' : ''}`}>
            ⏱ {formatTime(timeRemaining)}
          </b>
        )}

        <button
          className="qpb font-bold"
          onClick={() => setIsPaletteOpen(true)}
          aria-label="Question palette"
        >
          ☰ {currentIndex + 1}/{totalQuestions}
        </button>

        <button
          className="btn sm bg-emerald-600 text-white font-bold"
          onClick={() => setShowConfirmModal(true)}
        >
          Submit
        </button>
      </div>

      {/* Progress Line */}
      <div className="bar my-3">
        <i style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }} />
      </div>

      {/* Main Grid */}
      <div className="qzg">
        {/* Question Panel */}
        <div className="card qzc space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span className="chip c1">{currentQuestion.subject}</span>
            <span>{currentQuestion.chapter}</span>
            <span className="chip c3">+4 / -1 Marks</span>
          </div>

          <h3 className="qq font-bold text-slate-900 dark:text-emerald-50 text-lg leading-snug">
            {currentQuestion.statement}
          </h3>

          <div className="space-y-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isCorrect = currentQuestion.correctOptionIndex === optIdx;
              const showFeedback = !isTimed && isAnswered;

              let styleClass = 'opt';
              if (showFeedback) {
                if (isCorrect) styleClass += ' ok';
                else if (isSelected) styleClass += ' no';
              } else if (isSelected) {
                styleClass += ' sel';
              }

              return (
                <button
                  key={optIdx}
                  className={styleClass}
                  onClick={() => handleOptionSelect(optIdx)}
                >
                  <b>{['A', 'B', 'C', 'D'][optIdx]}</b>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Solution Explanation if Instant Feedback mode */}
          {!isTimed && isAnswered && (
            <div className={`exp ${currentAnswer === currentQuestion.correctOptionIndex ? 'g' : 'r'}`}>
              <b className="block font-bold mb-1">
                {currentAnswer === currentQuestion.correctOptionIndex ? 'Correct! 🎉' : 'Incorrect Answer'}
              </b>
              <p className="text-xs">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              className={`btn sm o ${bookmarks[currentIndex] ? 'bg-amber-100 text-amber-900' : ''}`}
              onClick={handleMarkForReviewAndNext}
            >
              🏷️ {bookmarks[currentIndex] ? 'Marked' : 'Mark for Review'}
            </button>

            {isAnswered && (
              <button
                className="btn sm o text-slate-500"
                onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: null }))}
              >
                Clear Response
              </button>
            )}

            <div className="ml-auto flex gap-2">
              <button
                className="btn sm o"
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                ← Prev
              </button>
              <button className="btn sm" onClick={handleNext}>
                {currentIndex === totalQuestions - 1 ? 'Review →' : 'Save & Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <aside className="card qzp hidden md:block">
          <h3 className="font-extrabold text-base mb-2">Question Palette</h3>
          <div className="pds">
            {questions.map((_, idx) => {
              const ans = answers[idx];
              const isAns = ans !== undefined && ans !== null;
              const isMk = !!bookmarks[idx];
              const isCurr = idx === currentIndex;

              let pdClass = 'pd';
              if (isAns) pdClass += ' ans';
              if (isMk) pdClass += ' mk';
              if (isCurr) pdClass += ' cur';

              return (
                <button
                  key={idx}
                  className={pdClass}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setVisited((prev) => ({ ...prev, [idx]: true }));
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pl mt-4 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <i className="pd ans w-4 h-4 rounded-md" /> <span>Answered: {answeredCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="pd mk w-4 h-4 rounded-md" /> <span>Marked: {markedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="pd w-4 h-4 rounded-md" /> <span>Unvisited: {unvisitedCount}</span>
            </div>
          </div>

          <button
            className="btn w-full mt-6"
            onClick={() => setShowConfirmModal(true)}
          >
            Submit Test ✓
          </button>
        </aside>
      </div>

      {/* Question Palette Modal on Mobile */}
      {isPaletteOpen && (
        <div className="md" onClick={() => setIsPaletteOpen(false)}>
          <div className="mdc" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-lg mb-3">Question Palette</h2>
            <div className="pds mb-4">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`pd ${answers[idx] !== null && answers[idx] !== undefined ? 'ans' : ''} ${bookmarks[idx] ? 'mk' : ''} ${idx === currentIndex ? 'cur' : ''}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPaletteOpen(false);
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button className="btn w-full" onClick={() => setIsPaletteOpen(false)}>
              Close Palette
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="md" onClick={() => setShowConfirmModal(false)}>
          <div className="mdc" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-xl mb-3">Submit Test?</h2>
            <div className="space-y-2 text-xs font-semibold my-4">
              <div className="flex justify-between py-1 border-b">
                <span>Total Questions</span>
                <b>{totalQuestions}</b>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Answered</span>
                <b className="text-emerald-600">{answeredCount}</b>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Unanswered</span>
                <b className="text-amber-600">{totalQuestions - answeredCount}</b>
              </div>
              <div className="flex justify-between py-1">
                <span>Marked for Review</span>
                <b className="text-purple-600">{markedCount}</b>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                className="btn o flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Continue Test
              </button>
              <button
                className="btn flex-1 bg-emerald-600 text-white"
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitSession(answers, timeLimitSeconds - timeRemaining);
                }}
              >
                Submit Now ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
