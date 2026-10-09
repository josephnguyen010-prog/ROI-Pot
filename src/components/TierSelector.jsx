import { TIERS } from '../data/menu';
import { fmt } from '../utils/cart';

export default function TierSelector({ tier, onChange }) {
  return (
    <div className="tiers" role="group" aria-label="What you paid">
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
  );
}
