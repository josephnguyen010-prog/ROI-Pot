import { useEffect, useRef, useState } from 'react';
import TierSelector from './components/TierSelector';
import CategoryTabs from './components/CategoryTabs';
import FoodGrid from './components/FoodGrid';
import TablePanel from './components/TablePanel';
import { CATS, TIERS } from './data/menu';
import { usePlatePhysics } from './hooks/usePlatePhysics';
import { useFoodDrag } from './hooks/useFoodDrag';
import { spawnParticles, spawnFloatText } from './utils/fx';
import './styles/app.css';

function readStoredTier() {
  try {
    const saved = localStorage.getItem('roipot-tier');
    return saved && TIERS[saved] ? saved : 'dinner';
  } catch {
    return 'dinner';
  }
}

export default function App() {
  const [tier, setTier] = useState(readStoredTier);
  const [activeCat, setActiveCat] = useState(CATS[0]);
  const [cart, setCart] = useState({});
  const [settled, setSettled] = useState(false);

  const plateZoneRef = useRef(null);
  const { plateAreaRef, monsterRef, spawnFallingChip, clearPlate } = usePlatePhysics();

  useEffect(() => {
    try { localStorage.setItem('roipot-tier', tier); } catch { /* private mode */ }
  }, [tier]);

  // Dinner-only cuts are not on the lunch menu, so they cannot be ordered then.
  const isOff = (item) => tier === 'lunch' && !!item.dinner;

  function land(item, x, y) {
    spawnFallingChip(item.id, x, y);
    spawnParticles(x, y);
    spawnFloatText(x, y - 10, item.value);
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setSettled(false);
  }

  const { startDrag } = useFoodDrag({ plateZoneRef, plateAreaRef, onLand: land });

  // Enter or Space on a dish: no pointer to fly from, so drop it straight in.
  function addFromKeyboard(item) {
    const area = plateAreaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    land(item, r.left + r.width / 2, r.top + 8);
  }

  function removeOne(id) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
    setSettled(false);
  }

  function reset() {
    setCart({});
    setSettled(false);
    clearPlate();
  }

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <h1 className="wordmark">ROI<span>-Pot</span></h1>
          <p className="tagline">
            Did you eat your money's worth? Order at an all-you-can-eat Korean BBQ and every plate is
            priced at what the same cut costs at retail, against what you paid to sit down.
          </p>
        </div>
        <TierSelector tier={tier} onChange={setTier} />
      </header>

      <div className="layout">
        <main>
          <p className="hint">Tap a dish to order it, or press and hold to drag it onto your plate.</p>
          <CategoryTabs activeCat={activeCat} onChange={setActiveCat} />
          <FoodGrid
            activeCat={activeCat}
            cart={cart}
            isOff={isOff}
            onPointerDown={startDrag}
            onKeyAdd={addFromKeyboard}
            onRemove={removeOne}
          />
        </main>

        <TablePanel
          tier={tier}
          cart={cart}
          settled={settled}
          onSettle={() => setSettled(true)}
          onReset={reset}
          plateZoneRef={plateZoneRef}
          plateAreaRef={plateAreaRef}
          monsterRef={monsterRef}
        />
      </div>

      <p className="footnote">
        A portfolio prototype, not affiliated with any restaurant. Dish names, calories and the spicy,
        gluten-free and dinner-only marks come from a real KPOT menu board, which lists no prices: every
        retail value here is my own estimate, and the lunch and dinner prices are made up.
      </p>
    </div>
  );
}
