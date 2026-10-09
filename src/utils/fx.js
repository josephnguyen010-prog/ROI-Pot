import { fmt } from './cart';
import { artSvg } from '../data/foodArt';

function ensureFX() {
  let fx = document.getElementById('fx-layer');
  if (!fx) {
    fx = document.createElement('div');
    fx.id = 'fx-layer';
    fx.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(fx);
  }
  return fx;
}

export function setGhostPos(ghost, x, y, scale) {
  ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${scale})`;
}

export function spawnGhost(id, rect) {
  const fx = ensureFX();
  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  ghost.innerHTML = artSvg(id);
  setGhostPos(ghost, rect.left + rect.width / 2, rect.top + rect.height / 2, 1.3);
  fx.appendChild(ghost);
  return ghost;
}

// A few grains of spice thrown off where the plate lands.
export function spawnParticles(x, y) {
  const fx = ensureFX();
  for (let i = 0; i < 7; i++) {
    const p = document.createElement('div');
    p.className = 'spark';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    fx.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = 24 + Math.random() * 24;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 6;
    const anim = p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.4)`, opacity: 0 },
      ],
      { duration: 450 + Math.random() * 150, easing: 'ease-out', fill: 'forwards' }
    );
    anim.finished.then(() => p.remove()).catch(() => p.remove());
  }
}

export function spawnFloatText(x, y, value) {
  const fx = ensureFX();
  const t = document.createElement('div');
  t.className = 'float-text';
  t.textContent = '+' + fmt(value);
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  fx.appendChild(t);
  const anim = t.animate(
    [
      { transform: 'translate(-50%,-50%) translateY(0)', opacity: 1 },
      { transform: 'translate(-50%,-50%) translateY(-34px)', opacity: 0 },
    ],
    { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
  );
  anim.finished.then(() => t.remove()).catch(() => t.remove());
}
