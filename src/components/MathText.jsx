import katex from 'katex';

function renderMath(math, displayMode = false) {
  try {
    return katex.renderToString(math, {
      throwOnError: false,
      displayMode,
    });
  } catch {
    return math;
  }
}

export default function MathText({ text }) {
  if (!text) return null;

  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const html = renderMath(part.slice(2, -2), true);
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const html = renderMath(part.slice(1, -1), false);
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
