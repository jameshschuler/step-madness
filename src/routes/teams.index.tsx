import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { teams, teamPlayers, players } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Users, Flower2 } from 'lucide-react'
import { iconMap } from '@/lib/constants'

export const getTeamsWithPlayers = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Fetch teams and manually join players (or use Drizzle Relational API)
    const result = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        teamAvatar: teams.avatar,
        playerId: players.id,
        playerName: players.name,
        playerAvatar: players.avatar,
      })
      .from(teams)
      .leftJoin(teamPlayers, eq(teams.id, teamPlayers.teamId))
      .leftJoin(players, eq(teamPlayers.playerId, players.id))

    // Group the flat rows into a nested structure
    const groupedTeams = result.reduce(
      (acc, row) => {
        const { teamId, teamName, teamAvatar, ...player } = row
        if (!acc[teamId]) {
          acc[teamId] = {
            id: teamId,
            name: teamName,
            avatar: teamAvatar,
            players: [],
          }
        }
        if (player.playerId) {
          acc[teamId].players.push({
            id: player.playerId,
            name: player.playerName,
            avatar: player.playerAvatar,
          })
        }
        return acc
      },
      {} as Record<number, any>,
    )

    return Object.values(groupedTeams)
  },
)

export const Route = createFileRoute('/teams/')({
  loader: () => getTeamsWithPlayers(),
  component: TeamsTab,
})

export function TeamsTab() {
  const teamsData = useLoaderData({ from: '/teams/' })

  return (
    <div className="p-4 pb-24 space-y-6 bg-[#fdfcf0] min-h-screen">
      {' '}
      {/* Soft cream background */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-900">
            Teams
          </h1>
          <p className="text-xs text-emerald-700/60 font-bold uppercase tracking-widest">
            March Step Challenge
          </p>
        </div>
        <Flower2
          className="text-pink-400 h-8 w-8 animate-pulse"
          strokeWidth={1.5}
        />
      </header>
      <div className="space-y-5">
        {teamsData.map((team) => {
          const config = iconMap[team.avatar as keyof typeof iconMap] || {
            icon: Users,
            color: 'bg-slate-100 text-slate-500',
          }
          const IconComponent = config.icon

          return (
            <Card
              key={team.id}
              className="overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl ring-1 ring-emerald-100"
            >
              {/* Spring Accent Bar */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-300 via-yellow-200 to-pink-300" />

              <CardHeader className="bg-white py-4 px-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center h-12 w-12 rounded-2xl ${config.color} shadow-sm`}
                    >
                      <IconComponent size={28} strokeWidth={2} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-emerald-950">
                        {team.name}
                      </CardTitle>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">
                        Team Roster
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 bg-white/50">
                <div className="divide-y divide-emerald-50/50">
                  {team.players.map((player: any) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-emerald-50">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {player.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-emerald-900/80">
                          {player.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
