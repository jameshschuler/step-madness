import { Swords } from 'lucide-react'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from './ui/carousel'

interface SwipeableMatchupsProps {
  data: {
    userSteps: number
    opponentSteps: number
    teamAvg: number
    oppTeamAvg: number
    leaderboard: { name: string; steps: number }[]
  }
}

export function SwipeableMatchups({ data }: SwipeableMatchupsProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1))
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full relative">
      <CarouselContent>
        {[1, 2, 3].map((matchupIndex) => (
          <CarouselItem key={matchupIndex}>
            {/* MAIN MATCHUP CARD */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-emerald-100/50 mx-1">
              <div className="text-center text-[10px] font-black tracking-[0.2em] text-emerald-800/40 mb-6 uppercase">
                Matchup {matchupIndex} of 3
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                  <div className="text-emerald-600/50 text-[10px] font-black uppercase mb-1">
                    You
                  </div>
                  <div className="text-4xl font-black text-emerald-950 tracking-tighter">
                    {data.userSteps.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />
                  <div className="my-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black border border-orange-100">
                    VS
                  </div>
                  <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-emerald-100 to-transparent" />
                </div>

                <div className="text-center">
                  <div className="text-rose-600/50 text-[10px] font-black uppercase mb-1">
                    Opp
                  </div>
                  <div className="text-4xl font-black text-emerald-950 tracking-tighter">
                    {data.opponentSteps.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* SPRING PROGRESS BAR */}
              <div className="h-4 w-full bg-emerald-50 rounded-full flex overflow-hidden p-1 ring-1 ring-emerald-100/50">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                  style={{ width: '48%' }}
                />
                <div
                  className="bg-transparent h-full transition-all"
                  style={{ width: '4%' }} // Gap
                />
                <div
                  className="bg-gradient-to-r from-rose-300 to-orange-300 h-full rounded-full transition-all duration-1000"
                  style={{ width: '48%' }}
                />
              </div>
            </section>

            {/* AVERAGES GRID */}
            <div className="grid grid-cols-2 gap-4 my-6 px-1">
              <div className="bg-emerald-50/50 backdrop-blur-sm p-4 rounded-3xl border border-emerald-100/50 text-center">
                <div className="text-[9px] uppercase font-black text-emerald-700/60 tracking-wider mb-1">
                  Team Pulse
                </div>
                <div className="text-xl font-black text-emerald-900">
                  {data.teamAvg}k{' '}
                  <span className="text-[10px] opacity-40">/ DAY</span>
                </div>
              </div>
              <div className="bg-rose-50/50 backdrop-blur-sm p-4 rounded-3xl border border-rose-100/50 text-center">
                <div className="text-[9px] uppercase font-black text-rose-700/60 tracking-wider mb-1">
                  Opp Pulse
                </div>
                <div className="text-xl font-black text-rose-900">
                  {data.oppTeamAvg}k{' '}
                  <span className="text-[10px] opacity-40">/ DAY</span>
                </div>
              </div>
            </div>

            {/* MINI LEADERBOARD */}
            <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-sm ring-1 ring-emerald-100/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Your Team
                </h2>
                <Swords size={16} className="text-emerald-100" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                  Rivals
                </h2>
              </div>

              <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                  {data.leaderboard.map((player, i) => (
                    <div key={player.name} className="flex flex-col">
                      <div className="flex justify-between items-end mb-1">
                        <span
                          className={`text-xs font-bold ${player.name === 'YOU' ? 'text-emerald-700' : 'text-emerald-900/60'}`}
                        >
                          {player.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-900/40">
                          {player.steps.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-emerald-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${(player.steps / 10000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-px bg-emerald-50" />

                <div className="flex-1 space-y-4">
                  {[
                    { name: 'Mike', steps: 9120 },
                    { name: 'Jan', steps: 8850 },
                  ].map((opp) => (
                    <div key={opp.name} className="flex flex-col">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-rose-900/60">
                          {opp.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-rose-900/40">
                          {opp.steps.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-rose-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-300 rounded-full"
                          style={{ width: `${(opp.steps / 10000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* CAROUSEL DOTS */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === i + 1 ? 'bg-emerald-500 w-6' : 'bg-emerald-200 w-1.5'
            }`}
          />
        ))}
      </div>
    </Carousel>
  )
}
