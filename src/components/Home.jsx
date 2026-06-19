import { useState } from 'react';
import { TOPICS, questions } from '../data/questions';
import { getHistory } from '../utils/storage';

export default function Home({ onStartQuiz, onViewHistory, dark, toggleDark }) {
  const [selectedTopics, setSelectedTopics] = useState([...TOPICS]);
  const [questionCount, setQuestionCount] = useState(15);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const history = getHistory();
  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.score / h.total) * 100, 0) / totalAttempts)
    : 0;

  const availableQuestions = questions.filter(q => selectedTopics.includes(q.topic));

  function toggleTopic(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  }

  function selectAll() {
    setSelectedTopics([...TOPICS]);
  }

  function clearAll() {
    setSelectedTopics([]);
  }

  function handleStart() {
    if (availableQuestions.length === 0) return;
    const count = Math.min(questionCount, availableQuestions.length);
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    onStartQuiz({
      questions: selected,
      timeLimit: timerEnabled ? timeLimit * 60 : null,
    });
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <button
            onClick={toggleDark}
            className="absolute right-0 top-0 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-dark dark:text-white mb-2">
            MTH 101 Quiz Bank
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Elementary Mathematics — University of Ibadan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary dark:text-blue-400">{questions.length}</div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Questions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary dark:text-blue-400">{totalAttempts}</div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Attempts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary dark:text-blue-400">{avgScore}%</div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Avg Score</div>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">Select Topics</h2>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-sm text-primary dark:text-blue-400 hover:underline">All</button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button onClick={clearAll} className="text-sm text-primary dark:text-blue-400 hover:underline">None</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(topic => {
              const count = questions.filter(q => q.topic === topic).length;
              const active = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {topic} ({count})
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {availableQuestions.length} questions available
          </p>
          {availableQuestions.length === 0 && (
            <p className="text-sm text-wrong mt-1">Select at least one topic to start a quiz.</p>
          )}
        </div>

        {/* Quiz Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quiz Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions
              </label>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 30].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      questionCount === n
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={e => setTimerEnabled(e.target.checked)}
                  className="mr-2 accent-primary"
                />
                Time Limit
              </label>
              {timerEnabled && (
                <div className="flex flex-wrap gap-2">
                  {[10, 15, 20, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => setTimeLimit(m)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeLimit === m
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={handleStart}
            disabled={availableQuestions.length === 0}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Start Quiz
          </button>
          <button
            onClick={onViewHistory}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary dark:text-blue-400 font-semibold py-3.5 md:py-4 px-4 md:px-6 rounded-xl text-base md:text-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
}
