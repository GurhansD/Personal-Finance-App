// Challenges reset daily/weekly. ID includes date seed so they rotate.
export const DAILY_CHALLENGES = [
  { id: 'log-3-expenses', title: 'Track 3 Expenses', desc: 'Log at least 3 transactions today', xp: 50, icon: '📝', type: 'daily', target: 3, metric: 'transactions' },
  { id: 'check-budget', title: 'Budget Check-In', desc: 'Review all your budget categories', xp: 30, icon: '📊', type: 'daily', target: 1, metric: 'budgetReview' },
  { id: 'learn-lesson', title: 'Learn Something New', desc: 'Complete one Finance Academy lesson', xp: 75, icon: '🎓', type: 'daily', target: 1, metric: 'lesson' },
  { id: 'no-overspend', title: 'Stay in the Green', desc: 'Keep all budgets under their limits today', xp: 60, icon: '✅', type: 'daily', target: 1, metric: 'allBudgetsGreen' },
  { id: 'goal-contribution', title: 'Feed a Goal', desc: 'Add funds to any savings goal', xp: 40, icon: '🎯', type: 'daily', target: 1, metric: 'goalContribution' },
  { id: 'net-worth-check', title: 'Net Worth Check', desc: 'Visit your portfolio page', xp: 25, icon: '💼', type: 'daily', target: 1, metric: 'portfolioVisit' },
  { id: 'debt-review', title: 'Debt Destroyer Check', desc: 'Review your debt payoff strategy', xp: 35, icon: '💳', type: 'daily', target: 1, metric: 'debtReview' },
]

export const WEEKLY_CHALLENGES = [
  { id: 'log-20-expenses', title: 'Expense Tracker Pro', desc: 'Log 20 transactions this week', xp: 200, icon: '🔥', type: 'weekly', target: 20, metric: 'transactions' },
  { id: 'complete-3-lessons', title: 'Scholar of the Week', desc: 'Complete 3 Finance Academy lessons', xp: 350, icon: '🎓', type: 'weekly', target: 3, metric: 'lessons' },
  { id: 'savings-50', title: 'Save $50+', desc: 'Contribute at least $50 to your goals', xp: 300, icon: '💰', type: 'weekly', target: 50, metric: 'goalAmount' },
  { id: 'under-budget-all', title: 'Budget Champion', desc: 'Stay under budget in all categories', xp: 400, icon: '🏆', type: 'weekly', target: 1, metric: 'weeklyBudgetGreen' },
  { id: 'debt-extra-payment', title: 'Debt Slayer', desc: 'Apply an extra payment to any debt', xp: 250, icon: '⚔️', type: 'weekly', target: 1, metric: 'extraDebtPayment' },
  { id: 'streak-7', title: '7-Day Streak', desc: 'Log in and track for 7 days straight', xp: 500, icon: '🔥', type: 'weekly', target: 7, metric: 'streak' },
]

export const BADGES = [
  { id: 'first-budget', name: 'Budget Builder', icon: '📊', desc: 'Set your first budget' },
  { id: 'saver', name: 'Super Saver', icon: '🏦', desc: 'Saved over $1,000' },
  { id: 'debt-warrior', name: 'Debt Warrior', icon: '⚔️', desc: 'Paid off a debt' },
  { id: 'investor', name: 'Investor', icon: '📈', desc: 'Added an investment' },
  { id: 'streak-7', name: '7-Day Streak', icon: '🔥', desc: '7 days in a row' },
  { id: 'streak-30', name: '30-Day Streak', icon: '⚡', desc: '30 days in a row' },
  { id: 'top-earner', name: 'Top Earner', icon: '👑', desc: 'Reached top 10 leaderboard' },
  { id: 'scholar', name: 'Finance Scholar', icon: '🎓', desc: 'Completed all lessons' },
  { id: 'challenger', name: 'Challenger', icon: '🏆', desc: 'Completed 10 challenges' },
  { id: 'goal-crusher', name: 'Goal Crusher', icon: '🎯', desc: 'Completed a savings goal' },
  { id: 'health-90', name: 'Financial Elite', icon: '💎', desc: 'Achieved 90+ health score' },
  { id: 'first-login', name: 'Welcome!', icon: '🌟', desc: 'Joined Finwise' },
]

export function getDailyChallenges() {
  const day = new Date().getDay()
  // Return 3 challenges based on day of week
  const indices = [(day) % 7, (day + 2) % 7, (day + 4) % 7]
  return indices.map(i => DAILY_CHALLENGES[i % DAILY_CHALLENGES.length])
}

export function getWeeklyChallenges() {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const indices = [week % 6, (week + 2) % 6, (week + 4) % 6]
  return indices.map(i => WEEKLY_CHALLENGES[i % WEEKLY_CHALLENGES.length])
}
