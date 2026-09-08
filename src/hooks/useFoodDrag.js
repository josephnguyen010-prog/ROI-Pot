import { useRef } from 'react';
import { spawnGhost, setGhostPos } from '../utils/fx';

// How far the pointer may wander before the gesture counts as a real move.
const SLOP = 8;
// How long a finger must rest on a card before it becomes a drag rather than a
// scroll. Short enough not to feel sticky, long enough that a flick scrolls.
const HOLD_MS = 220;

// Three gestures share one code path:
//   tap            - press and release without moving -> the plate
//   press and drag - hold, then move -> follow the pointer, drop on the plate
//   scroll         - move before the hold elapses -> hand back to the browser
//
// That last case is why nothing here calls preventDefault on pointerdown for
// touch: doing so cancels the browser's own scrolling, which turned every
// attempt to scroll the menu into a picked-up plate of food.
export function useFoodDrag({ plateZoneRef, plateAreaRef, onLand }) {
  const dragRef = useRef(null);

  // Once we own the gesture the page must not scroll under it. touchmove has to
  // be non-passive for this to bite.
  function blockScroll(e) {
    e.preventDefault();
  }

  function detach() {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);
    document.removeEventListener('touchmove', blockScroll);
  }

  function promote() {
    const g = dragRef.current;
    if (!g || g.dragging) return;
    g.dragging = true;
    clearTimeout(g.holdTimer);
    g.ghost = spawnGhost(g.item.id, g.cardRect);
    setGhostPos(g.ghost, g.lastX, g.lastY, 1.3);
    g.cardEl.classList.add('lifted');
    document.addEventListener('touchmove', blockScroll, { passive: false });
  }

  function onPointerMove(e) {
    const g = dragRef.current;
    if (!g) return;
    g.lastX = e.clientX;
    g.lastY = e.clientY;

    if (!g.dragging) {
      if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) <= SLOP) return;
      // Moved before the hold elapsed. On touch that is a scroll, so let go of
      // the gesture entirely; with a mouse there is nothing to scroll, so drag.
      if (g.touch) {
        clearTimeout(g.holdTimer);
        dragRef.current = null;
        g.cardEl.classList.remove('lifted');
        detach();
        return;
      }
      promote();
    }

    setGhostPos(g.ghost, e.clientX, e.clientY, 1.3);
    const zone = plateZoneRef.current;
    if (!zone) return;
    const r = zone.getBoundingClientRect();
    const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    zone.classList.toggle('hover', over);
  }

  function onPointerCancel() {
    const g = dragRef.current;
    if (!g) return;
    dragRef.current = null;
    clearTimeout(g.holdTimer);
    detach();
    g.cardEl.classList.remove('lifted');
    if (g.ghost) g.ghost.remove();
    const zone = plateZoneRef.current;
    if (zone) zone.classList.remove('hover');
  }

  function onPointerUp(e) {
    const g = dragRef.current;
    if (!g) return;
    dragRef.current = null;
    clearTimeout(g.holdTimer);
    detach();
    g.cardEl.classList.remove('lifted');

    const zone = plateZoneRef.current;
    if (zone) zone.classList.remove('hover');

    // A tap, or a hold that never moved, always lands. A real drag only lands
    // if it was released over the plate.
    let land = true;
    if (g.dragging) {
      const zoneRect = zone ? zone.getBoundingClientRect() : null;
      land = !!zoneRect
        && e.clientX >= zoneRect.left && e.clientX <= zoneRect.right
        && e.clientY >= zoneRect.top && e.clientY <= zoneRect.bottom;
    }

    // The tap path has no ghost yet - give it one so the food still flies.
    const ghost = g.ghost || spawnGhost(g.item.id, g.cardRect);
    const fromX = g.dragging ? g.lastX : g.cardRect.left + g.cardRect.width / 2;
    const fromY = g.dragging ? g.lastY : g.cardRect.top + g.cardRect.height / 2;

    const area = plateAreaRef.current;
    const targetRect = land && area ? area.getBoundingClientRect() : null;
    const targetX = targetRect
      // oxlint-disable-next-line react/purity -- pointerup handler, not render
      ? targetRect.left + targetRect.width / 2 + (Math.random() - 0.5) * 30
      : g.cardRect.left + g.cardRect.width / 2;
    const targetY = targetRect ? targetRect.top + 8 : g.cardRect.top + g.cardRect.height / 2;

    setGhostPos(ghost, fromX, fromY, 1.3);
    ghost.style.transition = 'transform 260ms cubic-bezier(.34,1.56,.64,1), opacity 260ms ease';
    requestAnimationFrame(() => {
      setGhostPos(ghost, targetX, targetY, land ? 0.55 : 1);
      ghost.style.opacity = land ? '0.85' : '1';
    });

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      ghost.remove();
      if (land) onLand(g.item, targetX, targetY);
    };
    ghost.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 350);
  }

  function startDrag(e, item) {
    if (dragRef.current) return;
    const touch = e.pointerType !== 'mouse';
    // Only safe with a mouse: on touch this is what stops the menu scrolling.
    if (!touch) e.preventDefault();

    const cardEl = e.currentTarget;
    dragRef.current = {
      item,
      cardEl,
      touch,
      dragging: false,
      ghost: null,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      cardRect: cardEl.getBoundingClientRect(),
      holdTimer: touch ? setTimeout(promote, HOLD_MS) : null,
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, { once: true });
    document.addEventListener('pointercancel', onPointerCancel, { once: true });
  }

  return { startDrag };
}
