import { useState } from 'react';
import { TOPICS, questions } from '../data/questions';
import { getHistory } from '../utils/storage';

export default function Home({ onStartQuiz, onViewHistory }) {
  const [selectedTopics, setSelectedTopics] = useState([...TOPICS]);
  const [questionCount, setQuestionCount] = useState(15);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const history = getHistory();
  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.score / h.total) * 100, 0) / totalAttempts)
    : 0;

  const availableQuestions = questions.filter(q => selectedTopics.includes(q.topic));

  const numQuestions = parseInt(questionCount, 10);
  const isValidCount = !isNaN(numQuestions) && numQuestions > 0;

  const numTimeLimit = parseInt(timeLimit, 10);
  const isValidTime = !timerEnabled || (!isNaN(numTimeLimit) && numTimeLimit > 0);

  const isStartDisabled = availableQuestions.length === 0 || !isValidCount || !isValidTime;

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
    if (isStartDisabled) return;
    const finalCount = Math.min(numQuestions, availableQuestions.length);
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, finalCount);
    onStartQuiz({
      questions: selected,
      timeLimit: timerEnabled ? numTimeLimit * 60 : null,
    });
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-dark mb-2">
            MTH 101 Quiz Bank
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Elementary Mathematics — University of Ibadan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">{questions.length}</div>
            <div className="text-xs md:text-sm text-gray-500">Questions</div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">{totalAttempts}</div>
            <div className="text-xs md:text-sm text-gray-500">Attempts</div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm text-center">
            <div className="text-xl md:text-2xl font-bold text-primary">{avgScore}%</div>
            <div className="text-xs md:text-sm text-gray-500">Avg Score</div>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Select Topics</h2>
          </div>
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all text-left focus:outline-none"
            >
              <span className="text-gray-700 font-medium text-sm md:text-base truncate mr-2">
                {selectedTopics.length === TOPICS.length
                  ? 'All Topics Selected'
                  : selectedTopics.length === 0
                    ? 'Select topics...'
                    : `${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''} selected: ${selectedTopics.join(', ')}`}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                
                {/* Menu items */}
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto p-2">
                  <div className="flex justify-between items-center px-3 py-2 border-b border-gray-50 mb-2">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Topics</span>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        All
                      </button>
                      <span className="text-gray-200 text-xs">|</span>
                      <button
                        onClick={clearAll}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        None
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {TOPICS.map(topic => {
                      const count = questions.filter(q => q.topic === topic).length;
                      const active = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={active}
                              readOnly
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary accent-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">{topic}</span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {availableQuestions.length} questions available
          </p>
          {availableQuestions.length === 0 && (
            <p className="text-sm text-wrong mt-1">Select at least one topic to start a quiz.</p>
          )}
        </div>

        {/* Quiz Settings */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Quiz Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {[5, 10, 15, 20, 30].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      questionCount === n
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="text-xs text-gray-400 font-medium">Custom:</span>
                  <input
                    type="number"
                    min="1"
                    max={availableQuestions.length > 0 ? availableQuestions.length : 1}
                    value={! [5, 10, 15, 20, 30].includes(questionCount) ? questionCount : ''}
                    onChange={e => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      setQuestionCount(val);
                    }}
                    placeholder="Qty"
                    className={`w-16 px-2 py-1.5 text-sm rounded-lg border focus:outline-none transition-all ${
                      !isValidCount && ! [5, 10, 15, 20, 30].includes(questionCount)
                        ? 'border-wrong focus:border-wrong focus:ring-1 focus:ring-wrong'
                        : 'border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent'
                    }`}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={e => setTimerEnabled(e.target.checked)}
                  className="mr-2 accent-primary"
                />
                Time Limit
              </label>
              {timerEnabled && (
                <div className="flex flex-wrap gap-2 items-center">
                  {[10, 15, 20, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => setTimeLimit(m)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeLimit === m
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-xs text-gray-400 font-medium">Custom:</span>
                    <input
                      type="number"
                      min="1"
                      value={! [10, 15, 20, 30, 45, 60].includes(timeLimit) ? timeLimit : ''}
                      onChange={e => {
                        const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                        setTimeLimit(val);
                      }}
                      placeholder="Mins"
                      className={`w-16 px-2 py-1.5 text-sm rounded-lg border focus:outline-none transition-all ${
                        !isValidTime && ! [10, 15, 20, 30, 45, 60].includes(timeLimit)
                          ? 'border-wrong focus:border-wrong focus:ring-1 focus:ring-wrong'
                          : 'border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={handleStart}
            disabled={isStartDisabled}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3.5 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Start Quiz
          </button>
          <button
            onClick={onViewHistory}
            className="bg-white hover:bg-gray-50 text-primary font-semibold py-3.5 md:py-4 px-4 md:px-6 rounded-xl text-base md:text-lg shadow-sm border border-gray-200"
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
}
