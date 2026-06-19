import { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import History from './components/History';
import ConfirmModal from './components/ConfirmModal';
import { saveResult } from './utils/storage';

function App() {
  const [page, setPage] = useState('home');
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('mth101_dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('mth101_dark', dark);
  }, [dark]);

  function handleStartQuiz(config) {
    setQuizConfig(config);
    setPage('quiz');
  }

  function handleFinishQuiz(result) {
    saveResult(result);
    setQuizResult(result);
    setPage('results');
  }

  function handleRetry() {
    setPage('quiz');
  }

  function navigateAway(target) {
    if (page === 'quiz') {
      setPendingNav(target);
      setShowQuitConfirm(true);
    } else {
      goTo(target);
    }
  }

  function goTo(target) {
    setPage(target);
    if (target === 'home') {
      setQuizConfig(null);
      setQuizResult(null);
    }
  }

  function confirmQuit() {
    setShowQuitConfirm(false);
    goTo(pendingNav || 'home');
    setPendingNav(null);
  }

  const toggleDark = () => setDark(d => !d);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {page === 'quiz' && (
        <Quiz config={quizConfig} onFinish={handleFinishQuiz} onQuit={() => navigateAway('home')} />
      )}
      {page === 'results' && (
        <Results result={quizResult} onHome={() => goTo('home')} onRetry={handleRetry} />
      )}
      {page === 'history' && (
        <History onBack={() => goTo('home')} />
      )}
      {page === 'home' && (
        <Home onStartQuiz={handleStartQuiz} onViewHistory={() => goTo('history')} dark={dark} toggleDark={toggleDark} />
      )}

      {showQuitConfirm && (
        <ConfirmModal
          title="Leave Quiz?"
          message="Your progress will be lost. Are you sure you want to quit?"
          confirmText="Quit"
          cancelText="Stay"
          variant="danger"
          onConfirm={confirmQuit}
          onCancel={() => { setShowQuitConfirm(false); setPendingNav(null); }}
        />
      )}
    </div>
  );
}

export default App;
