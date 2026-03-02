import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Medal, Target, Zap } from 'lucide-react'
import { iconMap } from '@/lib/constants'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { teams, players, teamPlayers, dailyPerformance } from '@/db/schema'
import { eq, sql, desc } from 'drizzle-orm'

export const getIndividualLeaderboard = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db
    .select({
      id: players.id,
      name: players.name,
      avatar: players.avatar,
      teamName: teams.name,
      teamAvatar: teams.avatar,
      totalSteps: sql<number>`sum(${dailyPerformance.stepCount})`,
    })
    .from(players)
    .leftJoin(teamPlayers, eq(players.id, teamPlayers.playerId))
    .leftJoin(teams, eq(teamPlayers.teamId, teams.id))
    .leftJoin(dailyPerformance, eq(players.id, dailyPerformance.playerId))
    .groupBy(players.id)
    .orderBy(desc(sql`sum(${dailyPerformance.stepCount})`))
    .limit(50) // Keep it performant
})

export const getTeamLeaderboard = createServerFn({ method: 'GET' }).handler(
  async () => {
    const result = await db
      .select({
        id: teams.id,
        name: teams.name,
        avatar: teams.avatar,
        // Calculate the average steps across all players in the team
        dailyAvg: sql<number>`round(avg(${dailyPerformance.stepCount}), 1)`,
        totalSteps: sql<number>`sum(${dailyPerformance.stepCount})`,
        playerCount: sql<number>`count(distinct ${players.id})`,
      })
      .from(teams)
      .leftJoin(teamPlayers, eq(teams.id, teamPlayers.teamId))
      .leftJoin(players, eq(teamPlayers.playerId, players.id))
      .leftJoin(dailyPerformance, eq(players.id, dailyPerformance.playerId))
      .groupBy(teams.id)
      .orderBy(sql`avg(${dailyPerformance.stepCount}) desc`)

    return result
  },
)

export function LeaderboardTab() {
  const { individualStats, teamStats } = useLoaderData({
    from: '/leaderboard/',
  })

  return (
    <div className="p-4 pb-24 space-y-6 bg-[#fdfcf0] min-h-screen">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-emerald-900 italic">
          RANKINGS
        </h1>
        <p className="text-[10px] text-emerald-700/60 font-bold uppercase tracking-[0.3em]">
          Spring Standings
        </p>
      </header>

      <Tabs defaultValue="individuals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-emerald-100/50 p-1 rounded-2xl border border-emerald-100/50">
          <TabsTrigger
            value="individuals"
            className="rounded-xl font-black text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-700"
          >
            PLAYERS
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className="rounded-xl font-black text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-700"
          >
            TEAMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individuals" className="mt-6 space-y-3">
          {individualStats.map((player, index) => {
            const rank = index + 1
            const teamConfig =
              iconMap[player.teamAvatar as keyof typeof iconMap]
            const TeamIcon = teamConfig?.icon

            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 rounded-3xl bg-white shadow-sm ring-1 ring-emerald-100/50 transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Display */}
                  <div className="w-6 text-center">
                    {rank === 1 ? (
                      <Trophy size={18} className="text-amber-400" />
                    ) : rank === 2 ? (
                      <Medal size={18} className="text-slate-300" />
                    ) : rank === 3 ? (
                      <Medal size={18} className="text-orange-300" />
                    ) : (
                      <span className="text-xs font-black text-emerald-900/20">
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar with Team Badge */}
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-emerald-50 shadow-sm">
                      <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold">
                        {player.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {TeamIcon && (
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${teamConfig.color}`}
                      >
                        <TeamIcon size={8} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div>
                    <p className="text-sm font-black tracking-tight text-emerald-950">
                      {player.name}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/60">
                      {player.teamName || 'Free Agent'}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-black tracking-tighter text-emerald-950">
                    {(player.totalSteps || 0).toLocaleString()}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-emerald-700/40">
                    Steps
                  </div>
                </div>
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 mt-6">
          {teamStats.map((team, index) => (
            <TeamRankCard
              key={team.id}
              name={team.name}
              avg={team.dailyAvg || 0}
              total={team.totalSteps || 0}
              rank={index + 1}
              avatar={team.avatar}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TeamRankCard({ name, avg, rank, avatar }: any) {
  const config = iconMap[avatar as keyof typeof iconMap] || {
    icon: Target,
    color: 'bg-emerald-50 text-emerald-600',
  }
  const Icon = config.icon

  return (
    <div className="relative overflow-hidden p-6 rounded-[2.5rem] bg-white ring-1 ring-emerald-100 shadow-sm transition-transform active:scale-[0.98]">
      {/* Visual Rank Badge */}
      <div className="absolute -right-2 -top-2 h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center opacity-50">
        <span className="text-4xl font-black text-emerald-100">#{rank}</span>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-2xl ${config.color} flex items-center justify-center shadow-sm`}
          >
            <Icon size={30} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-black text-xl text-emerald-950 uppercase tracking-tighter">
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap size={10} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] text-emerald-700/60 font-bold uppercase">
                Active Streak
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-emerald-950 tracking-tighter">
            {avg}k
          </p>
          <p className="text-[9px] text-emerald-700 font-black uppercase tracking-widest">
            Team Avg
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/leaderboard/')({
  loader: async () => {
    const [teamStats, individualStats] = await Promise.all([
      getTeamLeaderboard(),
      getIndividualLeaderboard(),
    ])
    return { teamStats, individualStats }
  },
  component: LeaderboardTab,
})
