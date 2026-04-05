export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatCurrencyFull = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatPercent = (value, decimals = 1) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export const calcNetWorth = (investments, debts) => {
  const totalAssets = investments.reduce((sum, inv) => sum + inv.shares * inv.currentPrice, 0)
  const totalLiabilities = debts.reduce((sum, d) => sum + d.balance, 0)
  return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities }
}

export const calcPortfolioGain = (investments) => {
  const totalCost = investments.reduce((sum, inv) => sum + inv.shares * inv.costBasis, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.shares * inv.currentPrice, 0)
  const gain = totalValue - totalCost
  const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0
  return { totalCost, totalValue, gain, gainPercent }
}

export const getMonthlyExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

export const getMonthlyIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

export const getSpendingByCategory = (transactions) => {
  const byCategory = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
  return byCategory
}

export const calcBudgetUsed = (budgets, transactions) => {
  const spending = getSpendingByCategory(transactions)
  return budgets.map(b => ({
    ...b,
    spent: spending[b.category] || 0,
    percentage: Math.min(((spending[b.category] || 0) / b.limit) * 100, 100),
    overBudget: (spending[b.category] || 0) > b.limit,
  }))
}

export const calcDebtPayoff = (debts, extraPayment = 0, method = 'avalanche') => {
  const sorted = [...debts].sort((a, b) =>
    method === 'avalanche'
      ? b.interestRate - a.interestRate
      : a.balance - b.balance
  )

  let totalMonths = 0
  let totalInterest = 0
  const schedule = sorted.map(debt => {
    let balance = debt.balance
    let months = 0
    let interest = 0
    const monthlyRate = debt.interestRate / 100 / 12
    const payment = debt.minimumPayment + extraPayment

    while (balance > 0 && months < 600) {
      const monthInterest = balance * monthlyRate
      interest += monthInterest
      balance = balance + monthInterest - Math.min(payment, balance + monthInterest)
      months++
    }
    totalMonths = Math.max(totalMonths, months)
    totalInterest += interest

    return { ...debt, months, interest }
  })

  return { schedule, totalMonths, totalInterest }
}

export const calcCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  let balance = principal

  const data = [{ year: 0, balance: principal, contributions: principal }]

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        balance: Math.round(balance),
        contributions: Math.round(principal + monthlyContribution * m)
      })
    }
  }

  return { finalBalance: balance, data }
}

export const getFinancialHealthScore = (transactions, budgets, goals, debts) => {
  let score = 0
  let factors = []

  // Budget adherence (25 points)
  const budgetData = calcBudgetUsed(budgets, transactions)
  const overBudget = budgetData.filter(b => b.overBudget).length
  const budgetScore = Math.max(0, 25 - overBudget * 8)
  score += budgetScore
  factors.push({
    name: 'Budget Adherence',
    score: budgetScore,
    max: 25,
    status: budgetScore >= 20 ? 'good' : budgetScore >= 12 ? 'fair' : 'poor',
    tip: overBudget > 0 ? `${overBudget} categories are over budget` : 'All categories on track!'
  })

  // Savings rate (25 points)
  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const savingsScore = Math.min(25, Math.max(0, savingsRate / 20 * 25))
  score += savingsScore
  factors.push({
    name: 'Savings Rate',
    score: Math.round(savingsScore),
    max: 25,
    status: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'fair' : 'poor',
    tip: `Saving ${savingsRate.toFixed(1)}% of income. Target: 20%+`
  })

  // Goal progress (25 points)
  const avgGoalProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + (g.current / g.target), 0) / goals.length * 100
    : 0
  const goalScore = Math.min(25, avgGoalProgress / 4)
  score += goalScore
  factors.push({
    name: 'Goals Progress',
    score: Math.round(goalScore),
    max: 25,
    status: avgGoalProgress >= 50 ? 'good' : avgGoalProgress >= 25 ? 'fair' : 'poor',
    tip: `${avgGoalProgress.toFixed(0)}% average goal completion`
  })

  // Debt-to-income ratio (25 points)
  const totalDebtPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0)
  const dti = income > 0 ? (totalDebtPayments / income) * 100 : 100
  const debtScore = Math.max(0, 25 - Math.max(0, dti - 15) * 0.8)
  score += debtScore
  factors.push({
    name: 'Debt-to-Income',
    score: Math.round(debtScore),
    max: 25,
    status: dti <= 20 ? 'good' : dti <= 35 ? 'fair' : 'poor',
    tip: `DTI ratio: ${dti.toFixed(1)}%. Target: under 20%`
  })

  const finalScore = Math.round(score)
  const grade = finalScore >= 85 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 55 ? 'C' : finalScore >= 40 ? 'D' : 'F'
  const label = finalScore >= 85 ? 'Excellent' : finalScore >= 70 ? 'Good' : finalScore >= 55 ? 'Fair' : 'Needs Work'

  return { score: finalScore, grade, label, factors }
}

export const CATEGORY_COLORS = {
  Housing: '#6366f1',
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Entertainment: '#ec4899',
  Health: '#22c55e',
  Shopping: '#f97316',
  Utilities: '#8b5cf6',
  Salary: '#22c55e',
  Freelance: '#06b6d4',
  Other: '#6b7280',
}

export const CATEGORY_ICONS = {
  Housing: '🏠',
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Health: '💊',
  Shopping: '🛍️',
  Utilities: '⚡',
  Salary: '💼',
  Freelance: '💻',
  Other: '📦',
}
