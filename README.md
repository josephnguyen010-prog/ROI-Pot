# ROI-Pot

A portfolio concept prototype: an interactive Korean BBQ and hot pot all-you-can-eat "calculator"
that tallies every plate you order against what those cuts would cost at retail, so you get a number
on who won the meal — you or the house.

Tap a plate to add it, or press and hold to drag it across. Food falls and piles up on a small
hand-rolled physics simulation. Close out the check to see your retail value vs. what you paid.

Not affiliated with any restaurant chain. Item names, calorie counts and the spicy / gluten-free /
dinner-only marks are transcribed from a real KPOT menu board; **every price in here is an estimate
I assigned**, since the board carries calories rather than prices. The AYCE tier prices are invented
too. Treat the totals as a demonstration of the idea, not as real figures.

## Stack

React + Vite, plain CSS (no component library). No backend — all menu data and pricing live in
[`src/data/menu.js`](src/data/menu.js).

```
src/
  data/menu.js          menu items, categories, AYCE pricing tiers
  data/foodArt.js       the drawn SVG food shapes, one per item
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
