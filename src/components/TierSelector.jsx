import { TIERS } from '../data/menu';
import { fmt } from '../utils/cart';

export default function TierSelector({ tier, onChange }) {
  return (
    <div className="tier-picker">
      <span className="tier-label" id="tier-label">You paid</span>
      <div className="tiers" role="group" aria-labelledby="tier-label">
        {Object.entries(TIERS).map(([key, t]) => (
          <button
            key={key}
            type="button"
            className="tier"
            aria-pressed={key === tier}
            onClick={() => onChange(key)}
          >
            <small>{t.label}</small>
            <b>{fmt(t.price)}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
