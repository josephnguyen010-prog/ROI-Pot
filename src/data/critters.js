// The monster and the funnel, as plain SVG strings like the food art. The
// bulldozer is an illustration, in assets/bulldozer.png.

// A round little mochi of a monster with its mouth on top of its head, so the
// slide can feed straight into it. Closed, the mouth is a smile across the top;
// when food is coming it opens round the end of the slide and the eyes turn up
// to watch it arrive. The stylesheet drives that through the named groups.
export const MONSTER_SVG = `<svg viewBox="0 0 80 78" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="75" rx="25" ry="2.6" fill="#000" opacity=".16"/>
  <g class="m-body">
    <path d="M10 33 Q1 20 13 21 Q16 26 15.5 33Z" fill="#E8B04B"/>
    <path d="M70 33 Q79 20 67 21 Q64 26 64.5 33Z" fill="#E8B04B"/>
    <ellipse cx="9" cy="55" rx="4.2" ry="6.5" fill="#E25F49" transform="rotate(22 9 55)"/>
    <ellipse cx="71" cy="55" rx="4.2" ry="6.5" fill="#E25F49" transform="rotate(-22 71 55)"/>
    <path d="M7 57 C7 35 20 18 40 18 C60 18 73 35 73 57 C73 68 65 73 54 73 H26 C15 73 7 68 7 57Z" fill="#F07560"/>
    <path d="M15 42 Q18 33 25 29" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="26" cy="73" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="54" cy="73" rx="7.5" ry="3.2" fill="#D4553F"/>
    <ellipse cx="19.5" cy="51" rx="5.6" ry="3.4" fill="#FFA191"/>
    <ellipse cx="60.5" cy="51" rx="5.6" ry="3.4" fill="#FFA191"/>
    <g class="m-eyes">
      <ellipse cx="30" cy="42" rx="5.2" ry="6.2" fill="#2A1A14"/>
      <ellipse cx="50" cy="42" rx="5.2" ry="6.2" fill="#2A1A14"/>
      <circle cx="31.6" cy="38.8" r="2" fill="#fff"/>
      <circle cx="51.6" cy="38.8" r="2" fill="#fff"/>
      <circle cx="28.6" cy="44.6" r="1" fill="#fff"/>
      <circle cx="48.6" cy="44.6" r="1" fill="#fff"/>
    </g>
    <path class="m-smile" d="M27 22 Q40 27 53 22" stroke="#B9452F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g class="m-mouth">
      <ellipse cx="40" cy="21.5" rx="17" ry="7.2" fill="#C24A36"/>
      <ellipse cx="40" cy="22.2" rx="14" ry="5.3" fill="#4A1712"/>
      <ellipse cx="40" cy="24.4" rx="7" ry="2.2" fill="#FF8C7E"/>
      <path d="M29.5 18.6 L31.2 21.8 L32.9 18.2Z M47.1 18.2 L48.8 21.8 L50.5 18.6Z" fill="#FFF8F0"/>
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
