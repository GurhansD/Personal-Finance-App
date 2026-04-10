import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BOSSES, WORLD_NODES, WORLD_PATHS } from '../data/bossData'
import { useAuthStore } from '../store/useAuthStore'
import { Sword, Lock, Star, ChevronRight, Zap, Shield, Map } from 'lucide-react'

const DIFFICULTY_COLORS = ['', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
const DIFFICULTY_LABELS = ['', 'Beginner', 'Apprentice', 'Warrior', 'Champion', 'Legend']

function BossNode({ boss, node, isUnlocked, isDefeated, isSelected, onClick }) {
  const difficulty = boss.difficulty

  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center gap-1 group"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Node ring */}
      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
        transition-all duration-300 border-2
        ${isDefeated
          ? 'bg-yellow-500/20 border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
          : isUnlocked
            ? `border-2 transition-transform group-hover:scale-110 shadow-[0_0_15px_${DIFFICULTY_COLORS[difficulty]}40]`
            : 'bg-slate-800/80 border-slate-700 opacity-60 cursor-not-allowed'
        }
        ${isSelected && isUnlocked ? 'scale-110' : ''}
      `}
        style={isUnlocked && !isDefeated ? {
          backgroundColor: `${boss.auraColor}20`,
          borderColor: boss.auraColor,
        } : {}}>
        {isDefeated
          ? <span className="text-2xl">✅</span>
          : isUnlocked
            ? <span className="text-2xl animate-pulse">{node.icon}</span>
            : <Lock className="w-5 h-5 text-slate-600" />
        }
        {/* Difficulty stars */}
        <div className="absolute -top-2 -right-2 flex gap-px">
          {Array.from({ length: difficulty }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5"
              style={{ fill: DIFFICULTY_COLORS[difficulty], color: DIFFICULTY_COLORS[difficulty] }} />
          ))}
        </div>
      </div>
      <span className={`text-xs font-bold whitespace-nowrap px-1.5 py-0.5 rounded-md
        ${isDefeated ? 'text-yellow-400' : isUnlocked ? 'text-white' : 'text-slate-600'}
        bg-slate-900/80
      `}>{boss.name}</span>
    </button>
  )
}

export default function WorldMap() {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()
  const [selectedBoss, setSelectedBoss] = useState(null)

  // For demo: bosses defeated tracked by XP thresholds (or could be in user store)
  // Simple unlock: boss N is unlocked if XP >= threshold × N
  const defeatedBosses = currentUser?.defeatedBosses || []
  const totalXP = currentUser?.xp || 0

  function isUnlocked(bossIndex) {
    if (bossIndex === 0) return true
    // Previous boss must be defeated
    return defeatedBosses.includes(BOSSES[bossIndex - 1].id)
  }

  function isDefeated(bossId) {
    return defeatedBosses.includes(bossId)
  }

  const selectedBossData = selectedBoss ? BOSSES.find(b => b.id === selectedBoss) : null
  const selectedNodeIndex = selectedBoss ? BOSSES.findIndex(b => b.id === selectedBoss) : -1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Map className="w-6 h-6 text-brand-400" />
            World Map
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Defeat finance bosses to earn XP and level up</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Bosses Slain</div>
          <div className="text-lg font-black text-yellow-400">{defeatedBosses.length}/{BOSSES.length}</div>
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10"
        style={{ paddingBottom: '56%', background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 30%, #1a0f2e 60%, #0a1628 100%)' }}>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '10% 10%'
          }} />

        {/* Terrain decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Mountains */}
          <div className="absolute text-4xl opacity-20" style={{ left: '8%', top: '55%' }}>🏔️</div>
          <div className="absolute text-2xl opacity-15" style={{ left: '25%', top: '30%' }}>⛰️</div>
          <div className="absolute text-3xl opacity-20" style={{ left: '45%', top: '45%' }}>🌋</div>
          <div className="absolute text-2xl opacity-15" style={{ left: '62%', top: '20%' }}>🏔️</div>
          <div className="absolute text-4xl opacity-20" style={{ left: '78%', top: '42%' }}>🌑</div>
          {/* Trees */}
          <div className="absolute text-xl opacity-25" style={{ left: '20%', top: '65%' }}>🌲</div>
          <div className="absolute text-lg opacity-20" style={{ left: '48%', top: '25%' }}>🌳</div>
          <div className="absolute text-xl opacity-25" style={{ left: '65%', top: '55%' }}>🌲</div>
          {/* Stars/sparkles on dark areas */}
          {[
            { x: 5, y: 10 }, { x: 15, y: 85 }, { x: 30, y: 15 }, { x: 55, y: 80 },
            { x: 70, y: 10 }, { x: 85, y: 80 }, { x: 92, y: 20 }, { x: 40, y: 90 },
          ].map((s, i) => (
            <div key={i} className="absolute text-xs opacity-40"
              style={{ left: `${s.x}%`, top: `${s.y}%`, animation: `pulse ${2 + i * 0.3}s ease-in-out infinite` }}>
              ✦
            </div>
          ))}
        </div>

        {/* Path connectors (SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {WORLD_PATHS.map(([fromId, toId], i) => {
            const from = WORLD_NODES.find(n => n.id === fromId)
            const to = WORLD_NODES.find(n => n.id === toId)
            const fromDefeated = isDefeated(fromId)
            return (
              <g key={i}>
                {/* Shadow line */}
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="#000000" strokeWidth="1.5" strokeOpacity="0.5"
                  strokeDasharray="3 2"
                />
                {/* Colored path */}
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={fromDefeated ? '#fbbf24' : '#334155'}
                  strokeWidth="0.8"
                  strokeDasharray={fromDefeated ? 'none' : '3 2'}
                  strokeOpacity={fromDefeated ? 0.8 : 0.4}
                />
              </g>
            )
          })}
        </svg>

        {/* Boss nodes */}
        {WORLD_NODES.map((node, i) => {
          const boss = BOSSES.find(b => b.id === node.id)
          if (!boss) return null
          return (
            <BossNode
              key={node.id}
              boss={boss}
              node={node}
              isUnlocked={isUnlocked(i)}
              isDefeated={isDefeated(node.id)}
              isSelected={selectedBoss === node.id}
              onClick={() => setSelectedBoss(selectedBoss === node.id ? null : node.id)}
            />
          )
        })}

        {/* Player position indicator */}
        {(() => {
          const nextUndone = BOSSES.findIndex(b => !isDefeated(b.id))
          const nodeIndex = nextUndone === -1 ? WORLD_NODES.length - 1 : nextUndone
          const node = WORLD_NODES[nodeIndex]
          if (!node) return null
          return (
            <div className="absolute pointer-events-none"
              style={{
                left: `${node.x - 2}%`,
                top: `${node.y - 18}%`,
                transform: 'translate(-50%, -50%)',
              }}>
              <div className="text-lg animate-bounce">{currentUser?.avatar || '🦁'}</div>
            </div>
          )
        })()}
      </div>

      {/* Selected boss panel */}
      {selectedBossData && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4"
          style={{ borderColor: `${selectedBossData.auraColor}40` }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: `${selectedBossData.auraColor}20`, border: `2px solid ${selectedBossData.auraColor}40` }}>
              {WORLD_NODES.find(n => n.id === selectedBossData.id)?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="font-black text-white text-lg">{selectedBossData.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: `${DIFFICULTY_COLORS[selectedBossData.difficulty]}20`, color: DIFFICULTY_COLORS[selectedBossData.difficulty] }}>
                  {DIFFICULTY_LABELS[selectedBossData.difficulty]}
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">"{selectedBossData.lore}"</p>
              <div className="text-xs text-slate-500 mt-1">{selectedBossData.world}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-white">{selectedBossData.hp}</div>
              <div className="text-xs text-slate-400">Boss HP</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-yellow-400">+{selectedBossData.xpReward}</div>
              <div className="text-xs text-slate-400">XP Reward</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-yellow-400">🪙{selectedBossData.coinReward}</div>
              <div className="text-xs text-slate-400">Coins</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
              <Sword className="w-3.5 h-3.5 text-red-400" />
              <span className="text-slate-400">Attack: </span>
              <span className="text-red-400 font-bold">{selectedBossData.attackName}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-slate-400">Weakness: </span>
              <span className="text-brand-400 font-bold">{selectedBossData.weaknessName}</span>
            </div>
          </div>

          {isUnlocked(selectedNodeIndex) ? (
            <button
              onClick={() => navigate(`/boss/${selectedBossData.id}`)}
              className="w-full py-3 font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: selectedBossData.auraColor, boxShadow: `0 4px 20px ${selectedBossData.auraColor}60` }}
            >
              <Sword className="w-4 h-4" />
              {isDefeated(selectedBossData.id) ? 'Challenge Again' : 'Begin Battle!'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full py-3 bg-slate-800 text-slate-500 font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Defeat previous boss to unlock
            </div>
          )}
        </div>
      )}

      {/* Boss list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BOSSES.map((boss, i) => {
          const unlocked = isUnlocked(i)
          const defeated = isDefeated(boss.id)
          return (
            <button key={boss.id}
              onClick={() => unlocked && setSelectedBoss(selectedBoss === boss.id ? null : boss.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all
                ${defeated
                  ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
                  : unlocked
                    ? 'bg-slate-900 border-white/10 hover:border-white/20'
                    : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                }
                ${selectedBoss === boss.id ? 'ring-2' : ''}
              `}
              style={selectedBoss === boss.id ? { ringColor: boss.auraColor } : {}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${boss.auraColor}20` }}>
                {defeated ? '✅' : unlocked ? WORLD_NODES.find(n => n.id === boss.id)?.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate">{boss.name}</div>
                <div className="text-xs text-slate-500">{DIFFICULTY_LABELS[boss.difficulty]}</div>
              </div>
              <div className="text-xs font-bold" style={{ color: boss.auraColor }}>
                +{boss.xpReward} XP
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
