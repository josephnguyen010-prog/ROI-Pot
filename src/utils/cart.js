import { MENU } from '../data/menu';

export const fmt = (n) => '$' + n.toFixed(2);

export function cartEntries(cart) {
  return MENU.filter((m) => cart[m.id] > 0).map((m) => ({ ...m, qty: cart[m.id] }));
}

export function totalValue(cart) {
  return cartEntries(cart).reduce((s, i) => s + i.value * i.qty, 0);
}

export function totalItems(cart) {
  return cartEntries(cart).reduce((s, i) => s + i.qty, 0);
}

export function verdictFor(delta) {
  if (delta > 15) return { label: '🔥 Buffet Crushed', color: 'var(--app-jade)', text: `You out-ate the house by ${fmt(delta)}.` };
  if (delta > 0) return { label: '✅ You Won', color: 'var(--app-jade)', text: `You came out ahead by ${fmt(delta)}.` };
  if (delta > -5) return { label: '🤝 Break-Even', color: 'var(--app-gold)', text: `Almost exactly even — ${fmt(Math.abs(delta))} off.` };
  return { label: '🏠 House Won', color: 'var(--app-accent)', text: `The kitchen made ${fmt(Math.abs(delta))} on you this round.` };
}
