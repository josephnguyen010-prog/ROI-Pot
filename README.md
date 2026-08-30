# ROI-Pot

A portfolio concept prototype: an interactive Korean BBQ all-you-can-eat "calculator" that tallies
every plate you order against retail meat prices, so you get a real number on who won the meal —
you or the house.

Drag or tap food onto the plate and watch it actually fall and pile up with a small hand-rolled
physics simulation. Close out the check to see your retail value vs. what you paid.

Not affiliated with any restaurant chain.

## Stack

React + Vite, plain CSS (no component library). No backend — all menu data and pricing live in
[`src/data/menu.js`](src/data/menu.js).

```
src/
  data/menu.js          menu items, categories, AYCE pricing tiers
  utils/cart.js         cart math (totals, verdict copy)
  utils/fx.js           drag ghost / particle / floating-text DOM effects
  hooks/usePlatePhysics.js   the falling-food gravity/collision sim
  hooks/useFoodDrag.js       pointer-based drag-and-drop + tap-to-add
  components/           UI split by piece (tiers, categories, food grid, plate, receipt)
```

## Run it

```
npm install
npm run dev
```

## Build

```
npm run build
```
