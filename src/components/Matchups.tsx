import { Swords } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from './ui/carousel'
import { iconMap } from '@/lib/constants'

interface Team {
  name: string
  displayName: string
  avatar: string
  avg: string | number
  total: number
  players: {
    name: string
    id: number
    steps: number
  }[]
}

interface Matchup {
  id: number
  startDate: Date
  team1: Team
  team2: Team
}

interface MatchupsProps {
  matchups: Matchup[]
}

export function Matchups({ matchups }: MatchupsProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1))
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full relative">
      {/* CAROUSEL DOTS */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === i + 1 ? 'bg-emerald-500 w-6' : 'bg-emerald-200 w-1.5'
            }`}
          />
        ))}
      </div>
      <CarouselContent>
        {matchups.map((match, idx) => {
          const Team1Icon =
            iconMap[match.team1.avatar as keyof typeof iconMap]?.icon || Swords
          const Team2Icon =
            iconMap[match.team2.avatar as keyof typeof iconMap]?.icon || Swords

          // Calculate Progress Percentages
          const t1Total = match.team1.total || 0
          const t2Total = match.team2.total || 0
          const combined = t1Total + t2Total

          // Default to 50/50 if no steps yet, otherwise calculate ratio
          const t1Width = combined > 0 ? (t1Total / combined) * 100 : 50
          const t2Width = combined > 0 ? (t2Total / combined) * 100 : 50

          return (
            <CarouselItem key={match.id}>
              {/* MAIN MATCHUP CARD */}
              <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-emerald-100/50 mx-1">
                <div className="text-center text-[10px] font-black tracking-[0.2em] text-emerald-800/40 mb-6 uppercase">
                  Matchup {idx + 1} of {matchups.length}
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div className="text-center flex-1">
                    <div className="flex flex-col items-center justify-center gap-1 mb-1">
                      <Team1Icon size={16} className="text-emerald-500/50" />
                      <div className="text-emerald-600/50 text-[10px] font-black uppercase truncate max-w-[80px]">
                        {match.team1.displayName}
                      </div>
                    </div>
                    <div className="text-4xl font-black text-emerald-950 tracking-tighter">
                      {match.team1.total.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />
                    <div className="my-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black border border-orange-100">
                      VS
                    </div>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />
                  </div>

                  <div className="text-center flex-1">
                    <div className="flex flex-col items-center justify-center gap-1 mb-1">
                      <Team2Icon size={16} className="text-rose-500/50" />
                      <div className="text-rose-600/50 text-[10px] font-black uppercase truncate max-w-[80px]">
                        {match.team2.displayName}
                      </div>
                    </div>
                    <div className="text-4xl font-black text-emerald-950 tracking-tighter">
                      {match.team2.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* SPRING PROGRESS BAR (Tug of War) */}
                <div className="h-4 w-full bg-emerald-50 rounded-full flex overflow-hidden p-1 ring-1 ring-emerald-100/50">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    style={{ width: `${t1Width}%` }}
                  />
                  <div
                    className="bg-transparent h-full transition-all"
                    style={{ width: '2%' }} // Tiny gap for aesthetic
                  />
                  <div
                    className="bg-gradient-to-r from-rose-300 to-orange-300 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${t2Width}%` }}
                  />
                </div>
              </section>

              {/* AVERAGES GRID */}
              <div className="grid grid-cols-2 gap-4 my-6 px-1">
                {/* Team 1 Stats */}
                <div className="bg-white p-5 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-sm text-center flex flex-col justify-center min-h-[120px]">
                  <div className="text-[10px] uppercase font-black text-emerald-700 tracking-[0.15em] mb-1 truncate px-2">
                    {match.team1.displayName}
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-emerald-950 tracking-tighter leading-none">
                      {match.team1.avg}
                    </span>
                    <div className="text-[8px] font-bold text-emerald-900/30 uppercase tracking-widest mt-2 leading-tight">
                      Avg Steps <br /> Per Person
                    </div>
                  </div>
                </div>

                {/* Team 2 Stats */}
                <div className="bg-white p-5 rounded-[2.5rem] border-2 border-rose-500/20 shadow-sm text-center flex flex-col justify-center min-h-[120px]">
                  <div className="text-[10px] uppercase font-black text-rose-700 tracking-[0.15em] mb-1 truncate px-2">
                    {match.team2.displayName}
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-rose-950 tracking-tighter leading-none">
                      {match.team2.avg}
                    </span>
                    <div className="text-[8px] font-bold text-rose-900/30 uppercase tracking-widest mt-2 leading-tight">
                      Avg Steps <br /> Per Person
                    </div>
                  </div>
                </div>
              </div>

              {/* MINI LEADERBOARD */}
              <div className="mt-8 bg-white rounded-[2rem] p-6 mb-1 shadow-sm ring-1 ring-emerald-100/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    {match.team1.displayName}
                  </h2>
                  <Swords size={16} className="text-emerald-100" />
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                    {match.team2.displayName}
                  </h2>
                </div>

                <div className="flex gap-6">
                  {/* Team 1 Players */}
                  <div className="flex-1 space-y-4">
                    {match.team1.players.map((player: any) => (
                      <div key={player.id} className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-emerald-900/60">
                            {player.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-900/40">
                            {(player.steps || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{
                              width: `${Math.min((player.steps / 15000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-px bg-emerald-50" />

                  {/* Team 2 Players */}
                  <div className="flex-1 space-y-4">
                    {match.team2.players.map((player: any) => (
                      <div key={player.id} className="flex flex-col">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-rose-900/60">
                            {player.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-rose-900/40">
                            {(player.steps || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-rose-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-300 rounded-full"
                            style={{
                              width: `${Math.min((player.steps / 15000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}
