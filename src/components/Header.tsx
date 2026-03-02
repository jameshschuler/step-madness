import { Flower2, Info } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfcf0]/80 backdrop-blur-md border-b border-emerald-100/50 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 active:scale-95 transition-transform"
        >
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
        </Link>

        {/* Info Link */}
        <Link
          to="/about"
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full ring-1 ring-emerald-200/50 transition-colors group"
        >
          <Info
            size={14}
            className="text-emerald-600 group-hover:text-emerald-700"
          />
          <span className="text-[10px] font-[1000] text-emerald-800 uppercase tracking-widest">
            Rules
          </span>
        </Link>
      </div>
    </header>
  )
}
