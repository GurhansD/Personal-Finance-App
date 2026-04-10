import { useState } from 'react'
import { useAuthStore, AVATARS } from '../store/useAuthStore'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

const GOALS = [
  { id: 'save', icon: '💰', label: 'Build savings', desc: 'Emergency fund & big purchases' },
  { id: 'debt', icon: '⚔️', label: 'Pay off debt', desc: 'Eliminate loans & credit cards' },
  { id: 'invest', icon: '📈', label: 'Grow wealth', desc: 'Invest for long-term growth' },
  { id: 'budget', icon: '📊', label: 'Control spending', desc: 'Track every dollar' },
  { id: 'retire', icon: '🏖️', label: 'Retire early', desc: 'Financial independence' },
]

const INCOME_RANGES = [
  { id: '0-2000', label: 'Under $2,000/mo', value: 1500 },
  { id: '2000-4000', label: '$2,000 – $4,000/mo', value: 3000 },
  { id: '4000-7000', label: '$4,000 – $7,000/mo', value: 5500 },
  { id: '7000-12000', label: '$7,000 – $12,000/mo', value: 9500 },
  { id: '12000+', label: '$12,000+/mo', value: 15000 },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    avatar: AVATARS[0],
    primaryGoal: 'save',
    incomeRange: '4000-7000',
    monthlyIncome: 5500,
  })
  const { completeOnboarding, currentUser } = useAuthStore()

  const steps = [
    { title: 'Pick your avatar', subtitle: 'Choose how you appear on the leaderboard' },
    { title: 'What\'s your main goal?', subtitle: 'We\'ll personalize your experience around this' },
    { title: 'Monthly income range', subtitle: 'Helps us calibrate your financial health score' },
  ]

  const handleFinish = () => {
    completeOnboarding(data)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl mb-2">👋</div>
          <h1 className="text-2xl font-black text-white">Welcome, {currentUser?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-400 mt-1 text-sm">Let's set up your profile ({step + 1}/3)</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[0,1,2].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-500' : 'bg-slate-800'}`} />
          ))}
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-1">{steps[step].title}</h2>
          <p className="text-slate-400 text-sm mb-6">{steps[step].subtitle}</p>

          {/* Step 0: Avatar */}
          {step === 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setData(d => ({ ...d, avatar: av }))}
                  className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all border-2 ${
                    data.avatar === av
                      ? 'bg-brand-500/20 border-brand-500 scale-110 shadow-glow'
                      : 'bg-slate-800 border-transparent hover:border-white/20 hover:scale-105'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-2.5">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setData(d => ({ ...d, primaryGoal: g.id }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    data.primaryGoal === g.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-white/10 hover:border-white/20 bg-slate-800'
                  }`}
                >
                  <div className="text-2xl w-10 text-center flex-shrink-0">{g.icon}</div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${data.primaryGoal === g.id ? 'text-white' : 'text-slate-300'}`}>{g.label}</div>
                    <div className="text-xs text-slate-500">{g.desc}</div>
                  </div>
                  {data.primaryGoal === g.id && <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Income */}
          {step === 2 && (
            <div className="space-y-2.5">
              {INCOME_RANGES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setData(d => ({ ...d, incomeRange: r.id, monthlyIncome: r.value }))}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    data.incomeRange === r.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-white/10 hover:border-white/20 bg-slate-800'
                  }`}
                >
                  <span className={`font-medium text-sm ${data.incomeRange === r.id ? 'text-white' : 'text-slate-300'}`}>{r.label}</span>
                  {data.incomeRange === r.id && <Check className="w-4 h-4 text-brand-400" />}
                </button>
              ))}
              <p className="text-xs text-slate-600 text-center pt-1">This is never shared publicly</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all shadow-glow"
          >
            {step < 2 ? (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>🚀 Launch Finwise!</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
