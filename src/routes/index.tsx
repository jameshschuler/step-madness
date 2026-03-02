import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { getDashboardData } from '@/services/dashboard'
import { Matchups } from '@/components/Matchups'

const dashboardSearchSchema = z.object({
  week: z.number().catch(1),
})

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(dashboardSearchSchema),
  loaderDeps: ({ search: { week } }) => ({ week }),
  loader: ({ deps: { week } }) => getDashboardData({ data: week }),
  component: Dashboard,
})

function Dashboard() {
  const { week } = Route.useSearch()
  const matchupsData = Route.useLoaderData()

  const weekRange = matchupsData[0]
    ? (() => {
        const start = new Date(matchupsData[0].startDate)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)

        const options: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC', // Keep that UTC fix from earlier!
        }

        return `${start.toLocaleDateString('en-US', options)} — ${end.toLocaleDateString('en-US', options)}`
      })()
    : 'No games this week'

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
            {weekRange}
          </span>
        </div>
      </nav>

      {matchupsData.length > 0 ? (
        <Matchups matchups={matchupsData} />
      ) : (
        <div className="text-center py-20 text-emerald-900/40 font-bold uppercase italic">
          No matchups found
        </div>
      )}
    </div>
  )
}
