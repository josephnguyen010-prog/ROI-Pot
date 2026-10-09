import { CATS } from '../data/menu';

export default function CategoryTabs({ activeCat, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Menu sections">
      {CATS.map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          className="tab"
          aria-selected={c === activeCat}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
