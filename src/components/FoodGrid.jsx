import { MENU, CAT_COLORS } from '../data/menu';
import { artFor, VIEW_BOX } from '../data/foodArt';
import { fmt } from '../utils/cart';

export default function FoodGrid({ activeCat, cart, onCardPointerDown, onRemove }) {
  const items = MENU.filter((m) => m.cat === activeCat);
  return (
    <div className="food-grid">
      {items.map((m, i) => {
        const qty = cart[m.id] || 0;
        return (
          <div
            key={m.id}
            className={`food-card ${qty > 0 ? 'in-cart' : ''}`}
            style={{ '--cat-color': CAT_COLORS[m.cat], animationDelay: `${Math.min(i * 30, 180)}ms` }}
            onPointerDown={(e) => onCardPointerDown(e, m)}
          >
            {/* The black slate the food is photographed on, on the real board. */}
            <div className="food-plate">
              <svg
                className="food-art"
                viewBox={VIEW_BOX}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={m.name}
                dangerouslySetInnerHTML={{ __html: artFor(m.id) }}
              />
              {qty > 0 && (
                <button
                  type="button"
                  className="food-badge"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onRemove(m.id)}
                  aria-label={`Remove one ${m.name}`}
                >
                  {qty}
                </button>
              )}
            </div>
            <div className="food-name">{m.name}</div>
            <div className="food-meta">
              <span className="food-cals">{m.cals}</span>
              {m.gf && <span className="mark-gf" title="Gluten free">G</span>}
              {m.spicy && <span className="mark-spicy" title="Spicy">🌶️</span>}
            </div>
            {m.dinner && <div className="mark-dinner">Dinner Item</div>}
            <div className="food-price">{fmt(m.value)}</div>
          </div>
        );
      })}
    </div>
  );
}
