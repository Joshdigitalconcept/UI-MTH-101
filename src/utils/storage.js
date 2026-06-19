const HISTORY_KEY = 'mth101_quiz_history';

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveResult(result) {
  const history = getHistory();
  history.unshift({
    ...result,
    id: Date.now(),
    date: new Date().toISOString(),
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
