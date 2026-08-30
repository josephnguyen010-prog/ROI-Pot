import { MENU, CAT_COLORS } from '../data/menu';
import { fmt } from '../utils/cart';

export default function FoodGrid({ activeCat, cart, onCardPointerDown, onRemove }) {
  const items = MENU.filter((m) => m.cat === activeCat);
  return (
    <div className="food-grid">
      {items.map((m, i) => (
        <div
          key={m.id}
          className="food-card"
          style={{ '--cat-color': CAT_COLORS[m.cat], animationDelay: `${Math.min(i * 35, 200)}ms` }}
          onPointerDown={(e) => onCardPointerDown(e, m)}
        >
          {cart[m.id] > 0 && (
            <div
              className="food-badge"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onRemove(m.id)}
            >
              {cart[m.id]}
            </div>
          )}
          <div className="food-emoji">{m.emoji}</div>
          <div className="food-name">{m.name}</div>
          <div className="food-price">{fmt(m.value)}</div>
        </div>
      ))}
    </div>
  );
}
