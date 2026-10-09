// The two characters that keep the plate clear. Plain SVG strings like the
// food art: the monster is rendered by React, the dozer is built by the physics
// hook outside React, and both want the same markup.

// Faces left, toward the plate. The mouth and eyes are their own groups so the
// stylesheet can open, chomp and blink them.
export const MONSTER_SVG = `<svg viewBox="0 0 80 78" xmlns="http://www.w3.org/2000/svg">
  <path d="M29 15 L24 2 L38 11Z" fill="#E0AC5C"/>
  <path d="M55 12 L61 0 L65 16Z" fill="#E0AC5C"/>
  <ellipse cx="31" cy="74" rx="9" ry="4" fill="#9E3119"/>
  <ellipse cx="58" cy="74" rx="9" ry="4" fill="#9E3119"/>
  <path d="M12 46 C12 22 27 9 47 9 C66 9 77 25 77 45 C77 64 65 75 45 75 C25 75 12 66 12 46Z" fill="#D2492C"/>
  <ellipse cx="53" cy="57" rx="16" ry="12" fill="#EE8462" opacity=".5"/>
  <path d="M68 40 Q75 36 77 44" stroke="#9E3119" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="eyes">
    <circle cx="35" cy="29" r="8.5" fill="#fff"/>
    <circle cx="53" cy="27" r="7" fill="#fff"/>
    <circle cx="31.5" cy="30" r="3.8" fill="#1C1612"/>
    <circle cx="50" cy="28" r="3.3" fill="#1C1612"/>
    <circle cx="30.3" cy="28.6" r="1.2" fill="#fff"/>
  </g>
  <g class="mouth">
    <path d="M6 43 Q25 36 44 44 Q41 63 23 63 Q9 59 6 43Z" fill="#3A1410"/>
    <ellipse cx="23" cy="57" rx="9" ry="3.6" fill="#E2665A"/>
    <polygon points="11,42 14,48.5 17,41 20,48.5 23,40.5 26,48.5 29,40.5 32,48 35,41.5 38,47 41,43.5" fill="#FFF7EE"/>
  </g>
</svg>`;

// Faces right, blade first.
export const DOZER_SVG = `<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="27" width="42" height="11" rx="5.5" fill="#2A221C"/>
  <g fill="#6B5D50">
    <circle cx="9.5" cy="32.5" r="3.4"/><circle cx="18.5" cy="32.5" r="3.4"/>
    <circle cx="27.5" cy="32.5" r="3.4"/><circle cx="36.5" cy="32.5" r="3.4"/>
  </g>
  <g class="dozer-body">
    <rect x="7" y="14" width="32" height="14" rx="2.5" fill="#E8A93A"/>
    <path d="M11 14 V4 H27 L30.5 14Z" fill="#E8A93A"/>
    <path d="M14 6.5 H25.6 L27.6 13 H14Z" fill="#CFE6EE"/>
    <rect x="33" y="6" width="3" height="9" rx="1" fill="#2A221C"/>
    <rect x="7" y="21" width="32" height="2.5" fill="#C98A24"/>
  </g>
  <rect x="38" y="19" width="13" height="3.6" fill="#6B5D50"/>
  <path d="M50 7 Q57.5 22 50 38.5 H55.5 Q62 22 55.5 7Z" fill="#A7B0B5"/>
  <path d="M50 7 Q57.5 22 50 38.5" stroke="#737C81" stroke-width="1.6" fill="none"/>
</svg>`;
