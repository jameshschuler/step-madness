import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Trophy, Users, CalendarDays } from 'lucide-react'

export function BottomNavigation() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around pb-6 pt-2 z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      {/* Dashboard */}
      <Link
        to="/"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="flex flex-col items-center gap-1 transition-colors"
      >
        <LayoutDashboard size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Home
        </span>
      </Link>

      {/* Leaderboard */}
      <Link
        to="/leaderboard"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="flex flex-col items-center gap-1 transition-colors"
      >
        <Trophy size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Ranks
        </span>
      </Link>

      {/* Teams */}
      <Link
        to="/teams"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="flex flex-col items-center gap-1 transition-colors"
      >
        <Users size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Teams
        </span>
      </Link>

      {/* Schedule */}
      <Link
        to="/schedule"
        activeProps={{ className: 'text-blue-600' }}
        inactiveProps={{ className: 'text-gray-400' }}
        className="flex flex-col items-center gap-1 transition-colors"
      >
        <CalendarDays size={20} strokeWidth={2.5} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          Events
        </span>
      </Link>
    </footer>
  )
}
