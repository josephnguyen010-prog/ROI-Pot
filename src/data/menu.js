export const MENU = [
  { id: 'wagyu', cat: 'Premium', name: 'Wagyu Beef', unit: 'plate', value: 5.00, emoji: '🥩' },
  { id: 'ribeye', cat: 'Premium', name: 'Prime Ribeye', unit: 'plate', value: 3.50, emoji: '🍖' },
  { id: 'shortrib', cat: 'Premium', name: 'Short Rib', unit: 'plate', value: 2.75, emoji: '🥩' },
  { id: 'wagyubrisket', cat: 'Premium', name: 'Wagyu Brisket', unit: 'plate', value: 4.50, emoji: '🥩' },
  { id: 'ribeyecap', cat: 'Premium', name: 'Ribeye Cap', unit: 'plate', value: 4.00, emoji: '🍖' },
  { id: 'crableg', cat: 'Premium', name: 'King Crab Leg', unit: 'plate', value: 4.50, emoji: '🦀' },
  { id: 'porkbelly', cat: 'Meats', name: 'Pork Belly', unit: 'plate', value: 1.50, emoji: '🥓' },
  { id: 'bulgogi', cat: 'Meats', name: 'Bulgogi Beef', unit: 'plate', value: 2.00, emoji: '🍖' },
  { id: 'spicypork', cat: 'Meats', name: 'Spicy Pork', unit: 'plate', value: 1.75, emoji: '🌶️' },
  { id: 'chicken', cat: 'Meats', name: 'Chicken Thigh', unit: 'plate', value: 0.75, emoji: '🍗' },
  { id: 'tongue', cat: 'Meats', name: 'Beef Tongue', unit: 'plate', value: 3.00, emoji: '🥩' },
  { id: 'spicychicken', cat: 'Meats', name: 'Spicy Chicken Bulgogi', unit: 'plate', value: 1.00, emoji: '🍗' },
  { id: 'porkjowl', cat: 'Meats', name: 'Pork Jowl', unit: 'plate', value: 1.25, emoji: '🥓' },
  { id: 'shrimp', cat: 'Seafood', name: 'Shrimp', unit: '6 pc', value: 2.50, emoji: '🍤' },
  { id: 'scallops', cat: 'Seafood', name: 'Sea Scallops', unit: '4 pc', value: 2.75, emoji: '🐚' },
  { id: 'squid', cat: 'Seafood', name: 'Squid', unit: 'plate', value: 1.50, emoji: '🦑' },
  { id: 'mussels', cat: 'Seafood', name: 'Mussels', unit: '6 pc', value: 1.25, emoji: '🦪' },
  { id: 'fishcake', cat: 'Seafood', name: 'Fish Cake', unit: 'plate', value: 1.00, emoji: '🍥' },
  { id: 'octopus', cat: 'Seafood', name: 'Octopus', unit: 'plate', value: 2.25, emoji: '🐙' },
  { id: 'enoki', cat: 'Hot Pot', name: 'Enoki Mushroom', unit: 'bundle', value: 0.50, emoji: '🍄' },
  { id: 'napa', cat: 'Hot Pot', name: 'Napa Cabbage', unit: 'plate', value: 0.35, emoji: '🥬' },
  { id: 'tofu', cat: 'Hot Pot', name: 'Tofu', unit: 'plate', value: 0.45, emoji: '⬜' },
  { id: 'glassnoodles', cat: 'Hot Pot', name: 'Glass Noodles', unit: 'bowl', value: 0.55, emoji: '🍜' },
  { id: 'fishballs', cat: 'Hot Pot', name: 'Fish Balls', unit: '6 pc', value: 1.00, emoji: '🟣' },
  { id: 'meatballs', cat: 'Hot Pot', name: 'Meatballs', unit: '6 pc', value: 1.25, emoji: '🟤' },
  { id: 'eggsouffle', cat: 'Sides', name: 'Egg Soufflé', unit: 'bowl', value: 1.50, emoji: '🍳' },
  { id: 'corncheese', cat: 'Sides', name: 'Corn Cheese', unit: 'bowl', value: 2.00, emoji: '🌽' },
  { id: 'kimchirice', cat: 'Sides', name: 'Kimchi Rice', unit: 'plate', value: 2.50, emoji: '🍚' },
  { id: 'banchan', cat: 'Sides', name: 'Banchan Set', unit: 'set', value: 1.75, emoji: '🥗' },
  { id: 'japchae', cat: 'Sides', name: 'Japchae', unit: 'plate', value: 2.25, emoji: '🍜' },
  { id: 'steamedegg', cat: 'Sides', name: 'Steamed Egg', unit: 'bowl', value: 1.25, emoji: '🥚' },
  { id: 'softserve', cat: 'Dessert', name: 'Soft Serve', unit: 'cone', value: 2.00, emoji: '🍦' },
  { id: 'mochi', cat: 'Dessert', name: 'Mochi', unit: '3 pc', value: 2.50, emoji: '🍡' },
  { id: 'bingsu', cat: 'Dessert', name: 'Red Bean Bingsu', unit: 'bowl', value: 3.50, emoji: '🍧' },
  { id: 'churros', cat: 'Dessert', name: 'Churros', unit: 'plate', value: 2.25, emoji: '🍩' },
];

export const CATS = ['Premium', 'Meats', 'Seafood', 'Hot Pot', 'Sides', 'Dessert'];

export const CAT_COLORS = {
  Premium: 'var(--cat-premium)',
  Meats: 'var(--cat-meats)',
  Seafood: 'var(--cat-seafood)',
  'Hot Pot': 'var(--cat-hotpot)',
  Sides: 'var(--cat-sides)',
  Dessert: 'var(--cat-dessert)',
};

export const TIERS = {
  lunch: { label: 'Lunch', price: 23.99 },
  dinner: { label: 'Dinner', price: 32.99 },
  weekend: { label: 'Weekend', price: 35.99 },
};
