import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Medal, Target } from 'lucide-react'
import { iconMap } from '@/lib/constants'
import {
  getIndividualLeaderboard,
  getTeamLeaderboard,
} from '@/services/leaderboard'

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

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-emerald-100/50 p-1 rounded-2xl border border-emerald-100/50">
          <TabsTrigger
            value="teams"
            className="rounded-xl font-black text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-700"
          >
            TEAMS
          </TabsTrigger>
          <TabsTrigger
            value="individuals"
            className="rounded-xl font-black text-xs data-[state=active]:bg-white data-[state=active]:text-emerald-700"
          >
            PLAYERS
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
                      Team {player.teamName || 'Free Agent'}
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
          {teamStats.map((team) => (
            <TeamRankCard
              key={team.id}
              name={team.name}
              avg={team.dailyAvg || 0}
              totalSteps={team.totalSteps || 0}
              totalPoints={team.totalPoints || 0}
              wins={team.wins ?? 0}
              losses={team.losses ?? 0}
              avatar={team.avatar ?? ''}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TeamRankCardProps {
  name: string
  avg: number
  totalSteps: number
  totalPoints: number
  wins: number
  losses: number
  avatar: string
}

function TeamRankCard({
  name,
  avg,
  totalSteps,
  totalPoints,
  wins,
  losses,
  avatar,
}: TeamRankCardProps) {
  const config = iconMap[avatar as keyof typeof iconMap] || {
    icon: Target,
    color: 'bg-emerald-50 text-emerald-600',
  }
  const Icon = config.icon

  return (
    <div className="relative overflow-hidden p-6 rounded-[3rem] bg-white ring-1 ring-emerald-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between relative z-10 mb-6">
        {/* Team Identity */}
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-2xl ${config.color} flex items-center justify-center shadow-sm`}
          >
            <Icon size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-2xl text-emerald-950 uppercase tracking-tighter leading-none mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                {wins} - {losses}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Points Metric */}
        <div className="text-right">
          <p className="text-4xl font-[1000] text-emerald-950 tracking-tighter leading-none">
            {totalPoints}
          </p>
          <p className="text-[9px] text-emerald-900/40 font-black uppercase tracking-[0.2em] mt-1">
            Points
          </p>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between bg-emerald-50/50 px-4 py-3 rounded-2xl border border-emerald-100/50">
          <span className="text-[8px] font-black text-emerald-900/40 uppercase tracking-widest">
            Steps
          </span>
          <span className="text-xs font-black text-emerald-950 tracking-tight">
            {Number(totalSteps).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between bg-orange-50/50 px-4 py-3 rounded-2xl border border-orange-100/50">
          <span className="text-[8px] font-black text-orange-900/40 uppercase tracking-widest">
            Avg/Day
          </span>
          <span className="text-xs font-black text-orange-700 tracking-tight">
            {Number(avg.toFixed(0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
