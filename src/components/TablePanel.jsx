import { useLayoutEffect, useRef, useState } from 'react';
import { TIERS } from '../data/menu';
import { artFor, VIEW_BOX } from '../data/foodArt';
import { MONSTER_SVG, FUNNEL_SVG, BOWL_SVG } from '../data/critters';
import ClearButton from './ClearButton';
import { fmt, cartEntries, totalItems, totalValue, verdictFor } from '../utils/cart';

// The plate, the break-even meter and the running check. On a wide screen it
// sits beside the menu, with the funnel, slide and monster hanging in a lane
// off its right-hand side; on a narrow one it is a sheet along the bottom, the
// check opens out of it, and the three tuck inside.
export default function TablePanel({ tier, cart, settled, onSettle, onReset, plateZoneRef, plateAreaRef, monsterRef, funnelRef, beltRef, bowlRef }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const slideRef = useRef(null);

  // The belt runs level with the plate, from just inside its rim to just short
  // of the funnel; the funnel's rim sits a little below the belt, so food
  // falls off the end into it; the slide runs from the funnel down to just
  // over the bowl. All of it depends on where the plate ends up, so it is
  // measured, not laid out.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const slide = slideRef.current;
    if (!wrap || !slide) return undefined;
    function fit() {
      const f = funnelRef.current;
      const bowl = bowlRef.current;
      const z = plateZoneRef.current;
      if (!f || !bowl || !z) return;
      const w = wrap.getBoundingClientRect();
      // The rim is drawn 10% of the way down the funnel; put it a little below
      // the plate surface food rests on (78% of the way down the disc).
      const disc = z.querySelector('.plate-disc');
      if (!disc) return;
      const d = disc.getBoundingClientRect();
      const surface = d.top + d.height * 0.78;
      const rim = surface + 16;
      f.style.top = `${rim - w.top - f.offsetHeight * 0.1}px`;
      const fr = f.getBoundingClientRect();
      const belt = beltRef.current;
      if (belt) {
        const left = d.right - w.left - 14;
        belt.style.left = `${left}px`;
        belt.style.top = `${surface - w.top + 2}px`;
        // It stops short of the funnel's rim, so food comes off the end
        // roller and falls in, rather than the belt running over the mouth.
        belt.style.width = `${fr.left - w.left - 4 - left}px`;
      }
      const br = bowl.getBoundingClientRect();
      const top = fr.bottom - w.top - 2;
      slide.style.left = `${fr.left + fr.width / 2 - w.left}px`;
      slide.style.top = `${top}px`;
      slide.style.height = `${Math.max(0, br.top - w.top - 2 - top)}px`;
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [funnelRef, bowlRef, plateZoneRef, beltRef]);
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
    <div className="table-wrap" ref={wrapRef}>
      <aside className={`table${open ? ' open' : ''}`} aria-label="Your table" ref={panelRef}>
        <div className="table-head">
          <h2>Your table</h2>
          <span className="table-meta">
            {n} plate{n === 1 ? '' : 's'}
            <ClearButton count={n} onClear={() => { onReset(); setOpen(false); }} />
          </span>
        </div>

        <div className="plate-zone" ref={plateZoneRef}>
          <div className="plate-area" ref={plateAreaRef}>
            <div className="plate-disc" />
          </div>
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

        {entries.length > 0 && <div className="check">
          {/* The panel's header is hidden on a phone, so the clear button
              comes with the check instead. */}
          <div className="check-head only-narrow">
            <span>Your order</span>
            <ClearButton count={n} onClear={() => { onReset(); setOpen(false); }} />
          </div>
          {entries.map((i) => (
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
        </div>}

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

      {/* Once the plate fills up the bulldozer shoves it onto the belt, the
          belt drops it into the funnel, the slide fills the bowl, and the
          monster eats the bowl. */}
      <div className="belt" ref={beltRef} aria-hidden="true"><i /><i /></div>
      <div className="funnel" ref={funnelRef} aria-hidden="true" dangerouslySetInnerHTML={{ __html: FUNNEL_SVG }} />
      <div className="slide" ref={slideRef} aria-hidden="true" />
      <div className="bowl" ref={bowlRef} aria-hidden="true" dangerouslySetInnerHTML={{ __html: BOWL_SVG }} />
      <div className="monster" ref={monsterRef} aria-hidden="true" dangerouslySetInnerHTML={{ __html: MONSTER_SVG }} />
    </div>
  );
}
