import { useEffect, useRef } from 'react';

const PLATE_BOTTOM = 10;
const PLATE_HEIGHT = 24;
const GRAVITY = 1600;
const CHIP_RADIUS = 15;

function floorYFor(H) {
  return H - PLATE_BOTTOM - PLATE_HEIGHT * 0.6;
}

// A small, self-contained gravity/collision sim for food landing on the plate.
// State lives in refs (not React state) since it's mutated every animation
// frame — routing that through setState would re-render on every tick.
export function usePlatePhysics() {
  const plateAreaRef = useRef(null);
  const pileRef = useRef([]); // settled chips: { el, emoji, fx, fy, r, rot } (fx/fy are fractions of plate size)
  const activeRef = useRef([]); // falling chips: { el, emoji, x, y, vx, vy, r, rot, rotVel, rest }
  const rafRef = useRef(null);

  function drawActive(c) {
    c.el.style.transform = `translate(${c.x - c.r}px, ${c.y - c.r}px) rotate(${c.rot}deg)`;
  }

  function drawPile(c, W, H) {
    c.el.style.transform = `translate(${c.fx * W - c.r}px, ${c.fy * H - c.r}px) rotate(${c.rot}deg)`;
  }

  function startLoop() {
    if (rafRef.current) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      const area = plateAreaRef.current;
      const rect = area ? area.getBoundingClientRect() : null;
      const W = rect ? rect.width : 220;
      const H = rect ? rect.height : 70;
      const active = activeRef.current;
      const pile = pileRef.current;

      for (let i = active.length - 1; i >= 0; i--) {
        const c = active[i];
        c.vy += GRAVITY * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot += c.rotVel * dt;
        let onFloor = false;

        if (c.x - c.r < 0) { c.x = c.r; c.vx *= -0.4; }
        if (c.x + c.r > W) { c.x = W - c.r; c.vx *= -0.4; }

        const floorY = floorYFor(H) - c.r * 0.3;
        if (c.y >= floorY) {
          c.y = floorY;
          c.vy = Math.abs(c.vy) > 40 ? -c.vy * 0.3 : 0;
          c.vx *= 0.85;
          onFloor = true;
        }

        for (const o of pile) {
          const ox = o.fx * W, oy = o.fy * H;
          const dx = c.x - ox, dy = c.y - oy;
          const dist = Math.hypot(dx, dy) || 0.01;
          const minDist = c.r + o.r - 2;
          if (dist < minDist) {
            const overlap = minDist - dist, nx = dx / dist, ny = dy / dist;
            c.x += nx * overlap; c.y += ny * overlap;
            if (ny < -0.3) {
              c.vy = Math.abs(c.vy) > 40 ? -c.vy * 0.3 : Math.min(c.vy, 0);
              onFloor = true;
            }
            c.vx += nx * 15;
          }
        }
        for (const o of active) {
          if (o === c) continue;
          const dx = c.x - o.x, dy = c.y - o.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const minDist = c.r + o.r - 2;
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2, nx = dx / dist, ny = dy / dist;
            c.x += nx * overlap; c.y += ny * overlap;
            if (ny < -0.3) { c.vy = Math.min(c.vy, 0); onFloor = true; }
          }
        }

        drawActive(c);

        if (onFloor && Math.abs(c.vx) < 8 && Math.abs(c.vy) < 8) c.rest += dt;
        else c.rest = 0;

        if (c.rest > 0.1) {
          active.splice(i, 1);
          pile.push({ el: c.el, emoji: c.emoji, fx: c.x / W, fy: c.y / H, r: c.r, rot: c.rot });
        }
      }

      if (active.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function spawnFallingChip(emoji, clientX, clientY) {
    const area = plateAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const r = CHIP_RADIUS;
    const x = Math.min(Math.max(clientX - rect.left, r), Math.max(rect.width - r, r));
    const y = Math.max(clientY - rect.top, -10);
    const el = document.createElement('div');
    el.className = 'plate-chip';
    el.textContent = emoji;
    area.appendChild(el);
    const chip = {
      el, emoji, x, y,
      vx: (Math.random() - 0.5) * 50, vy: 0, r,
      rot: (Math.random() - 0.5) * 40, rotVel: (Math.random() - 0.5) * 220,
      rest: 0,
    };
    activeRef.current.push(chip);
    drawActive(chip);
    startLoop();
  }

  function clearPlate() {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    activeRef.current.forEach((c) => c.el.remove());
    pileRef.current.forEach((c) => c.el.remove());
    activeRef.current = [];
    pileRef.current = [];
  }

  // Keep the settled pile visually correct if the plate's on-screen size changes
  // (e.g. the window resizes) — positions are stored as fractions for this reason.
  useEffect(() => {
    function onResize() {
      const area = plateAreaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      pileRef.current.forEach((c) => drawPile(c, rect.width, rect.height));
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { plateAreaRef, spawnFallingChip, clearPlate };
}
