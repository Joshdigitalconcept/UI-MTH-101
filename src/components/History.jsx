import { getHistory, clearHistory } from '../utils/storage';

export default function History({ onBack }) {
  const history = getHistory();

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (s) => {
    if (s == null) return '-';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary-dark">Quiz History</h1>
          <button
            onClick={onBack}
            className="text-primary font-medium hover:underline"
          >
            Back
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <p className="text-gray-500 text-lg">No quiz attempts yet.</p>
            <p className="text-gray-400 text-sm mt-2">Start a quiz to see your history here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {history.map((h) => {
                const pct = Math.round((h.score / h.total) * 100);
                const grade = pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F';
                return (
                  <div key={h.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      pct >= 50 ? 'bg-correct/10 text-correct' : 'bg-wrong/10 text-wrong'
                    }`}>
                      {grade}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {h.score}/{h.total} ({pct}%)
                      </div>
                      <div className="text-sm text-gray-500">
                        {h.topics?.slice(0, 3).join(', ')}{h.topics?.length > 3 ? '...' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{formatTime(h.timeTaken)}</div>
                      <div className="text-xs text-gray-400">{formatDate(h.date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { clearHistory(); window.location.reload(); }}
              className="mt-6 text-sm text-wrong hover:underline"
            >
              Clear History
            </button>
          </>
        )}
      </div>
    </div>
  );
}
