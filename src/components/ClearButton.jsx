import { useEffect, useState } from 'react';

// How long the "are you sure" state waits for the second press.
const ARM_MS = 3000;

// Clearing throws away the whole order, so it takes two presses: the first
// turns the button into the question, the second answers it. Left alone, it
// goes back to how it was. No dialog to dismiss, and a stray tap costs nothing.
export default function ClearButton({ count, onClear, className = '' }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), ARM_MS);
    return () => clearTimeout(t);
  }, [armed]);

  if (count === 0) return null;

  return (
    <button
      type="button"
      className={`clear-btn${armed ? ' armed' : ''} ${className}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onClear();
        } else {
          setArmed(true);
        }
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? `Clear ${count} plate${count === 1 ? '' : 's'}?` : 'Clear'}
    </button>
  );
}
