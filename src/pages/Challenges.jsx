import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useStore } from '../store/useStore'
import { getDailyChallenges, getWeeklyChallenges, BADGES } from '../data/challenges'
import { useToast } from '../components/Toast'
import Confetti from '../components/Confetti'
import MoneyRain from '../components/MoneyRain'
import { Zap, Trophy, Flame, CheckCircle2, Clock, Star, Target } from 'lucide-react'

function ChallengeCard({ challenge, isCompleted, onComplete }) {
  const [claiming, setClaiming] = useState(false)

  const handleClaim = async () => {
    setClaiming(true)
    setTimeout(() => {
      onComplete(challenge.id, challenge.xp)
      setClaiming(false)
    }, 600)
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${
      isCompleted
        ? 'bg-brand-500/5 border-brand-500/20'
        : 'bg-slate-900 border-white/5 hover:border-white/10'
    }`}>
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
          isCompleted ? 'bg-brand-500/20' : 'bg-slate-800'
        }`}>
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`font-bold text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
              {challenge.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              challenge.type === 'daily'
                ? 'bg-orange-500/10 text-orange-400'
                : 'bg-purple-500/10 text-purple-400'
            }`}>
              {challenge.type}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">{challenge.desc}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-bold text-yellow-400">+{challenge.xp} XP</span>
            </div>

            {!isCompleted ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 border border-brand-500/30 rounded-xl text-xs font-semibold transition-all"
              >
                {claiming ? '✓ Claiming...' : 'Mark Complete'}
              </button>
            ) : (
              <span className="text-xs text-brand-400 font-medium">Completed! 🎉</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ badge, earned }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
      earned
        ? 'bg-yellow-500/10 border-yellow-500/20'
        : 'bg-slate-900/50 border-white/5 opacity-50 grayscale'
    }`}>
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className={`text-xs font-bold ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</div>
      <div className="text-xs text-slate-600 mt-0.5">{badge.desc}</div>
      {earned && <div className="mt-1 text-xs text-yellow-400 font-medium">Earned ✓</div>}
    </div>
  )
}

export default function Challenges() {
  const { currentUser, completeChallenge, addBadge } = useAuthStore()
  const { addToast } = useToast()
  const [confetti, setConfetti] = useState(false)
  const [moneyRain, setMoneyRain] = useState(false)
  const [activeTab, setActiveTab] = useState('challenges')

  const completed = currentUser?.completedChallenges || []
  const badges = currentUser?.badges || []
  const xp = currentUser?.xp || 0

  const dailyChallenges = getDailyChallenges()
  const weeklyChallenges = getWeeklyChallenges()

  const dailyDone = dailyChallenges.filter(c => completed.includes(c.id)).length
  const weeklyDone = weeklyChallenges.filter(c => completed.includes(c.id)).length

  const handleComplete = (id, xpReward) => {
    completeChallenge(id, xpReward)
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3100)
    addToast({ type: 'xp', title: `+${xpReward} XP!`, message: 'Challenge completed!' })

    // Check for challenger badge
    const newCount = completed.length + 1
    if (newCount >= 10 && !badges.includes('challenger')) {
      addBadge('challenger')
      addToast({ type: 'achievement', title: '🏆 Badge Earned!', message: 'Challenger — 10 challenges complete!' })
      setMoneyRain(true)
      setTimeout(() => setMoneyRain(false), 100)
    }
  }

  // Streak info
  const streak = currentUser?.streak || 1
  const streakDays = Array.from({ length: 7 }, (_, i) => i < streak % 7 || streak >= 7)

  return (
    <div className="space-y-6">
      <Confetti active={confetti} />
      {moneyRain && <MoneyRain />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-400" />
          Challenges & Badges
        </h1>
        <p className="text-slate-400 mt-1">Complete daily and weekly challenges to earn XP and badges</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🔥', label: 'Day Streak', value: streak },
          { icon: '⚡', label: 'Total XP', value: xp.toLocaleString() },
          { icon: '🏆', label: 'Badges Earned', value: badges.length },
          { icon: '✅', label: 'Challenges Done', value: completed.length },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-4 border border-white/5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak Calendar */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            {streak}-Day Streak
          </h2>
          <span className="text-xs text-slate-400">Last 7 days</span>
        </div>
        <div className="flex gap-2">
          {['M','T','W','T','F','S','S'].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm transition-all ${
                streakDays[i]
                  ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg'
                  : 'bg-slate-800'
              }`}>
                {streakDays[i] ? '🔥' : ''}
              </div>
              <span className="text-xs text-slate-500">{day}</span>
            </div>
          ))}
        </div>
        {streak >= 7 && (
          <div className="mt-3 text-center text-xs text-orange-400 font-medium">
            🎉 7-day streak bonus active! +25% XP on all activities
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['challenges', 'badges'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
              activeTab === t ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' : 'bg-slate-800 text-slate-400 hover:text-white border-transparent'
            }`}
          >
            {t === 'challenges' ? '⚡ Challenges' : '🏆 Badges'}
          </button>
        ))}
      </div>

      {activeTab === 'challenges' && (
        <>
          {/* Daily */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                Daily Challenges
                <span className="text-xs text-slate-500 font-normal">Resets at midnight</span>
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                dailyDone === dailyChallenges.length ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {dailyDone}/{dailyChallenges.length} done
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dailyChallenges.map(c => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  isCompleted={completed.includes(c.id)}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          </div>

          {/* Weekly */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                Weekly Challenges
                <span className="text-xs text-slate-500 font-normal">Resets Monday</span>
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                weeklyDone === weeklyChallenges.length ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {weeklyDone}/{weeklyChallenges.length} done
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weeklyChallenges.map(c => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  isCompleted={completed.includes(c.id)}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          </div>

          {/* XP until next level */}
          {currentUser && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Complete more challenges to level up!</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    You're Level {currentUser.level}. Finish today's challenges for up to <span className="text-yellow-400 font-semibold">
                      {dailyChallenges.filter(c => !completed.includes(c.id)).reduce((s, c) => s + c.xp, 0) +
                       weeklyChallenges.filter(c => !completed.includes(c.id)).reduce((s, c) => s + c.xp, 0)}</span> XP.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'badges' && (
        <div>
          <p className="text-sm text-slate-400 mb-4">
            {badges.length}/{BADGES.length} badges earned
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BADGES.map(badge => (
              <BadgeCard key={badge.id} badge={badge} earned={badges.includes(badge.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
