import { useRef } from 'react';
import TierSelector from './TierSelector';
import CategoryTabs from './CategoryTabs';
import FoodGrid from './FoodGrid';
import PlateZone from './PlateZone';
import { fmt, totalValue, totalItems } from '../utils/cart';
import { usePlatePhysics } from '../hooks/usePlatePhysics';
import { useFoodDrag } from '../hooks/useFoodDrag';
import { spawnParticles, spawnFloatText } from '../utils/fx';

export default function OrderView({ tier, onTierChange, activeCat, onCatChange, cart, onAdd, onRemove, onCheckout }) {
  const plateZoneRef = useRef(null);
  const { plateAreaRef, spawnFallingChip } = usePlatePhysics();

  const { startDrag } = useFoodDrag({
    plateZoneRef,
    plateAreaRef,
    onLand: (item, x, y) => {
      spawnFallingChip(item.id, x, y);
      spawnParticles(x, y);
      spawnFloatText(x, y - 10, item.value);
      onAdd(item.id);
    },
  });

  const n = totalItems(cart);

  return (
    <div className="view-enter">
      <div className="app-header">
        <div className="app-word">ROI<span>-Pot</span></div>
        <div className="app-sub">Are you winning this meal?</div>
        <TierSelector tier={tier} onChange={onTierChange} />
      </div>

      <CategoryTabs activeCat={activeCat} onChange={onCatChange} />

      <FoodGrid
        activeCat={activeCat}
        cart={cart}
        onCardPointerDown={(e, item) => startDrag(e, item)}
        onRemove={onRemove}
      />

      <PlateZone plateZoneRef={plateZoneRef} plateAreaRef={plateAreaRef} />

      <div className="pot-zone">
        <div className="pot-info">
          <div className="pot-label">{n} plate{n === 1 ? '' : 's'} logged</div>
          <div className="pot-value" key={n}>{fmt(totalValue(cart))}</div>
        </div>
        <button type="button" className="cta-btn" disabled={n === 0} onClick={onCheckout}>
          Close Out →
        </button>
      </div>
    </div>
  );
}
