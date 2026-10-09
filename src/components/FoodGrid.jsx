import { MENU } from '../data/menu';
import { artFor, VIEW_BOX } from '../data/foodArt';
import { fmt } from '../utils/cart';

export default function FoodGrid({ activeCat, cart, isOff, onPointerDown, onKeyAdd, onRemove }) {
  const items = MENU.filter((m) => m.cat === activeCat);
  return (
    <div className="grid">
      {items.map((m) => {
        const qty = cart[m.id] || 0;
        const off = isOff(m);
        return (
          <div key={m.id} className={`dish${off ? ' off' : ''}`}>
            <button
              type="button"
              className="dish-add"
              aria-disabled={off}
              aria-label={off ? `${m.name}, dinner only` : `Order ${m.name}, ${fmt(m.value)}`}
              onPointerDown={(e) => { if (!off) onPointerDown(e, m); }}
              // Pointer taps are handled on pointerdown/up by the drag hook; a
              // click with no pointer behind it (detail 0) is the keyboard.
              onClick={(e) => { if (!off && e.detail === 0) onKeyAdd(m); }}
            >
              <div className="dish-art">
                <svg
                  className="food-art"
                  viewBox={VIEW_BOX}
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: artFor(m.id) }}
                />
              </div>
              <div className="dish-name">{m.name}</div>
              <div className="dish-meta">
                <span className="dish-price">{fmt(m.value)}</span>
                <span>{m.cals} cal</span>
                {m.spicy && <span className="mark-spicy">Spicy</span>}
                {m.gf && <span title="Gluten free">GF</span>}
                {m.dinner && <span className="mark-dinner">Dinner only</span>}
              </div>
            </button>
            {qty > 0 && (
              <button
                type="button"
                className="dish-qty"
                onClick={() => onRemove(m.id)}
                aria-label={`${qty} ordered. Remove one ${m.name}`}
              >
                <span className="n">{qty}</span>
                <span className="minus" aria-hidden="true">&minus;1</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
