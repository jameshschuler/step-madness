import { Flower2 } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfcf0]/80 backdrop-blur-md border-b border-emerald-100/50 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-1.5 rounded-xl shadow-sm ring-1 ring-emerald-200">
            <Flower2 className="text-white h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-lg font-black tracking-tight text-emerald-950 uppercase italic">
              Step <span className="text-emerald-600">Madness</span>
            </h1>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
              March '26
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
