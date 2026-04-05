import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, PlusCircle, CalendarDays } from 'lucide-react'
import { formatCurrency } from '../utils/finance'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'

const GOAL_ICONS = ['🎯', '✈️', '🏠', '🚗', '💻', '💍', '🎓', '🏖️', '🛡️', '🌍', '💰', '🎸', '🏋️', '📚', '🐾']
const GOAL_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316']

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showContribute, setShowContribute] = useState(null)
  const [contributeAmount, setContributeAmount] = useState('')
  const [form, setForm] = useState({
    name: '', target: '', current: '0', icon: '🎯', color: '#22c55e',
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const totalSaved = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const completedGoals = goals.filter(g => g.current >= g.target).length

  const handleAdd = (e) => {
    e.preventDefault()
    addGoal({ ...form, target: parseFloat(form.target), current: parseFloat(form.current) })
    setForm({
      name: '', target: '', current: '0', icon: '🎯', color: '#22c55e',
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    setShowAdd(false)
  }

  const handleContribute = (e) => {
    e.preventDefault()
    if (!contributeAmount || !showContribute) return
    const goal = goals.find(g => g.id === showContribute)
    updateGoal(showContribute, { current: Math.min(goal.current + parseFloat(contributeAmount), goal.target) })
    setContributeAmount('')
    setShowContribute(null)
  }

  const getDaysLeft = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getMonthlySavingsNeeded = (goal) => {
    const daysLeft = getDaysLeft(goal.deadline)
    if (daysLeft <= 0) return 0
    const monthsLeft = daysLeft / 30
    return (goal.target - goal.current) / monthsLeft
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-slate-400 mt-1">Dream big. Save smart. Achieve everything.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-glow flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Saved', value: formatCurrency(totalSaved), icon: '💰' },
          { label: 'Total Target', value: formatCurrency(totalTarget), icon: '🎯' },
          { label: 'Completed', value: `${completedGoals}/${goals.length}`, icon: '🏆' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl p-5 border border-white/5 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-lg font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      {totalTarget > 0 && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="text-sm text-brand-400 font-bold">{((totalSaved / totalTarget) * 100).toFixed(1)}%</span>
          </div>
          <ProgressBar value={totalSaved} max={totalTarget} size="lg" showLabel={false} />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatCurrency(totalSaved)} saved</span>
            <span>{formatCurrency(totalTarget - totalSaved)} to go</span>
          </div>
        </div>
      )}

      {/* Goal Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100)
          const daysLeft = getDaysLeft(goal.deadline)
          const monthlyNeeded = getMonthlySavingsNeeded(goal)
          const isCompleted = goal.current >= goal.target

          return (
            <div
              key={goal.id}
              className="bg-slate-900 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {isCompleted && (
                <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    {goal.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white">{goal.name}</div>
                    {isCompleted
                      ? <div className="text-xs text-brand-400 font-medium">🎉 Completed!</div>
                      : <div className="text-xs text-slate-400 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </div>
                    }
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-bold">{formatCurrency(goal.current)}</span>
                  <span className="text-slate-400">of {formatCurrency(goal.target)}</span>
                </div>
                <ProgressBar value={goal.current} max={goal.target} color={goal.color} showLabel={false} size="lg" />
                <div className="text-right text-xs text-slate-500 mt-1">{percentage.toFixed(1)}%</div>
              </div>

              {!isCompleted && (
                <div className="mb-4 p-3 rounded-xl bg-slate-800/50 text-xs text-slate-400">
                  Save <span className="text-white font-semibold">{formatCurrency(monthlyNeeded)}/mo</span> to reach goal on time
                </div>
              )}

              <button
                onClick={() => setShowContribute(goal.id)}
                disabled={isCompleted}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isCompleted ? 'transparent' : `${goal.color}20`,
                  color: isCompleted ? '#4b5563' : goal.color,
                  border: `1px solid ${isCompleted ? '#374151' : `${goal.color}40`}`
                }}
              >
                {isCompleted ? '✓ Goal Achieved!' : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Add Funds
                  </>
                )}
              </button>
            </div>
          )
        })}

        {/* Add New Goal Card */}
        <button
          onClick={() => setShowAdd(true)}
          className="bg-slate-900/50 rounded-2xl p-6 border border-dashed border-white/10 hover:border-brand-500/50 hover:bg-slate-900 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-brand-400 min-h-[200px]"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm font-medium">Add New Goal</span>
        </button>
      </div>

      {/* Contribute Modal */}
      <Modal isOpen={!!showContribute} onClose={() => setShowContribute(null)} title="Add Funds to Goal" size="sm">
        <form onSubmit={handleContribute} className="space-y-4">
          {showContribute && (() => {
            const goal = goals.find(g => g.id === showContribute)
            return goal ? (
              <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl">
                <div className="text-2xl">{goal.icon}</div>
                <div>
                  <div className="font-semibold text-white">{goal.name}</div>
                  <div className="text-xs text-slate-400">{formatCurrency(goal.target - goal.current)} remaining</div>
                </div>
              </div>
            ) : null
          })()}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Amount to Add</label>
            <input
              type="number"
              value={contributeAmount}
              onChange={e => setContributeAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-lg font-bold"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Add Funds
          </button>
        </form>
      </Modal>

      {/* Add Goal Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create New Goal">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Goal Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Trip to Japan"
              required
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Target Amount</label>
              <input
                type="number"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="5000"
                required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Already Saved</label>
              <input
                type="number"
                value={form.current}
                onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
                placeholder="0"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Target Date</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, icon }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    form.icon === icon ? 'bg-brand-500/20 border-2 border-brand-500' : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2">
              {GOAL_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: form.color === color ? '#fff' : 'transparent',
                    transform: form.color === color ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Create Goal
          </button>
        </form>
      </Modal>
    </div>
  )
}
