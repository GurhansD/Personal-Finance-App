import { useState, useEffect } from 'react'

export default function BattleIntro({ boss, playerName, playerAvatar, onComplete }) {
  const [phase, setPhase] = useState('vs') // vs | flash | done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('flash'), 2200)
    const t2 = setTimeout(() => setPhase('done'), 2700)
    const t3 = setTimeout(onComplete, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at center, ${boss.auraColor}30 0%, #000 70%)`,
        transition: 'opacity 0.4s',
        opacity: phase === 'done' ? 0 : 1,
      }}>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
        }} />

      {/* Flash effect */}
      {phase === 'flash' && (
        <div className="absolute inset-0 bg-white pointer-events-none" style={{ animation: 'fadeIn 0.05s, fadeOut 0.4s 0.05s forwards' }} />
      )}

      <div className="relative z-10 text-center px-4 w-full max-w-lg" style={{ animation: 'scaleIn 0.4s ease-out' }}>
        {/* Player side */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Player */}
          <div className="flex flex-col items-center gap-2 flex-1" style={{ animation: 'slideDown 0.5s ease-out' }}>
            <div className="text-5xl" style={{ filter: 'drop-shadow(0 0 20px #22c55e)' }}>
              {playerAvatar || '🦁'}
            </div>
            <div className="text-sm font-black text-white bg-brand-500/20 border border-brand-500/40 px-3 py-1 rounded-full">
              {playerName || 'Hero'}
            </div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="text-4xl font-black text-white relative"
              style={{
                textShadow: '0 0 30px white, 0 0 60px white',
                animation: 'pulse 0.8s ease-in-out infinite'
              }}>
              VS
            </div>
            <div className="flex gap-1 mt-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          {/* Boss */}
          <div className="flex flex-col items-center gap-2 flex-1" style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div className="text-5xl" style={{ filter: `drop-shadow(0 0 20px ${boss.auraColor})`, animation: 'pulse 1s ease-in-out infinite' }}>
              {['🐉','👻','😈','🗿','👾'][['debt-dragon','budget-buster','inflation-imp','tax-titan','crypto-chaos'].indexOf(boss.id)] || '👹'}
            </div>
            <div className="text-sm font-black text-white px-3 py-1 rounded-full border"
              style={{ backgroundColor: `${boss.auraColor}20`, borderColor: `${boss.auraColor}60`, color: boss.auraColor }}>
              {boss.name}
            </div>
          </div>
        </div>

        {/* Boss info */}
        <div className="space-y-2">
          <div className="text-xs text-slate-500 uppercase tracking-widest">{boss.world}</div>
          <div className="text-lg font-black text-white"
            style={{ textShadow: `0 0 20px ${boss.auraColor}` }}>
            {boss.title}
          </div>
          <div className="text-xs text-slate-400 italic max-w-xs mx-auto leading-relaxed">
            "{boss.lore.slice(0, 80)}..."
          </div>
        </div>

        {/* HP preview bars */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-black/40 rounded-xl p-3 border border-brand-500/20">
            <div className="text-brand-400 font-bold mb-1">Your HP</div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-brand-500 rounded-full" style={{ animation: 'slideUp 0.8s ease-out' }} />
            </div>
            <div className="text-white font-bold mt-1">80 / 80</div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 border"
            style={{ borderColor: `${boss.auraColor}20` }}>
            <div className="font-bold mb-1" style={{ color: boss.auraColor }}>{boss.name} HP</div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full rounded-full" style={{ backgroundColor: boss.auraColor, animation: 'slideUp 0.8s ease-out' }} />
            </div>
            <div className="text-white font-bold mt-1">{boss.hp} / {boss.hp}</div>
          </div>
        </div>

        {/* Battle start text */}
        <div className="mt-6 text-2xl font-black animate-pulse"
          style={{ color: boss.auraColor, textShadow: `0 0 30px ${boss.auraColor}`, animation: 'bounceIn 0.5s ease-out 1.5s both' }}>
          BATTLE START!
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: '5%', left: '5%' },
        { top: '5%', right: '5%' },
        { bottom: '5%', left: '5%' },
        { bottom: '5%', right: '5%' },
      ].map((pos, i) => (
        <div key={i} className="absolute w-16 h-16 pointer-events-none"
          style={{ ...pos, border: `2px solid ${boss.auraColor}40`, borderRadius: '4px' }} />
      ))}

      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
