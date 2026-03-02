import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { matchups, teams } from '@/db/schema'
import { eq, aliasedTable } from 'drizzle-orm'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, HelpCircle, Swords } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { iconMap } from '@/lib/constants'

export const getMatchups = createServerFn({ method: 'GET' }).handler(
  async () => {
    const team1 = aliasedTable(teams, 'team1')
    const team2 = aliasedTable(teams, 'team2')

    return await db
      .select({
        id: matchups.id,
        startDate: matchups.startDate,
        weekNumber: matchups.weekNumber,
        roundNumber: matchups.roundNumber,
        isPlayoff: matchups.isPlayoff,
        team1: {
          name: team1.name,
          avatar: team1.avatar,
        },
        team2: {
          name: team2.name,
          avatar: team2.avatar,
        },
      })
      .from(matchups)
      .leftJoin(team1, eq(matchups.team1Id, team1.id))
      .leftJoin(team2, eq(matchups.team2Id, team2.id))
      .orderBy(matchups.startDate)
  },
)

export const Route = createFileRoute('/schedule/')({
  loader: () => getMatchups(),
  component: SchedulePage,
})

function SchedulePage() {
  const games = useLoaderData({ from: '/schedule/' })

  return (
    <div className="p-4 pb-24 space-y-8 bg-[#fdfcf0] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-900 italic">
            SCHEDULE
          </h1>
          <p className="text-[10px] text-emerald-700/60 font-bold uppercase tracking-[0.3em]">
            Road to Victory
          </p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm ring-1 ring-emerald-100">
          <Swords size={20} className="text-emerald-600" />
        </div>
      </header>

      <div className="space-y-10">
        {games.map((game) => (
          <div key={game.id} className="group">
            {/* Round Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                {game.isPlayoff ? (
                  <Badge className="bg-orange-500 text-white border-none text-[10px] font-black px-2 py-0">
                    PLAYOFFS
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 text-[10px] font-black px-2 py-0"
                  >
                    WEEK {game.weekNumber}
                  </Badge>
                )}
                <span className="text-xs font-black text-emerald-900 uppercase">
                  {game.roundNumber ? `Round ${game.roundNumber}` : ''}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest">
                {new Date(game.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC', // This is the magic line
                })}
              </span>
            </div>

            <Card
              className={`overflow-hidden border-none shadow-sm rounded-[2.5rem] bg-white ring-1 transition-all ${game.isPlayoff ? 'ring-orange-200 shadow-orange-100 shadow-lg' : 'ring-emerald-100'}`}
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-8 relative">
                  {/* Decorative Background for Playoff Matchups */}
                  {game.isPlayoff && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                      <Trophy size={120} />
                    </div>
                  )}

                  <TeamSlot team={game.team1} />

                  <div className="flex flex-col items-center gap-2 z-10">
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full border text-[10px] font-black ${game.isPlayoff ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                    >
                      VS
                    </div>
                  </div>

                  <TeamSlot team={game.team2} />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamSlot({ team }: { team: any }) {
  // If team data is missing, use TBD configuration
  const config = team?.avatar
    ? iconMap[team.avatar as keyof typeof iconMap]
    : null
  const IconComponent = config?.icon || HelpCircle

  return (
    <div className="flex flex-col items-center gap-3 w-24">
      <div
        className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-sm ring-4 ring-white transition-transform group-hover:scale-105 ${config ? config.color : 'bg-slate-100 text-slate-400'}`}
      >
        <IconComponent size={32} strokeWidth={2} />
      </div>
      <span
        className={`text-[11px] font-black text-center leading-tight uppercase tracking-tight ${team ? 'text-emerald-950' : 'text-slate-400 italic'}`}
      >
        {team?.name || 'TBD'}
      </span>
    </div>
  )
}
