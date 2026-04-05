import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatCurrencyFull, formatPercent, calcPortfolioGain, calcCompoundInterest } from '../utils/finance'
import Modal from '../components/Modal'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'

export default function Invest() {
  const { investments, addInvestment, deleteInvestment } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [form, setForm] = useState({ name: '', ticker: '', shares: '', costBasis: '', currentPrice: '', color: '#22c55e' })
  const [calc, setCalc] = useState({ principal: 10000, monthly: 500, rate: 10, years: 30 })

  const { totalCost, totalValue, gain, gainPercent } = calcPortfolioGain(investments)
  const { finalBalance, data: compoundData } = calcCompoundInterest(calc.principal, calc.monthly, calc.rate, calc.years)

  const pieData = investments.map(inv => ({
    name: inv.ticker,
    value: inv.shares * inv.currentPrice,
    color: inv.color,
  }))

  const handleAdd = (e) => {
    e.preventDefault()
    addInvestment({
      ...form,
      shares: parseFloat(form.shares),
      costBasis: parseFloat(form.costBasis),
      currentPrice: parseFloat(form.currentPrice),
    })
    setForm({ name: '', ticker: '', shares: '', costBasis: '', currentPrice: '', color: '#22c55e' })
    setShowAdd(false)
  }

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Portfolio</h1>
          <p className="text-slate-400 mt-1">Track your wealth-building assets</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowCalc(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all border border-white/10"
          >
            🧮 Calculator
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value', value: formatCurrency(totalValue), icon: '💼' },
          { label: 'Total Invested', value: formatCurrency(totalCost), icon: '💵' },
          { label: 'Total Gain/Loss', value: formatCurrency(gain), icon: gain >= 0 ? '📈' : '📉', positive: gain >= 0 },
          { label: 'Return', value: `${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(1)}%`, icon: '🎯', positive: gainPercent >= 0 },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-5 border border-white/5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-lg font-bold ${s.positive === undefined ? 'text-white' : s.positive ? 'text-brand-400' : 'text-red-400'}`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Portfolio Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-bold text-white mb-4">Allocation</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" strokeWidth={0} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings Table */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="text-base font-bold text-white mb-4">Holdings</h2>
          <div className="space-y-3">
            {investments.map((inv) => {
              const value = inv.shares * inv.currentPrice
              const cost = inv.shares * inv.costBasis
              const g = value - cost
              const gp = cost > 0 ? (g / cost) * 100 : 0
              const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0

              return (
                <div key={inv.id} className="flex items-center gap-3 group">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ backgroundColor: `${inv.color}25`, color: inv.color }}
                  >
                    {inv.ticker.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">{inv.name}</span>
                      <span className="text-sm font-bold text-white">{formatCurrency(value)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-500">{inv.shares} shares · {allocation.toFixed(1)}%</span>
                      <span className={`text-xs font-medium ${gp >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
                        {gp >= 0 ? '+' : ''}{gp.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteInvestment(inv.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Individual Holdings Detail */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {investments.map((inv) => {
          const value = inv.shares * inv.currentPrice
          const cost = inv.shares * inv.costBasis
          const g = value - cost
          const gp = cost > 0 ? (g / cost) * 100 : 0
          const isUp = g >= 0

          return (
            <div key={inv.id} className="bg-slate-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-slate-400">{inv.name}</div>
                  <div className="font-bold text-white text-lg">{inv.ticker}</div>
                </div>
                {isUp
                  ? <TrendingUp className="w-5 h-5 text-brand-400" />
                  : <TrendingDown className="w-5 h-5 text-red-400" />
                }
              </div>

              <div className="text-xl font-black text-white mb-1">{formatCurrency(value)}</div>
              <div className={`text-sm font-semibold mb-3 ${isUp ? 'text-brand-400' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{formatCurrency(g)} ({isUp ? '+' : ''}{gp.toFixed(1)}%)
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Shares</span>
                  <span className="text-white">{inv.shares}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Price</span>
                  <span className="text-white">{formatCurrencyFull(inv.currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Cost</span>
                  <span className="text-white">{formatCurrencyFull(inv.costBasis)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Compound Interest Calculator Modal */}
      <Modal isOpen={showCalc} onClose={() => setShowCalc(false)} title="Compound Interest Calculator" size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Initial Investment', key: 'principal', min: 0, max: 100000, step: 1000 },
              { label: 'Monthly Contribution', key: 'monthly', min: 0, max: 5000, step: 50 },
              { label: 'Annual Return (%)', key: 'rate', min: 1, max: 20, step: 0.5 },
              { label: 'Time Period (Years)', key: 'years', min: 1, max: 50, step: 1 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-brand-400 font-bold">
                    {key === 'rate' ? `${calc[key]}%` : key === 'years' ? `${calc[key]} yrs` : formatCurrency(calc[key])}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={calc[key]}
                  onChange={e => setCalc(c => ({ ...c, [key]: Number(e.target.value) }))}
                  className="w-full accent-brand-500"
                />
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="text-lg font-black text-white">{formatCurrency(calc.principal + calc.monthly * calc.years * 12)}</div>
              <div className="text-xs text-slate-400">Total Invested</div>
            </div>
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
              <div className="text-xl font-black text-brand-400">{formatCurrency(finalBalance)}</div>
              <div className="text-xs text-slate-400">Final Balance</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="text-lg font-black text-white">{formatCurrency(finalBalance - (calc.principal + calc.monthly * calc.years * 12))}</div>
              <div className="text-xs text-slate-400">Interest Earned</div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={compoundData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `Yr${v}`} />
              <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${Math.round(v/1000)}k`} />
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#3b82f6" strokeWidth={1.5} fill="url(#contribGrad)" />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="#22c55e" strokeWidth={2} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Modal>

      {/* Add Investment Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Investment">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="S&P 500 ETF" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Ticker</label>
              <input type="text" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))} placeholder="VOO" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Shares</label>
              <input type="number" step="0.001" value={form.shares} onChange={e => setForm(f => ({ ...f, shares: e.target.value }))} placeholder="10" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Avg Cost</label>
              <input type="number" step="0.01" value={form.costBasis} onChange={e => setForm(f => ({ ...f, costBasis: e.target.value }))} placeholder="400" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Current Price</label>
              <input type="number" step="0.01" value={form.currentPrice} onChange={e => setForm(f => ({ ...f, currentPrice: e.target.value }))} placeholder="480" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button key={color} type="button" onClick={() => setForm(f => ({ ...f, color }))} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ backgroundColor: color, borderColor: form.color === color ? '#fff' : 'transparent', transform: form.color === color ? 'scale(1.15)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Add Investment
          </button>
        </form>
      </Modal>
    </div>
  )
}
