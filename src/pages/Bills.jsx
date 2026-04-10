import { useState } from 'react'
import { useStore } from '../store/useStore'
import { formatCurrency } from '../utils/finance'
import Modal from '../components/Modal'
import { Plus, Trash2, Bell, Calendar, CreditCard, Repeat, CheckCircle2, AlertCircle } from 'lucide-react'

const FREQUENCIES = ['Monthly', 'Weekly', 'Bi-weekly', 'Quarterly', 'Yearly']
const BILL_ICONS = ['💡','📱','🏠','🚗','🌐','📺','🎵','💊','🐾','🏋️','🎓','🔒','☁️','🎮','✈️']
const BILL_COLORS = ['#6366f1','#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4']

function daysUntilDue(dayOfMonth) {
  const today = new Date()
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), dayOfMonth)
  if (thisMonth < today) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
    return Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24))
  }
  return Math.ceil((thisMonth - today) / (1000 * 60 * 60 * 24))
}

const DEFAULT_BILLS = [
  { id: 'b1', name: 'Rent', amount: 1400, dueDay: 1, frequency: 'Monthly', icon: '🏠', color: '#6366f1', autopay: true, category: 'Housing' },
  { id: 'b2', name: 'Electric & Internet', amount: 95, dueDay: 15, frequency: 'Monthly', icon: '💡', color: '#f59e0b', autopay: false, category: 'Utilities' },
  { id: 'b3', name: 'Netflix', amount: 15.99, dueDay: 8, frequency: 'Monthly', icon: '📺', color: '#ef4444', autopay: true, category: 'Entertainment' },
  { id: 'b4', name: 'Spotify', amount: 9.99, dueDay: 12, frequency: 'Monthly', icon: '🎵', color: '#22c55e', autopay: true, category: 'Entertainment' },
  { id: 'b5', name: 'Phone Plan', amount: 45, dueDay: 20, frequency: 'Monthly', icon: '📱', color: '#3b82f6', autopay: true, category: 'Utilities' },
  { id: 'b6', name: 'Gym', amount: 39.99, dueDay: 1, frequency: 'Monthly', icon: '🏋️', color: '#8b5cf6', autopay: true, category: 'Health' },
]

export default function Bills() {
  const [bills, setBills] = useState(DEFAULT_BILLS)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', dueDay: '1', frequency: 'Monthly', icon: '💡', color: '#6366f1', autopay: false, category: 'Utilities' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const sorted = [...bills].sort((a, b) => daysUntilDue(a.dueDay) - daysUntilDue(b.dueDay))
  const totalMonthly = bills.reduce((s, b) => {
    if (b.frequency === 'Monthly') return s + b.amount
    if (b.frequency === 'Weekly') return s + b.amount * 4.33
    if (b.frequency === 'Bi-weekly') return s + b.amount * 2.17
    if (b.frequency === 'Quarterly') return s + b.amount / 3
    if (b.frequency === 'Yearly') return s + b.amount / 12
    return s + b.amount
  }, 0)

  const upcomingIn7 = sorted.filter(b => daysUntilDue(b.dueDay) <= 7)
  const autopayCount = bills.filter(b => b.autopay).length

  const handleAdd = (e) => {
    e.preventDefault()
    setBills(prev => [...prev, { ...form, id: Date.now().toString(), amount: parseFloat(form.amount), dueDay: parseInt(form.dueDay) }])
    setForm({ name: '', amount: '', dueDay: '1', frequency: 'Monthly', icon: '💡', color: '#6366f1', autopay: false, category: 'Utilities' })
    setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Repeat className="w-6 h-6 text-blue-400" />
            Bill Tracker
          </h1>
          <p className="text-slate-400 mt-1">Never miss a payment. All your recurring bills in one place.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-glow flex-shrink-0"
        >
          <Plus className="w-4 h-4" />Add Bill
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '💸', label: 'Monthly Total', value: formatCurrency(totalMonthly) },
          { icon: '📅', label: 'Total Bills', value: `${bills.length} bills` },
          { icon: '⚡', label: 'Autopay Active', value: `${autopayCount}/${bills.length}` },
          { icon: '🔔', label: 'Due This Week', value: `${upcomingIn7.length} bills`, urgent: upcomingIn7.length > 0 },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 border ${s.urgent ? 'bg-orange-500/10 border-orange-500/20' : 'bg-slate-900 border-white/5'}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-lg font-bold ${s.urgent ? 'text-orange-400' : 'text-white'}`}>{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming alert */}
      {upcomingIn7.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <Bell className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-white">Bills due in the next 7 days</div>
            <div className="text-xs text-slate-400 mt-1">
              {upcomingIn7.map(b => `${b.name} (${formatCurrency(b.amount)} in ${daysUntilDue(b.dueDay)} days)`).join(' · ')}
            </div>
          </div>
        </div>
      )}

      {/* Bill List */}
      <div className="space-y-3">
        {sorted.map(bill => {
          const days = daysUntilDue(bill.dueDay)
          const isUrgent = days <= 3
          const isSoon = days <= 7

          return (
            <div key={bill.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-white/15 ${
              isUrgent ? 'bg-red-500/5 border-red-500/20' : isSoon ? 'bg-orange-500/5 border-orange-500/10' : 'bg-slate-900 border-white/5'
            }`}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${bill.color}20` }}
              >
                {bill.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white text-sm">{bill.name}</span>
                  {bill.autopay && (
                    <span className="text-xs px-1.5 py-0.5 bg-brand-500/10 text-brand-400 rounded-md font-medium">
                      autopay
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>{bill.frequency}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due day {bill.dueDay}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-bold text-white">{formatCurrency(bill.amount)}</div>
                <div className={`text-xs mt-0.5 font-medium ${isUrgent ? 'text-red-400' : isSoon ? 'text-orange-400' : 'text-slate-500'}`}>
                  {days === 0 ? 'Due today!' : days === 1 ? 'Due tomorrow' : `${days} days`}
                </div>
              </div>

              <button
                onClick={() => setBills(prev => prev.filter(b => b.id !== bill.id))}
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Monthly calendar view */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
        <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          Monthly Bill Calendar
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
            const dayBills = bills.filter(b => b.dueDay === day)
            return (
              <div
                key={day}
                className={`relative h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  dayBills.length > 0
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-600'
                }`}
                title={dayBills.map(b => b.name).join(', ')}
              >
                {day}
                {dayBills.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                    {dayBills.length}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500/50 inline-block" />has a bill due</span>
          <span>Total: {formatCurrency(totalMonthly)}/month</span>
        </div>
      </div>

      {/* Add Bill Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Recurring Bill">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Bill Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Netflix" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Amount</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="15.99" required className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Due Day of Month</label>
              <input type="number" min="1" max="31" value={form.dueDay} onChange={e => set('dueDay', e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Frequency</label>
              <select value={form.frequency} onChange={e => set('frequency', e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500">
                {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {BILL_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => set('icon', ic)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2 ${form.icon === ic ? 'border-brand-500 bg-brand-500/20' : 'border-transparent bg-slate-800'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Color</label>
            <div className="flex gap-2">
              {BILL_COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('color', c)}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: form.color === c ? '#fff' : 'transparent', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set('autopay', !form.autopay)} className={`w-11 h-6 rounded-full transition-all ${form.autopay ? 'bg-brand-500' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mt-0.5 ${form.autopay ? 'ml-5.5' : 'ml-0.5'}`} style={{ marginLeft: form.autopay ? '22px' : '2px' }} />
            </div>
            <span className="text-sm text-slate-300">Autopay enabled</span>
          </label>
          <button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-glow">
            Add Bill
          </button>
        </form>
      </Modal>
    </div>
  )
}
