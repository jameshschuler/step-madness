import { SwipeableMatchups } from '@/components/SwipeableMatchups'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

const dashboardSearchSchema = z.object({
  week: z.number().catch(1), // Default to week 1 if missing or invalid
})

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(dashboardSearchSchema),
  // Pass the week from search params into our loader
  loaderDeps: ({ search: { week } }) => ({ week }),
  component: Dashboard,
})

function Dashboard() {
  const { week } = Route.useSearch()

  const data = {
    weekRange: 'Mar 1 — Mar 7, 2026',
    userSteps: 8450,
    opponentSteps: 9120,
    teamAvg: 10.2,
    oppTeamAvg: 11.5,
    leaderboard: [
      { name: 'YOU', steps: 8450 },
      { name: 'Alice', steps: 9800 },
      { name: 'Bob', steps: 7600 },
    ],
  }

  return (
    <div className="p-4 bg-[#fdfcf0] min-h-screen pb-24">
      {/* WEEK SELECTOR */}
      <nav className="flex flex-col items-center mb-8">
        <div className="flex bg-emerald-100/50 backdrop-blur-sm rounded-2xl p-1 w-full max-w-sm mb-4 border border-emerald-100/50">
          {[1, 2, 3, 4].map((w) => (
            <Link
              key={w}
              to="/"
              search={{ week: w }}
              className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all ${
                week === w
                  ? 'bg-white shadow-sm text-emerald-700'
                  : 'text-emerald-900/40 hover:text-emerald-700'
              }`}
            >
              WEEK {w}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-emerald-800/30 uppercase tracking-[0.2em]">
            Timeline
          </span>
          <div className="h-1 w-1 rounded-full bg-emerald-200" />
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
            {data.weekRange}
          </span>
        </div>
      </nav>

      <SwipeableMatchups data={data} />
    </div>
  )
}
