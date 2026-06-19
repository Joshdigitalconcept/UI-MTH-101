import { useState } from 'react';
import MathText from './MathText';

export default function Results({ result, onHome, onRetry }) {
  const { questions, answers, score, total, timeTaken, timeLimit } = result;
  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState('');

  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F';

  const formatTime = (s) => {
    if (s == null) return 'Untimed';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  const gradeColors = {
    A: 'text-correct',
    B: 'text-primary',
    C: 'text-accent',
    D: 'text-orange-500',
    F: 'text-wrong',
  };

  const formatShareTime = (s) => {
    if (s == null) return 'Untimed';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  async function handleShare() {
    const percentageText = `${percentage}%`;
    const summary = `I scored ${score}/${total} (${percentageText}) on the MTH 101 Quiz Bank.`;
    const details = timeTaken != null
      ? `Time taken: ${formatShareTime(timeTaken)} / ${formatShareTime(timeLimit)}`
      : 'Untimed attempt.';
    const shareText = `${summary}\n${details}\nTry it here: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'MTH 101 Quiz Result',
          text: shareText,
          url: window.location.href,
        });
        setShareStatus('Result shared');
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setShareStatus('Result copied to clipboard');
    } catch {
      setShareStatus('Unable to share right now');
    }
  }

  if (showReview) {
    const q = questions[reviewIndex];
    const userAnswer = answers[reviewIndex];
    const isCorrect = userAnswer === q.correct;
    const isSkipped = userAnswer === undefined;

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowReview(false)}
              className="text-primary font-medium hover:underline"
            >
              Back to Results
            </button>
            <span className="text-gray-500">
              Review: {reviewIndex + 1} / {questions.length}
            </span>
          </div>

          <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6 border-l-4 ${
            isCorrect ? 'border-correct' : isSkipped ? 'border-gray-400' : 'border-wrong'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-bold px-2 py-1 rounded ${
                isCorrect ? 'bg-correct/10 text-correct' : isSkipped ? 'bg-gray-100 text-gray-500' : 'bg-wrong/10 text-wrong'
              }`}>
                {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong'}
              </span>
              <span className="text-xs text-gray-400">{q.topic}</span>
            </div>

            <div className="text-lg font-medium text-gray-800 mb-6">
              <span className="text-primary font-bold mr-2">Q{reviewIndex + 1}.</span>
              <MathText text={q.question} />
            </div>

            <div className="space-y-3">
              {q.options.map((option, i) => {
                const isUserChoice = userAnswer === i;
                const isCorrectOption = q.correct === i;
                let classes = 'border-gray-200 bg-white';
                if (isCorrectOption) classes = 'border-correct bg-correct/5';
                if (isUserChoice && !isCorrect) classes = 'border-wrong bg-wrong/5';

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 ${classes}`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrectOption
                        ? 'bg-correct text-white'
                        : isUserChoice
                          ? 'bg-wrong text-white'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isCorrectOption ? '✓' : isUserChoice ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    <span className="pt-1 text-gray-700">
                      <MathText text={option} />
                    </span>
                  </div>
                );
              })}
            </div>

            {q.explanation && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-primary">Explanation: </span>
                <MathText text={q.explanation} />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setReviewIndex(prev => Math.max(0, prev - 1))}
              disabled={reviewIndex === 0}
              className="px-5 py-3 rounded-xl bg-white shadow-sm text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setReviewIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={reviewIndex === questions.length - 1}
              className="px-5 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-light shadow-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {/* Question Navigator */}
          <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const isCorrectQ = answers[i] === q.correct;
                const isSkippedQ = answers[i] === undefined;
                const isCurrent = i === reviewIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      isCurrent
                        ? 'ring-2 ring-primary/50'
                        : ''
                    } ${
                      isCorrectQ
                        ? 'bg-correct/20 text-correct'
                        : isSkippedQ
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-wrong/20 text-wrong'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Complete!</h2>

          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#e5e7eb" strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={percentage >= 50 ? '#10b981' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${percentage * 2.64} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${gradeColors[grade]}`}>{percentage}%</span>
              <span className="text-sm text-gray-500">Grade: {grade}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-correct/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-correct">{score}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="bg-wrong/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-wrong">
                {total - score - Object.keys(answers).length + Object.keys(answers).filter(k => answers[k] !== undefined).length === total
                  ? total - score
                  : total - Object.keys(answers).length}
              </div>
              <div className="text-xs text-gray-500">Wrong</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="text-2xl font-bold text-gray-500">
                {total - Object.values(answers).filter(a => a !== undefined).length}
              </div>
              <div className="text-xs text-gray-500">Skipped</div>
            </div>
          </div>

          {timeTaken != null && (
            <p className="text-gray-500 mb-2">
              Time: {formatTime(timeTaken)} / {formatTime(timeLimit)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowReview(true)}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-sm"
          >
            Review Answers
          </button>
          <button
            onClick={onRetry}
            className="bg-accent hover:bg-accent-light text-white font-bold py-4 px-6 rounded-xl shadow-sm"
          >
            Retry
          </button>
          <button
            onClick={onHome}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-sm border"
          >
            Home
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleShare}
            className="text-primary font-medium hover:underline"
          >
            Share result
          </button>
          {shareStatus && (
            <p className="mt-2 text-sm text-gray-500">{shareStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
