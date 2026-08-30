import { useRef } from 'react';
import { spawnGhost, setGhostPos } from '../utils/fx';

// Handles both drag-to-plate and tap-to-add as one code path: a pointerdown
// followed by a pointerup with little/no movement is treated as a "land"
// just like a drop directly over the plate.
export function useFoodDrag({ plateZoneRef, plateAreaRef, onLand }) {
  const dragRef = useRef(null);

  function onPointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    drag.moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    setGhostPos(drag.ghost, e.clientX, e.clientY, 1.3);
    const zone = plateZoneRef.current;
    if (!zone) return;
    const r = zone.getBoundingClientRect();
    const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    zone.classList.toggle('hover', over);
  }

  function onPointerUp(e) {
    document.removeEventListener('pointermove', onPointerMove);
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const { item, cardEl, ghost, moved, cardRect, lastX, lastY } = drag;
    cardEl.classList.remove('lifted');

    const zone = plateZoneRef.current;
    if (zone) zone.classList.remove('hover');
    const zoneRect = zone ? zone.getBoundingClientRect() : null;
    const overZone = zoneRect && e.clientX >= zoneRect.left && e.clientX <= zoneRect.right && e.clientY >= zoneRect.top && e.clientY <= zoneRect.bottom;
    const land = !moved || overZone;

    const area = plateAreaRef.current;
    const targetRect = land && area ? area.getBoundingClientRect() : null;
    const targetX = targetRect ? targetRect.left + targetRect.width / 2 + (Math.random() - 0.5) * 30 : cardRect.left + cardRect.width / 2;
    const targetY = targetRect ? targetRect.top + 8 : cardRect.top + cardRect.height / 2;

    setGhostPos(ghost, lastX, lastY, 1.3);
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
      if (land) onLand(item, targetX, targetY);
    };
    ghost.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 350);
  }

  function startDrag(e, item) {
    e.preventDefault();
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const ghost = spawnGhost(item.emoji, rect);
    cardEl.classList.add('lifted');
    dragRef.current = { item, cardEl, ghost, startX: e.clientX, startY: e.clientY, moved: false, cardRect: rect };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, { once: true });
  }

  return { startDrag };
}
