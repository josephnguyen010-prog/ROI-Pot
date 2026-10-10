// The monster, the funnel and the bowl, as plain SVG strings like the food
// art. The bulldozer is an illustration, in assets/bulldozer.png.

// A round little mochi of a monster, facing out. It smiles while it waits; when
// food is on the way the smile swaps for an open mouth and its eyes turn to the
// bowl, and when the bowl is full it leans over and eats the lot in one bite.
// The stylesheet drives all of that through the named groups.
export const MONSTER_SVG = `<svg viewBox="0 0 80 74" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="71" rx="25" ry="2.6" fill="#000" opacity=".16"/>
  <g class="m-body">
    <path d="M21 24 Q15 9 25.5 11.5 Q29 17 28.5 23Z" fill="#E8B04B"/>
    <path d="M59 24 Q65 9 54.5 11.5 Q51 17 51.5 23Z" fill="#E8B04B"/>
    <ellipse cx="9" cy="50" rx="4.2" ry="6.5" fill="#E25F49" transform="rotate(22 9 50)"/>
    <ellipse cx="71" cy="50" rx="4.2" ry="6.5" fill="#E25F49" transform="rotate(-22 71 50)"/>
    <path d="M7 53 C7 30 21 15 40 15 C59 15 73 30 73 53 C73 64 65 69 54 69 H26 C15 69 7 64 7 53Z" fill="#F07560"/>
    <path d="M17 33 Q22 22 32 20" stroke="#fff" stroke-opacity=".5" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="26" cy="69" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="54" cy="69" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="19.5" cy="45" rx="5.6" ry="3.4" fill="#FFA191"/>
    <ellipse cx="60.5" cy="45" rx="5.6" ry="3.4" fill="#FFA191"/>
    <g class="m-eyes">
      <ellipse cx="29" cy="36" rx="5.2" ry="6.2" fill="#2A1A14"/>
      <ellipse cx="51" cy="36" rx="5.2" ry="6.2" fill="#2A1A14"/>
      <circle cx="30.9" cy="33.4" r="2" fill="#fff"/>
      <circle cx="52.9" cy="33.4" r="2" fill="#fff"/>
      <circle cx="27.6" cy="38.6" r="1" fill="#fff"/>
      <circle cx="49.6" cy="38.6" r="1" fill="#fff"/>
    </g>
    <path class="m-smile" d="M35 46 Q40 50.5 45 46" stroke="#2A1A14" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <g class="m-mouth">
      <ellipse cx="40" cy="50" rx="9.5" ry="8.5" fill="#5A1E16"/>
      <ellipse cx="40" cy="55" rx="5.8" ry="3.1" fill="#FF8C7E"/>
      <path d="M34.2 42.8 L35.9 46 L37.6 42.4Z M42.4 42.4 L44.1 46 L45.8 42.8Z" fill="#FFF8F0"/>
    </g>
  </g>
</svg>`;

// Brushed steel, wide at the top to catch whatever comes off the plate,
// narrowing to the width of the slide.
export const FUNNEL_SVG = `<svg viewBox="0 0 48 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 6 H47 L31 40 V60 H17 V40Z" fill="#B9C1C5"/>
  <path d="M1 6 H47 L31 40 V60 H17 V40Z" fill="none" stroke="#7D868B" stroke-width="1.4"/>
  <path d="M6 9 L20 39 V58" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none"/>
  <ellipse cx="24" cy="6" rx="23" ry="4.2" fill="#8D969B"/>
  <ellipse cx="24" cy="6" rx="18" ry="2.6" fill="#3A3330"/>
</svg>`;

// A big pet bowl, seen a little from above: the food lands on the pale glaze
// inside the rim and heaps up there until the monster eats it. Pale, because
// most of what lands in it is red-brown meat.
export const BOWL_SVG = `<svg viewBox="0 0 64 34" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="32" cy="31" rx="27" ry="2.6" fill="#000" opacity=".2"/>
  <path d="M3 9 L9 28 Q10 31 14 31 H50 Q54 31 55 28 L61 9Z" fill="#C2361B"/>
  <path d="M6 18 H58 L56.4 23 H7.6Z" fill="#E8B04B"/>
  <path d="M9 11 L13 27" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="32" cy="9" rx="29.5" ry="6.5" fill="#E0573C"/>
  <ellipse cx="32" cy="9.4" rx="25" ry="4.6" fill="#F3E6D6"/>
  <ellipse cx="32" cy="10.4" rx="20" ry="3" fill="#E2D0BB"/>
</svg>`;
