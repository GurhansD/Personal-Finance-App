export const lessons = [
  {
    id: 'budgeting-101',
    title: 'Budgeting 101',
    subtitle: 'The foundation of financial success',
    category: 'Basics',
    difficulty: 'Beginner',
    xp: 100,
    duration: '8 min',
    icon: '📊',
    color: '#22c55e',
    description: 'Learn the fundamentals of creating and sticking to a budget that actually works.',
    content: [
      {
        type: 'intro',
        title: 'Why Budgeting Changes Everything',
        text: 'A budget is simply a plan for your money. Without one, money tends to disappear — with one, you tell every dollar where to go. Studies show that people who budget consistently build 3x more wealth over 10 years than those who don\'t.'
      },
      {
        type: 'concept',
        title: 'The 50/30/20 Rule',
        text: 'The most popular budgeting framework divides your after-tax income into three buckets:',
        bullets: [
          '50% — Needs: rent, groceries, utilities, insurance',
          '30% — Wants: dining out, entertainment, shopping',
          '20% — Savings & Debt: emergency fund, investments, extra debt payments',
        ]
      },
      {
        type: 'tip',
        title: 'Pro Tip: Zero-Based Budgeting',
        text: 'Give every dollar a job. At the start of each month, subtract all expenses, savings, and investments from your income until you reach zero. This forces intentionality with every dollar.'
      },
      {
        type: 'concept',
        title: 'Fixed vs. Variable Expenses',
        text: 'Fixed expenses (rent, loan payments) stay the same each month — easy to budget. Variable expenses (food, gas, entertainment) fluctuate — these need tracking and category limits.',
        bullets: [
          'Fixed: Rent/mortgage, car payment, insurance, subscriptions',
          'Variable: Groceries, dining out, gas, clothing, entertainment',
          'Irregular: Car repairs, medical bills, gifts — budget for these with a "sinking fund"',
        ]
      },
      {
        type: 'action',
        title: 'Your First Budget Step',
        text: 'Go to the Budget section now and set limits for your top 5 spending categories. Start with what you already know you spend, then reduce each by 10% as a challenge.'
      },
    ],
    quiz: [
      {
        question: 'In the 50/30/20 rule, what percentage should go to savings?',
        options: ['10%', '20%', '30%', '50%'],
        correct: 1,
        explanation: '20% of your after-tax income should go toward savings and debt repayment.'
      },
      {
        question: 'What is "zero-based budgeting"?',
        options: [
          'Spending nothing',
          'Assigning every dollar a purpose until income minus expenses equals zero',
          'Having zero credit card debt',
          'Saving zero dollars'
        ],
        correct: 1,
        explanation: 'Zero-based budgeting means every dollar of income is allocated to a category, leaving zero unassigned.'
      },
      {
        question: 'Which of these is a "variable" expense?',
        options: ['Rent', 'Car payment', 'Grocery shopping', 'Monthly subscription'],
        correct: 2,
        explanation: 'Groceries are variable because the amount changes month to month.'
      },
    ]
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund Essentials',
    subtitle: 'Your financial safety net',
    category: 'Savings',
    difficulty: 'Beginner',
    xp: 100,
    duration: '6 min',
    icon: '🛡️',
    color: '#3b82f6',
    description: 'Why an emergency fund is the #1 priority before any other financial goal.',
    content: [
      {
        type: 'intro',
        title: 'The #1 Financial Priority',
        text: 'Before investing, before paying extra on debt, before anything — you need an emergency fund. Without it, one car repair or medical bill sends you into debt spiral. With it, you have financial peace of mind.'
      },
      {
        type: 'concept',
        title: 'How Much Do You Need?',
        text: 'Financial experts recommend saving 3-6 months of essential living expenses:',
        bullets: [
          '3 months — dual-income household, stable job, no dependents',
          '6 months — single income, variable income, or have dependents',
          '9-12 months — self-employed, commission-based, or high-risk industry',
        ]
      },
      {
        type: 'tip',
        title: 'Where to Keep It',
        text: 'Your emergency fund should be: (1) Liquid — accessible within 1-2 days. (2) Safe — no investment risk. (3) Separate — not your checking account. Best choice: High-Yield Savings Account (HYSA) earning 4-5% APY.'
      },
      {
        type: 'concept',
        title: 'Building It Fast',
        text: 'Start with a "starter emergency fund" of $1,000 while paying minimum on debts. Then aggressively build to your full 3-6 month target.',
        bullets: [
          'Automate a transfer on payday',
          'Direct windfalls (tax refunds, bonuses) here first',
          'Sell unused items',
          'Pick up extra work temporarily',
        ]
      },
    ],
    quiz: [
      {
        question: 'What is the recommended size of an emergency fund?',
        options: ['1 month expenses', '2 months expenses', '3-6 months expenses', '1 year expenses'],
        correct: 2,
        explanation: '3-6 months of essential living expenses is the standard recommendation.'
      },
      {
        question: 'Where is the best place to keep an emergency fund?',
        options: [
          'Stock market for better returns',
          'Under your mattress',
          'High-Yield Savings Account',
          'Checking account'
        ],
        correct: 2,
        explanation: 'A High-Yield Savings Account is liquid, safe, and earns interest — perfect for an emergency fund.'
      },
    ]
  },
  {
    id: 'compound-interest',
    title: 'The Magic of Compound Interest',
    subtitle: 'Make your money work for you',
    category: 'Investing',
    difficulty: 'Beginner',
    xp: 150,
    duration: '10 min',
    icon: '🚀',
    color: '#8b5cf6',
    description: 'Understand the most powerful force in personal finance and how to harness it.',
    content: [
      {
        type: 'intro',
        title: 'Einstein\'s "8th Wonder of the World"',
        text: 'Albert Einstein reportedly called compound interest the eighth wonder of the world. "He who understands it, earns it; he who doesn\'t, pays it." Compound interest is earning returns on your returns — and it\'s exponential.'
      },
      {
        type: 'concept',
        title: 'Simple vs. Compound Interest',
        text: 'Simple interest is linear. Compound interest is exponential:',
        bullets: [
          'Simple: $10,000 at 10% = $1,000/year, every year',
          'Compound: $10,000 at 10% = $1,000 yr1, $1,100 yr2, $1,210 yr3...',
          'After 30 years: Simple = $40,000 | Compound = $174,494',
        ]
      },
      {
        type: 'concept',
        title: 'The Rule of 72',
        text: 'Divide 72 by your annual return rate to find how many years to double your money:',
        bullets: [
          '72 ÷ 6% = 12 years to double',
          '72 ÷ 8% = 9 years to double',
          '72 ÷ 10% = 7.2 years to double',
          '72 ÷ 12% = 6 years to double',
        ]
      },
      {
        type: 'tip',
        title: 'The Time Factor',
        text: 'Starting at 25 vs. 35 makes a massive difference. Investing $500/month from age 25 at 8% = $1.7M at 65. Starting at 35 = $745K. Ten years earlier = more than double. Start NOW.'
      },
      {
        type: 'concept',
        title: 'Best Compound Interest Vehicles',
        text: 'Use tax-advantaged accounts to maximize compounding:',
        bullets: [
          '401(k) — Pre-tax, employer match = instant 50-100% return',
          'Roth IRA — Tax-free growth, pay taxes now, withdraw tax-free',
          'Index Funds (S&P 500) — ~10% average annual returns since 1926',
          'HSA — Triple tax advantage if used for healthcare',
        ]
      },
    ],
    quiz: [
      {
        question: 'Using the Rule of 72, how long to double money at 9% annual return?',
        options: ['6 years', '8 years', '9 years', '12 years'],
        correct: 1,
        explanation: '72 ÷ 9 = 8 years to double your money at a 9% annual return rate.'
      },
      {
        question: 'What makes compound interest more powerful than simple interest?',
        options: [
          'Higher interest rates',
          'Earning returns on your previous returns',
          'More frequent deposits',
          'Lower taxes'
        ],
        correct: 1,
        explanation: 'Compound interest earns returns on your accumulated returns, creating exponential growth.'
      },
    ]
  },
  {
    id: 'debt-avalanche',
    title: 'Destroy Debt: Avalanche Method',
    subtitle: 'Mathematically optimal debt payoff',
    category: 'Debt',
    difficulty: 'Intermediate',
    xp: 150,
    duration: '8 min',
    icon: '⛰️',
    color: '#ef4444',
    description: 'The mathematically optimal strategy for paying off debt and saving thousands in interest.',
    content: [
      {
        type: 'intro',
        title: 'The Debt Avalanche Strategy',
        text: 'Pay minimums on all debts, then throw every extra dollar at the highest-interest debt first. Once that\'s gone, roll that payment to the next highest. This minimizes total interest paid — often saving thousands.'
      },
      {
        type: 'concept',
        title: 'Avalanche vs. Snowball',
        text: 'Two popular debt payoff methods:',
        bullets: [
          'Avalanche: Highest interest rate first — saves the most money',
          'Snowball: Smallest balance first — gives psychological wins faster',
          'Mathematically: Avalanche wins. Psychologically: Snowball wins.',
          'Hybrid: Use snowball to build momentum, switch to avalanche.',
        ]
      },
      {
        type: 'tip',
        title: 'The Debt Payoff Formula',
        text: 'Step 1: List all debts with balance, interest rate, minimum payment. Step 2: Pay minimums on all. Step 3: Apply ALL extra money to highest-rate debt. Step 4: When paid off, add that payment to next debt.'
      },
      {
        type: 'concept',
        title: 'Finding Extra Money',
        text: 'To accelerate debt payoff:',
        bullets: [
          'Cut subscriptions you don\'t use',
          'Cook at home vs. dining out',
          'Negotiate bills (insurance, phone, internet)',
          'Sell items you don\'t need',
          'Pick up a side hustle temporarily',
        ]
      },
    ],
    quiz: [
      {
        question: 'In the Avalanche method, which debt do you pay first?',
        options: ['Smallest balance', 'Largest balance', 'Highest interest rate', 'Lowest interest rate'],
        correct: 2,
        explanation: 'The Avalanche method targets the highest interest rate debt first to minimize total interest paid.'
      },
      {
        question: 'Which debt payoff method saves the most money mathematically?',
        options: ['Snowball', 'Avalanche', 'Both are equal', 'It depends on balances'],
        correct: 1,
        explanation: 'The Avalanche method is mathematically optimal because it minimizes total interest paid over time.'
      },
    ]
  },
  {
    id: 'index-investing',
    title: 'Index Fund Investing',
    subtitle: 'Beat 90% of investors effortlessly',
    category: 'Investing',
    difficulty: 'Intermediate',
    xp: 200,
    duration: '12 min',
    icon: '📈',
    color: '#f59e0b',
    description: 'Why index funds outperform most actively managed funds and how to start investing today.',
    content: [
      {
        type: 'intro',
        title: 'The Simplest Path to Wealth',
        text: 'John Bogle, founder of Vanguard, revolutionized investing: 90%+ of actively managed funds fail to beat their benchmark index over 20 years. By investing in an index fund, you automatically own a piece of hundreds of companies.'
      },
      {
        type: 'concept',
        title: 'What is an Index Fund?',
        text: 'An index fund tracks a market index like the S&P 500 (top 500 US companies):',
        bullets: [
          'Instant diversification across 500+ companies',
          'Ultra-low fees (0.03-0.2% vs. 1-2% for active funds)',
          'No fund manager risk',
          'Historical average: ~10% annual return (S&P 500)',
        ]
      },
      {
        type: 'concept',
        title: 'Top Index Funds to Know',
        text: 'Popular, battle-tested options:',
        bullets: [
          'VOO (Vanguard S&P 500 ETF) — 0.03% expense ratio',
          'VTI (Vanguard Total Stock Market) — entire US market',
          'VXUS (International stocks) — diversify globally',
          'BND (Bond index) — stability for older investors',
        ]
      },
      {
        type: 'tip',
        title: 'Dollar-Cost Averaging',
        text: 'Invest a fixed amount regularly (monthly) regardless of market price. When prices are low, you buy more shares. When high, fewer. This removes emotion and timing risk from investing.'
      },
      {
        type: 'action',
        title: 'Getting Started',
        text: 'Open a Roth IRA at Fidelity, Vanguard, or Schwab. Set up automatic monthly investments into a total market index fund. Don\'t touch it for 30+ years. That\'s it. That\'s the strategy.'
      },
    ],
    quiz: [
      {
        question: 'What percentage of active fund managers fail to beat index funds over 20 years?',
        options: ['30%', '50%', '70%', '90%'],
        correct: 3,
        explanation: 'Over 90% of actively managed funds underperform their benchmark index over 20 years.'
      },
      {
        question: 'What is Dollar-Cost Averaging?',
        options: [
          'Buying only when prices are low',
          'Investing a fixed amount at regular intervals',
          'Averaging your purchase price manually',
          'Only buying low-cost stocks'
        ],
        correct: 1,
        explanation: 'DCA means investing a set amount regularly regardless of price — removing emotion from investing.'
      },
    ]
  },
  {
    id: 'credit-score',
    title: 'Master Your Credit Score',
    subtitle: 'From 580 to 800+ explained',
    category: 'Credit',
    difficulty: 'Beginner',
    xp: 125,
    duration: '7 min',
    icon: '⭐',
    color: '#06b6d4',
    description: 'Understand exactly what makes up your credit score and how to optimize each factor.',
    content: [
      {
        type: 'intro',
        title: 'Why Your Credit Score Matters',
        text: 'Your credit score affects mortgage rates, car loan rates, insurance premiums, and even job applications. A 760 vs. 620 score on a $300K mortgage saves $100,000+ in interest over 30 years.'
      },
      {
        type: 'concept',
        title: 'FICO Score Breakdown',
        text: 'Your score is calculated from 5 factors:',
        bullets: [
          '35% — Payment History (never miss a payment)',
          '30% — Credit Utilization (keep below 10-30%)',
          '15% — Length of Credit History (older is better)',
          '10% — Credit Mix (cards + loans + mortgage)',
          '10% — New Credit (hard inquiries hurt temporarily)',
        ]
      },
      {
        type: 'tip',
        title: 'The #1 Hack: Credit Utilization',
        text: 'Your utilization ratio is your balance divided by your credit limit. Keep it below 10% for an excellent score. If you have a $5,000 limit, keep your balance under $500. Pay multiple times per month if needed.'
      },
      {
        type: 'concept',
        title: 'Score Ranges',
        text: 'What your score means:',
        bullets: [
          '800-850: Exceptional — best rates available',
          '740-799: Very Good — near-best rates',
          '670-739: Good — most loans approved',
          '580-669: Fair — higher rates, limited options',
          'Below 580: Poor — very limited credit access',
        ]
      },
    ],
    quiz: [
      {
        question: 'What is the most important factor in your credit score?',
        options: ['Credit Utilization', 'Payment History', 'Length of History', 'Credit Mix'],
        correct: 1,
        explanation: 'Payment history makes up 35% of your FICO score — the single largest factor.'
      },
      {
        question: 'What credit utilization ratio is ideal for maximizing your score?',
        options: ['Below 10%', 'Below 30%', 'Below 50%', 'It doesn\'t matter'],
        correct: 0,
        explanation: 'Keeping utilization below 10% (ideally 1-9%) gives the best impact on your score.'
      },
    ]
  },
]

export const categories = ['All', 'Basics', 'Savings', 'Investing', 'Debt', 'Credit']
