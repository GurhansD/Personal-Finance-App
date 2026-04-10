import { useState } from 'react'
import { useAuthStore, AVATARS } from '../store/useAuthStore'
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  { icon: '📊', title: 'Smart Budget Tracking', desc: 'Visual spending limits with real-time alerts' },
  { icon: '🏆', title: 'Global Leaderboard', desc: 'Compete with thousands of savers worldwide' },
  { icon: '🎓', title: 'Finance Academy', desc: 'Interactive lessons with XP rewards' },
  { icon: '🔥', title: 'Daily Challenges', desc: 'Earn XP and badges every day' },
  { icon: '🤖', title: 'AI Financial Coach', desc: 'Personalized insights from your data' },
]

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuthStore()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!form.name.trim()) throw new Error('Please enter your name')
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters')
        signUp({ email: form.email, password: form.password, name: form.name.trim() })
      } else {
        signIn({ email: form.email, password: form.password })
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-xl">Finwise</div>
            <div className="text-xs text-slate-400">Finance Academy</div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Master your money.<br />
              <span className="text-brand-400">Beat the leaderboard.</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              The only finance app that makes getting rich feel like a game.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{f.title}</div>
                  <div className="text-xs text-slate-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['🦁','🦋','🚀','🔥'].map((a,i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-xs">{a}</div>
              ))}
            </div>
            <span>12,847 users</span>
          </div>
          <div>·</div>
          <div>⭐ 4.9/5 rating</div>
          <div>·</div>
          <div>100% free</div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-white text-lg">Finwise</div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              {mode === 'signup'
                ? 'Start your journey to financial freedom'
                : 'Continue your financial journey'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-6 border border-white/5">
            {['signin','signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  required
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Loading...' : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'signup' && (
            <div className="mt-6 space-y-2">
              {['No credit card required', 'Your data stays private & local', '100% free forever'].map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  {t}
                </div>
              ))}
            </div>
          )}

          {/* Demo account shortcut */}
          <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-white/5">
            <div className="text-xs text-slate-400 mb-2 font-medium">Try with demo account:</div>
            <button
              type="button"
              onClick={() => {
                setForm({ email: 'demo@finwise.app', password: 'demo123', name: '' })
                setMode('signin')
                // Auto-create demo if not exists
                try {
                  useAuthStore.getState().signUp({ email: 'demo@finwise.app', password: 'demo123', name: 'Demo User' })
                } catch {
                  useAuthStore.getState().signIn({ email: 'demo@finwise.app', password: 'demo123' })
                }
              }}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              demo@finwise.app / demo123 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
