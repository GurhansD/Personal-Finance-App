import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/useAuthStore'
import {
  getFinancialHealthScore, calcBudgetUsed, getMonthlyIncome, getMonthlyExpenses,
  calcDebtPayoff, formatCurrency, CATEGORY_COLORS
} from '../utils/finance'
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Zap, Target, BarChart2 } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

function InsightCard({ insight }) {
  const [expanded, setExpanded] = useState(false)
  const colors = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🚨', badge: 'bg-red-500/20 text-red-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⚠️', badge: 'bg-yellow-500/20 text-yellow-400' },
    good: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', icon: '✅', badge: 'bg-brand-500/20 text-brand-400' },
    tip: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '💡', badge: 'bg-blue-500/20 text-blue-400' },
  }
  const c = colors[insight.type] || colors.tip

  return (
    <div className={`rounded-2xl border ${c.bg} ${c.border} overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <div className="text-xl flex-shrink-0 mt-0.5">{c.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-white text-sm">{insight.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
              {insight.type}
            </span>
            {insight.impact && (
              <span className="text-xs text-slate-500">{insight.impact}</span>
            )}
          </div>
          <p className="text-xs text-slate-400">{insight.summary}</p>
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-5 pb-5 -mt-1">
          <div className="border-t border-white/5 pt-4 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{insight.detail}</p>
            {insight.actions?.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold text-brand-400">{i+1}</div>
                <p className="text-sm text-slate-300">{a}</p>
              </div>
            ))}
            {insight.saving && (
              <div className="flex items-center gap-2 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-sm">
                <Zap className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-brand-300 font-semibold">{insight.saving}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Coach() {
  const { transactions, budgets, goals, debts, investments } = useStore()
  const { currentUser } = useAuthStore()
  const [activeCategory, setActiveCategory] = useState('All')

  const income = getMonthlyIncome(transactions)
  const expenses = getMonthlyExpenses(transactions)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  const health = getFinancialHealthScore(transactions, budgets, goals, debts)
  const budgetData = calcBudgetUsed(budgets, transactions)
  const overBudget = budgetData.filter(b => b.overBudget)
  const { totalInterest } = calcDebtPayoff(debts, 0, 'avalanche')
  const { totalInterest: avalancheInterest } = calcDebtPayoff(debts, 200, 'avalanche')
  const totalDebt = debts.reduce((s, d) => s + d.balance, 0)
  const avgGoalProgress = goals.length > 0
    ? goals.reduce((s, g) => s + (g.current / g.target), 0) / goals.length * 100
    : 0

  const radarData = health.factors.map(f => ({
    subject: f.name.split(' ')[0],
    score: f.score,
    fullMark: f.max,
  }))

  const insights = useMemo(() => {
    const all = []

    // Savings rate analysis
    if (savingsRate < 10) {
      all.push({
        id: 'low-savings', type: 'critical', category: 'Savings',
        title: `Low Savings Rate: ${savingsRate.toFixed(1)}%`,
        summary: 'You\'re saving less than 10% of income — financial experts recommend 20%+.',
        detail: `Your current savings rate of ${savingsRate.toFixed(1)}% means you\'re spending ${(100-savingsRate).toFixed(0)}% of your income. At this rate, building wealth is very difficult. The 50/30/20 rule suggests putting at least 20% toward savings and debt.`,
        actions: [
          `Cut your highest variable expense by 10% to free up ${formatCurrency(expenses * 0.1)}/month`,
          'Set up automatic transfer to savings on payday before you can spend it',
          `Even saving ${formatCurrency(income * 0.05)} more per month adds ${formatCurrency(income * 0.05 * 12)} per year`,
        ],
        saving: `Increasing to 20% savings adds ${formatCurrency((income * 0.2 - (income - expenses))) } more/month toward wealth`,
        impact: '🚨 High Priority',
      })
    } else if (savingsRate >= 20) {
      all.push({
        id: 'great-savings', type: 'good', category: 'Savings',
        title: `Great Savings Rate: ${savingsRate.toFixed(1)}%`,
        summary: 'You\'re saving above the recommended 20% — excellent financial discipline!',
        detail: 'Maintaining a 20%+ savings rate puts you ahead of 80% of people. Consider directing extra savings into investments like index funds for maximum long-term growth.',
        actions: [
          'Max out your 401(k) or Roth IRA contribution if you haven\'t already',
          'Keep at least 3-6 months expenses in a high-yield savings account',
          'Direct extra savings into diversified index funds (VOO, VTI)',
        ],
        impact: '💪 Strong',
      })
    } else {
      all.push({
        id: 'ok-savings', type: 'warning', category: 'Savings',
        title: `Savings Rate Could Improve: ${savingsRate.toFixed(1)}%`,
        summary: 'You\'re saving, but there\'s room to grow. Target: 20% or more.',
        detail: `You're currently saving ${savingsRate.toFixed(1)}% — better than average, but financial independence requires 20-30%+ consistently. Small adjustments in discretionary spending can make a big difference.`,
        actions: [
          `Find ${formatCurrency((income * 0.2) - (income - expenses))}/month in spending to cut`,
          'Review subscriptions — the average person has 12+ and uses half of them',
          'Cook at home 3 more times per week — saves $150-300/month typically',
        ],
        impact: '📈 Medium Priority',
      })
    }

    // Over-budget categories
    if (overBudget.length > 0) {
      overBudget.forEach(b => {
        all.push({
          id: `over-${b.category}`, type: 'warning', category: 'Budget',
          title: `Over Budget: ${b.category}`,
          summary: `You've spent ${formatCurrency(b.spent)} vs your ${formatCurrency(b.limit)} limit — ${((b.spent / b.limit - 1) * 100).toFixed(0)}% over.`,
          detail: `The ${b.category} category is ${formatCurrency(b.spent - b.limit)} over budget this month. Even small overruns compound over 12 months into significant overspending.`,
          actions: [
            `Adjust your ${b.category} budget to ${formatCurrency(Math.ceil(b.spent / 50) * 50)} if this spend is necessary`,
            'Track individual purchases in this category to identify the biggest culprit',
            'Set a mid-month check-in reminder to catch overspending early',
          ],
          saving: `Staying within budget saves ${formatCurrency((b.spent - b.limit) * 12)}/year in this category alone`,
          impact: '⚠️ Action Needed',
        })
      })
    }

    // Debt insights
    if (totalDebt > 0) {
      const interestSaved = totalInterest - avalancheInterest
      if (interestSaved > 500) {
        all.push({
          id: 'debt-extra', type: 'tip', category: 'Debt',
          title: 'Add Extra Debt Payments — Save Thousands',
          summary: `Adding just $200/month extra to debt saves ${formatCurrency(interestSaved)} in interest.`,
          detail: 'The debt avalanche method (highest interest first) combined with even modest extra payments dramatically reduces total interest paid. Your highest-rate debt is costing you the most — target it first.',
          actions: [
            'Use the Debt Destroyer to find your optimal extra payment amount',
            `Your Credit Card at high APR should be target #1`,
            'Any windfall (tax refund, bonus) → debt first, then invest',
          ],
          saving: `Saving ${formatCurrency(interestSaved)} by adding $200/month extra`,
          impact: '💰 High Savings Potential',
        })
      }
    }

    // Investment insights
    const totalInvested = investments.reduce((s, inv) => s + inv.shares * inv.costBasis, 0)
    if (totalInvested === 0 && savingsRate > 15) {
      all.push({
        id: 'start-investing', type: 'tip', category: 'Investing',
        title: 'Time to Start Investing',
        summary: 'You have a healthy savings rate but no investments. Your money should be working for you.',
        detail: 'With a good savings rate, the next step is investing in low-cost index funds. $500/month at 10% annual return = $1.1M in 30 years. Every year you wait costs an estimated $100K+ at retirement.',
        actions: [
          'Open a Roth IRA at Fidelity, Vanguard, or Schwab (takes 10 minutes)',
          'Invest in VOO (S&P 500 ETF) — 0.03% expense ratio, ~10% historical returns',
          'Set up automatic monthly investment to remove emotion from the equation',
        ],
        saving: 'Starting $500/month investing now vs. 5 years from now = +$500K at retirement',
        impact: '🚀 Wealth Building',
      })
    }

    // Emergency fund
    const emergencyGoal = goals.find(g => g.name.toLowerCase().includes('emergency'))
    if (!emergencyGoal || (emergencyGoal && emergencyGoal.current < income * 3)) {
      all.push({
        id: 'emergency-fund', type: emergencyGoal ? 'tip' : 'warning', category: 'Savings',
        title: 'Emergency Fund Status',
        summary: emergencyGoal
          ? `You're building your emergency fund (${((emergencyGoal.current / (income * 6)) * 100).toFixed(0)}% of 6-month target).`
          : 'No emergency fund goal detected — this is your #1 financial priority.',
        detail: 'An emergency fund of 3-6 months expenses prevents debt spirals when unexpected costs hit. Without it, any car repair or medical bill forces you into high-interest debt.',
        actions: emergencyGoal ? [
          `Target: ${formatCurrency(income * 6)} (6 months expenses)`,
          `You're at ${formatCurrency(emergencyGoal.current)} — ${formatCurrency(income * 6 - emergencyGoal.current)} to go`,
          'Consider a high-yield savings account for your emergency fund',
        ] : [
          'Add an "Emergency Fund" goal with a target of 6x your monthly expenses',
          `Your target: ${formatCurrency(income * 6 || 15000)}`,
          'Keep it in a high-yield savings account earning 4-5% APY',
        ],
        impact: emergencyGoal ? '📈 In Progress' : '🚨 Priority #1',
      })
    }

    // Goal insights
    if (goals.length === 0) {
      all.push({
        id: 'set-goals', type: 'tip', category: 'Goals',
        title: 'Set Your First Savings Goal',
        summary: 'People with written goals are 3x more likely to achieve financial milestones.',
        detail: 'Savings goals give your money direction. Whether it\'s an emergency fund, vacation, or down payment — having a specific target with a deadline triggers motivational psychology.',
        actions: [
          'Go to Goals and add your emergency fund as Goal #1',
          'Then add one "wants" goal like a vacation or gadget',
          'Set realistic deadlines and track monthly contributions',
        ],
        impact: '🎯 Foundation',
      })
    } else if (avgGoalProgress < 25) {
      all.push({
        id: 'goal-progress', type: 'tip', category: 'Goals',
        title: 'Accelerate Your Goals',
        summary: `Your average goal completion is ${avgGoalProgress.toFixed(0)}%. Try automating contributions.`,
        detail: 'Automating savings contributions on payday is the single most effective habit for hitting goals. "Pay yourself first" removes willpower from the equation.',
        actions: [
          'Set up automatic transfers the day your paycheck arrives',
          `Even $50/month auto-transfer adds ${formatCurrency(600)} per year per goal`,
          'Review the monthly savings needed for each goal in your Goals page',
        ],
        impact: '📊 Moderate Priority',
      })
    }

    return all.filter(i => activeCategory === 'All' || i.category === activeCategory)
  }, [savingsRate, overBudget, totalDebt, totalInterest, avalancheInterest, goals, investments, income, expenses, activeCategory])

  const categories = ['All', 'Budget', 'Savings', 'Debt', 'Investing', 'Goals']
  const criticalCount = insights.filter(i => i.type === 'critical').length
  const warningCount = insights.filter(i => i.type === 'warning').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Financial Coach
          </h1>
          <p className="text-slate-400 mt-1">
            Personalized insights from {transactions.length} transactions · Updated in real-time
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {criticalCount > 0 && (
            <span className="text-xs px-2.5 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-full font-medium">
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs px-2.5 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-full font-medium">
              {warningCount} warnings
            </span>
          )}
        </div>
      </div>

      {/* Health Radar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-white text-sm mb-1">Financial Health Radar</h2>
          <p className="text-xs text-slate-400 mb-4">Score: {health.score}/100 — {health.label}</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {health.factors.map(f => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{f.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(f.score / f.max) * 100}%`,
                        backgroundColor: f.status === 'good' ? '#22c55e' : f.status === 'fair' ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="text-white font-medium w-8 text-right">{f.score}/{f.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, icon: '💰', status: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'fair' : 'poor' },
              { label: 'Monthly Cashflow', value: formatCurrency(income - expenses), icon: '💸', status: income > expenses ? 'good' : 'poor' },
              { label: 'Debt Burden', value: `${((debts.reduce((s,d)=>s+d.minimumPayment,0)/income)*100).toFixed(0)}% DTI`, icon: '💳', status: debts.reduce((s,d)=>s+d.minimumPayment,0)/income < 0.2 ? 'good' : 'fair' },
              { label: 'Goals Progress', value: `${avgGoalProgress.toFixed(0)}%`, icon: '🎯', status: avgGoalProgress >= 50 ? 'good' : avgGoalProgress >= 25 ? 'fair' : 'poor' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className="text-sm">{s.icon}</span>
                </div>
                <div className={`text-lg font-black ${s.status === 'good' ? 'text-brand-400' : s.status === 'fair' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Score interpretation */}
          <div className={`p-5 rounded-2xl border ${
            health.score >= 85 ? 'bg-brand-500/10 border-brand-500/20' :
            health.score >= 70 ? 'bg-blue-500/10 border-blue-500/20' :
            health.score >= 55 ? 'bg-yellow-500/10 border-yellow-500/20' :
            'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {health.score >= 85 ? '🌟' : health.score >= 70 ? '😊' : health.score >= 55 ? '😐' : '😰'}
              </div>
              <div>
                <div className="font-bold text-white">{health.label} Financial Health (Grade {health.grade})</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {health.score >= 85 ? 'Excellent! You\'re in the top tier of financial health.' :
                   health.score >= 70 ? 'Good overall. A few focused improvements can get you to excellent.' :
                   health.score >= 55 ? 'Fair. Address the warnings below to improve your score significantly.' :
                   'Your finances need attention. Focus on the critical items below.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              activeCategory === cat ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' : 'bg-slate-800 text-slate-400 hover:text-white border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No insights in this category right now.</p>
          </div>
        ) : (
          insights.map(insight => <InsightCard key={insight.id} insight={insight} />)
        )}
      </div>
    </div>
  )
}
