import React from 'react';
import { TestResultSummary, Question } from '../types/neetbuddy';

interface ResultViewProps {
  result: TestResultSummary | null;
  questions: Question[];
  userAnswers: Record<number, number | null>;
  onReviewQuestions: () => void;
  onRetry: () => void;
  onNavigate: (view: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  questions,
  userAnswers,
  onReviewQuestions,
  onRetry,
  onNavigate
}) => {
  if (!result) {
    return (
      <div className="card text-center p-8">
        <h2 className="text-xl font-bold">No test result available</h2>
        <button onClick={() => onNavigate('practice')} className="btn mt-4">
          Go to Practice
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="ring w-28 h-28" style={{ background: `conic-gradient(var(--g2) ${result.accuracyPercentage * 3.6}deg, var(--ln) 0)` }}>
          <span>
            <div>
              {result.accuracyPercentage}%
              <small>Accuracy</small>
            </div>
          </span>
        </div>

        <div>
          <small className="text-slate-500 font-bold uppercase">{result.type} Result</small>
          <h2 className="text-2xl font-extrabold">{result.testName}</h2>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {result.score} <small className="text-sm text-slate-500 font-medium">/ {result.totalMarks} marks</small>
          </div>
        </div>
      </div>

      <div className="hg">
        <div className="st s3 bg-blue-50 dark:bg-blue-950/40">
          <span>
            <small>Attempted</small>
            <b className="text-blue-700 dark:text-blue-300">{result.totalQuestions - result.unansweredCount} / {result.totalQuestions}</b>
          </span>
        </div>
        <div className="st s3 bg-emerald-50 dark:bg-emerald-950/40">
          <span>
            <small>Correct</small>
            <b className="text-emerald-700 dark:text-emerald-300">{result.correctCount}</b>
          </span>
        </div>
        <div className="st s3 bg-red-50 dark:bg-red-950/40">
          <span>
            <small>Incorrect</small>
            <b className="text-red-700 dark:text-red-300">{result.incorrectCount}</b>
          </span>
        </div>
        <div className="st s3 bg-amber-50 dark:bg-amber-950/40">
          <span>
            <small>Time Taken</small>
            <b className="text-amber-700 dark:text-amber-300">{Math.round(result.timeTakenSeconds / 60)} min</b>
          </span>
        </div>
      </div>

      {result.subjectBreakdown && Object.keys(result.subjectBreakdown).length > 0 && (
        <div>
          <h3 className="font-extrabold text-base mb-3">Subject Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(result.subjectBreakdown).map(([subj, stats], idx) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={idx} className="pr">
                  <span className="w-28 text-xs font-bold">{subj}</span>
                  <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  <b className="w-16 text-xs text-right">{stats.correct} / {stats.total} ({pct}%)</b>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button className="btn" onClick={onReviewQuestions}>
          Review Questions
        </button>
        <button className="btn o" onClick={onRetry}>
          ↻ Re-attempt Test
        </button>
        <button className="btn o" onClick={() => onNavigate('ib')}>
          📖 Improvement Book
        </button>
        <button className="btn o ml-auto" onClick={() => onNavigate('practice')}>
          Back to Practice
        </button>
      </div>
    </div>
  );
};
