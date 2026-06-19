import { useState, useEffect, useCallback } from 'react';
import MathText from './MathText';
import ConfirmModal from './ConfirmModal';

export default function Quiz({ config, onFinish }) {
  const { questions, timeLimit } = config;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const [flagged, setFlagged] = useState(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const finish = useCallback(() => {
    const score = questions.reduce((sum, q, i) => {
      return sum + (answers[i] === q.correct ? 1 : 0);
    }, 0);
    onFinish({
      questions,
      answers,
      score,
      total: questions.length,
      timeLimit,
      timeTaken: timeLimit ? timeLimit - secondsLeft : null,
      topics: [...new Set(questions.map(q => q.topic))],
    });
  }, [questions, answers, onFinish, timeLimit, secondsLeft]);

  // Warn before leaving page during quiz
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Timer
  useEffect(() => {
    if (!timeLimit) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, timeLimit, finish]);

  function selectAnswer(optionIndex) {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  }

  function toggleFlag() {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  }

  function handleSubmitClick() {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      setShowSubmitConfirm(true);
    } else {
      finish();
    }
  }

  const question = questions[currentIndex];
  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;
  const progress = (answered / questions.length) * 100;

  const formatTime = (s) => {
    if (s == null) return null;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColor = secondsLeft != null && secondsLeft < 60
    ? 'text-wrong animate-pulse'
    : secondsLeft != null && secondsLeft < 300
      ? 'text-accent'
      : 'text-primary';

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {currentIndex + 1}/{questions.length}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full truncate hidden sm:inline-block">
              {question.topic}
            </span>
          </div>
          {secondsLeft != null && (
            <div className={`text-lg md:text-xl font-mono font-bold ${timerColor}`}>
              {formatTime(secondsLeft)}
            </div>
          )}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {answered} done
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm mb-6">
          <div className="text-base md:text-xl font-medium text-gray-800 mb-6 leading-relaxed">
            <span className="text-primary font-bold mr-2">Q{currentIndex + 1}.</span>
            <MathText text={question.question} />
          </div>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const selected = answers[currentIndex] === i;
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={`option-btn w-full text-left p-3 md:p-4 rounded-xl border-2 flex items-start gap-3 ${
                    selected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="pt-1 text-gray-700 min-w-0">
                    <MathText text={option} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3 md:px-5 py-3 rounded-xl bg-white shadow-sm text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={toggleFlag}
            className={`px-3 md:px-4 py-3 rounded-xl font-medium ${
              flagged.has(currentIndex)
                ? 'bg-accent/20 text-accent'
                : 'bg-white shadow-sm text-gray-500 hover:bg-gray-50'
            }`}
          >
            {flagged.has(currentIndex) ? 'Flagged' : 'Flag'}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-3 md:px-5 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-light shadow-sm"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitClick}
              className="px-4 md:px-6 py-3 rounded-xl bg-correct text-white font-bold hover:opacity-90 shadow-sm"
            >
              Submit
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
          <p className="text-sm text-gray-500 mb-3">Jump to question:</p>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {questions.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isCurrent = i === currentIndex;
              const isFlagged = flagged.has(i);
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-primary text-white ring-2 ring-primary/30'
                      : isAnswered
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  } ${isFlagged ? 'ring-2 ring-accent' : ''}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <ConfirmModal
          title="Submit Quiz?"
          message={`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`}
          confirmText="Submit Anyway"
          cancelText="Keep Going"
          variant="primary"
          onConfirm={() => { setShowSubmitConfirm(false); finish(); }}
          onCancel={() => setShowSubmitConfirm(false)}
        />
      )}
    </div>
  );
}
