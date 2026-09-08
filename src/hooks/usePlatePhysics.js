import { useEffect, useRef } from 'react';
import { artSvg } from '../data/foodArt';

const CHIP_RADIUS = 15;
const GRAVITY = 1600;     // px/s^2
const MAX_FALL = 900;     // px/s terminal speed — a chip can never clear its own radius in one substep
const SUB_DT = 1 / 240;   // fixed physics substep; each frame's dt is chopped into these
const MAX_FRAME = 0.05;   // s — anything longer (tab wake-up, GC pause) counts as one short frame

const SURFACE = 0.78;     // how far down the disc a resting chip's bottom sits (0 = back rim, 1 = front rim)
const BOWL = 7;           // px the rim sits above the middle, so food gathers instead of perching on the edge
const OVERHANG = 0.45;    // fraction of a chip allowed to hang past the rim
const SLIDE = 520;        // px/s^2 pulling resting food down the bowl toward the middle
const SLIDE_FLAT = 0.15;  // the middle of the plate reads as flat, so food can actually stop there

const WALL_BOUNCE = 0.35;
const FLOOR_BOUNCE = 0.28;
const CHIP_BOUNCE = 0.15;
const FRICTION = 10;      // per second, while touching something
const MERGE = 7;          // px of overlap allowed between chips, so a pile packs instead of gridding

const SLEEP_SPEED = 14;   // px/s
const SLEEP_TIME = 0.1;   // s slower than that, in contact, before a chip joins the pile
const MAX_AGE = 4;        // s — a chip settles eventually no matter what it is doing
const MAX_PILE = 24;      // chips kept on the plate before the bottom of the heap is cleared away
const TRIM = 4;           // cleared in batches, so the heap re-settles now and then rather than every drop

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// A small, self-contained gravity/collision sim for food landing on the plate.
// State lives in refs (not React state) since it's mutated every animation
// frame — routing that through setState would re-render on every tick.
export function usePlatePhysics() {
  const plateAreaRef = useRef(null);
  const pileRef = useRef([]); // settled chips: { el, id, r, rot, t, lift, x, y }
  const activeRef = useRef([]); // falling chips: { el, id, x, y, vx, vy, r, rot, rotVel, rest, age, contact }
  const rafRef = useRef(null);
  const geomRef = useRef(null);

  // The plate is drawn in CSS, so measure the disc rather than restating its size
  // here — the floor and walls then track whatever the stylesheet actually says.
  function measure() {
    const area = plateAreaRef.current;
    if (!area) return null;
    const a = area.getBoundingClientRect();
    if (!a.width || !a.height) return null;
    const disc = area.querySelector('.plate-disc');
    const d = disc ? disc.getBoundingClientRect() : null;
    return {
      left: a.left,
      top: a.top,
      cx: d ? d.left - a.left + d.width / 2 : a.width / 2,
      rx: d ? d.width / 2 : a.width / 2,
      base: d ? d.top - a.top + d.height * SURFACE : a.height - 14, // y of a resting chip's bottom, mid-plate
    };
  }

  function sameGeom(a, b) {
    return !!a && !!b && a.cx === b.cx && a.rx === b.rx && a.base === b.base;
  }

  // Centre y at which a chip of radius r rests, given how far across the plate it is.
  function floorAt(g, x, r) {
    const t = clamp((x - g.cx) / g.rx, -1, 1);
    return g.base - BOWL * t * t - r;
  }

  // The plate is an ellipse narrower than its container, so the walls are its rim,
  // not the edges of the box — food used to come to rest in mid-air beside the plate.
  function wallsFor(g, r) {
    const inset = Math.min(r * (1 - OVERHANG), g.rx * 0.6);
    return [g.cx - g.rx + inset, g.cx + g.rx - inset];
  }

  function draw(c) {
    c.el.style.transform = `translate(${c.x - c.r}px, ${c.y - c.r}px) rotate(${c.rot}deg)`;
  }

  // Pile chips are stored relative to the plate (across it, and above its surface)
  // rather than as a fraction of the box, so they stay sitting on the disc when it
  // changes size instead of being stretched off it.
  function layoutPile(g) {
    for (const c of pileRef.current) {
      c.x = g.cx + c.t * g.rx;
      c.y = floorAt(g, c.x, c.r) - c.lift;
      draw(c);
    }
  }

  // Reflect a chip off an immovable surface with normal (nx, ny).
  function bounce(c, nx, ny, e) {
    const vn = c.vx * nx + c.vy * ny;
    if (vn >= 0) return; // already separating
    c.vx -= (1 + e) * vn * nx;
    c.vy -= (1 + e) * vn * ny;
  }

  // How far a chip is buried in the nearest thing it touches, in px.
  function deepestOverlap(c, skip) {
    let worst = 0;
    for (const o of pileRef.current) {
      const d = Math.hypot(c.x - o.x, c.y - o.y);
      worst = Math.max(worst, c.r + o.r - MERGE - d);
    }
    for (const o of activeRef.current) {
      if (o === c || o === skip) continue;
      const d = Math.hypot(c.x - o.x, c.y - o.y);
      worst = Math.max(worst, c.r + o.r - MERGE - d);
    }
    return worst;
  }

  // Contact resolution: chips against the pile, against each other, then against the
  // plate itself. Resolving contacts one at a time can leave a chip in a crowd still
  // slightly buried; that is handled by refusing to let it fall asleep until it is
  // clear (see step) rather than by iterating this to convergence.
  function contacts(g) {
    const active = activeRef.current;
    const pile = pileRef.current;

    for (const c of active) {
      for (const o of pile) {
        const dx = c.x - o.x;
        const dy = c.y - o.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = c.r + o.r - MERGE;
        if (dist >= min) continue;
        const nx = dx / dist;
        const ny = dy / dist;
        c.x += nx * (min - dist);
        c.y += ny * (min - dist);
        bounce(c, nx, ny, CHIP_BOUNCE);
        if (ny < -0.4) c.contact = true; // came down on top of it, rather than glancing off the side
      }
    }

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i];
        const b = active[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = a.r + b.r - MERGE;
        if (dist >= min) continue;
        const nx = dx / dist;
        const ny = dy / dist;
        const push = (min - dist) / 2;
        a.x += nx * push;
        a.y += ny * push;
        b.x -= nx * push;
        b.y -= ny * push;
        const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rel < 0) {
          const imp = (-(1 + CHIP_BOUNCE) * rel) / 2;
          a.vx += imp * nx;
          a.vy += imp * ny;
          b.vx -= imp * nx;
          b.vy -= imp * ny;
        }
        if (ny < -0.4) a.contact = true;
        if (ny > 0.4) b.contact = true;
      }
    }

    for (const c of active) {
      const [minX, maxX] = wallsFor(g, c.r);
      if (c.x < minX) {
        c.x = minX;
        if (c.vx < 0) c.vx = -c.vx * WALL_BOUNCE;
      }
      if (c.x > maxX) {
        c.x = maxX;
        if (c.vx > 0) c.vx = -c.vx * WALL_BOUNCE;
      }
      const floorY = floorAt(g, c.x, c.r);
      if (c.y >= floorY) {
        c.y = floorY;
        c.vy = c.vy > 40 ? -c.vy * FLOOR_BOUNCE : 0;
        c.contact = true;
      }
    }
  }

  function step(g, dt) {
    const active = activeRef.current;

    for (const c of active) {
      c.vy = Math.min(c.vy + GRAVITY * dt, MAX_FALL);
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rot += c.rotVel * dt;
      c.age += dt;
      c.contact = false;
    }

    contacts(g);

    for (const c of active) {
      if (c.contact) {
        const damp = Math.min(FRICTION * dt, 1);
        c.vx -= c.vx * damp;
        c.rotVel -= c.rotVel * damp;
        const t = (c.x - g.cx) / g.rx;
        if (Math.abs(t) > SLIDE_FLAT) c.vx -= Math.sign(t) * SLIDE * dt;
      }

      // Never let a chip fall asleep while it is still buried in something — that
      // freezes the overlap into the pile permanently, since the pile never moves again.
      const slow = Math.abs(c.vx) < SLEEP_SPEED && Math.abs(c.vy) < SLEEP_SPEED;
      if (c.contact && slow && deepestOverlap(c) < 1) c.rest += dt;
      else c.rest = 0;
    }

    for (let i = active.length - 1; i >= 0; i--) {
      const c = active[i];
      if (c.rest > SLEEP_TIME || c.age > MAX_AGE) {
        if (c.age > MAX_AGE) unwedge(c, g);
        active.splice(i, 1);
        settle(c, g);
      }
    }
  }

  // Last resort for a chip that has run out of time still jammed against others:
  // it must not join the pile buried inside a neighbour, because the pile never
  // moves again and the overlap would be frozen in place for good.
  function unwedge(c, g) {
    const [minX, maxX] = wallsFor(g, c.r);
    for (let pass = 0; pass < 8 && deepestOverlap(c) >= 1; pass++) {
      for (const o of pileRef.current.concat(activeRef.current)) {
        if (o === c) continue;
        const dx = c.x - o.x;
        const dy = c.y - o.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const min = c.r + o.r - MERGE;
        if (dist >= min) continue;
        c.x += (dx / dist) * (min - dist);
        c.y += (dy / dist) * (min - dist);
      }
      c.x = clamp(c.x, minX, maxX);
      c.y = Math.min(c.y, floorAt(g, c.x, c.r));
    }
    // Boxed in with nowhere to go sideways: lift it clear. There is always room
    // above the pile, and food sitting on top of the heap reads far better than
    // food fused into the piece next to it.
    for (let i = 0; i < 120 && deepestOverlap(c) >= 1; i++) c.y -= 1;
    c.vx = 0;
    c.vy = 0;
  }

  function settle(c, g) {
    const pile = pileRef.current;
    const entry = {
      el: c.el,
      id: c.id,
      r: c.r,
      rot: c.rot,
      t: (c.x - g.cx) / g.rx,
      lift: floorAt(g, c.x, c.r) - c.y,
      x: c.x,
      y: c.y,
    };
    pile.push(entry);
    draw(entry);

    // Keep the mound on the plate. Clearing the oldest chips leaves holes under the
    // ones stacked on them, so what remains is re-dropped and settles into a fresh
    // heap — done TRIM at a time, since re-settling on every single drop past the
    // cap would have the whole plate twitching each time food is added.
    if (pile.length > MAX_PILE + TRIM) {
      for (const gone of pile.splice(0, TRIM)) {
        gone.el.style.transition = 'opacity 220ms ease';
        gone.el.style.opacity = '0';
        setTimeout(() => gone.el.remove(), 220);
      }
      for (const o of pile.splice(0, pile.length)) activeRef.current.push(reactivate(o));
    }
  }

  function reactivate(o) {
    return {
      el: o.el,
      id: o.id,
      x: o.x,
      y: o.y,
      vx: 0,
      vy: 0,
      r: o.r,
      rot: o.rot,
      rotVel: 0,
      rest: 0,
      age: 0,
      contact: false,
    };
  }

  function startLoop() {
    if (rafRef.current) return;
    let last = performance.now();
    const tick = (now) => {
      const frame = Math.min((now - last) / 1000, MAX_FRAME);
      last = now;
      const g = measure();
      const active = activeRef.current;

      if (g && active.length) {
        if (!sameGeom(g, geomRef.current)) {
          geomRef.current = g;
          layoutPile(g);
        }
        // Fixed substeps: at 1600 px/s^2 a whole frame integrated in one go lets a
        // chip jump clean past another, which is how food fell through the pile.
        for (let left = frame; left > 0 && active.length; left -= SUB_DT) {
          step(g, Math.min(left, SUB_DT));
        }
        for (const c of active) draw(c);
      }

      rafRef.current = active.length ? requestAnimationFrame(tick) : null;
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function spawnFallingChip(id, clientX, clientY) {
    const area = plateAreaRef.current;
    const g = measure();
    if (!area || !g) return;
    const r = CHIP_RADIUS;
    const [minX, maxX] = wallsFor(g, r);
    const x = clamp(clientX - g.left, minX, maxX);
    const y = clamp(clientY - g.top, -10, floorAt(g, x, r) - 4); // never start inside the plate
    const el = document.createElement('div');
    el.className = 'plate-chip';
    // The sim treats a chip as a circle of radius r, so give the element that box —
    // otherwise it is sized by its contents and its centre drifts off the body.
    el.style.width = `${r * 2}px`;
    el.style.height = `${r * 2}px`;
    el.innerHTML = artSvg(id, { chip: true });
    area.appendChild(el);
    const chip = {
      el,
      id,
      x,
      y,
      vx: (Math.random() - 0.5) * 50,
      vy: 0,
      r,
      rot: (Math.random() - 0.5) * 40,
      rotVel: (Math.random() - 0.5) * 220,
      rest: 0,
      age: 0,
      contact: false,
    };
    activeRef.current.push(chip);
    draw(chip);
    startLoop();
  }

  // Keep the settled pile sitting on the plate if it changes size (e.g. the window
  // resizes) — chips are stored relative to the disc for exactly this reason.
  useEffect(() => {
    function onResize() {
      const g = measure();
      if (!g) return;
      geomRef.current = g;
      layoutPile(g);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { plateAreaRef, spawnFallingChip };
}
