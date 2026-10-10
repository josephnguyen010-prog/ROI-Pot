// The monster and the funnel, as plain SVG strings like the food art. The
// bulldozer is an illustration, in assets/bulldozer.png.

// A round little mochi of a monster, turned a little to its left (our right)
// toward the pipe, which comes in sideways at the mouth on that side of its
// face. Idle, its lips are pursed round the pipe's end; when food is coming
// the mouth opens and the eyes slide toward the pipe. The stylesheet drives
// that through the named groups.
export const MONSTER_SVG = `<svg viewBox="0 0 80 74" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="71" rx="25" ry="2.6" fill="#000" opacity=".16"/>
  <g class="m-body">
    <path d="M24 24 Q19 9 29.5 11.5 Q33 17 32.5 23Z" fill="#E8B04B"/>
    <path d="M59 22 Q66 8 56.5 10.5 Q53.5 16 54.5 22Z" fill="#E8B04B"/>
    <ellipse cx="9" cy="50" rx="4.2" ry="6.5" fill="#E25F49" transform="rotate(22 9 50)"/>
    <path d="M7 53 C7 30 21 15 40 15 C59 15 73 30 73 53 C73 64 65 69 54 69 H26 C15 69 7 64 7 53Z" fill="#F07560"/>
    <path d="M17 33 Q22 22 32 20" stroke="#fff" stroke-opacity=".5" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <ellipse cx="26" cy="69" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="54" cy="69" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="29" cy="46" rx="6" ry="3.6" fill="#FFA191"/>
    <ellipse cx="58" cy="44.5" rx="3.6" ry="2.8" fill="#FFA191"/>
    <g class="m-eyes">
      <ellipse cx="39" cy="35" rx="5.4" ry="6.4" fill="#2A1A14"/>
      <ellipse cx="55.5" cy="34" rx="4.4" ry="5.8" fill="#2A1A14"/>
      <circle cx="41" cy="32.3" r="2.1" fill="#fff"/>
      <circle cx="57" cy="31.6" r="1.7" fill="#fff"/>
      <circle cx="37.6" cy="37.8" r="1" fill="#fff"/>
    </g>
    <g class="m-lips">
      <ellipse cx="69" cy="50" rx="7" ry="9.5" fill="#C24A36"/>
      <ellipse cx="70" cy="50" rx="4.2" ry="6.6" fill="#8E2E21"/>
    </g>
    <g class="m-mouth">
      <ellipse cx="67" cy="50" rx="10" ry="12" fill="#C24A36"/>
      <ellipse cx="67.5" cy="50.5" rx="7.6" ry="9.4" fill="#4A1712"/>
      <ellipse cx="66" cy="55.5" rx="4.6" ry="2.6" fill="#FF8C7E"/>
      <path d="M61.5 41.6 L63 45 L64.6 41.2Z" fill="#FFF8F0"/>
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
