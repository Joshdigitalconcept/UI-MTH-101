import { useState } from 'react';
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 transition-colors duration-300">
      <div className="flex-grow">
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
          <Home onStartQuiz={handleStartQuiz} onViewHistory={() => goTo('history')} />
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
      <footer className="py-6 text-center text-xs md:text-sm text-gray-500 font-medium bg-white/20 border-t border-gray-200/40 backdrop-blur-sm mt-auto">
        Created with ❤️ by{' '}
        <a
          href="https://gentlesoul.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline"
        >
          Gentle soul
        </a>
      </footer>
    </div>
  );
}

export default App;
