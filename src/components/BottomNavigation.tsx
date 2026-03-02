import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Trophy, Users, CalendarDays } from 'lucide-react'

export function BottomNavigation() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#fdfcf0]/90 backdrop-blur-lg border-t border-emerald-100 flex justify-around pb-8 pt-3 z-50 shadow-[0_-8px_20px_rgba(6,78,59,0.03)]">
      {/* Dashboard */}
      <NavItem to="/" icon={LayoutDashboard} label="Home" />

      {/* Leaderboard */}
      <NavItem to="/leaderboard" icon={Trophy} label="Ranks" />

      {/* Teams */}
      <NavItem to="/teams" icon={Users} label="Teams" />

      {/* Schedule */}
      <NavItem to="/schedule" icon={CalendarDays} label="Events" />
    </footer>
  )
}

function NavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: any
  label: string
}) {
  return (
    <Link
      to={to}
      activeProps={{ className: 'text-emerald-600' }}
      inactiveProps={{ className: 'text-emerald-900/40' }}
      className="flex flex-col items-center gap-1 group relative px-4"
    >
      {/* Active Indicator Dot */}
      <div className="absolute -top-1 w-1 h-1 rounded-full bg-emerald-500 opacity-0 [[data-status=active]_&]:opacity-100 transition-opacity" />

      <Icon
        size={22}
        strokeWidth={2.5}
        className="transition-transform group-active:scale-90"
      />
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">
        {label}
      </span>
    </Link>
  )
}
