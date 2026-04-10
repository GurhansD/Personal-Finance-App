import { useState } from 'react'
import { useAuthStore, AVATARS, getLevelProgress, LEVEL_THRESHOLDS } from '../store/useAuthStore'
import { useStore } from '../store/useStore'
import { getFinancialHealthScore, getMonthlyIncome, getMonthlyExpenses, formatCurrency } from '../utils/finance'
import { BADGES } from '../data/challenges'
import { Edit2, Save, X, Shield, Zap, Flame, Trophy, TrendingUp } from 'lucide-react'

export default function Profile() {
  const { currentUser, updateUser } = useAuthStore()
  const { transactions, budgets, goals, debts } = useStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: currentUser?.name || '', avatar: currentUser?.avatar || '🦁' })

  const { level, progress, next, current } = getLevelProgress(currentUser?.xp || 0)
  const health = getFinancialHealthScore(transactions, budgets, goals, debts)
  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const badges = currentUser?.badges || []
  const xp = currentUser?.xp || 0

  const handleSave = () => {
    updateUser({ name: form.name, avatar: form.avatar })
    setEditing(false)
  }

  const xpToNext = next - xp
  const completedLessons = currentUser?.completedLessons || []
  const completedChallenges = currentUser?.completedChallenges || []

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white">Your Profile</h1>

      {/* Profile Card */}
      <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600/30 via-brand-500/20 to-transparent" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-4xl shadow-card">
                {editing ? form.avatar : (currentUser?.avatar || '🦁')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-slate-900">
                {level}
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                editing ? 'bg-brand-500 text-white shadow-glow' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {editing ? <><Save className="w-4 h-4" />Save</> : <><Edit2 className="w-4 h-4" />Edit</>}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Display Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => setForm(f => ({ ...f, avatar: av }))}
                      className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-all border-2 ${
                        form.avatar === av ? 'border-brand-500 bg-brand-500/20 scale-110' : 'border-transparent bg-slate-800 hover:border-white/20'
                      }`}
                    >{av}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />Cancel
              </button>
            </div>
          ) : (
            <div>
              <div className="text-xl font-black text-white">{currentUser?.name}</div>
              <div className="text-sm text-slate-400">{currentUser?.email}</div>
              <div className="text-xs text-slate-500 mt-1">
                Member since {new Date(currentUser?.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* XP & Level Progress */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Level {level} — {xp.toLocaleString()} XP
          </h2>
          <span className="text-xs text-slate-400">{xpToNext.toLocaleString()} XP to Level {level + 1}</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {LEVEL_THRESHOLDS.slice(0, 8).map((threshold, i) => (
            <div key={i} className={`text-center p-2 rounded-xl text-xs ${xp >= threshold ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-600'}`}>
              <div className="font-bold">Lv {i + 1}</div>
              <div>{threshold >= 1000 ? `${threshold/1000}k` : threshold}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: <Flame className="w-5 h-5 text-orange-400" />, label: 'Day Streak', value: currentUser?.streak || 1 },
          { icon: <Shield className="w-5 h-5 text-blue-400" />, label: 'Health Score', value: `${health.score}/100` },
          { icon: <TrendingUp className="w-5 h-5 text-brand-400" />, label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%` },
          { icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: 'Challenges Done', value: completedChallenges.length },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">{s.icon}</div>
            <div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Badges ({badges.length}/{BADGES.length})
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const earned = badges.includes(badge.id)
            return (
              <div key={badge.id} title={badge.desc} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                earned ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-slate-800/50 border-transparent opacity-40 grayscale'
              }`}>
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-semibold text-white leading-tight">{badge.name}</div>
                {earned && <div className="text-xs text-yellow-400 mt-0.5">✓</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lessons completed */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-sm">Academy Progress</h2>
          <span className="text-xs text-brand-400">{completedLessons.length}/6 lessons</span>
        </div>
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
            style={{ width: `${(completedLessons.length / 6) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {completedLessons.length === 6 ? '🎓 Scholar badge unlocked!' : `Complete ${6 - completedLessons.length} more to earn the Scholar badge`}
        </div>
      </div>
    </div>
  )
}
