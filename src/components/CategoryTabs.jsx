import { CATS, CAT_COLORS } from '../data/menu';

export default function CategoryTabs({ activeCat, onChange }) {
  return (
    <div className="cat-row">
      {CATS.map((c) => (
        <button
          key={c}
          type="button"
          className={`cat-chip ${c === activeCat ? 'active' : ''}`}
          style={{ '--chip-color': CAT_COLORS[c] }}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
