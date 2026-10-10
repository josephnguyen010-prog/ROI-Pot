import { useEffect, useRef } from 'react';
import { artSvg } from '../data/foodArt';
import dozerUrl from '../assets/bulldozer.png';
import { ensureFX } from '../utils/fx';

const CHIP_RADIUS = 17;
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

// When the plate fills up, a bulldozer drives across it and shoves the lot off
// the far edge into a funnel. From there each piece rides a slide down the side
// of the panel into the monster sitting by the checkout button.
const FULL = 14;          // chips on the plate before the dozer is sent in: about two layers
const DOZER_SPEED = 150;  // px/s across the plate
const LOAD_ROWS = 3;      // the heap in front of the blade is this many chips tall
const GRAB = 16;          // per second: how quickly a chip catches up to its place on the blade
const FLIGHT_GAP = 0.06;  // s between chips going down, so it reads as a stream of bites
const SLIDE_SPEED = 720;  // px/s down the slide at the bottom, accelerating from rest
const SPIN = 420;         // deg/s a piece tumbles while it is in the air or the slide

const REDUCED = typeof window !== 'undefined'
  && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
  const monsterRef = useRef(null);
  const funnelRef = useRef(null);
  const sweepRef = useRef(null); // { el, w, h, x, phase, load, flying }

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
    const scale = c.scale == null ? '' : ` scale(${c.scale})`;
    c.el.style.transform = `translate(${c.x - c.r}px, ${c.y - c.r}px) rotate(${c.rot}deg)${scale}`;
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

    if (pile.length >= FULL) startSweep(g);
  }

  /* ---------- the bulldozer and the monster ---------- */

  function monster(cls, on = true) {
    const m = monsterRef.current;
    if (m) m.classList.toggle(cls, on);
  }

  // One bite: restart the chomp animation even if the last one is still running.
  function chomp() {
    const m = monsterRef.current;
    if (!m) return;
    m.classList.remove('chomp');
    void m.offsetWidth;
    m.classList.add('chomp');
  }

  // The way down, in window coordinates: the funnel's mouth, its throat, the
  // bottom of the slide, and the monster's mouth. Measured every frame, so the
  // food follows the panel if the page scrolls or the sheet opens mid-meal.
  function route() {
    const f = funnelRef.current;
    const m = monsterRef.current;
    if (!f || !m) return null;
    const fr = f.getBoundingClientRect();
    const mr = m.getBoundingClientRect();
    const x = fr.left + fr.width / 2;
    return {
      funnel: { x, y: fr.top + fr.height * 0.18 },
      throat: { x, y: fr.bottom },
      end: { x, y: mr.top + mr.height * 0.12 },
      mouth: { x: mr.left + mr.width * 0.5, y: mr.top + mr.height * 0.66 },
    };
  }

  // Advance one piece along the route. Each leg is a straight line with an
  // optional hop; the slide leg starts slow and picks up speed. Returns true
  // once the piece is in the monster.
  function ride(c, r, dt) {
    const f = c.fly;
    const slide = Math.max(0, r.end.y - r.throat.y);
    const legs = [
      { d: 0.22, a: { x: f.x0, y: f.y0 }, b: r.funnel, s0: 1, s1: 0.72, hop: 24 },
      { d: 0.1, a: r.funnel, b: r.throat, s0: 0.72, s1: 0.5, hop: 0 },
      { d: Math.max(0.2, Math.sqrt((2 * slide) / SLIDE_SPEED)), a: r.throat, b: r.end, s0: 0.5, s1: 0.5, hop: 0, accel: true },
      { d: 0.2, a: r.end, b: r.mouth, s0: 0.5, s1: 0.34, hop: 14 },
    ];
    let t = f.t;
    for (const leg of legs) {
      if (t <= leg.d) {
        const q = t / leg.d;
        const p = leg.accel ? q * q : q;
        c.x = leg.a.x + (leg.b.x - leg.a.x) * p;
        c.y = leg.a.y + (leg.b.y - leg.a.y) * p - Math.sin(Math.PI * p) * leg.hop;
        c.scale = leg.s0 + (leg.s1 - leg.s0) * p;
        c.rot += SPIN * dt;
        return false;
      }
      t -= leg.d;
    }
    return true;
  }

  function startSweep(g) {
    if (sweepRef.current) return;
    const area = plateAreaRef.current;
    if (!area) return;

    // No dozer for anyone who has asked for less motion: the plate just empties.
    if (REDUCED) {
      for (const c of pileRef.current.concat(activeRef.current)) c.el.remove();
      pileRef.current = [];
      activeRef.current = [];
      chomp();
      return;
    }

    const el = document.createElement('div');
    el.className = 'dozer driving';
    el.innerHTML = `<img src="${dozerUrl}" alt="" draggable="false">`;
    area.appendChild(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight; // the box carries the image's aspect ratio, so this is right before it loads
    sweepRef.current = {
      el, w, h,
      x: g.cx - g.rx - w - 6, // just off the near rim, blade first
      phase: 'push',
      load: [],
      flying: [],
    };
    monster('hungry');
    startLoop();
  }

  function stepSweep(g, dt) {
    const s = sweepRef.current;
    const edge = g.cx + g.rx;

    if (s.phase === 'push') {
      s.x = Math.min(s.x + DOZER_SPEED * dt, edge - s.w);
      const front = s.x + s.w;

      // Anything the blade reaches comes out of the sim and onto the blade.
      for (const list of [pileRef.current, activeRef.current]) {
        for (let i = list.length - 1; i >= 0; i--) {
          const c = list[i];
          if (c.x - c.r * 0.5 < front) {
            list.splice(i, 1);
            s.load.push(c);
          }
        }
      }

      // Heap the load against the blade, a few chips tall, spilling forward.
      s.load.forEach((c, i) => {
        const col = Math.floor(i / LOAD_ROWS);
        const row = i % LOAD_ROWS;
        const tx = front + c.r * 0.7 + col * c.r * 1.1 + (row % 2) * c.r * 0.4;
        const ty = g.base - c.r - row * c.r * 1.15;
        const k = Math.min(1, dt * GRAB);
        c.x += (tx - c.x) * k;
        c.y += (ty - c.y) * k;
        draw(c);
      });

      // Over the edge, each chip leaves the heap and arcs into the mouth. Once
      // the blade is at the rim, whatever is left goes in behind it.
      const atRim = s.x + s.w >= edge;
      for (let i = s.load.length - 1; i >= 0; i--) {
        const c = s.load[i];
        if (atRim || c.x - c.r * 0.3 > edge) {
          s.load.splice(i, 1);
          // Off the plate it has to cross the rest of the panel, so it moves to
          // the page-wide effects layer and switches to window coordinates.
          const a = plateAreaRef.current.getBoundingClientRect();
          c.x += a.left;
          c.y += a.top;
          ensureFX().appendChild(c.el);
          // Redraw now: a piece queued behind others is not drawn again until
          // its turn, and its old plate-relative transform would put it near
          // the top-left of the window in the meantime.
          draw(c);
          c.fly = { x0: c.x, y0: c.y, t: -FLIGHT_GAP * s.flying.length };
          s.flying.push(c);
        }
      }
      if (atRim && s.load.length === 0) s.phase = 'feed';
    }

    const r = route();
    for (let i = s.flying.length - 1; i >= 0; i--) {
      const c = s.flying[i];
      c.fly.t += dt;
      if (c.fly.t < 0) continue;
      const done = !r || ride(c, r, dt);
      draw(c);
      if (done) {
        c.el.remove();
        s.flying.splice(i, 1);
        chomp();
      }
    }

    if (s.phase === 'feed' && s.flying.length === 0) {
      s.phase = 'back';
      monster('hungry', false);
      monster('full');
      setTimeout(() => monster('full', false), 700);
    }
    if (s.phase === 'back') {
      s.x -= DOZER_SPEED * 1.5 * dt;
      if (s.x + s.w < g.cx - g.rx - 12) {
        s.el.remove();
        sweepRef.current = null;
        return;
      }
    }

    s.el.classList.toggle('driving', s.phase !== 'feed');
    s.el.style.transform = `translate(${s.x}px, ${g.base - s.h + 3}px)`;
  }

  function startLoop() {
    if (rafRef.current) return;
    // oxlint-disable-next-line react/purity -- only ever started from event handlers
    let last = performance.now();
    const tick = (now) => {
      const frame = Math.min((now - last) / 1000, MAX_FRAME);
      last = now;
      const g = measure();
      const active = activeRef.current;

      if (g && (active.length || sweepRef.current)) {
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
        if (sweepRef.current) stepSweep(g, frame);
      }

      const busy = activeRef.current.length || sweepRef.current;
      rafRef.current = busy ? requestAnimationFrame(tick) : null;
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

  // Clear the plate for a new visit: every chip, settled or still falling.
  function clearPlate() {
    for (const c of pileRef.current.concat(activeRef.current)) c.el.remove();
    pileRef.current = [];
    activeRef.current = [];
    const s = sweepRef.current;
    if (s) {
      for (const c of s.load.concat(s.flying)) c.el.remove();
      s.el.remove();
      sweepRef.current = null;
      monster('hungry', false);
    }
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

  return { plateAreaRef, monsterRef, funnelRef, spawnFallingChip, clearPlate };
}
