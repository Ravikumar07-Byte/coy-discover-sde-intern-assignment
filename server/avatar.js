// Generates a local placeholder "photo" (SVG) so the app needs no external image host.
const GRADS = [
  ['#FF7A9C', '#6C4DFF'], ['#FFB86B', '#FF4D7E'], ['#4DD6C1', '#3B5BFF'], ['#B58BFF', '#FF6FB1'],
  ['#6BD0FF', '#7A5CFF'], ['#FFD36B', '#FF7A59'], ['#7DE3A6', '#2BA8C9'], ['#FF9AD5', '#8A6BFF'],
];

function avatarSvg(id, name) {
  const [a, b] = GRADS[id % GRADS.length];
  const initial = String(name || '?').charAt(0).toUpperCase();
  const cx = 120 + ((id * 53) % 160);
  const cy = 90 + ((id * 37) % 120);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="400" height="520" fill="url(#g)"/>
<circle cx="${cx}" cy="${cy}" r="150" fill="#fff" opacity=".12"/>
<circle cx="${400 - cx}" cy="${520 - cy / 2}" r="110" fill="#000" opacity=".08"/>
<circle cx="200" cy="215" r="64" fill="#fff" opacity=".35"/>
<path d="M60 520c0-95 63-150 140-150s140 55 140 150z" fill="#fff" opacity=".35"/>
<text x="200" y="240" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="72" font-weight="700" fill="#fff">${initial}</text>
</svg>`;
}

module.exports = { avatarSvg };
