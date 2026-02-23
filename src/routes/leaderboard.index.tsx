import { createFileRoute } from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Medal, ArrowUpRight } from 'lucide-react'

export function LeaderboardTab() {
  // Example data - in TanStack Start, this would come from Route.useLoaderData()
  const individualRankings = [
    {
      rank: 1,
      name: 'Mike Johnson',
      team: 'Red Team',
      steps: 12450,
      isYou: false,
    },
    {
      rank: 2,
      name: 'Sarah Chen',
      team: 'Blue Team',
      steps: 11200,
      isYou: false,
    },
    { rank: 3, name: 'You', team: 'Blue Team', steps: 8450, isYou: true },
    {
      rank: 4,
      name: 'Jan de Vries',
      team: 'Red Team',
      steps: 8100,
      isYou: false,
    },
  ]

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Rankings for Mar 1 — Mar 31, 2026
        </p>
      </div>

      <Tabs defaultValue="individuals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individuals">Individuals</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="individuals" className="mt-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Steps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {individualRankings.map((user) => (
                  <TableRow
                    key={user.rank}
                    className={user.isYou ? 'bg-blue-50/50' : ''}
                  >
                    <TableCell className="font-medium">
                      {user.rank === 1 ? (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      ) : user.rank === 2 ? (
                        <Medal className="h-4 w-4 text-slate-400" />
                      ) : user.rank === 3 ? (
                        <Medal className="h-4 w-4 text-amber-600" />
                      ) : (
                        user.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${user.isYou ? 'font-bold' : 'font-medium'}`}
                          >
                            {user.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {user.team}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {user.steps.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 mt-4">
          {/* Team Comparison Card */}
          <div className="grid grid-cols-1 gap-4">
            <TeamRankCard
              name="Red Team"
              avg={11.5}
              total="82.4k"
              color="bg-red-500"
              rank={1}
            />
            <TeamRankCard
              name="Blue Team"
              avg={10.2}
              total="74.1k"
              color="bg-blue-500"
              rank={2}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TeamRankCard({ name, avg, total, color, rank }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-1 ${color} rounded-full`} />
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Rank {rank}
          </p>
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-black">{avg}k</p>
        <p className="text-[10px] text-muted-foreground uppercase">Daily Avg</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/leaderboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LeaderboardTab />
}
