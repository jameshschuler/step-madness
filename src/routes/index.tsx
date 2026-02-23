import { SwipeableMatchups } from '@/components/SwipeableMatchups'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'

const dashboardSearchSchema = z.object({
  week: z.number().catch(1), // Default to week 1 if missing or invalid
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
    <>
      {/* WEEK SELECTOR */}
      <nav className="flex flex-col items-center mb-8 px-4">
        {/* 4-Week Toggle */}
        <div className="flex bg-gray-200 rounded-xl p-1 w-full max-w-sm mb-3">
          {[1, 2, 3, 4].map((w) => (
            <Link
              key={w}
              to="/"
              search={{ week: w }}
              className={`flex-1 py-2 text-center text-sm rounded-lg transition-all ${
                week === w
                  ? 'bg-white shadow-sm font-bold text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              W{w}
            </Link>
          ))}
        </div>

        {/* Contextual Date Label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {`Week ${week}`}
          </span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-500 font-medium">
            {data.weekRange}
          </span>
        </div>
      </nav>

      <SwipeableMatchups data={data} />
    </>
  )
}

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(dashboardSearchSchema),
  // Pass the week from search params into our loader
  loaderDeps: ({ search: { week } }) => ({ week }),
  component: Dashboard,
})
