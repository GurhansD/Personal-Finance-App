import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuthStore, getLevelProgress } from '../store/useAuthStore'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, Plus, ArrowUpRight, Zap,
  Shield, Target, CreditCard, AlertCircle, CheckCircle2, Sword
} from 'lucide-react'
import {
  formatCurrency, getMonthlyIncome, getMonthlyExpenses,
  getSpendingByCategory, calcNetWorth, getFinancialHealthScore, CATEGORY_COLORS
} from '../utils/finance'
import { BOSSES } from '../data/bossData'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-xl">
      <div className="text-xs text-slate-400 mb-2">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="font-semibold text-white">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { transactions, budgets, goals, debts, investments, netWorthHistory, addTransaction, user } = useStore()
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const [showAddTx, setShowAddTx] = useState(false)
  const [txForm, setTxForm] = useState({
    type: 'expense', category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0]
  })

  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const { totalAssets, totalLiabilities, netWorth } = calcNetWorth(investments, debts)
  const health = getFinancialHealthScore(transactions, budgets, goals, debts)
  const spendingByCategory = getSpendingByCategory(transactions)

  const pieData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name, value, color: CATEGORY_COLORS[name] || '#6b7280'
  }))

  const cashflowData = MONTHS.slice(0, new Date().getMonth() + 1).map((month, i) => ({
    month,
    income: Math.round(income * (0.85 + Math.random() * 0.3)),
    expenses: Math.round(expenses * (0.8 + Math.random() * 0.4)),
  }))
  // Fix last month to actual
  if (cashflowData.length > 0) {
    cashflowData[cashflowData.length - 1] = { month: MONTHS[new Date().getMonth()], income, expenses }
  }

  const healthColor = health.score >= 70 ? '#22c55e' : health.score >= 50 ? '#f59e0b' : '#ef4444'

  const handleAddTransaction = (e) => {
    e.preventDefault()
    if (!txForm.amount || !txForm.description) return
    addTransaction({ ...txForm, amount: parseFloat(txForm.amount) })
    setTxForm({ type: 'expense', category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
    setShowAddTx(false)
  }

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other']
  const expenseCategories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your financial overview for April 2026</p>
        </div>
        <button
          onClick={() => setShowAddTx(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow-lg flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Worth"
          value={formatCurrency(netWorth)}
          subtitle={`${formatCurrency(totalAssets)} assets`}
          icon="💎"
          color="#22c55e"
          trend={8.2}
          trendLabel="this month"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(income)}
          subtitle="This month"
          icon="💰"
          color="#3b82f6"
          trend={12.5}
          trendLabel="vs last month"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(expenses)}
          subtitle={`${savingsRate.toFixed(0)}% savings rate`}
          icon="📊"
          color="#f59e0b"
          trend={-3.2}
          trendLabel="vs last month"
        />
        <StatCard
          title="Financial Health"
          value={`${health.score}/100`}
          subtitle={health.label}
          icon={health.score >= 70 ? '🌟' : health.score >= 50 ? '📈' : '⚠️'}
          color={healthColor}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cashflow Chart */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Cash Flow</h2>
              <p className="text-xs text-slate-400 mt-0.5">Income vs. Expenses</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-400 inline-block" />Income</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" />Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fill="url(#income)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-bold text-white mb-1">Spending</h2>
          <p className="text-xs text-slate-400 mb-4">By category this month</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net Worth + Health Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Net Worth History */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-bold text-white mb-1">Net Worth Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Assets minus liabilities</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={netWorthHistory}>
              <XAxis dataKey="month" stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="assets" name="Assets" fill="#22c55e" opacity={0.8} radius={[4,4,0,0]} />
              <Bar dataKey="liabilities" name="Liabilities" fill="#ef4444" opacity={0.8} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Health Score */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-bold text-white mb-4">Health Score</h2>

          {/* Score Circle */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="10" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke={healthColor}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - health.score / 100)}`}
                  style={{ filter: `drop-shadow(0 0 8px ${healthColor}80)`, transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{health.score}</span>
                <span className="text-xs font-bold" style={{ color: healthColor }}>{health.grade}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {health.factors.map((factor) => (
              <div key={factor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {factor.status === 'good'
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    : factor.status === 'fair'
                    ? <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                    : <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  }
                  <span className="text-xs text-slate-400 truncate">{factor.name}</span>
                </div>
                <span className="text-xs font-semibold text-white">{factor.score}/{factor.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Recent Transactions</h2>
          <span className="text-xs text-slate-400">{transactions.length} total</span>
        </div>
        <div className="divide-y divide-white/5">
          {transactions.slice(0, 8).map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${CATEGORY_COLORS[tx.category] || '#6b7280'}20` }}
              >
                {tx.type === 'income' ? '💰' : '💸'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{tx.description}</div>
                <div className="text-xs text-slate-500">{tx.category} · {tx.date}</div>
              </div>
              <div className={`text-sm font-bold flex-shrink-0 ${tx.type === 'income' ? 'text-brand-400' : 'text-red-400'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boss Battle CTA */}
      {(() => {
        const defeatedBosses = currentUser?.defeatedBosses || []
        const nextBossIndex = BOSSES.findIndex(b => !defeatedBosses.includes(b.id))
        const nextBoss = nextBossIndex !== -1 ? BOSSES[nextBossIndex] : null
        if (!nextBoss) return (
          <div className="relative overflow-hidden rounded-2xl p-5 border border-yellow-500/30"
            style={{ background: 'linear-gradient(135deg, #1a1200, #2a1f00)' }}>
            <div className="text-lg font-black text-yellow-400">🏆 All Bosses Defeated!</div>
            <p className="text-sm text-slate-400 mt-1">You are the Finance Champion. All 5 bosses bow before you.</p>
          </div>
        )
        return (
          <div className="relative overflow-hidden rounded-2xl border cursor-pointer group"
            style={{ borderColor: `${nextBoss.auraColor}40`, background: `linear-gradient(135deg, ${nextBoss.bgGradient[0]}, ${nextBoss.bgGradient[1]})` }}
            onClick={() => navigate('/world-map')}>
            {/* animated bg particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute rounded-full"
                  style={{
                    width: 4 + (i % 3) * 3, height: 4 + (i % 3) * 3,
                    left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%`,
                    backgroundColor: nextBoss.auraColor, opacity: 0.2,
                    animation: `floatParticle ${2.5 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }} />
              ))}
            </div>
            <div className="relative p-5 flex items-center gap-4">
              <div className="text-4xl animate-float flex-shrink-0">
                {['🐉','👻','😈','🗿','👾'][nextBossIndex]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: nextBoss.auraColor }}>⚔️ Next Boss Battle</div>
                <div className="text-lg font-black text-white">{nextBoss.name}</div>
                <div className="text-xs text-slate-400 italic">{nextBoss.world}</div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-slate-400">Reward</div>
                <div className="font-black" style={{ color: nextBoss.auraColor }}>+{nextBoss.xpReward} XP</div>
                <div className="text-xs font-bold text-yellow-400 mt-1 group-hover:translate-x-1 transition-transform">
                  Fight →
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Add Transaction Modal */}
      <Modal isOpen={showAddTx} onClose={() => setShowAddTx(false)} title="Add Transaction">
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {['income', 'expense'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setTxForm(f => ({ ...f, type, category: type === 'income' ? 'Salary' : 'Food' }))}
                className={`py-3 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                  txForm.type === type
                    ? type === 'income'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-slate-800 border-transparent text-slate-400 hover:border-white/20'
                }`}
              >
                {type === 'income' ? '💰 Income' : '💸 Expense'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Amount</label>
            <input
              type="number"
              value={txForm.amount}
              onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-lg font-bold"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <input
              type="text"
              value={txForm.description}
              onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What was this for?"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
              <select
                value={txForm.category}
                onChange={e => setTxForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
              >
                {(txForm.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Date</label>
              <input
                type="date"
                value={txForm.date}
                onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow"
          >
            Add Transaction
          </button>
        </form>
      </Modal>
    </div>
  )
}
