import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'
import { formatCurrency, calcBudgetUsed, getMonthlyIncome, getMonthlyExpenses } from '../utils/finance'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PRESET_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#f97316', '#84cc16', '#14b8a6'
]

export default function Budget() {
  const { transactions, budgets, addBudget, deleteBudget, updateBudget } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ category: '', limit: '', color: '#22c55e' })

  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const budgetData = calcBudgetUsed(budgets, transactions)
  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0)
  const overBudgetCount = budgetData.filter(b => b.overBudget).length

  const chartData = budgetData.map(b => ({
    category: b.category.slice(0, 8),
    budget: b.limit,
    spent: b.spent,
  }))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.category || !form.limit) return
    addBudget({ ...form, limit: parseFloat(form.limit) })
    setForm({ category: '', limit: '', color: '#22c55e' })
    setShowAdd(false)
  }

  const expenseCategories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Other', 'Subscriptions', 'Education', 'Pets', 'Travel']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Tracker</h1>
          <p className="text-slate-400 mt-1">Set limits. Track spending. Stay in control.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-glow flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: formatCurrency(totalBudgeted), icon: '📋', color: '#6366f1' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: '💸', color: '#f59e0b' },
          { label: 'Remaining', value: formatCurrency(Math.max(0, totalBudgeted - totalSpent)), icon: '✅', color: '#22c55e' },
          { label: 'Over Budget', value: `${overBudgetCount} categories`, icon: overBudgetCount > 0 ? '⚠️' : '🎉', color: overBudgetCount > 0 ? '#ef4444' : '#22c55e' },
        ].map(card => (
          <div key={card.label} className="bg-slate-900 rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{card.icon}</div>
              <div>
                <div className="text-xs text-slate-400">{card.label}</div>
                <div className="text-lg font-bold text-white">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget vs Spent Chart */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Budget vs. Spent</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis dataKey="category" stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(v), name === 'budget' ? 'Budget' : 'Spent']}
              contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            />
            <Bar dataKey="budget" name="Budget" fill="#334155" radius={[4,4,0,0]} />
            <Bar dataKey="spent" name="Spent" radius={[4,4,0,0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.spent > entry.budget ? '#ef4444' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetData.map((budget) => (
          <div
            key={budget.id}
            className="bg-slate-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-white">{budget.category}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {budget.overBudget
                  ? <AlertTriangle className="w-4 h-4 text-red-400" />
                  : <CheckCircle className="w-4 h-4 text-brand-400" />
                }
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <ProgressBar value={budget.spent} max={budget.limit} color={budget.overBudget ? '#ef4444' : budget.color} />

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className={budget.overBudget ? 'text-red-400 font-medium' : 'text-slate-400'}>
                {budget.overBudget
                  ? `Over by ${formatCurrency(budget.spent - budget.limit)}`
                  : `${formatCurrency(budget.limit - budget.spent)} left`
                }
              </span>
              <span className="text-slate-500">{budget.percentage.toFixed(0)}% used</span>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Tip */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-600/5 border border-brand-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <div className="font-semibold text-white text-sm">50/30/20 Budget Check</div>
            <div className="text-xs text-slate-400 mt-1">
              Your income is <span className="text-white font-medium">{formatCurrency(income)}</span>.
              Ideally: <span className="text-brand-400">Needs {formatCurrency(income * 0.5)}</span> ·
              <span className="text-blue-400"> Wants {formatCurrency(income * 0.3)}</span> ·
              <span className="text-purple-400"> Savings {formatCurrency(income * 0.2)}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              You're spending {formatCurrency(expenses)} ({((expenses/income)*100).toFixed(0)}% of income)
            </div>
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Budget Category">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="">Select a category</option>
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Monthly Limit</label>
            <input
              type="number"
              value={form.limit}
              onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
              placeholder="500"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: form.color === color ? '#fff' : 'transparent',
                    transform: form.color === color ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Add Budget
          </button>
        </form>
      </Modal>
    </div>
  )
}
