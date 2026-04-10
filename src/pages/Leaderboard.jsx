import { useState, useMemo } from 'react'
import { useAuthStore, MOCK_GLOBAL_USERS } from '../store/useAuthStore'
import { useStore } from '../store/useStore'
import { getFinancialHealthScore, getMonthlyIncome, getMonthlyExpenses } from '../utils/finance'
import { Trophy, Medal, Crown, TrendingUp, Zap, Flame, Star } from 'lucide-react'

const TABS = ['Overall', 'Health Score', 'XP Earned', 'Savings Rate']
const PERIODS = ['All Time', 'This Month', 'This Week']

function getRankIcon(rank) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
  return <span className="text-slate-400 font-bold text-sm w-5 text-center">#{rank}</span>
}

function getRankBg(rank) {
  if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30'
  if (rank === 2) return 'bg-slate-500/10 border-slate-500/30'
  if (rank === 3) return 'bg-amber-700/10 border-amber-700/30'
  return 'bg-slate-900 border-white/5'
}

export default function Leaderboard() {
  const [tab, setTab] = useState('Overall')
  const [period, setPeriod] = useState('All Time')
  const { currentUser } = useAuthStore()
  const { transactions, budgets, goals, debts } = useStore()

  // Build current user's entry
  const health = getFinancialHealthScore(transactions, budgets, goals, debts)
  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0

  const myEntry = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    xp: currentUser.xp || 0,
    level: currentUser.level || 1,
    streak: currentUser.streak || 1,
    healthScore: health.score,
    savingsRate,
    badges: currentUser.badges || [],
    isMe: true,
  } : null

  const allUsers = useMemo(() => {
    const base = [...MOCK_GLOBAL_USERS]
    if (myEntry) base.push(myEntry)
    return base
  }, [myEntry])

  const sorted = useMemo(() => {
    const arr = [...allUsers]
    if (tab === 'Health Score') arr.sort((a, b) => b.healthScore - a.healthScore)
    else if (tab === 'XP Earned') arr.sort((a, b) => b.xp - a.xp)
    else if (tab === 'Savings Rate') arr.sort((a, b) => b.savingsRate - a.savingsRate)
    else arr.sort((a, b) => (b.xp * 0.4 + b.healthScore * 0.4 + b.savingsRate * 0.2) - (a.xp * 0.4 + a.healthScore * 0.4 + a.savingsRate * 0.2))
    return arr.map((u, i) => ({ ...u, rank: i + 1 }))
  }, [allUsers, tab])

  const myRanked = myEntry ? sorted.find(u => u.isMe) : null
  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const getMetric = (user) => {
    if (tab === 'Health Score') return `${user.healthScore}/100`
    if (tab === 'XP Earned') return `${user.xp.toLocaleString()} XP`
    if (tab === 'Savings Rate') return `${user.savingsRate}%`
    const score = Math.round(user.xp * 0.4 + user.healthScore * 0.4 + user.savingsRate * 0.2)
    return `${score.toLocaleString()} pts`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Global Leaderboard
        </h1>
        <p className="text-slate-400 mt-1">Compete with {allUsers.length.toLocaleString()}+ Finwise users worldwide</p>
      </div>

      {/* Your Rank Banner */}
      {myRanked && (
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-500/20 via-brand-600/10 to-transparent border border-brand-500/30 rounded-2xl p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border-2 border-brand-500/50">
                  {myRanked.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-xs font-black text-white">
                  {myRanked.rank}
                </div>
              </div>
              <div>
                <div className="text-xs text-brand-400 font-medium mb-0.5">Your Ranking</div>
                <div className="text-xl font-black text-white">#{myRanked.rank} out of {sorted.length}</div>
                <div className="text-xs text-slate-400">{myRanked.name} · Level {myRanked.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-brand-400">{getMetric(myRanked)}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {myRanked.rank <= 3 ? '🏆 Top 3!' : myRanked.rank <= 10 ? '🔥 Top 10!' : 'Keep climbing!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              tab === t ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' : 'bg-slate-800 text-slate-400 hover:text-white border-transparent'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[top3[1], top3[0], top3[2]].map((user, i) => {
          if (!user) return <div key={i} />
          const positions = [2, 1, 3]
          const rank = positions[i]
          const heights = ['h-24', 'h-32', 'h-20']
          const glows = ['', 'shadow-glow', '']
          return (
            <div key={user.id} className={`flex flex-col items-center ${i === 1 ? '-mt-4' : 'mt-4'}`}>
              <div className="relative mb-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 ${
                  rank === 1 ? 'border-yellow-500 bg-yellow-500/10' : rank === 2 ? 'border-slate-400 bg-slate-700/50' : 'border-amber-700 bg-amber-900/20'
                } ${user.isMe ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-950' : ''}`}>
                  {user.avatar}
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : 'bg-amber-700'
                }`}>
                  {rank === 1 ? '👑' : rank}
                </div>
              </div>
              <div className={`w-full rounded-t-xl flex flex-col items-center justify-end pb-4 pt-3 ${heights[i]} ${
                rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : rank === 2 ? 'bg-slate-800 border border-white/10' : 'bg-amber-900/10 border border-amber-700/30'
              } ${glows[i]}`}>
                <div className="text-xs font-bold text-white truncate w-full text-center px-2">{user.name.split(' ')[0]}</div>
                <div className={`text-xs font-semibold mt-1 ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-300' : 'text-amber-600'}`}>
                  {getMetric(user)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Rankings */}
      <div className="space-y-2">
        {rest.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              user.isMe
                ? 'bg-brand-500/10 border-brand-500/30 shadow-glow/20'
                : `${getRankBg(user.rank)} hover:border-white/15`
            }`}
          >
            <div className="w-8 flex items-center justify-center flex-shrink-0">
              {getRankIcon(user.rank)}
            </div>

            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-slate-800 border border-white/5">
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm truncate ${user.isMe ? 'text-brand-300' : 'text-white'}`}>
                  {user.name}{user.isMe && ' (You)'}
                </span>
                {user.badges?.includes('top-earner') && <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" />Lv {user.level}</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{user.streak}d</span>
                <span>{user.badges?.length || 0} badges</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className={`font-bold text-sm ${user.isMe ? 'text-brand-400' : 'text-white'}`}>
                {getMetric(user)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Rank #{user.rank}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips to climb */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900 border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-400" />
          How to climb the leaderboard
        </h3>
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
          {[
            ['📊','Complete daily budget check-ins','30 XP/day'],
            ['🎓','Finish Finance Academy lessons','100-200 XP each'],
            ['🔥','Maintain your daily streak','Bonus multiplier'],
            ['💳','Pay off debts','Up to 500 XP'],
            ['🎯','Hit savings goals','250 XP per goal'],
            ['🏆','Complete weekly challenges','200-500 XP'],
          ].map(([icon, label, reward]) => (
            <div key={label} className="flex items-center justify-between gap-2 p-2 bg-slate-800 rounded-lg">
              <span className="flex items-center gap-2">{icon} {label}</span>
              <span className="text-brand-400 font-semibold flex-shrink-0">+{reward}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
