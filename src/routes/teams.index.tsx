import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Zap } from 'lucide-react'

export function TeamsTab() {
  // In a real app, you'd fetch this from your Server Function
  const teams = [
    {
      id: 'blue-team',
      name: 'Blue Team',
      color: 'bg-blue-500',
      players: [
        { name: 'You', steps: 8450, isYou: true, status: 'Active' },
        { name: 'Sarah Chen', steps: 7900, isYou: false, status: 'Active' },
        { name: 'Dave Miller', steps: 6200, isYou: false, status: 'Idle' },
        { name: 'Jessica W.', steps: 5100, isYou: false, status: 'Active' },
      ],
    },
    {
      id: 'red-team',
      name: 'Red Team',
      color: 'bg-red-500',
      players: [
        { name: 'Mike Johnson', steps: 9120, isYou: false, status: 'Active' },
        { name: 'Jan de Vries', steps: 8850, isYou: false, status: 'Active' },
        { name: 'Chris P.', steps: 7100, isYou: false, status: 'Active' },
        { name: 'Elena R.', steps: 4200, isYou: false, status: 'Idle' },
      ],
    },
  ]

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
      </div>

      <div className="space-y-4">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden border-2">
            <CardHeader className={`${team.color} text-white py-3 px-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-none"
                >
                  {team.players.length} Players
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {team.players.map((player) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 ${player.isYou ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className={`text-sm leading-none ${player.isYou ? 'font-black' : 'font-medium'}`}
                        >
                          {player.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/teams/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TeamsTab />
}
