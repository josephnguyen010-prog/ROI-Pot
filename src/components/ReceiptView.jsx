import { TIERS } from '../data/menu';
import { artFor, VIEW_BOX } from '../data/foodArt';
import { fmt, cartEntries, totalValue, verdictFor } from '../utils/cart';

export default function ReceiptView({ tier, cart, onReset }) {
  const entries = cartEntries(cart);
  const value = totalValue(cart);
  const paid = TIERS[tier].price;
  const delta = value - paid;
  const v = verdictFor(delta);
  const plateCount = entries.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="view-enter">
      <div className="receipt">
        <div className="receipt-head">
          <div className="app-word">ROI<span>-Pot</span></div>
          <div className="app-sub">{TIERS[tier].label} check · {plateCount} plates</div>
        </div>

        <div className="receipt-lines">
          {entries.map((i) => (
            <div className="receipt-line" key={i.id}>
              <svg
                className="re"
                viewBox={VIEW_BOX}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: artFor(i.id) }}
              />
              <span className="rq">{i.qty}×</span>
              <span className="rn">{i.name}</span>
              <span className="receipt-leader" />
              <span className="rv">{fmt(i.value * i.qty)}</span>
            </div>
          ))}
        </div>

        <div className="receipt-totals">
          <div className="rt-row"><span>Retail value</span><span className="v">{fmt(value)}</span></div>
          <div className="rt-row"><span>You paid</span><span className="v">{fmt(paid)}</span></div>
          <div className="rt-row grand">
            <span>Your take</span>
            <span className="v" style={{ color: v.color }}>{delta >= 0 ? '+' : '−'}{fmt(Math.abs(delta))}</span>
          </div>
        </div>

        <div
          className="verdict"
          style={{ background: `color-mix(in srgb, ${v.color} 16%, transparent)`, color: v.color }}
        >
          <div className="verdict-badge">{v.label}</div>
          <div className="verdict-sub" style={{ color: v.color, opacity: 0.85 }}>{v.text}</div>
        </div>

        <div className="receipt-spacer" />
        <button type="button" className="cta-ghost" onClick={onReset}>Start New Visit</button>
      </div>
    </div>
  );
}
