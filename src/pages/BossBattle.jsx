import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BOSSES } from '../data/bossData'
import PixelBoss from '../components/PixelBoss'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/Toast'
import { Sword, Shield, Heart, Zap, ChevronLeft, Star, RotateCcw, Trophy, X } from 'lucide-react'

/* ── helpers ── */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function HPBar({ current, max, color = '#22c55e', label, animate }) {
  const pct = Math.max(0, (current / max) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span style={{ color }}>{current}/{max} HP</span>
      </div>
      <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10 relative">
        <div
          className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          {/* scan line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: animate ? 'scanline 0.8s linear' : 'none' }} />
        </div>
        {/* tick marks */}
        {[25, 50, 75].map(t => (
          <div key={t} className="absolute top-0 bottom-0 w-px bg-slate-700" style={{ left: `${t}%` }} />
        ))}
      </div>
    </div>
  )
}

function DamageNumber({ value, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`absolute top-0 left-1/2 -translate-x-1/2 font-black text-3xl pointer-events-none z-50
      ${type === 'damage' ? 'text-red-400' : type === 'heal' ? 'text-green-400' : 'text-yellow-400'}
    `}
      style={{ animation: 'floatUp 1.2s ease-out forwards' }}
    >
      {type === 'damage' ? `-${value}` : type === 'heal' ? `+${value}` : `✨ ${value}`}
    </div>
  )
}

function BossAttackSlash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 600)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"
        style={{ animation: 'slashAcross 0.5s ease-out forwards' }} />
    </div>
  )
}

function VictoryScreen({ boss, xpGain, coinGain, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-slate-900 border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full mx-4 text-center overflow-hidden">
        {/* gold shimmer bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
        <div className="text-6xl mb-4" style={{ animation: 'bounceIn 0.6s ease-out' }}>🏆</div>
        <h2 className="text-2xl font-black text-yellow-400 mb-1">DEFEATED!</h2>
        <p className="text-slate-400 text-sm mb-6">{boss.name} has been vanquished!</p>
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-3">
            <span className="text-sm text-slate-300 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />XP Earned</span>
            <span className="font-black text-yellow-400">+{xpGain}</span>
          </div>
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-3">
            <span className="text-sm text-slate-300 flex items-center gap-2"><span>🪙</span>Coins Earned</span>
            <span className="font-black text-yellow-400">+{coinGain}</span>
          </div>
        </div>
        <button onClick={onContinue}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all text-sm shadow-lg">
          Continue Adventure →
        </button>
      </div>
    </div>
  )
}

function DefeatScreen({ boss, onRetry, onFlee }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-6xl mb-4" style={{ animation: 'shakeX 0.5s' }}>💀</div>
        <h2 className="text-2xl font-black text-red-400 mb-1">DEFEATED!</h2>
        <p className="text-slate-400 text-sm mb-6">{boss.name} was too powerful this time...</p>
        <div className="space-y-3">
          <button onClick={onRetry}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all text-sm">
            <RotateCcw className="w-4 h-4 inline mr-2" />Try Again
          </button>
          <button onClick={onFlee}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all text-sm">
            <ChevronLeft className="w-4 h-4 inline mr-1" />Return to World Map
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main BossBattle page ── */
export default function BossBattle() {
  const { bossId } = useParams()
  const navigate = useNavigate()
  const { awardXp, addBadge, defeatBoss, currentUser } = useAuthStore()
  const { showToast } = useToast()

  const boss = BOSSES.find(b => b.id === bossId)

  const PLAYER_MAX_HP = 80
  const [questions] = useState(() => shuffle(boss?.questions || []).slice(0, 5))
  const [qIndex, setQIndex] = useState(0)
  const [bossHp, setBossHp] = useState(boss?.hp || 100)
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP)
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('question') // question | result | victory | defeat | animating
  const [frame, setFrame] = useState(0)
  const [bossShake, setBossShake] = useState(false)
  const [playerShake, setPlayerShake] = useState(false)
  const [showSlash, setShowSlash] = useState(false)
  const [damageNums, setDamageNums] = useState([])
  const [resultData, setResultData] = useState(null)
  const [hpAnimBoss, setHpAnimBoss] = useState(false)
  const [hpAnimPlayer, setHpAnimPlayer] = useState(false)
  const damageIdRef = useRef(0)

  // boss idle animation
  useEffect(() => {
    const interval = setInterval(() => setFrame(f => f + 1), 500)
    return () => clearInterval(interval)
  }, [])

  const addDamageNum = useCallback((value, type) => {
    const id = ++damageIdRef.current
    setDamageNums(prev => [...prev, { id, value, type }])
  }, [])

  const removeDamageNum = useCallback((id) => {
    setDamageNums(prev => prev.filter(d => d.id !== id))
  }, [])

  const handleAnswer = useCallback((optionIndex) => {
    if (phase !== 'question') return
    setSelected(optionIndex)
    const q = questions[qIndex]
    const correct = optionIndex === q.answer

    setPhase('animating')

    if (correct) {
      // player attacks boss
      const dmg = Math.floor(Math.random() * 15) + 15 // 15-30 dmg
      setTimeout(() => {
        setBossShake(true)
        addDamageNum(dmg, 'damage')
        setHpAnimBoss(true)
        setBossHp(prev => Math.max(0, prev - dmg))
        setTimeout(() => {
          setBossShake(false)
          setHpAnimBoss(false)
        }, 600)
      }, 300)
      setResultData({ correct: true, dmg, explanation: q.explanation })
    } else {
      // boss attacks player
      setShowSlash(true)
      const dmg = Math.floor(Math.random() * 12) + 8 // 8-20 dmg
      setTimeout(() => {
        setShowSlash(false)
        setPlayerShake(true)
        addDamageNum(dmg, 'damage')
        setHpAnimPlayer(true)
        setPlayerHp(prev => Math.max(0, prev - dmg))
        setTimeout(() => {
          setPlayerShake(false)
          setHpAnimPlayer(false)
        }, 600)
      }, 500)
      setResultData({ correct: false, dmg, explanation: q.explanation })
    }

    setTimeout(() => setPhase('result'), 400)
  }, [phase, questions, qIndex, addDamageNum])

  const handleNext = useCallback(() => {
    const nextQ = qIndex + 1
    const bossDefeated = bossHp <= 0
    const playerDefeated = playerHp <= 0

    if (bossDefeated) {
      setPhase('victory')
      return
    }
    if (playerDefeated) {
      setPhase('defeat')
      return
    }
    if (nextQ >= questions.length) {
      // out of questions — check remaining HP
      if (bossHp <= 30) {
        setPhase('victory')
      } else {
        setPhase('defeat')
      }
      return
    }
    setQIndex(nextQ)
    setSelected(null)
    setResultData(null)
    setPhase('question')
  }, [qIndex, questions.length, bossHp, playerHp])

  const handleVictory = useCallback(() => {
    defeatBoss(boss.id, boss.xpReward)
    if (boss.id === 'crypto-chaos') addBadge('boss-master')
    showToast(`🏆 ${boss.name} defeated! +${boss.xpReward} XP`, 'achievement')
    navigate('/world-map')
  }, [defeatBoss, addBadge, boss, showToast, navigate])

  if (!boss) return (
    <div className="text-center py-20 text-slate-400">
      Boss not found. <button onClick={() => navigate('/world-map')} className="text-brand-400 underline">Return to map</button>
    </div>
  )

  const q = questions[qIndex]
  const progress = (qIndex / questions.length) * 100

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated battle background */}
      <div className="fixed inset-0 z-0"
        style={{ background: `linear-gradient(135deg, ${boss.bgGradient[0]}, ${boss.bgGradient[1]}, ${boss.bgGradient[2]})` }}>
        {/* floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${(i / 20) * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: boss.auraColor,
              animation: `floatParticle ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 0.4}s`,
            }}
          />
        ))}
        {/* aura ring */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: boss.auraColor, filter: 'blur(60px)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4">
        {/* Back button */}
        <button onClick={() => navigate('/world-map')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" />{boss.world}
        </button>

        {/* Boss header */}
        <div className="text-center mb-2">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{boss.title}</div>
          <h1 className="text-3xl font-black text-white" style={{ textShadow: `0 0 20px ${boss.auraColor}80` }}>
            {boss.name}
          </h1>
        </div>

        {/* HP bars */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <HPBar current={bossHp} max={boss.hp} color={boss.auraColor} label={boss.name} animate={hpAnimBoss} />
          <HPBar current={playerHp} max={PLAYER_MAX_HP} color="#22c55e" label="You" animate={hpAnimPlayer} />
        </div>

        {/* Battle arena */}
        <div className="relative h-52 mb-4 flex items-end justify-around">
          {/* ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          {/* ground glow */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-8 opacity-30 blur-xl rounded-full"
            style={{ backgroundColor: boss.auraColor }} />

          {/* Boss sprite */}
          <div className="relative flex flex-col items-center"
            style={{ animation: bossShake ? 'shakeX 0.4s' : 'none' }}>
            <div className="relative">
              {showSlash && <BossAttackSlash onDone={() => {}} />}
              {/* Boss aura */}
              <div className="absolute -inset-4 rounded-full opacity-20 blur-xl"
                style={{ backgroundColor: boss.auraColor, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <PixelBoss bossId={boss.id} palette={boss.palette} frame={frame} scale={2} />
              {/* damage numbers over boss */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                {damageNums.map(d => (
                  <DamageNumber key={d.id} value={d.value} type={d.type} onDone={() => removeDamageNum(d.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* Player hero sprite (pixel art character) */}
          <div className="relative flex flex-col items-center"
            style={{ animation: playerShake ? 'shakeX 0.4s' : 'none' }}>
            <svg width={72} height={100} style={{ imageRendering: 'pixelated' }}>
              <g transform={`translate(0,${frame % 2 === 0 ? 0 : 1})`}>
                {/* hero pixel art */}
                {/* helmet */}
                <rect x={24} y={0} width={8} height={8} fill="#60a5fa" />
                <rect x={16} y={8} width={24} height={8} fill="#3b82f6" />
                <rect x={16} y={16} width={24} height={8} fill="#2563eb" />
                {/* visor */}
                <rect x={20} y={16} width={6} height={4} fill="#93c5fd" />
                <rect x={30} y={16} width={6} height={4} fill="#93c5fd" />
                {/* body */}
                <rect x={12} y={24} width={32} height={24} fill="#22c55e" />
                <rect x={12} y={24} width={32} height={4} fill="#16a34a" />
                {/* chest emblem */}
                <rect x={24} y={28} width={8} height={12} fill="#4ade80" />
                {/* arms */}
                <rect x={4} y={24} width={8} height={16} fill="#16a34a" />
                <rect x={44} y={24} width={8} height={16} fill="#16a34a" />
                {/* sword */}
                <rect x={52} y={8} width={4} height={32} fill="#e2e8f0" />
                <rect x={48} y={20} width={12} height={4} fill="#94a3b8" />
                <rect x={52} y={4} width={4} height={8} fill="#fbbf24" />
                {/* shield */}
                <rect x={0} y={20} width={8} height={12} fill="#3b82f6" />
                <rect x={2} y={22} width={4} height={8} fill="#1d4ed8" />
                <rect x={4} y={24} width={4} height={4} fill="#60a5fa" />
                {/* legs */}
                <rect x={16} y={48} width={12} height={20} fill="#166534" />
                <rect x={28} y={48} width={12} height={20} fill="#166534" />
                {/* boots */}
                <rect x={14} y={64} width={14} height={8} fill="#1e3a5f" />
                <rect x={28} y={64} width={14} height={8} fill="#1e3a5f" />
              </g>
            </svg>
            <div className="text-xs text-brand-400 font-bold mt-1">
              {currentUser?.name?.split(' ')[0] || 'Hero'}
            </div>
          </div>
        </div>

        {/* Question card */}
        {(phase === 'question' || phase === 'animating') && (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-xs text-slate-500 font-mono">Question {qIndex + 1}/{questions.length}</div>
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <p className="text-white font-semibold text-sm leading-relaxed">{q.q}</p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={phase !== 'question'}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all
                    ${selected === i
                      ? 'bg-brand-500/20 border-brand-500 text-white'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:border-white/30 hover:text-white hover:bg-slate-700'
                    }
                    ${phase !== 'question' ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <span className="text-slate-500 mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result card */}
        {phase === 'result' && resultData && (
          <div className={`border rounded-2xl p-5 space-y-3 backdrop-blur-xl
            ${resultData.correct
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${resultData.correct ? '' : ''}`}>
                {resultData.correct ? '⚔️' : '💥'}
              </div>
              <div>
                <div className={`font-black text-sm ${resultData.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {resultData.correct ? `Critical Hit! -${resultData.dmg} HP to ${boss.name}!` : `${boss.name} strikes back! -${resultData.dmg} HP!`}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{resultData.explanation}</div>
              </div>
            </div>
            {/* show correct answer if wrong */}
            {!resultData.correct && (
              <div className="text-xs text-slate-300 bg-slate-800 rounded-xl px-4 py-2">
                <span className="text-green-400 font-bold">Correct answer: </span>
                {q.options[q.answer]}
              </div>
            )}
            <button onClick={handleNext}
              className={`w-full py-3 font-bold rounded-xl text-sm transition-all
                ${resultData.correct
                  ? 'bg-green-500 hover:bg-green-400 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}>
              {qIndex < questions.length - 1 && bossHp > 0 && playerHp > 0
                ? 'Next Attack →'
                : bossHp <= 0 ? '🏆 Claim Victory!'
                : playerHp <= 0 ? '💀 You were defeated...'
                : bossHp <= 30 ? '⚔️ Finish the Boss!'
                : 'Flee...'
              }
            </button>
          </div>
        )}
      </div>

      {/* Victory / Defeat overlays */}
      {phase === 'victory' && (
        <VictoryScreen boss={boss} xpGain={boss.xpReward} coinGain={boss.coinReward} onContinue={handleVictory} />
      )}
      {phase === 'defeat' && (
        <DefeatScreen boss={boss}
          onRetry={() => { setBossHp(boss.hp); setPlayerHp(PLAYER_MAX_HP); setQIndex(0); setSelected(null); setResultData(null); setPhase('question') }}
          onFlee={() => navigate('/world-map')} />
      )}

      {/* Global CSS injected via style tag */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-60px); opacity: 0; }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes slashAcross {
          0% { transform: scaleX(0) translateX(-50%); opacity: 1; }
          50% { transform: scaleX(1.5) translateX(0); opacity: 0.8; }
          100% { transform: scaleX(2) translateX(50%); opacity: 0; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.2); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0) rotate(-20deg); }
          60% { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
