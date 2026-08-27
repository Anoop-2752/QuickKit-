// Category colour tokens.
//
// The site previously gave each category its own hue, which meant the brand
// colour dissolved as soon as you went one level below the homepage. Every
// category now shares the single accent from src/index.css.
//
// getColors() keeps its old signature so callers don't need to change, and the
// map is kept keyed so a per-category accent can be reintroduced by editing
// this file alone.
const accent = {
  iconBg: 'bg-[var(--accent-soft)]',
  iconColor: 'text-[var(--accent)]',
  badge: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  hoverBorder: 'hover:border-[var(--line-strong)]',
  hoverGlow: 'hover:shadow-[0_2px_4px_rgba(20,20,15,0.04),0_12px_28px_rgba(20,20,15,0.06)]',
  hoverGlowSm: 'hover:shadow-[0_1px_3px_rgba(20,20,15,0.04),0_8px_20px_rgba(20,20,15,0.05)]',
  hoverIcon: 'group-hover:text-[var(--accent-hover)]',
}

export const colorMap = {
  blue: accent,
  purple: accent,
  green: accent,
  orange: accent,
  rose: accent,
  amber: accent,
  violet: accent,
  cyan: accent,
  teal: accent,
}

export function getColors(color) {
  return colorMap[color] ?? accent
}
