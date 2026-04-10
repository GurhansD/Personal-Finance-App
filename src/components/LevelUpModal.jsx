import { useEffect } from 'react'
import { Zap, Star, ChevronRight } from 'lucide-react'

export default function LevelUpModal({ level, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      {/* Backdrop flash */}
      <div className="absolute inset-0 bg-yellow-500/5" style={{ animation: 'xpFlash 1s ease-out' }} />

      {/* Level up card */}
      <div className="relative pointer-events-auto" style={{ animation: 'bounceIn 0.7s ease-out' }}>
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full opacity-40 blur-2xl"
          style={{ background: 'radial-gradient(circle, #fbbf24, #f59e0b, transparent)' }} />

        <div className="relative bg-slate-900 border-2 border-yellow-500/60 rounded-3xl px-8 py-7 text-center shadow-2xl overflow-hidden">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
            style={{ animation: 'scanline 1.5s linear infinite' }} />

          {/* Stars */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute text-yellow-400 text-xl pointer-events-none"
              style={{
                top: `${10 + (i % 3) * 35}%`,
                left: i < 3 ? `${5 + i * 5}%` : `${75 + (i - 3) * 7}%`,
                animation: `floatParticle ${1.5 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}>✦</div>
          ))}

          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-yellow-500 font-bold mb-1">
              Level Up!
            </div>
            <div className="text-7xl font-black text-white mb-2"
              style={{ textShadow: '0 0 30px #fbbf24, 0 0 60px #f59e0b' }}>
              {level}
            </div>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(Math.min(level, 5))].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" fill="#fbbf24" />
              ))}
            </div>
            <div className="text-white font-bold text-lg mb-1">Finance Hero Level {level}</div>
            <div className="text-slate-400 text-sm mb-5">
              {level <= 3 ? 'You\'re mastering the basics!'
               : level <= 6 ? 'Your financial knowledge grows!'
               : level <= 10 ? 'You\'re becoming a Finance Warrior!'
               : 'Legendary Finance Master status!'}
            </div>
            <button onClick={onClose}
              className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl text-sm transition-all flex items-center gap-2 mx-auto">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
