// Hand-drawn food art, one shape per menu item.
//
// Everything is plain SVG markup on a 40x32 canvas so the same string can be
// dropped into a React card, into the drag ghost, and into a physics chip on the
// plate - none of which share a rendering path. Emoji were doing this job before
// and six different beef cuts all came out as the same glyph.
//
// Shapes are built from a handful of generators (slices, balls, leaves, nests)
// with bespoke paths where a silhouette actually matters.

const C = {
  beef: '#B8384A', beefDark: '#8A2739', beefLight: '#D25E70',
  fat: '#F3E7E0', fatDim: '#DCCBC2',
  marinade: '#8E4025', marinadeDark: '#682B17', marinadeLight: '#AE5A34',
  chili: '#CE3A24', chiliDark: '#9E2716',
  pork: '#E2999A', porkDark: '#C2777B',
  chicken: '#E8C89C', chickenDark: '#C9A578',
  tongue: '#C98C86', tongueRim: '#EBD5CB',
  tripe: '#E6DACA', tripeDark: '#C7B7A2',
  fish: '#EFE3D5', fishDark: '#D2C0AC',
  shrimp: '#F2946C', shrimpDark: '#D46C45',
  shell: '#CFBEA8', shellDark: '#9C8970',
  shellDeep: '#4A3B4F', shellDeepDark: '#2E2433',
  crab: '#E2604A', crabDark: '#B8442F',
  salmon: '#EE8A5E', salmonPale: '#F7C4A6',
  tofu: '#F2E7C4', tofuDark: '#D9CB9C',
  fried: '#E0AC5C', friedDark: '#B98536',
  green: '#6FAE55', greenLight: '#93CD6E', greenDark: '#4B8437',
  greenPale: '#CFE0A8',
  pale: '#EBE5D2', paleDark: '#CDC4AB',
  mush: '#B08A63', mushDark: '#82603F',
  noodle: '#F0E2BC', noodleDark: '#D3C093',
  white: '#F4EFE4', whiteDark: '#D5CCBA',
  purple: '#8E6FA8', purpleDark: '#66497D',
  orange: '#E79A44',
  brown: '#7A5A3C',
  ink: '#2A211C',
};

const SHEEN = '<ellipse cx="14" cy="10" rx="7" ry="3.4" fill="#fff" opacity=".12"/>';

// --- generators -------------------------------------------------------------

// Three overlapping round slices - the workhorse for root veg, sausage, rings.
function slices(fill, dark, { rx = 7.6, ry = 6.8, rim = null, inner = null, holes = 0 } = {}) {
  const at = [[11, 20, -9], [20, 15.5, 5], [29, 20, 11]];
  return at
    .map(([cx, cy, rot]) => {
      let hole = '';
      if (holes) {
        const pts = [[0, -2.6], [2.6, 0.4], [-2.6, 0.4], [1.4, 3], [-1.4, 3]].slice(0, holes);
        hole = pts.map(([hx, hy]) => `<ellipse cx="${hx}" cy="${hy}" rx="1.15" ry="1" fill="${dark}"/>`).join('');
      }
      return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
        <ellipse rx="${rx}" ry="${ry}" fill="${fill}"/>
        ${rim ? `<ellipse rx="${rx * 0.74}" ry="${ry * 0.74}" fill="${rim}"/>` : ''}
        ${inner ? `<ellipse rx="${rx * 0.4}" ry="${ry * 0.4}" fill="${inner}"/>` : ''}
        ${hole}
        <ellipse cx="${-rx * 0.26}" cy="${-ry * 0.34}" rx="${rx * 0.38}" ry="${ry * 0.26}" fill="#fff" opacity=".16"/>
      </g>`;
    })
    .join('');
}

// A rolled slice of meat seen end-on: the swirl is what makes it read as rolled.
function roll(cx, cy, rx, ry, rot, meat, fat) {
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
    <ellipse rx="${rx}" ry="${ry}" fill="${meat}"/>
    <path d="M${-rx * 0.5} ${ry * 0.1} a ${rx * 0.5} ${ry * 0.46} 0 1 1 ${rx} 0"
      fill="none" stroke="${fat}" stroke-width="${ry * 0.3}" stroke-linecap="round"/>
    <ellipse cx="${-rx * 0.22}" cy="${-ry * 0.38}" rx="${rx * 0.34}" ry="${ry * 0.2}" fill="#fff" opacity=".18"/>
  </g>`;
}

function rolls(meat, fat) {
  return roll(11, 20, 7.4, 6.6, -10, meat, fat)
    + roll(20, 15, 7.8, 7, 4, meat, fat)
    + roll(29, 20, 7.4, 6.6, 12, meat, fat);
}

// Layered belly strips - fat and lean banded, laid in waves rather than rolled.
function belly(lean, fat) {
  const strip = (y, rot) => `<g transform="translate(20 ${y}) rotate(${rot})">
    <rect x="-14" y="-3.4" width="28" height="6.8" rx="3.4" fill="${lean}"/>
    <rect x="-14" y="-1.9" width="28" height="1.7" rx="0.85" fill="${fat}"/>
    <rect x="-14" y="1" width="28" height="1.3" rx="0.65" fill="${fat}" opacity=".75"/>
  </g>`;
  return strip(10.5, -5) + strip(17, 3) + strip(23.5, -2);
}

// Spheres, for the whole meatball/fishball/egg family.
function balls(fill, dark) {
  const at = [[12, 20, 5.6], [20.5, 13.5, 5.2], [28.5, 19.5, 5.8]];
  return at
    .map(([cx, cy, r]) => `<g transform="translate(${cx} ${cy})">
      <circle r="${r}" fill="${fill}"/>
      <path d="M${-r} 0 a ${r} ${r} 0 0 0 ${r * 2} 0z" fill="${dark}" opacity=".35"/>
      <circle cx="${-r * 0.3}" cy="${-r * 0.34}" r="${r * 0.34}" fill="#fff" opacity=".28"/>
    </g>`)
    .join('');
}

// Leafy greens: a stem with blades off it.
function leaves(fill, dark, { blades = 5, long = false } = {}) {
  const L = long ? 11 : 8.5;
  let out = `<path d="M20 27 C19 22 19 16 20 8" stroke="${dark}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < blades; i++) {
    const t = i / (blades - 1);
    const y = 24 - t * 15;
    const side = i % 2 ? 1 : -1;
    const w = L * (0.6 + 0.4 * (1 - t));
    out += `<path d="M20 ${y} q ${side * w * 0.6} ${-w * 0.5} ${side * w} ${-w * 0.15}
      q ${-side * w * 0.45} ${w * 0.6} ${-side * w} ${0.15}z" fill="${i % 2 ? fill : dark}"/>`;
  }
  return out;
}

// A coil of noodles.
function nest(fill, dark, { thick = 2, wobble = 3 } = {}) {
  let out = '';
  for (let i = 0; i < 5; i++) {
    const y = 11 + i * 2.6;
    const w = 15 - Math.abs(i - 2) * 1.6;
    out += `<path d="M${20 - w} ${y} q ${w * 0.5} ${-wobble} ${w} 0 q ${w * 0.5} ${wobble} ${w} 0"
      fill="none" stroke="${i % 2 ? dark : fill}" stroke-width="${thick}" stroke-linecap="round"/>`;
  }
  return out;
}

// Mushrooms: a cap on a stalk, repeated.
function mushrooms(cap, capDark, stalk, { capW = 6.4, capH = 4.2 } = {}) {
  return [[11, 19], [20, 15], [29, 19]]
    .map(([cx, cy]) => `<g transform="translate(${cx} ${cy})">
      <rect x="-2" y="0" width="4" height="7.5" rx="1.8" fill="${stalk}"/>
      <path d="M${-capW} 1 a ${capW} ${capH} 0 0 1 ${capW * 2} 0z" fill="${cap}"/>
      <path d="M${-capW * 0.5} ${1 - capH * 0.5} a ${capW * 0.5} ${capH * 0.4} 0 0 1 ${capW} 0z"
        fill="${capDark}" opacity=".35"/>
    </g>`)
    .join('');
}

// Thin-stalked clusters (enoki, beech) - a bundle of stems with tiny caps.
function cluster(cap, stalk, { n = 7, capR = 1.8, spread = 18, thick = 1.5 } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) - 0.5;
    const x = 20 + t * spread;
    const top = 9.5 + Math.abs(t) * 4;
    out += `<g transform="translate(${x} 26) rotate(${t * 16})">
      <rect x="${-thick / 2}" y="${top - 26}" width="${thick}" height="${26 - top}" rx="${thick / 2}" fill="${stalk}"/>
      <circle cy="${top - 26}" r="${capR}" fill="${cap}"/>
    </g>`;
  }
  return out;
}

// Bivalve shells, open, with the meat showing.
function shells(outer, outerDark, meat) {
  const one = (cx, cy, rot, s) => `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">
    <path d="M-8 2 a 8 7 0 0 1 16 0 q -8 4 -16 0z" fill="${outer}"/>
    <path d="M-8 2 a 8 7 0 0 1 16 0z" fill="${outerDark}" opacity=".45"/>
    <ellipse cy="0.6" rx="4.4" ry="2.4" fill="${meat}"/>
  </g>`;
  return one(11.5, 20, -12, 0.92) + one(20.5, 14.5, 4, 1) + one(29, 20, 13, 0.92);
}

// Battered / fried lumps.
function fritters(fill, dark) {
  const one = (cx, cy, rot) => `<g transform="translate(${cx} ${cy}) rotate(${rot})">
    <path d="M-7 0 q -1 -5 4 -5.5 q 5 -1.5 7 3 q 2 4.5 -3 6 q -6 2 -8 -3.5z" fill="${fill}"/>
    <path d="M-4 -3 q 3 -1.5 6 0.5" stroke="${dark}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  </g>`;
  return one(11.5, 20, -8) + one(20.5, 14.5, 6) + one(29, 20, 12);
}

// Cubes in light perspective, for the tofu family.
function cubes(fill, dark, top) {
  const one = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-6 -3 l6 -3 l6 3 l-6 3z" fill="${top}"/>
    <path d="M-6 -3 l6 3 v6 l-6 -3z" fill="${fill}"/>
    <path d="M6 -3 l-6 3 v6 l6 -3z" fill="${dark}"/>
  </g>`;
  return one(12, 20, 0.95) + one(21, 14.5, 1.05) + one(29, 20.5, 0.95);
}

// Long sticks laid at an angle (bean curd, dough, bamboo).
function sticks(fill, dark, { n = 3, w = 4.4, len = 22, rot = -22 } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * (w + 2.4);
    out += `<g transform="translate(${20 + off} 16) rotate(${rot + i * 6})">
      <rect x="${-w / 2}" y="${-len / 2}" width="${w}" height="${len}" rx="${w / 2}" fill="${fill}"/>
      <rect x="${-w / 2 + 0.8}" y="${-len / 2 + 1.5}" width="${w * 0.3}" height="${len - 3}"
        rx="${w * 0.15}" fill="#fff" opacity=".18"/>
      <rect x="${w / 2 - 1.4}" y="${-len / 2 + 1.5}" width="${w * 0.28}" height="${len - 3}"
        rx="${w * 0.14}" fill="${dark}" opacity=".5"/>
    </g>`;
  }
  return out;
}

// Pleated dumplings.
function dumplings(skin, skinDark, { pleats = 4 } = {}) {
  const one = (cx, cy, rot, s) => {
    let p = '';
    for (let i = 0; i < pleats; i++) {
      const x = -5 + (i * 10) / (pleats - 1);
      p += `<path d="M${x} -2.5 q 1 -2.5 2 -3.2" stroke="${skinDark}" stroke-width="1" fill="none" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">
      <path d="M-7 -1 q 0 -6 7 -6 q 7 0 7 6 q -3 6 -7 6 q -4 0 -7 -6z" fill="${skin}"/>
      ${p}
      <ellipse cx="-2" cy="1" rx="3" ry="1.6" fill="#fff" opacity=".16"/>
    </g>`;
  };
  return one(11.5, 20, -10, 0.92) + one(20.5, 14.5, 5, 1) + one(29, 20, 12, 0.92);
}

// Bulgogi is thin marinated strips, pulled apart into a tangle - not rolls.
// Strand positions are fixed rather than random so the drawing is stable.
function shredded(fill, dark, light) {
  const strands = [
    [10, 22, -20, 9], [16, 23, 10, 10], [22, 22.5, -8, 11], [28, 22, 18, 9],
    [12, 19, 14, 10], [18, 19.5, -16, 11], [24, 19, 8, 10], [29.5, 19.5, -10, 8],
    [14, 16, -12, 10], [20, 15.5, 16, 11], [26, 16, -6, 9],
    [16.5, 12.8, 8, 9], [23.5, 12.8, -14, 9], [20, 10.2, 4, 8],
  ];
  return strands
    .map(([cx, cy, rot, len], i) => {
      const shade = i % 3 === 0 ? light : i % 3 === 1 ? fill : dark;
      return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
        <path d="M${-len / 2} 0 q ${len / 4} -2 ${len / 2} -0.4 q ${len / 4} 1.6 ${len / 2} -0.2"
          stroke="${shade}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>`;
    })
    .join('');
}

// Korean short rib, cut across the bones: each strip shows the bone in section.
function galbi(lean, fat, bone) {
  const strip = (y, rot) => `<g transform="translate(20 ${y}) rotate(${rot})">
    <rect x="-14.5" y="-3.7" width="29" height="7.4" rx="2.4" fill="${lean}"/>
    <rect x="-14.5" y="-2" width="29" height="1.4" rx="0.7" fill="${fat}" opacity=".7"/>
    ${[-9.5, 0, 9.5].map((bx) => `<circle cx="${bx}" cy="0.4" r="2.2" fill="${bone}"/>
      <circle cx="${bx}" cy="0.4" r="1" fill="#D9CBBA"/>`).join('')}
  </g>`;
  return strip(10.5, -5) + strip(17, 3) + strip(23.5, -2);
}

// --- bespoke shapes ---------------------------------------------------------

const steak = (fill, dark, sear, { w = 26, h = 14, fat = C.fat } = {}) => `
  <g transform="translate(20 16) rotate(-7)">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * 0.36}" fill="${fill}"/>
    <path d="M${-w / 2 + 1} ${-h / 2 + 2.2} q ${w / 2 - 1} -3.4 ${w - 2} 0"
      stroke="${fat}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M${-w / 2 + 3} ${1} q ${w / 2 - 3} -2 ${w - 6} 0
             M${-w / 2 + 4} ${h / 2 - 2.6} q ${w / 2 - 4} -2 ${w - 8} 0"
      stroke="${sear}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>
    <rect x="${-w / 2 + 2}" y="${-h / 2 + 3.4}" width="${w * 0.3}" height="2" rx="1"
      fill="#fff" opacity=".14"/>
  </g>`;

// A fillet: thick rounded head, tapered tail, flake lines across the grain.
const fillet = (fill, dark, { flakes = true } = {}) => `
  <g transform="translate(20 16) rotate(-7)">
    <path d="M-15 -2 q 2 -7 9 -7.5 q 11 -0.8 17 4 q 4 3 3 5 q -7 5 -17 5 q -12 0 -12 -6.5z" fill="${fill}"/>
    ${flakes ? `<path d="M-9 -6 q 3 5 -0.5 9 M-3 -7 q 3 5 -0.5 9.5 M3 -6.5 q 3 5 -0.5 9"
      stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".75"/>` : ''}
  </g>`;

const SHAPES = {
  // ---- beef ----
  bulgogi: `<g>${shredded(C.marinade, C.marinadeDark, C.marinadeLight)}
    <circle cx="13.5" cy="14" r="0.95" fill="${C.pale}"/><circle cx="26" cy="12.5" r="0.85" fill="${C.pale}"/>
    <circle cx="19" cy="20" r="0.8" fill="${C.pale}"/>
    <path d="M7.5 25 q 4 -3 8 -1 M25 25.5 q 4 -3 7.5 -1.5" stroke="${C.green}" stroke-width="1.7"
      fill="none" stroke-linecap="round"/></g>`,
  bulgogiSpicy: `<g>${shredded(C.chili, C.chiliDark, '#E4644B')}
    <circle cx="13.5" cy="14" r="0.95" fill="${C.pale}"/><circle cx="27" cy="13" r="0.85" fill="${C.pale}"/>
    <circle cx="20" cy="20.5" r="0.8" fill="${C.pale}"/></g>`,
  brisket: rolls(C.beef, C.fat),
  beefBelly: belly(C.beef, C.fat),
  lamb: rolls('#D9727F', '#FBF3EE'),
  ribeye: `<g transform="translate(20 16)">
    <path d="M-13 -2 q -1 -8 8 -8.5 q 11 -0.5 14 5 q 3 6 -3 9 q -10 4 -16 0 q -4 -2 -3 -5.5z" fill="${C.beef}"/>
    <path d="M-9 -4 q 5 -3 9 1 q 4 4 8 1" stroke="${C.fat}" stroke-width="1.7" fill="none"
      stroke-linecap="round" opacity=".9"/>
    <path d="M-8 2 q 6 -2 10 1 q 4 3 8 0" stroke="${C.fat}" stroke-width="1.5" fill="none"
      stroke-linecap="round" opacity=".8"/>
    <path d="M-6 6 q 6 -2 12 1" stroke="${C.fat}" stroke-width="1.2" fill="none"
      stroke-linecap="round" opacity=".6"/></g>`,
  tongue: slices(C.tongueRim, '#A96F6A', { rx: 8, ry: 6.2, rim: C.tongue }),
  steak: steak(C.beef, C.beefDark, C.ink, { w: 26, h: 15 }),
  ribs: `<g>${[0, 1, 2].map((i) => `<g transform="translate(${11 + i * 9} ${20 - i * 2}) rotate(${-14 + i * 12})">
    <rect x="-3.6" y="-9" width="7.2" height="18" rx="3" fill="${C.marinade}"/>
    <circle cy="-6.4" r="2" fill="${C.fat}"/></g>`).join('')}</g>`,
  shortRib: galbi(C.marinade, C.marinadeLight, C.fat),
  hanger: steak('#94293C', C.ink, C.ink, { w: 29, h: 11, fat: C.fatDim }),
  flapTail: `<g>${steak(C.beefLight, C.beefDark, C.beefDark, { w: 27, h: 16 })}
    <path d="M9 17 q 10 -2 21 1 M9 21 q 10 -2 20 1" stroke="${C.fat}" stroke-width="1.3"
      fill="none" stroke-linecap="round" opacity=".85"/></g>`,

  // ---- pork & chicken ----
  porkRoll: rolls(C.pork, C.fat),
  porkBelly: belly(C.pork, C.fat),
  porkBellySpicy: belly(C.chili, '#E8836C'),
  porkBellySmoked: `<g>${belly('#A9563C', C.fatDim)}
    <circle cx="9" cy="9" r="1.4" fill="${C.pale}"/><circle cx="31" cy="24" r="1.2" fill="${C.pale}"/></g>`,
  porkBellyKpot: `<g>${belly('#C06A50', C.fat)}
    <path d="M6 26 q 5 -3 10 -1" stroke="${C.green}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`,
  porkSpicy: `<g>${rolls(C.chili, C.chiliDark)}<circle cx="14" cy="13" r="0.9" fill="${C.pale}"/></g>`,
  porkCheek: steak(C.pork, C.porkDark, '#B57A78', { w: 23, h: 16, fat: '#F6E6E2' }),
  chickenSlice: rolls(C.chicken, C.fat),
  chickenMarinated: `<g>${fritters(C.chicken, C.chickenDark)}
    <path d="M7 25 q 4 -3 8 -1" stroke="${C.green}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`,
  chickenSpicy: fritters(C.chili, C.chiliDark),
  chickenGarlic: `<g>${fritters(C.chicken, C.chickenDark)}
    <circle cx="10" cy="11" r="2" fill="${C.pale}"/><circle cx="30" cy="12" r="1.7" fill="${C.pale}"/></g>`,
  sausage: slices('#C0574F', '#9A3F39', { rx: 6.6, ry: 6.2, rim: '#D9776C' })
    + `<circle cx="20" cy="15.5" r="1.2" fill="${C.pale}" opacity=".8"/>`,
  miniSausage: sticks('#C4645A', '#9A4740', { n: 4, w: 5, len: 15, rot: -18 }),
  spam: `<g>${[0, 1, 2].map((i) => `<g transform="translate(${12 + i * 8} ${20 - i * 2.5}) rotate(${-8 + i * 8})">
    <rect x="-8" y="-5" width="16" height="10" rx="1.8" fill="#E6A0A0"/>
    <rect x="-8" y="-5" width="16" height="3" rx="1.5" fill="#F2BDBD"/></g>`).join('')}</g>`,
  tripe: `<g>${[12.5, 18.5, 24.5].map((y, i) =>
    `<g transform="translate(0 ${y}) rotate(${i % 2 ? 2 : -2} 20 0)">
      <path d="M5 0 q 3.75 -3.4 7.5 0 q 3.75 3.4 7.5 0 q 3.75 -3.4 7.5 0 q 3.75 3.4 7.5 0
               v4.2 q -3.75 3.4 -7.5 0 q -3.75 -3.4 -7.5 0 q -3.75 3.4 -7.5 0 q -3.75 -3.4 -7.5 0z"
        fill="${i === 1 ? C.tripe : '#DCCFBC'}"/>
    </g>`).join('')}
    ${[[10, 13], [17, 14], [24, 13], [31, 14], [13, 19], [21, 20], [28, 19], [11, 25], [19, 26], [27, 25]]
      .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1" fill="${C.tripeDark}" opacity=".5"/>`).join('')}</g>`,
  duckFeet: `<g>${[[13, 21, -16], [26, 19, 14]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M0 6 q -8 -3 -8 -9 q 3 2 4.6 -1 q 1.4 3 3.4 -2 q 2 5 3.4 2 q 1.6 3 4.6 1 q 0 6 -8 9z" fill="${C.tripe}"/>
      <path d="M0 5 q -1 -6 -4 -9 M0 5 q 0 -6 0 -10 M0 5 q 1 -6 4 -9"
        stroke="${C.tripeDark}" stroke-width="0.9" fill="none" opacity=".7"/>
      <rect x="-1.4" y="4" width="2.8" height="5" rx="1.4" fill="${C.tripeDark}"/></g>`).join('')}</g>`,

  // ---- seafood ----
  shrimp: `<g>${[[11, 20, -14], [20, 14, 6], [29, 20, 16]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-5 4 a 7 7 0 1 1 8 -8 q -3 1 -3 3 a 4.5 4.5 0 0 0 -5 5z" fill="${C.shrimp}"/>
      <path d="M-3.5 2.5 a 5 5 0 0 1 5 -5" stroke="${C.shrimpDark}" stroke-width="1.2" fill="none"/>
    </g>`).join('')}</g>`,
  shrimpGarlic: `<g>${[[11, 20, -14], [20, 14, 6], [29, 20, 16]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-5 4 a 7 7 0 1 1 8 -8 q -3 1 -3 3 a 4.5 4.5 0 0 0 -5 5z" fill="${C.shrimp}"/>
    </g>`).join('')}<circle cx="14" cy="24" r="1.6" fill="${C.pale}"/><circle cx="27" cy="9" r="1.4" fill="${C.pale}"/></g>`,
  squid: slices(C.fish, C.fishDark, { rx: 6.8, ry: 6.2, rim: C.ink }),
  calamari: slices(C.chili, C.chiliDark, { rx: 6.8, ry: 6.2, rim: '#7E1F12' }),
  fishFillet: fillet(C.fish, C.fishDark),
  fishSpicy: fillet(C.chili, C.chiliDark),
  salmon: `<g>${fillet(C.salmon, C.salmonPale, { flakes: false })}
    <path d="M7 14 q 11 -3 24 0 M8 18.5 q 10 -3 22 0 M10 23 q 9 -3 18 0" stroke="${C.salmonPale}"
      stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`,
  clamsWhite: shells(C.shell, C.shellDark, C.fish),
  clams: shells('#B9A88E', '#8A775F', C.fish),
  mussels: shells(C.shellDeep, C.shellDeepDark, C.shrimp),
  oysters: `<g>${[[12, 20, -14], [21, 14, 6], [29, 20.5, 15]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-8.5 1.5 q -0.5 -4 2 -5.5 q 1.5 -2.5 4 -1.5 q 2.5 -2 4.5 0.5
               q 3 0.5 2.5 4 q 1 3 -2 4.5 q -6 2.5 -11 -2z" fill="#9E9A8C"/>
      <path d="M-6 -1 q 2.5 -3.5 6 -2.5 q 3.5 1 4 4" stroke="#7C776A" stroke-width="1"
        fill="none" opacity=".8"/>
      <ellipse cx="0.4" cy="1.4" rx="4.4" ry="2.4" fill="#F0E6D2"/>
      <ellipse cx="-0.6" cy="0.8" rx="2" ry="1" fill="#fff" opacity=".45"/></g>`).join('')}</g>`,
  crawfish: `<g>${[[12, 20, -16], [21, 13.5, 4], [29, 20, 14]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <ellipse ry="5.5" rx="3.4" fill="${C.crab}"/>
      <path d="M-3 -5 l-3 -4 M3 -5 l3 -4" stroke="${C.crabDark}" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M0 5.5 l-2.5 3 M0 5.5 l2.5 3" stroke="${C.crabDark}" stroke-width="1.2" stroke-linecap="round"/>
    </g>`).join('')}</g>`,
  snowCrab: `<g>${[[10, 22, -30], [20, 16, -6], [30, 21, 24]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M0 10 q -3 -6 0 -11 q 3 -5 1 -8" stroke="${C.crab}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M0 10 q -3 -6 0 -11" stroke="${C.crabDark}" stroke-width="1.6" fill="none" opacity=".5"/>
    </g>`).join('')}</g>`,
  octopus: `<g>${[[12, 19, -10], [21, 14, 6], [29, 20, 14]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <circle cy="-2" r="4.4" fill="#B8848E"/>
      <path d="M-3 1 q -2 5 -4 6 M0 2 q 0 5 0 7 M3 1 q 2 5 4 6" stroke="#B8848E"
        stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="-1.4" cy="-3" r="0.9" fill="#F0D6D2" opacity=".7"/></g>`).join('')}</g>`,
  octopusSpicy: `<g>${[[12, 19, -10], [21, 14, 6], [29, 20, 14]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <circle cy="-2" r="4.4" fill="${C.chili}"/>
      <path d="M-3 1 q -2 5 -4 6 M0 2 q 0 5 0 7 M3 1 q 2 5 4 6" stroke="${C.chili}"
        stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`).join('')}</g>`,
  crabStick: `<g>${sticks(C.white, C.whiteDark, { n: 3, w: 5.6, len: 20, rot: -18 })}
    ${[0, 1, 2].map((i) => `<g transform="translate(${20 + (i - 1) * 8} 16) rotate(${-18 + i * 6})">
      <rect x="-2.8" y="-10" width="5.6" height="4" rx="2" fill="${C.crab}"/></g>`).join('')}</g>`,

  // ---- meat / sides ----
  beefBall: balls('#8A5A42', '#5E3A28'),
  fishBall: balls(C.white, C.whiteDark),
  lobsterBall: balls('#F0A07C', '#C97050'),
  roeBall: `<g>${balls('#E9C98E', '#C6A164')}
    <circle cx="10" cy="18" r="0.8" fill="${C.crab}"/><circle cx="22" cy="12" r="0.8" fill="${C.crab}"/>
    <circle cx="30" cy="18" r="0.8" fill="${C.crab}"/></g>`,
  quailEgg: `<g>${[[12, 20, 5], [20.5, 14, 5.4], [28.5, 20, 5]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy})"><ellipse rx="${r * 0.82}" ry="${r}" fill="${C.white}"/>
      <circle cx="-1.4" cy="-1.6" r="1.5" fill="#fff" opacity=".5"/>
      <circle cx="1.6" cy="1.4" r="0.7" fill="${C.brown}" opacity=".5"/></g>`).join('')}</g>`,
  dumpling: dumplings(C.pale, C.paleDark),
  gyoza: `<g>${dumplings('#E8DCC0', '#C3B491')}
    <path d="M6 24 q 14 4 28 0" stroke="${C.friedDark}" stroke-width="1.6" fill="none" opacity=".55"/></g>`,
  shumai: `<g>${[[12, 20, 0.92], [20.5, 14.5, 1], [29, 20, 0.92]].map(([cx, cy, s]) =>
    `<g transform="translate(${cx} ${cy}) scale(${s})">
      <path d="M-5.5 5 q -1 -10 5.5 -10 q 6.5 0 5.5 10z" fill="#EEE2B8"/>
      <ellipse cy="-4.6" rx="4.6" ry="2.2" fill="#C97E63"/>
      <circle cy="-5" r="1.2" fill="${C.orange}"/></g>`).join('')}</g>`,
  fishCake: slices(C.white, C.whiteDark, { rx: 7, ry: 6.4 })
    + `<g>${[[11, 20], [20, 15.5], [29, 20]].map(([cx, cy]) =>
      `<path d="M${cx} ${cy} m -3 0 a 3 3 0 1 1 3 3" stroke="#E48A93" stroke-width="1.6" fill="none"/>`).join('')}</g>`,
  roeBag: `<g>${[[12, 20, -10], [20.5, 14.5, 4], [29, 20, 12]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-5.5 3 q -1.5 -8 5.5 -8 q 7 0 5.5 8 q -5.5 3 -11 0z" fill="#EBD9A6"/>
      <path d="M-3 -4.5 q 3 -2 6 0" stroke="${C.friedDark}" stroke-width="1.1" fill="none"/>
      <circle cx="-1" cy="0" r="1" fill="${C.orange}"/><circle cx="2" cy="1" r="0.9" fill="${C.orange}"/></g>`).join('')}</g>`,
  tempura: fritters(C.fried, C.friedDark),

  // ---- soy bean ----
  tofuSoft: cubes(C.tofu, C.tofuDark, '#FAF2D8'),
  tofuFried: `<g>${cubes(C.fried, C.friedDark, '#EFC77E')}</g>`,
  tofuFrozen: `<g>${cubes('#EDE6CC', '#CFC5A4', '#F8F4E4')}
    <circle cx="12" cy="19" r="1" fill="#BDB294"/><circle cx="21" cy="14" r="1.1" fill="#BDB294"/>
    <circle cx="29" cy="20" r="1" fill="#BDB294"/></g>`,
  tofuSkin: `<g>${[0, 1, 2].map((i) => `<g transform="translate(${12 + i * 8} ${20 - i * 2.5}) rotate(${-10 + i * 9})">
    <path d="M-8 -4 q 4 -2 8 0 q 4 2 8 0 v8 q -4 2 -8 0 q -4 -2 -8 0z" fill="#E9CE93"/>
    <path d="M-8 0 q 4 -2 8 0 q 4 2 8 0" stroke="#C9A868" stroke-width="1" fill="none"/></g>`).join('')}</g>`,
  curdStick: sticks('#E7D9AE', '#C4B383', { n: 4, w: 3.6, len: 22, rot: -25 }),
  doughStick: `<g>${sticks(C.fried, C.friedDark, { n: 2, w: 6.4, len: 24, rot: -20 })}
    <path d="M14 8 q 2 8 0 16 M26 8 q -2 8 0 16" stroke="${C.friedDark}" stroke-width="1.2" fill="none" opacity=".55"/></g>`,

  // ---- vegetables ----
  spinach: leaves(C.green, C.greenDark, { blades: 6 }),
  crownDaisy: leaves(C.greenLight, C.green, { blades: 7, long: true }),
  watercress: leaves('#5FA24C', '#3F7A30', { blades: 7 }),
  bokChoy: `<g><path d="M20 27 q -6 -3 -6 -11 q 0 -8 6 -9 q 6 1 6 9 q 0 8 -6 11z" fill="${C.greenPale}"/>
    <path d="M20 27 q -5 -4 -5 -11 q 0 -7 5 -9" fill="none" stroke="${C.green}" stroke-width="3"/>
    <path d="M20 27 q 5 -4 5 -11 q 0 -7 -5 -9" fill="none" stroke="${C.greenDark}" stroke-width="3"/></g>`,
  lettuce: `<g><circle cx="20" cy="17" r="10" fill="${C.greenLight}"/>
    <path d="M12 14 q 6 4 8 -2 q 2 6 8 2" stroke="${C.greenDark}" stroke-width="1.6" fill="none" opacity=".7"/>
    <path d="M13 21 q 7 3 14 0" stroke="${C.green}" stroke-width="1.6" fill="none" opacity=".8"/>${SHEEN}</g>`,
  napa: `<g><path d="M20 28 q -8 -4 -8 -13 q 0 -8 8 -9 q 8 1 8 9 q 0 9 -8 13z" fill="#EFE9C8"/>
    <path d="M16 8 q -2 10 1 18 M24 8 q 2 10 -1 18" stroke="${C.greenPale}" stroke-width="2.4" fill="none"/>
    <path d="M20 7 v21" stroke="#DCD5AE" stroke-width="1.6"/></g>`,
  broccoli: `<g><rect x="18" y="17" width="4" height="9" rx="2" fill="${C.greenPale}"/>
    ${[[13, 14, 5], [20, 11, 6], [27, 14, 5], [16.5, 17, 4], [24, 17, 4]].map(([cx, cy, r]) =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.green}"/>`).join('')}
    ${[[12, 12], [20, 8], [27, 12], [17, 15], [24, 15]].map(([cx, cy]) =>
      `<circle cx="${cx}" cy="${cy}" r="2" fill="${C.greenLight}" opacity=".8"/>`).join('')}</g>`,
  shiitake: mushrooms(C.mush, C.mushDark, C.pale),
  kingMushroom: `<g>${[[12, 19], [20, 15], [28.5, 19.5]].map(([cx, cy]) =>
    `<g transform="translate(${cx} ${cy})">
      <rect x="-3.2" y="-6" width="6.4" height="13" rx="3" fill="#EDE4CC"/>
      <ellipse cy="-6" rx="4.2" ry="2.4" fill="${C.mush}"/></g>`).join('')}</g>`,
  beech: cluster(C.mush, '#EFE7D2', { n: 5, capR: 2.6, spread: 17, thick: 2.2 }),
  enoki: cluster('#F6F1E0', '#EFE8D4', { n: 8, capR: 1.5, spread: 19, thick: 1.3 }),
  blackFungus: `<g>${[[12, 20, -14], [21, 15, 6], [29, 20, 14]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-6 2 q -2 -7 5 -7 q 7 0 6 6 q -1 5 -5 4 q -4 -1 -6 -3z" fill="#3E3038"/>
      <path d="M-3 0 q 3 -3 6 -1" stroke="#5C4A52" stroke-width="1.2" fill="none"/></g>`).join('')}</g>`,
  seaweed: `<g>${[[12, 20], [20.5, 15], [29, 20]].map(([cx, cy]) =>
    `<g transform="translate(${cx} ${cy})">
      <path d="M-5 0 q 0 -5 5 -5 q 5 0 5 5 q 0 5 -5 5 q -5 0 -5 -5z" fill="none"
        stroke="#3E6B4B" stroke-width="3.2"/>
      <path d="M-5 0 q 3 -3 5 -1" stroke="#5C8F66" stroke-width="1.2" fill="none"/></g>`).join('')}</g>`,
  sprouts: `<g>${[0, 1, 2, 3, 4].map((i) => {
    const x = 9 + i * 5.5;
    return `<path d="M${x} 25 q ${i % 2 ? 3 : -3} -8 0 -13" stroke="${C.pale}" stroke-width="1.8"
      fill="none" stroke-linecap="round"/><circle cx="${x + (i % 2 ? 0.4 : -0.4)}" cy="11.5" r="1.9" fill="${C.greenPale}"/>`;
  }).join('')}</g>`,
  bamboo: sticks('#E4D9AF', '#BFB182', { n: 3, w: 6, len: 20, rot: -16 })
    + `<path d="M12 10 q 3 3 0 6 M20 8 q 3 3 0 6 M28 10 q 3 3 0 6" stroke="#BFB182" stroke-width="1" fill="none" opacity=".7"/>`,
  daikon: slices(C.white, C.whiteDark, { rx: 7.6, ry: 6.8, rim: '#FBF7EC' }),
  lotus: slices('#F1E8D2', '#CFC4A8', { rx: 7.8, ry: 7, holes: 5 }),
  taro: `<g>${slices('#F1EDF4', '#CFC6D8', { rx: 7.4, ry: 6.6 })}
    ${[[11, 20], [20, 15.5], [29, 20]].map(([cx, cy]) =>
      [[-2.6, -1.4], [1.8, -2.2], [-0.6, 1.8], [3, 1.4], [-3.4, 1.6]]
        .map(([dx, dy]) => `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="1.5" ry="0.85"
          transform="rotate(${dx * 8} ${cx + dx} ${cy + dy})" fill="${C.purple}" opacity=".55"/>`).join('')
    ).join('')}</g>`,
  potato: slices('#E9D9AE', '#C9B888', { rx: 7.4, ry: 6.6 }),
  sweetPotato: slices('#EFB472', '#C98B48', { rx: 7.4, ry: 6.6, rim: '#F5CE9C' }),
  pumpkin: `<g>${[[11, 20, -12], [20, 15, 4], [29, 20, 12]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-7 4 a 7 8 0 0 1 14 0z" fill="${C.orange}"/>
      <path d="M-7 4 h14" stroke="${C.greenDark}" stroke-width="1.6"/></g>`).join('')}</g>`,
  corn: `<g>${[[11, 20, 7], [20, 15.5, 7.4], [29, 20, 7]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy})">
      <circle r="${r}" fill="#F0CE63"/>
      ${Array.from({ length: 9 }, (_, k) => {
        const a = (k / 9) * Math.PI * 2;
        return `<circle cx="${(Math.cos(a) * r * 0.66).toFixed(2)}" cy="${(Math.sin(a) * r * 0.66).toFixed(2)}"
          r="${(r * 0.26).toFixed(2)}" fill="#F8E39B"/>`;
      }).join('')}
      <circle r="${r * 0.3}" fill="#E4B840"/>
    </g>`).join('')}</g>`,
  eggplant: slices('#EDE7DA', '#CFC7B6', { rx: 7.2, ry: 6.6 })
    + `<g>${[[11, 20, 7.2, 6.6], [20, 15.5, 7.2, 6.6], [29, 20, 7.2, 6.6]].map(([cx, cy, rx, ry]) =>
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.purpleDark}" stroke-width="2"/>`).join('')}</g>`,
  zucchini: slices('#E7EFCF', '#C4CFA6', { rx: 7, ry: 6.4, inner: '#F2F6E2' })
    + `<g>${[[11, 20], [20, 15.5], [29, 20]].map(([cx, cy]) =>
      `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="6.4" fill="none" stroke="${C.greenDark}" stroke-width="1.8"/>`).join('')}</g>`,
  pineapple: slices('#F2D46A', '#CFAF42', { rx: 7.4, ry: 6.8, holes: 1 }),
  pepper: `<g>${[[11, 20, -14], [20, 14.5, 5], [29, 20, 13]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M-2.6 -8 q 5 8 0 16 q -3 -8 0 -16z" fill="${C.green}"/>
      <path d="M-1.6 -6 q 3 6 0 11" stroke="${C.greenLight}" stroke-width="1.2" fill="none" opacity=".7"/></g>`).join('')}</g>`,
  onion: `<g>${[[11, 20, -9], [20, 15.5, 5], [29, 20, 11]].map(([cx, cy, rot]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${rot})">
      ${[1, 0.72, 0.46, 0.22].map((k, j) =>
        `<ellipse rx="${7.6 * k}" ry="${6.8 * k}" fill="none" stroke="${j % 2 ? '#D8CDBA' : '#F7F2E6'}" stroke-width="1.9"/>`).join('')}
    </g>`).join('')}</g>`,
  garlic: `<g>${[[12, 20, -12], [20.5, 14.5, 4], [29, 20, 12]].map(([cx, cy, r]) =>
    `<g transform="translate(${cx} ${cy}) rotate(${r})">
      <path d="M0 -6 q 5 4 4 8 q -1 4 -4 4 q -3 0 -4 -4 q -1 -4 4 -8z" fill="#F4EDDE"/>
      <path d="M0 -5 q 3 4 2.5 7" stroke="#D9CFBB" stroke-width="1.1" fill="none"/></g>`).join('')}</g>`,

  // ---- noodles ----
  vermicelli: nest('#F6F1E2', '#DCD5C2', { thick: 1.4, wobble: 2.4 }),
  udon: nest(C.noodle, C.noodleDark, { thick: 3.4, wobble: 3.2 }),
  meiFun: nest('#F2ECDC', '#D8D0BC', { thick: 1.7, wobble: 2.8 }),
  ramen: nest('#EFD79A', '#CBB273', { thick: 2.4, wobble: 4.2 }),
  sweetPotatoNoodle: nest('#D8CDB6', '#B4A88E', { thick: 2, wobble: 3.6 }),
  pho: nest('#F4EEDF', '#D6CEBB', { thick: 3, wobble: 2 }),
  riceCake: sticks(C.white, C.whiteDark, { n: 4, w: 4.6, len: 16, rot: -28 }),
  rice: `<g><path d="M8 16 q 12 -10 24 0 q -2 10 -12 10 q -10 0 -12 -10z" fill="#FAF6EC"/>
    ${[[14, 14], [20, 12], [26, 14], [17, 18], [23, 18]].map(([cx, cy]) =>
      `<ellipse cx="${cx}" cy="${cy}" rx="2.2" ry="1.4" fill="#fff" opacity=".7"/>`).join('')}</g>`,
};

// Which shape each menu item wears.
const ART_BY_ID = {
  bbq_bulgogi: 'bulgogi',
  bbq_spicy_bulgogi: 'bulgogiSpicy',
  bbq_brisket: 'brisket',
  bbq_beefbelly: 'beefBelly',
  bbq_tongue: 'tongue',
  bbq_steak: 'steak',
  bbq_fingerribs: 'ribs',
  bbq_shortrib: 'shortRib',
  bbq_hanger: 'hanger',
  bbq_flaptail: 'flapTail',

  bbq_chicken_bulgogi: 'chickenMarinated',
  bbq_spicy_chicken: 'chickenSpicy',
  bbq_garlic_chicken: 'chickenGarlic',
  bbq_spicy_pork: 'porkSpicy',
  bbq_porkbelly: 'porkBelly',
  bbq_spicy_porkbelly: 'porkBellySpicy',
  bbq_smoked_porkbelly: 'porkBellySmoked',
  bbq_kpot_porkbelly: 'porkBellyKpot',
  bbq_sliced_porkbelly: 'porkRoll',
  bbq_porkcheek: 'porkCheek',
  bbq_sausage: 'sausage',

  hp_pork: 'porkRoll',
  hp_porkbelly: 'porkBelly',
  hp_beefbelly: 'beefBelly',
  hp_brisket: 'brisket',
  hp_lamb: 'lamb',
  hp_chicken: 'chickenSlice',
  hp_ribeye: 'ribeye',
  hp_tongue: 'tongue',

  sf_squid: 'squid',
  sf_swai: 'fishFillet',
  sf_whiteclams: 'clamsWhite',
  sf_clams: 'clams',
  sf_crawfish: 'crawfish',
  sf_mussels: 'mussels',
  sf_calamari: 'calamari',
  sf_fishfillet: 'fishSpicy',
  sf_garlicshrimp: 'shrimpGarlic',
  sf_babyoctopus: 'octopus',
  sf_oysters: 'oysters',
  sf_prawns: 'shrimp',
  sf_snowcrab: 'snowCrab',
  sf_spicy_octopus: 'octopusSpicy',
  sf_salmon: 'salmon',

  ms_crabmeat: 'crabStick',
  ms_spam: 'spam',
  ms_minisausage: 'miniSausage',
  ms_shrimpdumpling: 'dumpling',
  ms_gyoza: 'gyoza',
  ms_tripe: 'tripe',
  ms_quaileggs: 'quailEgg',
  ms_tempura: 'tempura',
  ms_fishmeatballs: 'fishBall',
  ms_fishcakes: 'fishCake',
  ms_shumai: 'shumai',
  ms_fishroebags: 'roeBag',
  ms_duckfeet: 'duckFeet',
  ms_beefmeatballs: 'beefBall',
  ms_fishroeballs: 'roeBall',
  ms_lobsterballs: 'lobsterBall',

  sb_friedtofu: 'tofuFried',
  sb_softtofu: 'tofuSoft',
  sb_frozentofu: 'tofuFrozen',
  sb_tofuskin: 'tofuSkin',
  sb_beancurdstick: 'curdStick',
  sb_doughstick: 'doughStick',

  vg_spinach: 'spinach',
  vg_crowndaisy: 'crownDaisy',
  vg_watercress: 'watercress',
  vg_lettuce: 'lettuce',
  vg_broccoli: 'broccoli',
  vg_bokchoy: 'bokChoy',
  vg_shiitake: 'shiitake',
  vg_beech: 'beech',
  vg_napa: 'napa',
  vg_seaweedknots: 'seaweed',
  vg_beansprout: 'sprouts',
  vg_pumpkin: 'pumpkin',
  vg_daikon: 'daikon',
  vg_taro: 'taro',
  vg_enoki: 'enoki',
  vg_lotusroot: 'lotus',
  vg_eggplant: 'eggplant',
  vg_potato: 'potato',
  vg_bamboo: 'bamboo',
  vg_corn: 'corn',
  vg_kingmushroom: 'kingMushroom',
  vg_blackfungus: 'blackFungus',
  vg_sweetpotato: 'sweetPotato',
  vg_zucchini: 'zucchini',
  vg_pineapple: 'pineapple',
  vg_pepper: 'pepper',
  vg_onion: 'onion',
  vg_garlic: 'garlic',

  nd_vermicelli: 'vermicelli',
  nd_udon: 'udon',
  nd_meifun: 'meiFun',
  nd_ramen: 'ramen',
  nd_sweetpotato: 'sweetPotatoNoodle',
  nd_pho: 'pho',
  nd_ricecake: 'riceCake',
  nd_rice: 'rice',
};

export const VIEW_BOX = '0 0 40 32';
// Chips on the plate are sized by the sim's collision circle, so crop to where
// the food actually is and sit it on the bottom edge - otherwise the drawing
// floats inside its box and the pile looks spaced out.
export const CHIP_VIEW_BOX = '3 7 34 21';

export function artFor(id) {
  return SHAPES[ART_BY_ID[id]] || '';
}

// Full <svg> string, for the drag ghost and the physics chips - both build DOM
// by hand, outside React.
export function artSvg(id, { cls = 'food-art', chip = false } = {}) {
  const box = chip ? CHIP_VIEW_BOX : VIEW_BOX;
  const align = chip ? 'xMidYMax meet' : 'xMidYMid meet';
  return `<svg class="${cls}" viewBox="${box}" preserveAspectRatio="${align}"
    xmlns="http://www.w3.org/2000/svg">${artFor(id)}</svg>`;
}
