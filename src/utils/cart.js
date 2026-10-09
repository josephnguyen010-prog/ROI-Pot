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

// `tone` picks the colour: win, even or loss.
export function verdictFor(delta) {
  if (delta > 15) return { tone: 'win', label: 'You beat the buffet', text: 'You ate well past what you paid. The house lost money on this table.' };
  if (delta > 0) return { tone: 'win', label: 'You came out ahead', text: 'More on the plate than on the bill. Narrowly.' };
  if (delta > -5) return { tone: 'even', label: 'About even', text: 'Within a few dollars of the bill either way. Call it a fair trade.' };
  return { tone: 'loss', label: 'The house won', text: 'The kitchen made money on you this round. Order the steak next time.' };
}
