import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, getLevelProgress } from '../store/useAuthStore'
import { Lock, CheckCircle2, Zap, ChevronRight } from 'lucide-react'

const SKILL_TREE = [
  {
    id: 'tier-1',
    tier: 1,
    label: 'Foundation',
    color: '#22c55e',
    skills: [
      { id: 'budgeting-basics', name: 'Budget Basics', icon: '📊', desc: 'Learn the 50/30/20 rule', xpRequired: 0, bossRequired: null },
      { id: 'savings-starter', name: 'Saver\'s Path', icon: '💰', desc: 'Emergency fund essentials', xpRequired: 100, bossRequired: null },
      { id: 'debt-aware', name: 'Debt Awareness', icon: '⚠️', desc: 'Understand interest rates', xpRequired: 200, bossRequired: 'debt-dragon' },
    ]
  },
  {
    id: 'tier-2',
    tier: 2,
    label: 'Intermediate',
    color: '#3b82f6',
    skills: [
      { id: 'invest-intro', name: 'Investor Mindset', icon: '📈', desc: 'Index funds & compound growth', xpRequired: 500, bossRequired: 'budget-buster' },
      { id: 'tax-basics', name: 'Tax Literacy', icon: '📋', desc: '401k, Roth IRA, deductions', xpRequired: 700, bossRequired: null },
      { id: 'credit-master', name: 'Credit Mastery', icon: '💳', desc: 'Score optimization strategies', xpRequired: 800, bossRequired: 'inflation-imp' },
    ]
  },
  {
    id: 'tier-3',
    tier: 3,
    label: 'Advanced',
    color: '#8b5cf6',
    skills: [
      { id: 'portfolio-theory', name: 'Portfolio Theory', icon: '🎯', desc: 'Diversification & asset allocation', xpRequired: 1200, bossRequired: 'tax-titan' },
      { id: 'real-estate', name: 'Real Estate IQ', icon: '🏠', desc: 'REITs, mortgages, cash flow', xpRequired: 1500, bossRequired: null },
      { id: 'fi-planning', name: 'FIRE Planning', icon: '🔥', desc: 'Financial Independence blueprint', xpRequired: 2000, bossRequired: 'crypto-chaos' },
    ]
  },
  {
    id: 'tier-4',
    tier: 4,
    label: 'Master',
    color: '#f59e0b',
    skills: [
      { id: 'wealth-building', name: 'Wealth Architecture', icon: '🏗️', desc: 'Multi-stream income design', xpRequired: 3000, bossRequired: null },
      { id: 'tax-advanced', name: 'Tax Optimization', icon: '🧮', desc: 'Advanced strategies & structures', xpRequired: 4000, bossRequired: null },
      { id: 'legacy-planning', name: 'Legacy & Estate', icon: '👑', desc: 'Wills, trusts, generational wealth', xpRequired: 5000, bossRequired: null },
    ]
  },
]

const SKILL_FACTS = {
  'budgeting-basics': ['50% of income → needs', '30% → wants', '20% → savings & debt', 'Track every purchase for 30 days', 'Use the envelope method'],
  'savings-starter': ['3-6 months expenses in emergency fund', 'Keep emergency fund in HYSA', 'Automate savings on payday', '$1,000 starter fund first target', 'Never invest before emergency fund'],
  'debt-aware': ['Avalanche = highest interest first', 'Snowball = smallest balance first', 'Never pay just the minimum', 'Balance transfers can save $$', '29% APR doubles debt in ~2.5 years'],
  'invest-intro': ['S&P 500 avg ~10% annual return', 'Start investing in your 20s', '$100/mo for 40 years = $530,000+', 'Never time the market', 'Dollar-cost average consistently'],
  'tax-basics': ['Max 401(k) = $23,000/year (2024)', 'Roth IRA limit = $7,000/year', 'HSA is triple tax-advantaged', 'Keep investments >1 year for lower tax', 'Contribute enough for employer match'],
  'credit-master': ['Pay on time = 35% of score', 'Keep utilization under 30%', 'Don\'t close old accounts', 'Hard inquiries stay 2 years', '750+ score = best rates'],
  'portfolio-theory': ['Don\'t put all eggs in one basket', '3-fund portfolio covers everything', 'Rebalance annually', 'International stocks = 20-40%', 'Bonds increase as you age'],
  'real-estate': ['REITs let you invest with $10', 'House hacking = mortgage hack', 'Cap rate = NOI / property value', '1% rule for rental property', 'Location > everything else'],
  'fi-planning': ['FIRE number = expenses × 25', '4% withdrawal rule', 'Lean FIRE vs Fat FIRE', 'Coast FIRE = stop contributing', 'Barista FIRE = part-time work'],
  'wealth-building': ['7 income streams goal', 'Build assets, not liabilities', 'Invest in yourself first', 'Network = net worth', 'Passive income > active income'],
  'tax-advanced': ['Backdoor Roth IRA strategy', 'Tax-loss harvesting', 'Opportunity Zone investments', 'Charitable giving deductions', 'Business entity tax savings'],
  'legacy-planning': ['Will vs Trust differences', 'Beneficiary designations override will', 'Life insurance for dependents', 'Roth IRA = best inheritance', '529 for education inheritance'],
}

function SkillCard({ skill, isUnlocked, isCompleted, tierColor, onClick }) {
  return (
    <button
      onClick={() => isUnlocked && onClick(skill)}
      className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
        ${isCompleted
          ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/40'
          : isUnlocked
            ? 'bg-slate-800/80 hover:bg-slate-800 hover:scale-[1.02] cursor-pointer'
            : 'bg-slate-900/50 border-slate-800 opacity-40 cursor-not-allowed'
        }
      `}
      style={isUnlocked && !isCompleted ? { borderColor: `${tierColor}40` } : {}}
    >
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-4 h-4 text-yellow-500" />
        </div>
      )}
      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3.5 h-3.5 text-slate-600" />
        </div>
      )}

      <div className="text-2xl mb-2">{skill.icon}</div>
      <div className={`font-bold text-sm mb-1 ${isCompleted ? 'text-yellow-400' : isUnlocked ? 'text-white' : 'text-slate-600'}`}>
        {skill.name}
      </div>
      <div className="text-xs text-slate-500 mb-3">{skill.desc}</div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${tierColor}15`, color: tierColor }}>
          <Zap className="w-2.5 h-2.5 inline mr-0.5" />{skill.xpRequired} XP
        </span>
        {skill.bossRequired && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium">
            ⚔️ Defeat required
          </span>
        )}
      </div>
    </button>
  )
}

function SkillModal({ skill, facts, tierColor, onClose }) {
  const [currentFact, setCurrentFact] = useState(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border rounded-2xl p-6 max-w-sm w-full"
        style={{ borderColor: `${tierColor}40` }}>
        <div className="text-4xl mb-3 text-center">{skill.icon}</div>
        <h3 className="text-lg font-black text-white text-center mb-1">{skill.name}</h3>
        <p className="text-sm text-slate-400 text-center mb-5">{skill.desc}</p>

        <div className="bg-slate-800 rounded-xl p-4 mb-4 min-h-[80px] flex items-center">
          <div className="text-sm text-white leading-relaxed text-center w-full">
            💡 {facts?.[currentFact] || 'Keep learning!'}
          </div>
        </div>

        {facts && facts.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {facts.map((_, i) => (
              <button key={i}
                onClick={() => setCurrentFact(i)}
                className={`w-2 h-2 rounded-full transition-all ${currentFact === i ? 'w-4' : 'bg-slate-600'}`}
                style={currentFact === i ? { backgroundColor: tierColor } : {}} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCurrentFact(f => (f + 1) % (facts?.length || 1))}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all">
            Next Tip →
          </button>
          <button onClick={onClose}
            className="py-2.5 text-white text-sm font-bold rounded-xl transition-all"
            style={{ backgroundColor: tierColor }}>
            Got It!
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SkillTree() {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()
  const xp = currentUser?.xp || 0
  const defeatedBosses = currentUser?.defeatedBosses || []
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [selectedTierColor, setSelectedTierColor] = useState('#22c55e')

  const completedSkills = currentUser?.completedSkills || []

  function isSkillUnlocked(skill) {
    if (xp < skill.xpRequired) return false
    if (skill.bossRequired && !defeatedBosses.includes(skill.bossRequired)) return false
    return true
  }

  const totalSkills = SKILL_TREE.reduce((s, t) => s + t.skills.length, 0)
  const unlockedCount = SKILL_TREE.flatMap(t => t.skills).filter(isSkillUnlocked).length

  const { level } = getLevelProgress(xp)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            🌳 Skill Tree
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Master finance concepts to unlock skills and defeat bosses</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500">Unlocked</div>
          <div className="text-lg font-black text-brand-400">{unlockedCount}/{totalSkills}</div>
        </div>
      </div>

      {/* XP progress */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />Level {level} · {xp.toLocaleString()} XP
          </span>
          <button onClick={() => navigate('/world-map')}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            ⚔️ Boss Battles <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
            style={{ width: `${Math.min((xp / 5000) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Skill tiers */}
      {SKILL_TREE.map((tier) => (
        <div key={tier.id}>
          {/* Tier header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 rounded-full opacity-30" style={{ backgroundColor: tier.color }} />
            <div className="text-xs font-black px-3 py-1 rounded-full"
              style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
              TIER {tier.tier}: {tier.label.toUpperCase()}
            </div>
            <div className="h-px flex-1 rounded-full opacity-30" style={{ backgroundColor: tier.color }} />
          </div>

          {/* Connector from above */}
          {tier.tier > 1 && (
            <div className="flex justify-center mb-3">
              <div className="w-px h-6 rounded-full opacity-40" style={{ backgroundColor: tier.color }} />
            </div>
          )}

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tier.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isUnlocked={isSkillUnlocked(skill)}
                isCompleted={completedSkills.includes(skill.id)}
                tierColor={tier.color}
                onClick={(s) => { setSelectedSkill(s); setSelectedTierColor(tier.color) }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-brand-500 bg-brand-500/20 inline-block" />Unlocked</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/40 inline-block" />Completed</span>
        <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" />Locked</span>
      </div>

      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          facts={SKILL_FACTS[selectedSkill.id]}
          tierColor={selectedTierColor}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  )
}
