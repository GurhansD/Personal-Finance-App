import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Wallet, Target, CreditCard, TrendingUp,
  GraduationCap, Menu, X, Zap, ChevronRight, Trophy, Flame, Brain, LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore, getLevelProgress } from '../store/useAuthStore'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/budget', icon: Wallet, label: 'Budget' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/debt', icon: CreditCard, label: 'Debt' },
  { path: '/invest', icon: TrendingUp, label: 'Invest' },
  { path: '/learn', icon: GraduationCap, label: 'Learn' },
  { path: '/challenges', icon: Flame, label: 'Challenges', badge: 'NEW' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/coach', icon: Brain, label: 'AI Coach', badge: 'AI' },
]

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentUser, signOut } = useAuthStore()
  const location = useLocation()

  const { level, progress } = getLevelProgress(currentUser?.xp || 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight">Finwise</div>
                <div className="text-xs text-slate-400">Finance Academy</div>
              </div>
            </div>
          </div>

          {/* User XP Card */}
          <div
            className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 cursor-pointer hover:border-brand-500/40 transition-all"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xl flex-shrink-0">
                {currentUser?.avatar || '🦁'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{currentUser?.name || 'User'}</div>
                <div className="text-xs text-brand-400 flex items-center gap-1">
                  <span>Level {level}</span>
                  <span>·</span>
                  <span>{(currentUser?.xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span>🔥 {currentUser?.streak || 1} day streak</span>
              <span>·</span>
              <span>🏆 {(currentUser?.badges || []).length} badges</span>
            </div>
          </div>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="mx-4 mt-2 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
              <button
                onClick={() => { signOut(); setShowUserMenu(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-0.5 mt-2 overflow-y-auto">
            {navItems.map(({ path, icon: Icon, label, badge }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-brand-400' : 'group-hover:text-white'}`} />
                    <span className="flex-1">{label}</span>
                    {badge && !isActive && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                        badge === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-brand-500/20 text-brand-400'
                      }`}>
                        {badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400/60" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/5">
            <div className="text-xs text-slate-500 text-center">
              Your data stays private & local
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-white">Finwise</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-brand-400">
            <span>{currentUser?.avatar}</span>
            <span className="font-semibold">{(currentUser?.xp || 0).toLocaleString()} XP</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
