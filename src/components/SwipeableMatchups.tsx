import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './ui/carousel'
import React from 'react'

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

  // Update dots when swipe occurs
  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full mb-6 relative">
      <CarouselContent>
        {/* We map through the matchups here */}
        {[1, 2, 3].map((matchupIndex) => (
          <CarouselItem key={matchupIndex}>
            <section className="bg-white border-2 border-black rounded-2xl p-6 relative mx-1">
              <div className="text-center text-xs font-bold tracking-widest mb-4 uppercase">
                Matchup {matchupIndex} of 3
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] font-bold">YOU</div>
                  <div className="text-3xl font-black">
                    {data.userSteps.toLocaleString()}
                  </div>
                </div>
                <div className="text-center px-2">
                  <div className="text-sm font-bold italic">VS</div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                    14h 22m
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] font-bold">
                    OPPONENT
                  </div>
                  <div className="text-3xl font-black">
                    {data.opponentSteps.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="h-3 w-full bg-secondary rounded-full flex overflow-hidden border border-black/5">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: '48%' }}
                />
                <div
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: '52%' }}
                />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-white border-2 border-black p-3 rounded-xl text-center">
                <div className="text-[10px] uppercase font-bold text-gray-500">
                  Your Team Avg
                </div>
                <div className="text-lg font-bold">
                  {data.teamAvg}k{' '}
                  <span className="text-xs font-normal">steps/day</span>
                </div>
              </div>
              <div className="bg-white border-2 border-black p-3 rounded-xl text-center">
                <div className="text-[10px] uppercase font-bold text-gray-500">
                  Opp Team Avg
                </div>
                <div className="text-lg font-bold">
                  {data.oppTeamAvg}k{' '}
                  <span className="text-xs font-normal">steps/day</span>
                </div>
              </div>
            </div>

            {/* TEAM LEADERBOARDS SECTION */}
            <div className="mt-4 border-t-2 border-dashed border-gray-200 pt-4 pb-8">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">
                  Your Team
                </h2>
                <div className="h-4 w-[1px] bg-gray-300" />{' '}
                {/* Vertical Divider */}
                <h2 className="text-xs font-black uppercase tracking-widest text-red-600">
                  Opponent Team
                </h2>
              </div>

              <div className="flex gap-4">
                {/* Left Column: Your Team */}
                <div className="flex-1 space-y-3">
                  {data.leaderboard.map((player, i) => (
                    <div
                      key={player.name}
                      className={`flex justify-between items-center p-2 rounded-lg ${player.name === 'YOU' ? 'bg-blue-50 border border-blue-200' : ''}`}
                      search-result-id="1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">
                          {i + 1}.
                        </span>
                        <span className="text-sm font-semibold">
                          {player.name}
                        </span>
                      </div>
                      <span className="text-sm font-mono">
                        {player.steps.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column: Opponent Team (Hardcoded for demo) */}
                <div className="flex-1 space-y-3">
                  {[
                    { name: 'Mike', steps: 9120 },
                    { name: 'Jan', steps: 8850 },
                    { name: 'Chris', steps: 7100 },
                  ].map((opp, i) => (
                    <div
                      key={opp.name}
                      className="flex justify-between items-center p-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">
                          {i + 1}.
                        </span>
                        <span className="text-sm font-semibold">
                          {opp.name}
                        </span>
                      </div>
                      <span className="text-sm font-mono">
                        {opp.steps.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center gap-6 mt-4">
        {/* Hidden on mobile, shown on desktop */}
        <CarouselPrevious className="hidden md:flex static translate-y-0 h-8 w-8 border-2 border-black bg-white hover:bg-gray-100" />

        {/* Dots (Always visible as a swipe affordance) */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                current === i + 1 ? 'bg-black w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Hidden on mobile, shown on desktop */}
        <CarouselNext className="hidden md:flex static translate-y-0 h-8 w-8 border-2 border-black bg-white hover:bg-gray-100" />
      </div>
    </Carousel>
  )
}
