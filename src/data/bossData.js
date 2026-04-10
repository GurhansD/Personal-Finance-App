// Boss Battle Data — pixel art color palettes & finance quiz questions

export const BOSSES = [
  {
    id: 'debt-dragon',
    name: 'Debt Dragon',
    title: 'Lord of Liabilities',
    lore: 'Ancient beast born from unpaid credit card bills. Its scales are made of 29% APR notices.',
    hp: 100,
    xpReward: 300,
    coinReward: 150,
    difficulty: 1,
    world: 'Cavern of Compound Interest',
    bgGradient: ['#1a0a2e', '#2d1554', '#1a0a2e'],
    auraColor: '#7c3aed',
    palette: {
      body: '#4c1d95',
      bodyDark: '#2d1554',
      bodyLight: '#7c3aed',
      wing: '#5b21b6',
      wingDark: '#3b0764',
      accent: '#c4b5fd',
      eye: '#fbbf24',
      eyeGlow: '#fde68a',
      fire: '#dc2626',
      fireMid: '#f59e0b',
    },
    attackName: 'Interest Inferno',
    weaknessName: 'Budget Shield',
    questions: [
      {
        q: 'What is the "avalanche method" for paying off debt?',
        options: ['Pay minimums on all, extra on lowest balance', 'Pay minimums on all, extra on highest interest rate', 'Consolidate all debt into one loan', 'Pay equal amounts on all debts'],
        answer: 1,
        explanation: 'The avalanche method targets the highest-interest debt first, saving the most money over time.'
      },
      {
        q: 'If you have a $5,000 credit card balance at 20% APR, approximately how much interest do you pay per year?',
        options: ['$500', '$750', '$1,000', '$1,500'],
        answer: 2,
        explanation: '$5,000 × 20% = $1,000 in annual interest charges.'
      },
      {
        q: 'What does APR stand for?',
        options: ['Annual Payment Ratio', 'Annual Percentage Rate', 'Average Principal Rate', 'Adjusted Payment Rate'],
        answer: 1,
        explanation: 'APR (Annual Percentage Rate) is the yearly cost of borrowing, including fees and interest.'
      },
      {
        q: 'Which debt repayment strategy pays off the smallest balance first for psychological wins?',
        options: ['Avalanche method', 'Consolidation method', 'Snowball method', 'Balance transfer method'],
        answer: 2,
        explanation: 'The snowball method builds momentum by eliminating small debts first.'
      },
      {
        q: 'What is a good debt-to-income ratio?',
        options: ['Under 10%', 'Under 36%', 'Under 50%', 'Under 75%'],
        answer: 1,
        explanation: 'Most lenders prefer a DTI under 36%. Above 43% can make it hard to qualify for loans.'
      },
      {
        q: 'What happens to compound interest over time if left unpaid?',
        options: ['It stays the same', 'It decreases', 'It grows exponentially', 'It converts to simple interest'],
        answer: 2,
        explanation: 'Compound interest charges interest on interest — it grows exponentially, making debt much harder to pay off.'
      },
    ]
  },

  {
    id: 'budget-buster',
    name: 'Budget Buster',
    title: 'Phantom of Overspending',
    lore: 'A shapeshifting specter that appears in your bank account as mysterious charges. Born from impulse purchases at 2am.',
    hp: 120,
    xpReward: 400,
    coinReward: 200,
    difficulty: 2,
    world: 'Mall of Eternal Temptation',
    bgGradient: ['#0f1a0a', '#1a3012', '#0f1a0a'],
    auraColor: '#16a34a',
    palette: {
      body: '#14532d',
      bodyDark: '#052e16',
      bodyLight: '#16a34a',
      slime: '#4ade80',
      slimeDark: '#166534',
      accent: '#86efac',
      eye: '#fbbf24',
      eyeGlow: '#fef08a',
      tentacle: '#15803d',
      tentacleDark: '#14532d',
    },
    attackName: 'Impulse Surge',
    weaknessName: '50/30/20 Rule',
    questions: [
      {
        q: 'The 50/30/20 budgeting rule allocates 50% to needs, 30% to wants, and 20% to...?',
        options: ['Entertainment', 'Savings & debt repayment', 'Food & dining', 'Transportation'],
        answer: 1,
        explanation: 'The 20% goes to savings and extra debt payments, building your financial future.'
      },
      {
        q: 'What is a "zero-based budget"?',
        options: ['Spending zero dollars', 'Every dollar has a job — income minus expenses equals zero', 'Saving zero percent of income', 'Having zero credit cards'],
        answer: 1,
        explanation: 'Zero-based budgeting assigns every dollar a purpose, so income minus all allocations equals $0.'
      },
      {
        q: 'Which category typically has the most "budget creep" over time?',
        options: ['Rent/mortgage', 'Subscriptions & entertainment', 'Groceries', 'Utilities'],
        answer: 1,
        explanation: 'Subscriptions silently accumulate — streaming, apps, memberships — and are easy to forget.'
      },
      {
        q: 'What is the "pay yourself first" principle?',
        options: ['Pay your highest bill first', 'Automate savings before spending on anything else', 'Buy what you want before paying bills', 'Pay off debts before buying groceries'],
        answer: 1,
        explanation: 'Automating savings before you can spend ensures you consistently build wealth.'
      },
      {
        q: 'What percentage of Americans live paycheck to paycheck?',
        options: ['About 20%', 'About 35%', 'About 50%', 'About 65%'],
        answer: 3,
        explanation: 'Studies show roughly 65% of Americans live paycheck to paycheck — budgeting is crucial.'
      },
      {
        q: 'A "needs" expense in budgeting is best described as:',
        options: ['Something you really want', 'Essential for survival/work (housing, food, utilities)', 'Any purchase under $50', 'Things that make you happy'],
        answer: 1,
        explanation: 'Needs are non-negotiables: housing, food, transportation for work, healthcare, utilities.'
      },
    ]
  },

  {
    id: 'inflation-imp',
    name: 'Inflation Imp',
    title: 'Eroder of Purchasing Power',
    lore: 'A mischievous demon that makes $100 worth less every year. It feeds on cash sitting idle in savings accounts.',
    hp: 150,
    xpReward: 500,
    coinReward: 250,
    difficulty: 3,
    world: 'Plains of Price Increases',
    bgGradient: ['#1c0a00', '#2d1a00', '#1c0a00'],
    auraColor: '#d97706',
    palette: {
      body: '#92400e',
      bodyDark: '#451a03',
      bodyLight: '#d97706',
      horn: '#b45309',
      hornDark: '#78350f',
      accent: '#fde68a',
      eye: '#ef4444',
      eyeGlow: '#fca5a5',
      flame: '#f59e0b',
      flameDark: '#d97706',
    },
    attackName: 'Price Spike',
    weaknessName: 'Investment Armor',
    questions: [
      {
        q: 'The Rule of 72 estimates how long it takes to double your money. If inflation is 6%, in how many years does your purchasing power halve?',
        options: ['6 years', '12 years', '18 years', '24 years'],
        answer: 1,
        explanation: '72 ÷ 6 = 12 years for your money to lose half its value to 6% inflation.'
      },
      {
        q: 'What is the Federal Reserve\'s target inflation rate?',
        options: ['0%', '2%', '5%', '8%'],
        answer: 1,
        explanation: 'The Fed targets ~2% annual inflation as a healthy economic balance.'
      },
      {
        q: 'Which investment type best protects against inflation?',
        options: ['Cash savings account', 'US Treasury Bonds', 'Broad stock market index funds', 'Certificate of Deposit (CD)'],
        answer: 2,
        explanation: 'Stocks historically return 7-10% annually, outpacing inflation over long periods.'
      },
      {
        q: 'If inflation is 3% and your savings account earns 1%, what is your "real" return?',
        options: ['+4%', '+3%', '0%', '-2%'],
        answer: 3,
        explanation: 'Real return = nominal rate - inflation = 1% - 3% = -2%. You\'re losing purchasing power!'
      },
      {
        q: 'What does TIPS stand for in investing?',
        options: ['Total Interest Protection Securities', 'Treasury Inflation-Protected Securities', 'Tax-Indexed Portfolio Shares', 'Total Income Preservation System'],
        answer: 1,
        explanation: 'TIPS are US Treasury bonds that adjust their principal with inflation, protecting purchasing power.'
      },
      {
        q: 'Hyperinflation occurs when monthly inflation exceeds:',
        options: ['2%', '5%', '50%', '100%'],
        answer: 2,
        explanation: 'Economists define hyperinflation as >50% per month — prices doubling frequently in extreme cases.'
      },
    ]
  },

  {
    id: 'tax-titan',
    name: 'Tax Titan',
    title: 'Collector of Compulsory Contributions',
    lore: 'An ancient giant who has taken a slice of every paycheck since time immemorial. His weakness: deductions and tax-advantaged accounts.',
    hp: 180,
    xpReward: 650,
    coinReward: 325,
    difficulty: 4,
    world: 'Fortress of Filing Deadlines',
    bgGradient: ['#00111a', '#001f2e', '#00111a'],
    auraColor: '#0284c7',
    palette: {
      body: '#0c4a6e',
      bodyDark: '#082f49',
      bodyLight: '#0284c7',
      armor: '#0369a1',
      armorDark: '#075985',
      accent: '#7dd3fc',
      eye: '#f0f9ff',
      eyeGlow: '#bae6fd',
      weapon: '#38bdf8',
      weaponGlow: '#7dd3fc',
    },
    attackName: 'Audit Beam',
    weaknessName: 'Tax-Loss Harvest',
    questions: [
      {
        q: 'What is the maximum 401(k) contribution limit for 2024 (under age 50)?',
        options: ['$6,500', '$19,500', '$23,000', '$30,000'],
        answer: 2,
        explanation: 'The 2024 401(k) limit is $23,000 ($30,500 if 50+). Contributing the max reduces taxable income.'
      },
      {
        q: 'A Roth IRA differs from a Traditional IRA in that:',
        options: ['Contributions are tax-deductible now', 'Withdrawals in retirement are tax-free', 'There is no contribution limit', 'It has lower investment options'],
        answer: 1,
        explanation: 'Roth IRA uses after-tax dollars; withdrawals in retirement are 100% tax-free — great for young investors.'
      },
      {
        q: 'What is "tax-loss harvesting"?',
        options: ['Avoiding all taxes by harvesting crops', 'Selling losing investments to offset capital gains taxes', 'Delaying tax payments until harvest season', 'Claiming farm losses on your return'],
        answer: 1,
        explanation: 'Selling investments at a loss to offset gains can significantly reduce your tax bill.'
      },
      {
        q: 'The standard deduction for a single filer in 2024 is approximately:',
        options: ['$6,500', '$10,000', '$14,600', '$20,000'],
        answer: 2,
        explanation: 'The 2024 standard deduction is $14,600 for single filers — most people benefit from taking it.'
      },
      {
        q: 'Capital gains tax is lower than ordinary income tax if you hold an investment for at least:',
        options: ['30 days', '6 months', '1 year', '5 years'],
        answer: 2,
        explanation: 'Holding over 1 year qualifies for long-term capital gains rates (0%, 15%, or 20%) vs higher ordinary rates.'
      },
      {
        q: 'What is an HSA (Health Savings Account)?',
        options: ['A standard savings account for healthcare', 'A triple-tax-advantaged account for medical expenses', 'A government grant for health emergencies', 'A type of health insurance plan'],
        answer: 1,
        explanation: 'HSAs are triple tax-advantaged: tax-deductible contributions, tax-free growth, tax-free withdrawals for medical costs.'
      },
    ]
  },

  {
    id: 'crypto-chaos',
    name: 'Crypto Chaos',
    title: 'Volatility Incarnate',
    lore: 'A creature of pure chaos — worth $1 million one day and $100 the next. Spawned from leveraged trading and FOMO.',
    hp: 220,
    xpReward: 800,
    coinReward: 400,
    difficulty: 5,
    world: 'Digital Void of Speculation',
    bgGradient: ['#0a0a1a', '#0a0a30', '#0a0a1a'],
    auraColor: '#a855f7',
    palette: {
      body: '#581c87',
      bodyDark: '#3b0764',
      bodyLight: '#a855f7',
      data: '#7c3aed',
      dataDark: '#4c1d95',
      accent: '#d8b4fe',
      eye: '#22d3ee',
      eyeGlow: '#67e8f9',
      circuit: '#818cf8',
      circuitGlow: '#c7d2fe',
    },
    attackName: 'Market Crash',
    weaknessName: 'Diversification Protocol',
    questions: [
      {
        q: 'What percentage of your portfolio do most financial advisors recommend allocating to crypto?',
        options: ['0%', '1-5%', '20-30%', '50%+'],
        answer: 1,
        explanation: 'Most advisors suggest crypto should be 1-5% of your portfolio due to its extreme volatility.'
      },
      {
        q: 'What is "dollar-cost averaging" (DCA)?',
        options: ['Investing all money at once', 'Investing fixed amounts at regular intervals regardless of price', 'Only buying at market lows', 'Averaging the cost of dollars across currencies'],
        answer: 1,
        explanation: 'DCA reduces the impact of volatility by investing fixed amounts regularly — you buy more when prices are low.'
      },
      {
        q: 'What does diversification protect against?',
        options: ['Market inflation', 'Concentration risk (one asset crashing your entire portfolio)', 'Tax liability', 'Currency devaluation'],
        answer: 1,
        explanation: 'Diversification spreads risk — if one asset crashes, others may hold value, protecting your overall portfolio.'
      },
      {
        q: 'An index fund tracks a market index like the S&P 500. What is its main advantage over individual stocks?',
        options: ['Higher potential returns', 'Zero risk', 'Automatic diversification at low cost', 'Tax exemption'],
        answer: 2,
        explanation: 'Index funds instantly diversify across hundreds of companies, reducing single-stock risk at minimal cost.'
      },
      {
        q: 'FOMO in investing stands for:',
        options: ['Fundamental Operations Management Objective', 'Fear Of Missing Out', 'Financial Operations Monitoring Order', 'Forward Options Market Opportunity'],
        answer: 1,
        explanation: 'FOMO (Fear Of Missing Out) leads investors to chase gains irrationally — one of the biggest investment mistakes.'
      },
      {
        q: 'The Sharpe ratio measures:',
        options: ['How fast a stock grows', 'Risk-adjusted return — return per unit of risk taken', 'The sharpness of a market trend', 'Tax efficiency of investments'],
        answer: 1,
        explanation: 'Higher Sharpe ratio = better risk-adjusted returns. A ratio above 1 is generally considered good.'
      },
    ]
  },
]

export const WORLD_NODES = [
  { id: 'debt-dragon',   x: 15, y: 70, label: 'Cavern',  icon: '🐉' },
  { id: 'budget-buster', x: 35, y: 45, label: 'Mall',    icon: '👻' },
  { id: 'inflation-imp', x: 55, y: 65, label: 'Plains',  icon: '😈' },
  { id: 'tax-titan',     x: 72, y: 35, label: 'Fortress',icon: '🗿' },
  { id: 'crypto-chaos',  x: 88, y: 60, label: 'Void',    icon: '👾' },
]

export const WORLD_PATHS = [
  ['debt-dragon', 'budget-buster'],
  ['budget-buster', 'inflation-imp'],
  ['inflation-imp', 'tax-titan'],
  ['tax-titan', 'crypto-chaos'],
]
