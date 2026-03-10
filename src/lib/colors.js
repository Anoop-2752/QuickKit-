// Shared category color tokens used across CategoryCard, ToolCard, CategoryPage, ToolPage.
// All class strings are written out fully so Tailwind's scanner picks them up.
export const colorMap = {
  blue: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400',
    hoverBorder: 'hover:border-blue-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.07)]',
    hoverIcon: 'group-hover:text-blue-300',
  },
  purple: {
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400',
    hoverBorder: 'hover:border-purple-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.07)]',
    hoverIcon: 'group-hover:text-purple-300',
  },
  green: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.07)]',
    hoverIcon: 'group-hover:text-emerald-300',
  },
  orange: {
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    badge: 'bg-orange-500/10 text-orange-400',
    hoverBorder: 'hover:border-orange-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.07)]',
    hoverIcon: 'group-hover:text-orange-300',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400',
    hoverBorder: 'hover:border-rose-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.07)]',
    hoverIcon: 'group-hover:text-rose-300',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400',
    hoverBorder: 'hover:border-amber-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.07)]',
    hoverIcon: 'group-hover:text-amber-300',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    badge: 'bg-violet-500/10 text-violet-400',
    hoverBorder: 'hover:border-violet-500/40',
    hoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.07)]',
    hoverGlowSm: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.07)]',
    hoverIcon: 'group-hover:text-violet-300',
  },
}

export function getColors(color) {
  return colorMap[color] ?? colorMap.blue
}
