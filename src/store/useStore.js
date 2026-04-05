import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultTransactions = [
  { id: '1', type: 'income', category: 'Salary', amount: 5200, description: 'Monthly Salary', date: '2026-04-01' },
  { id: '2', type: 'expense', category: 'Housing', amount: 1400, description: 'Rent', date: '2026-04-01' },
  { id: '3', type: 'expense', category: 'Food', amount: 320, description: 'Groceries', date: '2026-04-02' },
  { id: '4', type: 'expense', category: 'Transport', amount: 85, description: 'Gas & Uber', date: '2026-04-03' },
  { id: '5', type: 'expense', category: 'Entertainment', amount: 45, description: 'Netflix & Spotify', date: '2026-04-03' },
  { id: '6', type: 'income', category: 'Freelance', amount: 800, description: 'Design Project', date: '2026-04-04' },
  { id: '7', type: 'expense', category: 'Health', amount: 120, description: 'Gym + Pharmacy', date: '2026-04-04' },
  { id: '8', type: 'expense', category: 'Shopping', amount: 210, description: 'Clothing', date: '2026-04-05' },
  { id: '9', type: 'expense', category: 'Food', amount: 65, description: 'Restaurant', date: '2026-04-05' },
  { id: '10', type: 'expense', category: 'Utilities', amount: 95, description: 'Electric & Internet', date: '2026-04-05' },
]

const defaultBudgets = [
  { id: '1', category: 'Housing', limit: 1500, color: '#6366f1' },
  { id: '2', category: 'Food', limit: 600, color: '#f59e0b' },
  { id: '3', category: 'Transport', limit: 200, color: '#3b82f6' },
  { id: '4', category: 'Entertainment', limit: 150, color: '#ec4899' },
  { id: '5', category: 'Health', limit: 200, color: '#22c55e' },
  { id: '6', category: 'Shopping', limit: 300, color: '#f97316' },
  { id: '7', category: 'Utilities', limit: 150, color: '#8b5cf6' },
]

const defaultGoals = [
  { id: '1', name: 'Emergency Fund', target: 10000, current: 4200, icon: '🛡️', color: '#22c55e', deadline: '2026-12-31' },
  { id: '2', name: 'Vacation to Japan', target: 5000, current: 1800, icon: '✈️', color: '#3b82f6', deadline: '2026-09-01' },
  { id: '3', name: 'New Laptop', target: 2000, current: 850, icon: '💻', color: '#8b5cf6', deadline: '2026-06-01' },
]

const defaultDebts = [
  { id: '1', name: 'Student Loan', balance: 18500, interestRate: 5.8, minimumPayment: 200, color: '#ef4444' },
  { id: '2', name: 'Credit Card', balance: 3200, interestRate: 22.9, minimumPayment: 80, color: '#f97316' },
  { id: '3', name: 'Car Loan', balance: 8400, interestRate: 4.5, minimumPayment: 320, color: '#eab308' },
]

const defaultInvestments = [
  { id: '1', name: 'S&P 500 ETF', ticker: 'VOO', shares: 12, costBasis: 420, currentPrice: 498, color: '#22c55e' },
  { id: '2', name: 'Tech ETF', ticker: 'QQQ', shares: 8, costBasis: 380, currentPrice: 445, color: '#3b82f6' },
  { id: '3', name: 'Bitcoin', ticker: 'BTC', shares: 0.15, costBasis: 42000, currentPrice: 68000, color: '#f59e0b' },
  { id: '4', name: 'Apple Inc.', ticker: 'AAPL', shares: 20, costBasis: 165, currentPrice: 188, color: '#8b5cf6' },
]

const defaultNetWorthHistory = [
  { month: 'Oct', assets: 28000, liabilities: 32000 },
  { month: 'Nov', assets: 30500, liabilities: 31200 },
  { month: 'Dec', assets: 31800, liabilities: 30800 },
  { month: 'Jan', assets: 34200, liabilities: 30100 },
  { month: 'Feb', assets: 36500, liabilities: 29800 },
  { month: 'Mar', assets: 38900, liabilities: 29200 },
  { month: 'Apr', assets: 41200, liabilities: 30100 },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // User profile
      user: {
        name: 'Alex Johnson',
        monthlyIncome: 6000,
        currency: 'USD',
        joinDate: '2026-01-01',
        xp: 1240,
        level: 7,
        streak: 12,
        completedLessons: ['budgeting-101', 'emergency-fund', 'compound-interest'],
        badges: ['first-budget', 'saver', 'debt-warrior'],
      },

      // Transactions
      transactions: defaultTransactions,
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      // Budgets
      budgets: defaultBudgets,
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, { ...budget, id: Date.now().toString() }]
      })),
      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter(b => b.id !== id)
      })),

      // Goals
      goals: defaultGoals,
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now().toString() }]
      })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      // Debts
      debts: defaultDebts,
      addDebt: (debt) => set((state) => ({
        debts: [...state.debts, { ...debt, id: Date.now().toString() }]
      })),
      updateDebt: (id, updates) => set((state) => ({
        debts: state.debts.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDebt: (id) => set((state) => ({
        debts: state.debts.filter(d => d.id !== id)
      })),

      // Investments
      investments: defaultInvestments,
      addInvestment: (investment) => set((state) => ({
        investments: [...state.investments, { ...investment, id: Date.now().toString() }]
      })),
      updateInvestment: (id, updates) => set((state) => ({
        investments: state.investments.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
      deleteInvestment: (id) => set((state) => ({
        investments: state.investments.filter(i => i.id !== id)
      })),

      // Net Worth History
      netWorthHistory: defaultNetWorthHistory,

      // Completed lessons
      completeLesson: (lessonId, xpReward) => set((state) => ({
        user: {
          ...state.user,
          completedLessons: state.user.completedLessons.includes(lessonId)
            ? state.user.completedLessons
            : [...state.user.completedLessons, lessonId],
          xp: state.user.xp + (state.user.completedLessons.includes(lessonId) ? 0 : xpReward),
        }
      })),

      // Settings
      settings: {
        theme: 'dark',
        notifications: true,
      },
    }),
    {
      name: 'finwise-storage',
    }
  )
)
