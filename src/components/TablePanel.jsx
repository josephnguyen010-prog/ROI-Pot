import { useState } from 'react';
import { TIERS } from '../data/menu';
import { artFor, VIEW_BOX } from '../data/foodArt';
import { MONSTER_SVG } from '../data/critters';
import { fmt, cartEntries, totalItems, totalValue, verdictFor } from '../utils/cart';

// The plate, the break-even meter and the running check. On a wide screen it
// sits beside the menu; on a narrow one it is a sheet along the bottom, and
// the check opens out of it.
export default function TablePanel({ tier, cart, settled, onSettle, onReset, plateZoneRef, plateAreaRef, monsterRef }) {
  const [open, setOpen] = useState(false);
  const entries = cartEntries(cart);
  const n = totalItems(cart);
  const eaten = totalValue(cart);
  const paid = TIERS[tier].price;
  const delta = eaten - paid;
  const v = verdictFor(delta);

  // The bar runs past break-even, so there is room to show a win.
  const scale = Math.max(paid * 1.6, eaten * 1.08);
  const pct = (x) => `${(x / scale) * 100}%`;
  const base = Math.min(eaten, paid);
  const over = Math.max(0, eaten - paid);

  return (
    <aside className={`table${open ? ' open' : ''}`} aria-label="Your table">
      <div className="table-head">
        <h2>Your table</h2>
        <span>{n} plate{n === 1 ? '' : 's'}</span>
      </div>

      <div className="plate-zone" ref={plateZoneRef}>
        <div className="plate-area" ref={plateAreaRef}>
          <div className="plate-disc" />
        </div>
        {n === 0 && <div className="plate-empty">Your plate</div>}
        {/* Eats whatever the bulldozer pushes off the plate once it fills up. */}
        <div className="monster" ref={monsterRef} aria-hidden="true" dangerouslySetInnerHTML={{ __html: MONSTER_SVG }} />
      </div>

      {/* Once settled, the verdict says what the meter was saying, with a number. */}
      {!settled && <div className="meter">
        <div className="meter-nums">
          <span className="eaten">{fmt(eaten)}</span>
          <span className="of">eaten of <b>{fmt(paid)}</b> paid</span>
        </div>
        <div
          className="bar"
          role="meter"
          aria-label="Retail value eaten against what you paid"
          aria-valuemin={0}
          aria-valuemax={paid}
          aria-valuenow={Math.min(eaten, paid)}
        >
          <div className="bar-fill" style={{ width: pct(base) }} />
          <div className="bar-over" style={{ left: pct(paid), width: pct(over) }} />
          <div className="bar-tick" style={{ left: pct(paid) }} />
        </div>
        <p className={`meter-status${delta >= 0 ? ' ahead' : ''}`}>
          {n === 0
            ? 'Order something to start the tab.'
            : delta < 0
              ? <><b>{fmt(-delta)}</b> to go before you break even</>
              : <>Up <b>{fmt(delta)}</b> on the house</>}
        </p>
      </div>}

      {settled && (
        <div className={`verdict tone-${v.tone}`} role="status">
          <span className="verdict-label">{v.label}</span>
          <span className="verdict-amt">{delta >= 0 ? '+' : '−'}{fmt(Math.abs(delta))}</span>
          <p>{v.text} {fmt(eaten)} eaten against {fmt(paid)} paid.</p>
        </div>
      )}

      <div className="check">
        {entries.length === 0
          ? <p className="check-empty">Nothing ordered yet.</p>
          : entries.map((i) => (
            <div className="line" key={i.id}>
              <svg
                viewBox={VIEW_BOX}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: artFor(i.id) }}
              />
              <span className="q">{i.qty}&times;</span>
              <span>{i.name}</span>
              <span className="amt">{fmt(i.value * i.qty)}</span>
            </div>
          ))}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn ghost only-narrow"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Hide check' : 'View check'}
        </button>
        {settled ? (
          <button type="button" className="btn ghost" onClick={() => { onReset(); setOpen(false); }}>
            New visit
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            disabled={n === 0}
            onClick={() => { onSettle(); setOpen(true); }}
          >
            Settle the check
          </button>
        )}
      </div>
    </aside>
  );
}
