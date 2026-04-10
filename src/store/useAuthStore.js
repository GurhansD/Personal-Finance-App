import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const AVATARS = ['🦁','🐯','🦊','🐺','🦅','🦋','🐬','🦄','🐲','🌟','🎯','🔥','💎','🚀','⚡']

export const MOCK_GLOBAL_USERS = [
  { id:'g1', name:'Sarah Chen', avatar:'🦋', xp:8420, level:15, streak:45, healthScore:92, savingsRate:34, badges:['first-budget','saver','debt-warrior','investor','streak-30','top-earner'], joinDate:'2025-06-01' },
  { id:'g2', name:'Marcus Thompson', avatar:'🦅', xp:7890, level:14, streak:62, healthScore:89, savingsRate:29, badges:['first-budget','saver','investor','streak-30'], joinDate:'2025-07-15' },
  { id:'g3', name:'Priya Patel', avatar:'💎', xp:7200, level:13, streak:28, healthScore:87, savingsRate:31, badges:['first-budget','saver','debt-warrior','top-earner'], joinDate:'2025-08-02' },
  { id:'g4', name:'Jake Williams', avatar:'🚀', xp:6650, level:12, streak:19, healthScore:84, savingsRate:25, badges:['first-budget','saver','streak-30'], joinDate:'2025-08-20' },
  { id:'g5', name:'Emma Rodriguez', avatar:'🌟', xp:6100, level:11, streak:33, healthScore:81, savingsRate:22, badges:['first-budget','investor'], joinDate:'2025-09-01' },
  { id:'g6', name:'David Kim', avatar:'🔥', xp:5800, level:11, streak:14, healthScore:79, savingsRate:20, badges:['first-budget','saver'], joinDate:'2025-09-10' },
  { id:'g7', name:'Aisha Johnson', avatar:'🎯', xp:5200, level:10, streak:21, healthScore:76, savingsRate:18, badges:['first-budget'], joinDate:'2025-09-18' },
  { id:'g8', name:'Carlos Mendez', avatar:'⚡', xp:4900, level:9, streak:9, healthScore:73, savingsRate:15, badges:['first-budget','saver'], joinDate:'2025-10-01' },
  { id:'g9', name:'Lin Zhang', avatar:'🐬', xp:4400, level:9, streak:17, healthScore:71, savingsRate:19, badges:['first-budget'], joinDate:'2025-10-15' },
  { id:'g10', name:'Nina Okafor', avatar:'🦊', xp:3900, level:8, streak:5, healthScore:68, savingsRate:12, badges:['first-budget'], joinDate:'2025-11-01' },
  { id:'g11', name:'Tyler Brooks', avatar:'🐯', xp:3500, level:7, streak:12, healthScore:65, savingsRate:10, badges:['first-budget'], joinDate:'2025-11-20' },
  { id:'g12', name:'Sofia Reyes', avatar:'🦁', xp:3100, level:7, streak:8, healthScore:62, savingsRate:14, badges:['first-budget'], joinDate:'2025-12-01' },
  { id:'g13', name:'Omar Hassan', avatar:'🐲', xp:2800, level:6, streak:3, healthScore:58, savingsRate:9, badges:['first-budget'], joinDate:'2025-12-15' },
  { id:'g14', name:'Hannah Lee', avatar:'🦄', xp:2400, level:5, streak:6, healthScore:55, savingsRate:11, badges:[], joinDate:'2026-01-05' },
  { id:'g15', name:'Ethan Foster', avatar:'🦅', xp:2000, level:5, streak:4, healthScore:52, savingsRate:8, badges:[], joinDate:'2026-01-20' },
]

export const useMockLeaderboard = () => MOCK_GLOBAL_USERS

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,

      signUp: ({ email, password, name, avatar }) => {
        const users = get()._users || []
        if (users.find(u => u.email === email)) throw new Error('Email already in use')
        const user = {
          id: `u_${Date.now()}`,
          email,
          password,
          name,
          avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
          joinDate: new Date().toISOString(),
          xp: 0,
          level: 1,
          streak: 1,
          completedLessons: [],
          completedChallenges: [],
          badges: [],
          monthlyIncome: 5000,
          primaryGoal: 'save',
          onboardingComplete: false,
          weeklyXp: 0,
          monthlyXp: 0,
        }
        set({ _users: [...users, user], currentUser: user, isAuthenticated: true })
        return user
      },

      signIn: ({ email, password }) => {
        const users = get()._users || []
        const user = users.find(u => u.email === email)
        if (!user) throw new Error('No account found with that email')
        if (user.password !== password) throw new Error('Incorrect password')
        set({ currentUser: user, isAuthenticated: true })
        return user
      },

      signOut: () => set({ currentUser: null, isAuthenticated: false }),

      completeOnboarding: (data) => {
        const { currentUser, _users = [] } = get()
        const updated = { ...currentUser, ...data, onboardingComplete: true }
        set({ currentUser: updated, _users: _users.map(u => u.id === updated.id ? updated : u) })
      },

      updateUser: (updates) => {
        const { currentUser, _users = [] } = get()
        const updated = { ...currentUser, ...updates }
        set({ currentUser: updated, _users: _users.map(u => u.id === updated.id ? updated : u) })
      },

      awardXp: (amount, label) => {
        const { currentUser, _users = [] } = get()
        if (!currentUser) return
        const newXp = (currentUser.xp || 0) + amount
        const newWeeklyXp = (currentUser.weeklyXp || 0) + amount
        const newMonthlyXp = (currentUser.monthlyXp || 0) + amount
        const level = calcLevel(newXp)
        const updated = { ...currentUser, xp: newXp, weeklyXp: newWeeklyXp, monthlyXp: newMonthlyXp, level }
        set({ currentUser: updated, _users: _users.map(u => u.id === updated.id ? updated : u) })
        return { newXp, level, label }
      },

      addBadge: (badgeId) => {
        const { currentUser, _users = [] } = get()
        if (!currentUser || currentUser.badges?.includes(badgeId)) return
        const updated = { ...currentUser, badges: [...(currentUser.badges || []), badgeId] }
        set({ currentUser: updated, _users: _users.map(u => u.id === updated.id ? updated : u) })
      },

      completeChallenge: (challengeId, xpReward) => {
        const { currentUser, _users = [] } = get()
        if (!currentUser) return
        if (currentUser.completedChallenges?.includes(challengeId)) return
        const newXp = (currentUser.xp || 0) + xpReward
        const updated = {
          ...currentUser,
          xp: newXp,
          weeklyXp: (currentUser.weeklyXp || 0) + xpReward,
          monthlyXp: (currentUser.monthlyXp || 0) + xpReward,
          level: calcLevel(newXp),
          completedChallenges: [...(currentUser.completedChallenges || []), challengeId],
        }
        set({ currentUser: updated, _users: _users.map(u => u.id === updated.id ? updated : u) })
      },

      _users: [],
    }),
    { name: 'finwise-auth-v2' }
  )
)

export const LEVEL_THRESHOLDS = [0,100,300,600,1000,1500,2200,3000,4000,5000,6500,8000,10000,12500,15000,20000]

export function calcLevel(xp) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return Math.min(level, LEVEL_THRESHOLDS.length)
}

export function getLevelProgress(xp) {
  const level = calcLevel(xp)
  const current = LEVEL_THRESHOLDS[level - 1] || 0
  const next = LEVEL_THRESHOLDS[level] || current + 5000
  return { level, progress: ((xp - current) / (next - current)) * 100, current, next }
}
