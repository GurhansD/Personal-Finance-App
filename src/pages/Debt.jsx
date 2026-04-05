import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, TrendingDown, Flame, Snowflake } from 'lucide-react'
import { formatCurrency, formatPercent, calcDebtPayoff } from '../utils/finance'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Debt() {
  const { debts, addDebt, deleteDebt } = useStore()
  const [method, setMethod] = useState('avalanche')
  const [extraPayment, setExtraPayment] = useState(200)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', balance: '', interestRate: '', minimumPayment: '', color: '#ef4444' })

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0)
  const totalMinimum = debts.reduce((s, d) => s + d.minimumPayment, 0)
  const avgInterest = debts.length > 0
    ? debts.reduce((s, d) => s + d.interestRate, 0) / debts.length : 0

  const { schedule, totalMonths, totalInterest } = calcDebtPayoff(debts, extraPayment, method)
  const { totalMonths: baseMonths, totalInterest: baseInterest } = calcDebtPayoff(debts, 0, method)

  const interestSaved = baseInterest - totalInterest
  const monthsSaved = baseMonths - totalMonths

  // Generate payoff projection chart
  const generatePayoffChart = () => {
    const points = []
    for (let m = 0; m <= Math.min(totalMonths, 60); m += 3) {
      const progress = m / Math.max(totalMonths, 1)
      points.push({
        month: m,
        balance: Math.max(0, totalDebt * (1 - progress)),
      })
    }
    points.push({ month: totalMonths, balance: 0 })
    return points
  }

  const chartData = generatePayoffChart()

  const handleAdd = (e) => {
    e.preventDefault()
    addDebt({
      ...form,
      balance: parseFloat(form.balance),
      interestRate: parseFloat(form.interestRate),
      minimumPayment: parseFloat(form.minimumPayment),
    })
    setForm({ name: '', balance: '', interestRate: '', minimumPayment: '', color: '#ef4444' })
    setShowAdd(false)
  }

  const sortedDebts = [...debts].sort((a, b) =>
    method === 'avalanche' ? b.interestRate - a.interestRate : a.balance - b.balance
  )

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Debt Destroyer</h1>
          <p className="text-slate-400 mt-1">Visualize your path to financial freedom</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-glow flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Debt
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Debt', value: formatCurrency(totalDebt), icon: '💳', color: '#ef4444' },
          { label: 'Avg Interest', value: `${avgInterest.toFixed(1)}%`, icon: '📊', color: '#f97316' },
          { label: 'Min. Monthly', value: formatCurrency(totalMinimum), icon: '📅', color: '#f59e0b' },
          { label: 'Payoff In', value: `${totalMonths} mo`, icon: '🏁', color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-5 border border-white/5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-lg font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Method Selector + Extra Payment */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Payoff Strategy</h2>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setMethod('avalanche')}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              method === 'avalanche'
                ? 'border-red-500 bg-red-500/10'
                : 'border-white/10 hover:border-white/20 bg-slate-800'
            }`}
          >
            <Flame className={`w-5 h-5 mt-0.5 flex-shrink-0 ${method === 'avalanche' ? 'text-red-400' : 'text-slate-400'}`} />
            <div>
              <div className={`font-semibold text-sm ${method === 'avalanche' ? 'text-white' : 'text-slate-300'}`}>Avalanche</div>
              <div className="text-xs text-slate-400 mt-0.5">Highest interest rate first — saves the most money</div>
            </div>
          </button>

          <button
            onClick={() => setMethod('snowball')}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              method === 'snowball'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 hover:border-white/20 bg-slate-800'
            }`}
          >
            <Snowflake className={`w-5 h-5 mt-0.5 flex-shrink-0 ${method === 'snowball' ? 'text-blue-400' : 'text-slate-400'}`} />
            <div>
              <div className={`font-semibold text-sm ${method === 'snowball' ? 'text-white' : 'text-slate-300'}`}>Snowball</div>
              <div className="text-xs text-slate-400 mt-0.5">Smallest balance first — builds momentum faster</div>
            </div>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white">Extra Monthly Payment</label>
            <span className="text-brand-400 font-bold">{formatCurrency(extraPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={25}
            value={extraPayment}
            onChange={e => setExtraPayment(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>$0</span>
            <span>$1,000</span>
          </div>
        </div>

        {extraPayment > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-brand-400">{formatCurrency(interestSaved)}</div>
              <div className="text-xs text-slate-400">Interest Saved</div>
            </div>
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-brand-400">{monthsSaved} months</div>
              <div className="text-xs text-slate-400">Faster Payoff</div>
            </div>
          </div>
        )}
      </div>

      {/* Payoff Projection Chart */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Debt Payoff Projection</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={v => v === 0 ? 'Now' : `${v}m`} />
            <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip
              formatter={v => [formatCurrency(v), 'Remaining Debt']}
              labelFormatter={v => `Month ${v}`}
              contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            />
            <Area type="monotone" dataKey="balance" stroke="#ef4444" strokeWidth={2} fill="url(#debtGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Debt Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white">Your Debts</h2>
        <p className="text-xs text-slate-400">Ordered by {method === 'avalanche' ? 'highest interest rate (Avalanche)' : 'smallest balance (Snowball)'}</p>
        {sortedDebts.map((debt, index) => (
          <div key={debt.id} className="bg-slate-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 text-white"
                style={{ backgroundColor: `${COLORS[index % COLORS.length]}30`, color: COLORS[index % COLORS.length] }}
              >
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-semibold text-white">{debt.name}</span>
                    <span className="text-xs text-red-400 ml-2 font-medium">{debt.interestRate}% APR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">{formatCurrency(debt.balance)}</span>
                    <button
                      onClick={() => { if (window.confirm('Remove this debt?')) deleteDebt(debt.id) }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Min: {formatCurrency(debt.minimumPayment)}/mo</span>
                  <span>•</span>
                  <span>Total interest: {formatCurrency(schedule.find(s => s.id === debt.id)?.interest || 0)}</span>
                  <span>•</span>
                  <span>Payoff: {schedule.find(s => s.id === debt.id)?.months || 0} months</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Debt Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Debt">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Debt Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Student Loan, Credit Card"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Balance</label>
              <input type="number" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} placeholder="10000" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Interest Rate (%)</label>
              <input type="number" step="0.1" value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} placeholder="5.8" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Minimum Monthly Payment</label>
            <input type="number" value={form.minimumPayment} onChange={e => setForm(f => ({ ...f, minimumPayment: e.target.value }))} placeholder="200" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
          </div>
          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Add Debt
          </button>
        </form>
      </Modal>
    </div>
  )
}
