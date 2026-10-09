# ROI-Pot

A portfolio concept prototype: an interactive Korean BBQ and hot pot all-you-can-eat "calculator"
that tallies every plate you order against what those cuts would cost at retail, so you get a number
on who won the meal — you or the house.

Tap a plate to add it, or press and hold to drag it across. Food falls and piles up on a small
hand-rolled physics simulation. Close out the check to see your retail value vs. what you paid.

**[Try it live →](https://josephnguyen010-prog.github.io/Joseph-Nguyen-Portfolio/roi-pot/)**

Not affiliated with any restaurant chain. Item names, calorie counts and the spicy / gluten-free /
dinner-only marks are transcribed from a real KPOT menu board; **every price in here is an estimate
I assigned**, since the board carries calories rather than prices. The AYCE tier prices are invented
too. Treat the totals as a demonstration of the idea, not as real figures.

## Stack

React + Vite, plain CSS (no component library), light and dark themes. A web page, not a phone mockup: on a wide screen the menu and your table sit side by side, and on a phone the table becomes a sheet along the bottom. No backend — all menu data and pricing live in
[`src/data/menu.js`](src/data/menu.js).

```
src/
  data/menu.js          menu items, categories, AYCE pricing tiers
  data/foodArt.js       the drawn SVG food shapes, one per item
  utils/cart.js         cart math (totals, verdict copy)
  utils/fx.js           drag ghost / particle / floating-text DOM effects
  hooks/usePlatePhysics.js   the falling-food gravity/collision sim
  hooks/useFoodDrag.js       pointer-based drag-and-drop + tap-to-add
  components/TablePanel.jsx  the plate, the break-even meter, the check and the verdict
  components/           the tier switch, menu tabs and food grid
  styles/app.css        layout and components; index.css holds the colour tokens
```

## Run it

```
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
```

## Build

```
npm run build
```

`vite.config.js` sets `base: './'`, so the build in `dist/` runs from any sub-path. That is how
it is hosted inside the portfolio: copy `dist/` over `public/roi-pot/` there.
