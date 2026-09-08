import { useEffect, useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import OrderView from './components/OrderView';
import ReceiptView from './components/ReceiptView';
import { CATS, TIERS } from './data/menu';
import './App.css';
import './styles/screen.css';

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
  const [view, setView] = useState('order');

  useEffect(() => {
    try { localStorage.setItem('roipot-tier', tier); } catch { /* ignore */ }
  }, [tier]);

  function handleAdd(id) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function handleRemove(id) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 0) {
        next[id]--;
        if (next[id] === 0) delete next[id];
      }
      return next;
    });
  }

  function handleReset() {
    setCart({});
    setView('order');
  }

  return (
    <div className="stage">
      <div className="intro">
        <span className="eyebrow">Concept Prototype</span>
        <h1 className="title">
          Did you actually<br />eat your <em>money's</em><br />worth?
        </h1>
        <p className="lede">
          ROI-Pot tallies every plate you order at an all-you-can-eat Korean BBQ and hot pot against what those cuts
          would cost at retail — so instead of guessing, you get a real number on who won the meal: you
          or the house.
        </p>
        <div className="tags">
          <span className="tag">Interaction design</span>
          <span className="tag">Korean BBQ</span>
          <span className="tag">AYCE economics</span>
        </div>
        <div className="howto">
          <div className="howto-step">
            <span className="howto-num">1</span>
            <span className="howto-text"><b>Pick your tier</b> — lunch or dinner pricing.</span>
          </div>
          <div className="howto-step">
            <span className="howto-num">2</span>
            <span className="howto-text"><b>Tap a plate</b> to add it, or press and hold to drag it across.</span>
          </div>
          <div className="howto-step">
            <span className="howto-num">3</span>
            <span className="howto-text"><b>Watch it land</b> — food actually drops and piles up on your plate.</span>
          </div>
          <div className="howto-step">
            <span className="howto-num">4</span>
            <span className="howto-text"><b>Close out the check</b> to see your retail value vs. what you paid.</span>
          </div>
        </div>
      </div>

      <PhoneFrame>
        {view === 'order' ? (
          <OrderView
            tier={tier}
            onTierChange={setTier}
            activeCat={activeCat}
            onCatChange={setActiveCat}
            cart={cart}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onCheckout={() => setView('receipt')}
          />
        ) : (
          <ReceiptView tier={tier} cart={cart} onReset={handleReset} />
        )}
      </PhoneFrame>

      <div className="credit">A portfolio concept prototype · not affiliated with any restaurant chain</div>
    </div>
  );
}
