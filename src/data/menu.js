// Item names, calorie counts and the spicy / gluten-free / dinner-only marks are
// transcribed from the KPOT all-you-can-eat Hot Pot and Korean BBQ menu boards.
// `value` is a retail-cost estimate per plate - the boards carry no prices, and
// estimating that number is the whole point of the ROI calculation.
export const MENU = [
  // ---------- Korean BBQ: beef ----------
  { id: 'bbq_bulgogi', cat: 'BBQ Beef', name: 'Beef Bulgogi', value: 3.25, cals: 160 },
  { id: 'bbq_spicy_bulgogi', cat: 'BBQ Beef', name: 'Spicy Beef Bulgogi', value: 3.25, cals: 200, spicy: true },
  { id: 'bbq_brisket', cat: 'BBQ Beef', name: 'Prime Brisket', value: 3.75, cals: 230, gf: true },
  { id: 'bbq_beefbelly', cat: 'BBQ Beef', name: 'Sliced Beef Belly', value: 3.50, cals: 360, gf: true },
  { id: 'bbq_tongue', cat: 'BBQ Beef', name: 'Beef Tongue', value: 4.50, cals: 190, gf: true, dinner: true },
  { id: 'bbq_steak', cat: 'BBQ Beef', name: 'KPOT Steak', value: 5.50, cals: 280, gf: true, dinner: true },
  { id: 'bbq_fingerribs', cat: 'BBQ Beef', name: 'Fingers Ribs', value: 4.75, cals: 240, gf: true, dinner: true },
  { id: 'bbq_shortrib', cat: 'BBQ Beef', name: 'Korean Short Rib', value: 5.00, cals: 200, dinner: true },
  { id: 'bbq_hanger', cat: 'BBQ Beef', name: 'Hanger Steak', value: 4.75, cals: 220, gf: true, dinner: true },
  { id: 'bbq_flaptail', cat: 'BBQ Beef', name: 'Angus Chuck Flap Tail', value: 4.50, cals: 240, gf: true, dinner: true },

  // ---------- Korean BBQ: pork & chicken ----------
  { id: 'bbq_chicken_bulgogi', cat: 'Pork & Chicken', name: 'Chicken Bulgogi', value: 1.75, cals: 120 },
  { id: 'bbq_spicy_chicken', cat: 'Pork & Chicken', name: 'Spicy Chicken Bulgogi', value: 1.75, cals: 130, spicy: true },
  { id: 'bbq_garlic_chicken', cat: 'Pork & Chicken', name: 'Garlic Chicken', value: 1.85, cals: 150 },
  { id: 'bbq_spicy_pork', cat: 'Pork & Chicken', name: 'Spicy Pork Bulgogi', value: 2.25, cals: 210, spicy: true },
  { id: 'bbq_porkbelly', cat: 'Pork & Chicken', name: 'Pork Belly', value: 2.50, cals: 330, gf: true },
  { id: 'bbq_spicy_porkbelly', cat: 'Pork & Chicken', name: 'Spicy Pork Belly', value: 2.50, cals: 330, spicy: true },
  { id: 'bbq_smoked_porkbelly', cat: 'Pork & Chicken', name: 'Smoked Garlic Pork Belly', value: 2.75, cals: 320 },
  { id: 'bbq_kpot_porkbelly', cat: 'Pork & Chicken', name: 'KPOT Pork Belly', value: 2.90, cals: 340 },
  { id: 'bbq_sliced_porkbelly', cat: 'Pork & Chicken', name: 'Sliced Pork Belly', value: 2.40, cals: 330, gf: true },
  { id: 'bbq_porkcheek', cat: 'Pork & Chicken', name: 'Signature Pork Cheek', value: 3.25, cals: 220, gf: true, dinner: true },
  { id: 'bbq_sausage', cat: 'Pork & Chicken', name: 'Sausage', value: 1.60, cals: 220 },

  // ---------- Hot Pot: sliced meat ----------
  { id: 'hp_pork', cat: 'Sliced Meat', name: 'Sliced Pork', value: 1.90, cals: 150, gf: true },
  { id: 'hp_porkbelly', cat: 'Sliced Meat', name: 'Sliced Pork Belly', value: 2.40, cals: 330, gf: true },
  { id: 'hp_beefbelly', cat: 'Sliced Meat', name: 'Sliced Beef Belly', value: 3.50, cals: 360, gf: true },
  { id: 'hp_brisket', cat: 'Sliced Meat', name: 'Prime Brisket', value: 3.75, cals: 230, gf: true },
  { id: 'hp_lamb', cat: 'Sliced Meat', name: 'Sliced Lamb', value: 3.60, cals: 100, gf: true },
  { id: 'hp_chicken', cat: 'Sliced Meat', name: 'Sliced Chicken', value: 1.60, cals: 100, gf: true },
  { id: 'hp_ribeye', cat: 'Sliced Meat', name: 'Sliced Ribeye', value: 4.25, cals: 140, gf: true, dinner: true },
  { id: 'hp_tongue', cat: 'Sliced Meat', name: 'Beef Tongue', value: 4.50, cals: 190, gf: true, dinner: true },

  // ---------- Seafood (both boards) ----------
  { id: 'sf_squid', cat: 'Seafood', name: 'Squid', value: 1.75, cals: 80, gf: true },
  { id: 'sf_swai', cat: 'Seafood', name: 'Swai Fish', value: 1.50, cals: 80, gf: true },
  { id: 'sf_whiteclams', cat: 'Seafood', name: 'White Clams', value: 1.60, cals: 70 },
  { id: 'sf_clams', cat: 'Seafood', name: 'Clams', value: 1.60, cals: 70, gf: true },
  { id: 'sf_crawfish', cat: 'Seafood', name: 'Crawfish', value: 2.25, cals: 70, gf: true },
  { id: 'sf_mussels', cat: 'Seafood', name: 'Mussels', value: 1.75, cals: 80, gf: true },
  { id: 'sf_calamari', cat: 'Seafood', name: 'Spicy Calamari', value: 2.00, cals: 110, spicy: true },
  { id: 'sf_fishfillet', cat: 'Seafood', name: 'Spicy Fish Fillet', value: 1.90, cals: 100, spicy: true },
  { id: 'sf_garlicshrimp', cat: 'Seafood', name: 'Garlic Shrimp', value: 2.60, cals: 90 },
  { id: 'sf_babyoctopus', cat: 'Seafood', name: 'Baby Octopus', value: 2.50, cals: 90, gf: true, dinner: true },
  { id: 'sf_oysters', cat: 'Seafood', name: 'Oysters', value: 2.75, cals: 60, gf: true, dinner: true },
  { id: 'sf_prawns', cat: 'Seafood', name: 'Shrimp Prawns', value: 2.75, cals: 90, gf: true, dinner: true },
  { id: 'sf_snowcrab', cat: 'Seafood', name: 'Snow Crab', value: 4.25, cals: 60, gf: true, dinner: true },
  { id: 'sf_spicy_octopus', cat: 'Seafood', name: 'Spicy Baby Octopus', value: 2.50, cals: 90, spicy: true, dinner: true },
  { id: 'sf_salmon', cat: 'Seafood', name: 'Spicy Salmon', value: 3.50, cals: 170, spicy: true, dinner: true },

  // ---------- Hot Pot: meat / sides ----------
  { id: 'ms_crabmeat', cat: 'Meat/Sides', name: 'Crab Meat', value: 1.20, cals: 50 },
  { id: 'ms_spam', cat: 'Meat/Sides', name: 'Spam', value: 1.40, cals: 270, gf: true },
  { id: 'ms_minisausage', cat: 'Meat/Sides', name: 'Mini Sausages', value: 1.10, cals: 250 },
  { id: 'ms_shrimpdumpling', cat: 'Meat/Sides', name: 'Shrimp Dumplings', value: 1.60, cals: 170 },
  { id: 'ms_gyoza', cat: 'Meat/Sides', name: 'Gyoza', value: 1.50, cals: 210 },
  { id: 'ms_tripe', cat: 'Meat/Sides', name: 'Cattle Tripe', value: 1.40, cals: 70, gf: true },
  { id: 'ms_quaileggs', cat: 'Meat/Sides', name: 'Quail Eggs', value: 1.30, cals: 140, gf: true },
  { id: 'ms_tempura', cat: 'Meat/Sides', name: 'Tempura', value: 1.20, cals: 180 },
  { id: 'ms_fishmeatballs', cat: 'Meat/Sides', name: 'Fish Meatballs', value: 1.20, cals: 140 },
  { id: 'ms_fishcakes', cat: 'Meat/Sides', name: 'Fish Cakes', value: 1.10, cals: 170 },
  { id: 'ms_shumai', cat: 'Meat/Sides', name: 'Shumai', value: 1.50, cals: 210 },
  { id: 'ms_fishroebags', cat: 'Meat/Sides', name: 'Fish Roe Bags', value: 1.60, cals: 160 },
  { id: 'ms_duckfeet', cat: 'Meat/Sides', name: 'Boneless Duck Feet', value: 1.90, cals: 170, gf: true, dinner: true },
  { id: 'ms_beefmeatballs', cat: 'Meat/Sides', name: 'Beef Meatballs', value: 1.70, cals: 220, dinner: true },
  { id: 'ms_fishroeballs', cat: 'Meat/Sides', name: 'Fish Roe Balls', value: 1.60, cals: 150, dinner: true },
  { id: 'ms_lobsterballs', cat: 'Meat/Sides', name: 'Lobster Balls', value: 1.80, cals: 150, dinner: true },

  // ---------- Hot Pot: soy bean ----------
  { id: 'sb_friedtofu', cat: 'Soy Bean', name: 'Fried Tofu', value: 0.90, cals: 230, gf: true },
  { id: 'sb_softtofu', cat: 'Soy Bean', name: 'Soft Tofu', value: 0.70, cals: 45, gf: true },
  { id: 'sb_frozentofu', cat: 'Soy Bean', name: 'Frozen Tofu', value: 0.80, cals: 81, gf: true },
  { id: 'sb_tofuskin', cat: 'Soy Bean', name: 'Fried Tofu Skin', value: 0.95, cals: 210, gf: true },
  { id: 'sb_beancurdstick', cat: 'Soy Bean', name: 'Bean Curd Stick', value: 0.85, cals: 125, gf: true },
  { id: 'sb_doughstick', cat: 'Soy Bean', name: 'Fried Dough Stick', value: 0.75, cals: 370 },

  // ---------- Vegetables (both boards) ----------
  { id: 'vg_spinach', cat: 'Vegetables', name: 'Spinach', value: 0.60, cals: 20, gf: true },
  { id: 'vg_crowndaisy', cat: 'Vegetables', name: 'Crown Daisy', value: 0.60, cals: 20, gf: true },
  { id: 'vg_watercress', cat: 'Vegetables', name: 'Watercress', value: 0.60, cals: 10, gf: true },
  { id: 'vg_lettuce', cat: 'Vegetables', name: 'Green Leaf Lettuce', value: 0.55, cals: 15, gf: true },
  { id: 'vg_broccoli', cat: 'Vegetables', name: 'Broccoli', value: 0.70, cals: 30, gf: true },
  { id: 'vg_bokchoy', cat: 'Vegetables', name: 'Bok Choy', value: 0.55, cals: 10, gf: true },
  { id: 'vg_shiitake', cat: 'Vegetables', name: 'Shiitake Mushroom', value: 0.95, cals: 30, gf: true },
  { id: 'vg_beech', cat: 'Vegetables', name: 'Beech Mushroom', value: 0.85, cals: 15, gf: true },
  { id: 'vg_napa', cat: 'Vegetables', name: 'Napa', value: 0.50, cals: 10, gf: true },
  { id: 'vg_seaweedknots', cat: 'Vegetables', name: 'Seaweed Knots', value: 0.65, cals: 20, gf: true },
  { id: 'vg_beansprout', cat: 'Vegetables', name: 'Mung Bean Sprout', value: 0.50, cals: 25, gf: true },
  { id: 'vg_pumpkin', cat: 'Vegetables', name: 'Sliced Pumpkins', value: 0.60, cals: 20, gf: true },
  { id: 'vg_daikon', cat: 'Vegetables', name: 'Daikon', value: 0.50, cals: 15, gf: true },
  { id: 'vg_taro', cat: 'Vegetables', name: 'Fried Taro', value: 0.80, cals: 180, gf: true },
  { id: 'vg_enoki', cat: 'Vegetables', name: 'Enoki Mushroom', value: 0.75, cals: 35, gf: true },
  { id: 'vg_lotusroot', cat: 'Vegetables', name: 'Lotus Root', value: 0.70, cals: 60, gf: true },
  { id: 'vg_eggplant', cat: 'Vegetables', name: 'Eggplant', value: 0.65, cals: 20, gf: true },
  { id: 'vg_potato', cat: 'Vegetables', name: 'Potato', value: 0.50, cals: 70, gf: true },
  { id: 'vg_bamboo', cat: 'Vegetables', name: 'Baby Bamboo Shoot', value: 0.70, cals: 25, gf: true },
  { id: 'vg_corn', cat: 'Vegetables', name: 'Corn', value: 0.60, cals: 70, gf: true },
  { id: 'vg_kingmushroom', cat: 'Vegetables', name: 'King Oyster Mushroom', value: 0.95, cals: 20, gf: true },
  { id: 'vg_blackfungus', cat: 'Vegetables', name: 'Black Fungus', value: 0.65, cals: 25, gf: true },
  { id: 'vg_sweetpotato', cat: 'Vegetables', name: 'Sweet Potato', value: 0.55, cals: 70, gf: true },
  { id: 'vg_zucchini', cat: 'Vegetables', name: 'Zucchini', value: 0.55, cals: 15, gf: true },
  { id: 'vg_pineapple', cat: 'Vegetables', name: 'Pineapple', value: 0.70, cals: 45, gf: true },
  { id: 'vg_pepper', cat: 'Vegetables', name: 'Pepper', value: 0.55, cals: 25, gf: true },
  { id: 'vg_onion', cat: 'Vegetables', name: 'Onion', value: 0.45, cals: 25, gf: true },
  { id: 'vg_garlic', cat: 'Vegetables', name: 'Garlic', value: 0.60, cals: 120, gf: true },

  // ---------- Hot Pot: noodles & rice ----------
  { id: 'nd_vermicelli', cat: 'Noodles', name: 'Vermicelli', value: 0.60, cals: 85, gf: true },
  { id: 'nd_udon', cat: 'Noodles', name: 'Udon', value: 0.90, cals: 220 },
  { id: 'nd_meifun', cat: 'Noodles', name: 'Mei Fun', value: 0.60, cals: 160, gf: true },
  { id: 'nd_ramen', cat: 'Noodles', name: 'Ramen Noodle', value: 0.80, cals: 170 },
  { id: 'nd_sweetpotato', cat: 'Noodles', name: 'Sweet Potato Noodle', value: 0.85, cals: 100, gf: true },
  { id: 'nd_pho', cat: 'Noodles', name: 'Fresh Pho Noodle', value: 0.85, cals: 238, gf: true },
  { id: 'nd_ricecake', cat: 'Noodles', name: 'Rice Cake', value: 0.95, cals: 110, gf: true },
  { id: 'nd_rice', cat: 'Noodles', name: 'White Rice', value: 0.60, cals: 170, gf: true },
];

export const CATS = [
  'BBQ Beef',
  'Pork & Chicken',
  'Sliced Meat',
  'Seafood',
  'Meat/Sides',
  'Soy Bean',
  'Vegetables',
  'Noodles',
];

export const CAT_COLORS = {
  'BBQ Beef': 'var(--cat-beef)',
  'Pork & Chicken': 'var(--cat-pork)',
  'Sliced Meat': 'var(--cat-sliced)',
  Seafood: 'var(--cat-seafood)',
  'Meat/Sides': 'var(--cat-sides)',
  'Soy Bean': 'var(--cat-soy)',
  Vegetables: 'var(--cat-veg)',
  Noodles: 'var(--cat-noodles)',
};

export const TIERS = {
  lunch: { label: 'Lunch', price: 23.99 },
  dinner: { label: 'Dinner', price: 32.99 },
};
