import { TIERS } from '../data/menu';
import { fmt } from '../utils/cart';

export default function TierSelector({ tier, onChange }) {
  return (
    <div className="tier-row">
      {Object.entries(TIERS).map(([key, t]) => (
        <button
          key={key}
          type="button"
          className={`tier-btn ${key === tier ? 'active' : ''}`}
          onClick={() => onChange(key)}
        >
          {t.label}
          <span className="p">{fmt(t.price)}</span>
        </button>
      ))}
    </div>
  );
}
