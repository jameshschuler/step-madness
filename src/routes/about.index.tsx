import { Info, Trophy, Calendar, Users, Heart } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="p-4 bg-[#fdfcf0] min-h-screen pb-24 space-y-8">
      {/* HEADER */}
      <header className="pt-4">
        <h1 className="text-3xl font-[1000] text-emerald-950 uppercase italic tracking-tighter">
          The Handbook
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60">
          March Step Madness 2026
        </p>
      </header>

      {/* HOW IT WORKS */}
      <section className="bg-white rounded-[2.5rem] p-6 shadow-sm ring-1 ring-emerald-100/50">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-emerald-500" />
          <h2 className="text-xs font-[1000] uppercase tracking-widest text-emerald-900">
            How it Works
          </h2>
        </div>
        <div className="space-y-4 text-sm font-bold text-emerald-900/70 leading-relaxed">
          <p>
            Steps are manually synced from{' '}
            <span className="text-emerald-600">StepUp</span>. To ensure
            accuracy, the leaderboard for each week is "locked" exactly{' '}
            <span className="text-emerald-950 underline decoration-emerald-200">
              12 hours
            </span>{' '}
            after the week ends. So don't forget to sync your steps before the
            deadline!
          </p>
        </div>
      </section>

      {/* SCORING RULES */}
      <section className="bg-emerald-900 rounded-[2.5rem] p-6 shadow-xl text-white">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={18} className="text-emerald-400" />
          <h2 className="text-xs font-black uppercase tracking-widest">
            Scoring System
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <ScoreCard
            points="+2"
            label="Matchup Win"
            desc="Awarded to the team with more steps"
          />
          <ScoreCard
            points="+1"
            label="Participation"
            desc="Awarded to the losing/drawing team"
          />
          <ScoreCard
            points="+1"
            label="Elite Bonus"
            desc="Team average > 6,000 steps/day"
          />
        </div>
      </section>

      {/* THE SCHEDULE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Calendar size={18} className="text-emerald-500" />
          <h2 className="text-xs font-[1000] uppercase tracking-widest text-emerald-900">
            Tournament Path
          </h2>
        </div>

        <div className="space-y-3">
          <WeekRow
            num="1"
            dates="Mar 1 - Mar 7"
            matchups={['Fish vs Worm', 'Shrimp vs Snail']}
          />
          <WeekRow
            num="2"
            dates="Mar 8 - Mar 14"
            matchups={['Fish vs Snail', 'Shrimp vs Worm']}
          />
          <WeekRow
            num="3"
            dates="Mar 15 - Mar 21"
            matchups={['Fish vs Shrimp', 'Shrimp vs Worm']}
          />

          <div className="p-5 rounded-[2rem] bg-orange-50 border-2 border-orange-100 border-dashed">
            <p className="text-[10px] font-black text-orange-600 uppercase mb-2 italic">
              Week 4: The Playoffs
            </p>
            <div className="space-y-2 text-xs font-bold text-orange-900/80">
              <p>Round 1 (Mar 22-26): Seed #1 vs #4 & #2 vs #3</p>
              <p>Round 2 (Mar 27-31): The Championship & Consolation</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE TEAMS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Users size={18} className="text-emerald-500" />
          <h2 className="text-xs font-[1000] uppercase tracking-widest text-emerald-900">
            The Rosters
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <RosterCard
            team="Team Fish 🐟"
            sub="The Deep Sea Sprinters"
            members="James, Bobby, Abby, Lucy"
          />
          <RosterCard
            team="Team Shrimp 🦐"
            sub="The High-Energy Crustaceans"
            members="Sandy, GirlSam, Jessica, Timothy"
          />
          <RosterCard
            team="Team Snail 🐌"
            sub="The Slow-Burn Steamrollers"
            members="Rob, Laura, Bryan"
          />
          <RosterCard
            team="Team Worm 🪱"
            sub="The Ground-Breaking Grinders"
            members="Laura, Sam, Patrick"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-emerald-900/30 font-black uppercase text-[10px] tracking-widest">
          Made with <Heart size={10} className="fill-rose-400 text-rose-400" />{' '}
          by James
        </div>
      </footer>
    </div>
  )
}

/* HELPER COMPONENTS */

function ScoreCard({ points, label, desc }: any) {
  return (
    <div className="flex items-center gap-4 bg-emerald-800/50 p-3 rounded-2xl border border-emerald-700">
      <div className="text-xl font-black text-emerald-400">{points}</div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-tighter">
          {label}
        </div>
        <div className="text-[10px] opacity-60 font-medium">{desc}</div>
      </div>
    </div>
  )
}

function WeekRow({ num, dates, matchups }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-3xl ring-1 ring-emerald-100 shadow-sm">
      <div>
        <p className="text-[10px] font-black text-emerald-500 uppercase">
          Week {num}
        </p>
        <p className="text-xs font-bold text-emerald-900/40">{dates}</p>
      </div>
      <div className="text-right italic">
        {matchups.map((m: string) => (
          <p
            key={m}
            className="text-[10px] font-black text-emerald-950 uppercase tracking-tighter"
          >
            {m}
          </p>
        ))}
      </div>
    </div>
  )
}

function RosterCard({ team, sub, members }: any) {
  return (
    <div className="p-5 bg-white rounded-3xl border border-emerald-100/50 shadow-sm">
      <h4 className="text-sm font-[1000] text-emerald-950 uppercase">{team}</h4>
      <p className="text-[9px] font-black text-emerald-600/60 uppercase mb-2 tracking-wide">
        {sub}
      </p>
      <p className="text-xs font-bold text-emerald-900/40 leading-tight">
        {members}
      </p>
    </div>
  )
}
