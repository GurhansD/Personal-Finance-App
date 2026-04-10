import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/Toast'
import SpinWheel from '../components/SpinWheel'
import Confetti from '../components/Confetti'
import { Zap, Calendar, Flame, Gift, Star } from 'lucide-react'

const DAILY_LOGIN_REWARDS = [
  { day: 1, reward: '25 XP',  xp: 25,  icon: '🌟' },
  { day: 2, reward: '50 XP',  xp: 50,  icon: '💰' },
  { day: 3, reward: '75 XP',  xp: 75,  icon: '🔥' },
  { day: 4, reward: '100 XP', xp: 100, icon: '💎' },
  { day: 5, reward: '150 XP', xp: 150, icon: '🚀' },
  { day: 6, reward: '200 XP', xp: 200, icon: '👑' },
  { day: 7, reward: '300 XP + Badge', xp: 300, icon: '🏆', badge: 'streak-30' },
]

export default function DailyBonus() {
  const { currentUser, awardXp } = useAuthStore()
  const { showToast } = useToast()
  const [showConfetti, setShowConfetti] = useState(false)
  const [spinResult, setSpinResult] = useState(null)

  const streak = currentUser?.streak || 1
  const lastSpinDate = currentUser?.lastSpinDate
  const todayStr = new Date().toISOString().split('T')[0]
  const canSpin = lastSpinDate !== todayStr

  const handleSpinResult = (value) => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3500)

    if (value.type === 'xp') {
      awardXp(value.amount, 'Daily Spin Bonus')
      showToast(`🎰 Spin bonus: +${value.amount} XP!`, 'xp')
    } else if (value.type === 'multiplier') {
      showToast('🚀 2× XP multiplier active for next reward!', 'achievement')
    }
    setSpinResult(value)
  }

  const currentDay = ((streak - 1) % 7) + 1

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {showConfetti && <Confetti />}

      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Gift className="w-6 h-6 text-yellow-400" />
          Daily Bonus
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Spin the wheel every day to earn bonus XP</p>
      </div>

      {/* Streak banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-orange-500/20"
        style={{ background: 'linear-gradient(135deg, #1a0800, #2d1500)' }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: 4, height: 4,
                left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 30}%`,
                backgroundColor: '#f97316',
                opacity: 0.3,
                animation: `floatParticle ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }} />
          ))}
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="text-5xl animate-float">🔥</div>
          <div>
            <div className="text-2xl font-black text-white">{streak} Day Streak!</div>
            <div className="text-sm text-orange-400">Keep it going — +50% XP bonus at 30 days</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-slate-500">Day {currentDay}/7</div>
            <div className="text-lg font-black text-orange-400">
              {DAILY_LOGIN_REWARDS[currentDay - 1]?.icon}
            </div>
          </div>
        </div>
      </div>

      {/* 7-day reward track */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
        <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          Weekly Reward Track
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {DAILY_LOGIN_REWARDS.map((reward, i) => {
            const dayNum = i + 1
            const isPast = dayNum < currentDay
            const isCurrent = dayNum === currentDay
            return (
              <div key={dayNum}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all
                  ${isPast
                    ? 'bg-brand-500/20 border-brand-500/40'
                    : isCurrent
                      ? 'bg-yellow-500/20 border-yellow-500/40 scale-105'
                      : 'bg-slate-800 border-transparent opacity-50'
                  }`}>
                <div className={`text-lg mb-1 ${isCurrent ? '' : ''}`}>{reward.icon}</div>
                <div className="text-xs font-bold text-center"
                  style={{ color: isPast ? '#22c55e' : isCurrent ? '#fbbf24' : '#64748b' }}>
                  D{dayNum}
                </div>
                {isPast && <Star className="w-3 h-3 text-brand-400 mt-0.5" fill="#22c55e" />}
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-xs text-slate-500 text-center">
          Day 7 reward: 🏆 +300 XP + streak badge!
        </div>
      </div>

      {/* Spin Wheel */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Daily Spin Wheel
        </h2>
        <p className="text-xs text-slate-400 mb-6">One spin per day — click to spin!</p>
        <SpinWheel onResult={handleSpinResult} canSpin={canSpin} />
      </div>

      {/* XP Today summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '⚡', label: 'Total XP', value: (currentUser?.xp || 0).toLocaleString() },
          { icon: '📅', label: 'This Week', value: (currentUser?.weeklyXp || 0).toLocaleString() },
          { icon: '🔥', label: 'Streak', value: `${streak} days` },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-4 border border-white/5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-lg font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
