// ─── src/data/seedKnowledgeBase.js ───────────────────────────────────────────
//
// Seed script: populates the KnowledgeBase MongoDB collection with verified
// financial content. Run once with: npm run seed
//
// This script uses upsert (updateOne with upsert: true) so it is safe to
// run multiple times — it will update existing entries rather than
// create duplicates.
//
// HOW TO RUN:
//   1. Make sure your .env file is configured with MONGODB_URI
//   2. Run:  npm run seed
//   3. You should see "✅  Knowledge base seeded successfully." in the console
//
// TO ADD MORE ENTRIES:
//   Add objects to the KB_ENTRIES array below following the same schema.
//   Each entry maps to one or more intent categories (intentTags).
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const mongoose     = require('mongoose');
const KnowledgeBase = require('../models/KnowledgeBase');

const KB_ENTRIES = [

  // ─── 1. PROFIT MARGIN ──────────────────────────────────────────────────────
  {
    topicId:    'profit-margin-basics',
    title:      'Profit Margin — What It Is and How to Calculate It',
    intentTags: ['Profit & Loss', 'General Financial Education'],
    definition: 'Profit margin is the percentage of revenue that remains as profit after all costs are deducted.',
    explanation: `There are two key types of profit margin every SME owner should know:

1. Gross Profit Margin: Measures how much profit you make after paying for the goods or services you sell.
   Formula: Gross Profit Margin = ((Revenue - Cost of Goods Sold) / Revenue) × 100%

2. Net Profit Margin: Measures how much profit remains after ALL expenses (rent, salaries, utilities, taxes).
   Formula: Net Profit Margin = (Net Profit / Revenue) × 100%

A higher margin means your business is more efficient. Most Nigerian retail businesses aim for at least 20–30% gross profit margin.`,
    examples: [
      'A Lagos fabric seller buys cloth for ₦40,000 and sells it for ₦60,000. Gross profit = ₦20,000. Gross margin = (₦20,000 / ₦60,000) × 100% = 33.3%.',
      'An Abuja caterer earns ₦500,000/month. After ingredients (₦180,000), staff (₦80,000), and gas/transport (₦40,000), net profit = ₦200,000. Net margin = (₦200,000 / ₦500,000) × 100% = 40%.',
    ],
    misconceptions: [
      'Revenue is NOT the same as profit. You can have high revenue but low or negative profit if your costs are too high.',
      'A profitable business can still run out of cash — profit and cash flow are different things.',
    ],
    actionSteps: [
      'Calculate your gross profit margin for last month by subtracting your cost of goods sold from your revenue, then dividing by revenue and multiplying by 100.',
      'Compare your margin to the previous month to see if your business is improving.',
      'If your margin is below 15%, investigate which costs you can reduce.',
    ],
    references: ['SMEDAN Financial Literacy Handbook', 'CBN Financial Inclusion Framework'],
  },

  // ─── 2. CASH FLOW ──────────────────────────────────────────────────────────
  {
    topicId:    'cash-flow-vs-profit',
    title:      'Cash Flow vs Profit — Understanding the Difference',
    intentTags: ['Cash Flow', 'General Financial Education'],
    definition: 'Cash flow is the movement of actual money in and out of your business. Profit is an accounting figure that may not reflect your cash position.',
    explanation: `Many profitable Nigerian businesses collapse due to cash flow problems. Here is why:

- When you sell goods on credit, your accounts show revenue (profit) immediately — but you have no cash until the buyer pays.
- When you buy stock in advance, cash leaves your account — but this doesn't reduce your "profit" until the goods are sold.
- Loan repayments come from cash, but are not always shown as expenses on your income statement.

Your cash flow statement tracks three types of flows:
1. Operating cash flows — from day-to-day business activities
2. Investing cash flows — from buying or selling assets
3. Financing cash flows — from loans taken or repaid`,
    examples: [
      'Amara sells electronics in Onitsha. In March, she records ₦300,000 in credit sales. Her income statement shows ₦300,000 revenue. But her customers pay 60 days later — so in March, her cash flow is ₦0 from those sales.',
      'Emeka runs a provision store. He buys ₦200,000 of stock in January. Cash leaves his account, but he still shows the stock as an asset — not a loss.',
    ],
    misconceptions: [
      'A business showing profit is NOT necessarily safe. If it cannot pay its bills when due, it can fail.',
      '"I have inventory" does not mean "I have cash." Inventory must be converted to sales, then to actual payment.',
    ],
    actionSteps: [
      'Track every actual cash receipt and every actual cash payment separately from your sales records.',
      'Chase unpaid invoices aggressively — every day a customer owes you money is a day that cash is not in your business.',
      'Maintain a cash buffer of at least 1 month of operating expenses.',
    ],
    references: ['CBN Financial Literacy Programme', 'SMEDAN Business Management Guide'],
  },

  // ─── 3. BUDGETING ──────────────────────────────────────────────────────────
  {
    topicId:    'budgeting-for-smes',
    title:      'How to Create a Simple Business Budget',
    intentTags: ['Budgeting & Planning'],
    definition: 'A budget is a financial plan that estimates your expected income and expenses over a specific time period.',
    explanation: `A budget is not just for large companies. Every SME needs one. Here is a simple 5-step process:

Step 1: Estimate your expected revenue for the month. Base this on your past sales or realistic targets.
Step 2: List ALL your expected expenses — rent, salaries, stock purchases, transport, utilities, taxes.
Step 3: Subtract expenses from revenue. If positive, that's your expected profit.
Step 4: At the end of the month, compare actual figures to your budget (variance analysis).
Step 5: Investigate large variances — if expenses were higher than budgeted, find out why and fix it.`,
    examples: [
      'Ngozi runs a hair salon in Port Harcourt. Expected monthly revenue: ₦150,000. Expenses: Products ₦30,000 + Rent ₦25,000 + Staff ₦40,000 + Utilities ₦10,000 = ₦105,000. Expected profit: ₦45,000.',
      'A Kano fabric shop budgets ₦80,000 for monthly stock purchase but spends ₦110,000. The ₦30,000 overspend should trigger an investigation — were extra goods bought unnecessarily?',
    ],
    misconceptions: [
      'A budget is not a rigid rule — it is a planning tool. Review and adjust it monthly.',
      'Revenue targets are not the same as revenue guarantees. Budget conservatively.',
    ],
    actionSteps: [
      'Open a simple spreadsheet and create two columns: Expected and Actual, for both revenue and each expense category.',
      'Review your budget every month — not just at year end.',
      'Set a "budget meeting" with yourself on the last Friday of every month.',
    ],
    references: ['SMEDAN SME Financial Management Toolkit'],
  },

  // ─── 4. BOOKKEEPING ────────────────────────────────────────────────────────
  {
    topicId:    'bookkeeping-basics',
    title:      'Bookkeeping Basics for Nigerian Small Business Owners',
    intentTags: ['Bookkeeping'],
    definition: 'Bookkeeping is the systematic recording of all financial transactions in your business.',
    explanation: `You do not need to be an accountant to keep basic books. Start with these records:

1. Sales Record — every sale you make (date, customer, amount, payment method)
2. Expense Record — every cost you incur (date, supplier, amount, category)
3. Cash Book — all cash received and paid out
4. Stock Record — what stock you have, what was sold, what needs reordering

The goal is to know at any point: How much did I sell? What did I spend? What do I owe? Who owes me?`,
    examples: [
      'Tunde, a Lagos electrician, uses a hardcover notebook with four columns: Date, Description, Money In, Money Out. He records every payment received and every supply purchased. At month end he adds up both columns to see his position.',
      'For a more modern approach: free apps like Wave Accounting or simple Excel templates work well for Nigerian SMEs.',
    ],
    misconceptions: [
      'Bookkeeping is not just for tax purposes — it helps you make better daily decisions.',
      'Mixing personal and business money in the same account makes bookkeeping nearly impossible. Open a separate business account.',
    ],
    actionSteps: [
      'Open a dedicated business bank account today if you do not have one.',
      'Record every transaction the same day it happens — never let it pile up.',
      'At month end, reconcile your records against your bank statement.',
    ],
    references: ['CAC Business Registration Guide', 'SMEDAN SME Capacity Building Resources'],
  },

  // ─── 5. FRAUD & SECURITY ───────────────────────────────────────────────────
  {
    topicId:    'fake-bank-alert-fraud',
    title:      'Protecting Your Business from Fake Bank Alert Scams',
    intentTags: ['Fraud & Security'],
    definition: 'A fake bank alert is a fraudulent SMS or screenshot designed to look like a genuine bank credit notification, used to trick business owners into releasing goods without receiving actual payment.',
    explanation: `This is one of the most common financial frauds targeting Nigerian market traders and small business owners.

HOW IT WORKS:
A buyer generates a fake bank transfer notification on their phone (using screenshot editing apps or fake SMS services) and shows it to the seller as "proof of payment." The seller releases goods, but no money ever arrives.

HOW TO VERIFY PAYMENT:
1. Log into your banking app directly and check your account balance.
2. Wait for the actual credit to appear — do not rely on the buyer's screenshot.
3. Call your bank's official customer service line to confirm large transfers.
4. Never release goods based on an SMS alone — always confirm on your bank app.`,
    examples: [
      'A laptop seller in Computer Village, Ikeja shows ₦350,000 credited on his app before releasing the device. The buyer had shown a fake alert — but the seller\'s app showed nothing had arrived. The buyer left empty-handed.',
      'A fabric dealer in Balogun Market now requires a minimum of 10 minutes from "alert" to goods release — enough time to see the credit appear on her mobile app.',
    ],
    misconceptions: [
      'A screenshot of a transfer is NOT proof of payment. Screenshots can be easily faked.',
      'USSD balance checks (*737#, *770#) can also be manipulated — always use the bank app or call the bank.',
    ],
    actionSteps: [
      'Download and set up your bank\'s official mobile app if you have not already.',
      'For transactions above ₦50,000, make it a policy to confirm on your banking app before releasing goods.',
      'Report confirmed fraud to the EFCC: efcchq@efcc.gov.ng or 0800-326-5252 (toll free).',
      'Educate your staff on how to spot fake alerts.',
    ],
    references: ['CBN Consumer Protection Framework', 'EFCC Fraud Prevention Guidelines'],
  },

  // ─── 6. CREDIT & LOANS ─────────────────────────────────────────────────────
  {
    topicId:    'business-loans-nigeria',
    title:      'Accessing Business Loans and Credit in Nigeria',
    intentTags: ['Credit & Loans'],
    definition: 'A business loan is borrowed capital that must be repaid with interest, used to fund business operations, expansion, or equipment purchase.',
    explanation: `Nigerian SMEs have several credit options:

1. Commercial Bank Loans — higher interest rates (typically 18–28% per annum), require collateral.
2. Microfinance Banks — smaller amounts (₦50,000–₦5 million), more flexible requirements.
3. Government Schemes:
   - BOI (Bank of Industry) — low-interest loans for manufacturing and agriculture
   - CBN Agri-Business/MSME Fund — concessionary rates for qualifying businesses
   - SMEDAN Support — business development services and funding referrals
4. Cooperative/esusu — informal group savings and lending
5. Fintech lending apps — quick disbursement, but very high effective interest rates

CALCULATING SIMPLE INTEREST:
Interest = Principal × Rate × Time
Example: ₦500,000 at 20% per annum for 2 years = ₦500,000 × 0.20 × 2 = ₦200,000 total interest`,
    examples: [
      'A seamstress in Aba wants ₦200,000 to buy an industrial sewing machine. She applies to a microfinance bank at 24% per annum for 1 year. Monthly repayment ≈ ₦18,667. She calculates whether her added revenue from the machine exceeds this before signing.',
      'For BOI loans, visit boi.ng — they have specific windows for women-owned and youth-owned businesses.',
    ],
    misconceptions: [
      'Taking a loan is not always bad — it depends on whether the return from the loan exceeds its cost.',
      'Do not take loans to pay salaries or rent unless you have a clear repayment plan. This creates a debt spiral.',
    ],
    actionSteps: [
      'Calculate your debt service coverage ratio: Monthly Net Profit ÷ Monthly Loan Repayment. If this is below 1.2, the loan may be too risky.',
      'Always read the full loan agreement — check for hidden fees and penalty clauses.',
      'Visit smedan.gov.ng or boi.ng to explore government-backed low-interest options before going to commercial banks.',
    ],
    references: ['CBN Development Finance Programmes', 'BOI SME Facility Guidelines', 'SMEDAN Access to Finance Guide'],
  },

  // ─── 7. TAX & COMPLIANCE ───────────────────────────────────────────────────
  {
    topicId:    'vat-and-tax-compliance-nigeria',
    title:      'VAT and Tax Compliance for Nigerian SMEs',
    intentTags: ['Tax & Compliance'],
    definition: 'Value Added Tax (VAT) is a consumption tax levied at 7.5% on most goods and services in Nigeria, collected and remitted by registered businesses to the FIRS.',
    explanation: `KEY TAX OBLIGATIONS FOR NIGERIAN SMEs:

1. VAT (Value Added Tax):
   - Rate: 7.5% (since Finance Act 2019)
   - Who must register: Businesses with annual turnover above ₦25 million
   - Filing: Monthly via FIRS e-Tax platform (eTax.firs.gov.ng)
   - Due date: 21st of the following month

2. Company Income Tax (CIT):
   - Rate: 20% for small companies (turnover ₦25m–₦100m)
   - 0% for micro companies (turnover below ₦25m)
   - Rate: 30% for large companies

3. PAYE (Pay As You Earn):
   - If you have employees, you must deduct income tax from their salaries monthly and remit to the relevant State Internal Revenue Service.

4. Business Registration:
   - Register your business with CAC at cac.gov.ng
   - A registered business can open a bank account, apply for loans, and win contracts.`,
    examples: [
      'A Lagos fashion designer with annual revenue of ₦30 million must register for VAT. She charges 7.5% VAT on each invoice. At month end, she remits the collected VAT (minus any VAT she paid on purchases) to FIRS.',
      'A sole proprietor with revenue below ₦25 million pays 0% CIT — but must still file a nil return annually to avoid penalties.',
    ],
    misconceptions: [
      '"My business is too small to pay tax." Not true — even if your tax rate is 0%, you still need to register and file returns.',
      'Keeping poor records makes tax compliance harder and increases your risk of penalties during a FIRS audit.',
    ],
    actionSteps: [
      'Register your business at cac.gov.ng (can be done online for a sole proprietorship).',
      'Obtain a Tax Identification Number (TIN) from FIRS: tin.jtb.gov.ng.',
      'Set up an account on eTax.firs.gov.ng to file and pay taxes online.',
      'Consult a registered tax consultant for your specific situation.',
    ],
    references: ['FIRS VAT Guide 2024', 'Finance Act 2019 (Nigeria)', 'CAC Registration Guidelines'],
  },

  // ─── 8. BREAK-EVEN ANALYSIS ────────────────────────────────────────────────
  {
    topicId:    'break-even-analysis',
    title:      'Break-Even Analysis — How Much Must You Sell to Cover Your Costs?',
    intentTags: ['Profit & Loss', 'Budgeting & Planning'],
    definition: 'The break-even point is the level of sales at which your total revenue equals your total costs — meaning you make neither a profit nor a loss.',
    explanation: `Understanding your break-even point helps you answer: "How much must I sell this month just to survive?"

KEY TERMS:
- Fixed Costs: Costs that stay the same regardless of sales (rent, salaries, electricity bill minimum)
- Variable Costs: Costs that change with each unit sold (raw materials, packaging, delivery)
- Contribution Margin per unit: Selling price per unit minus variable cost per unit

BREAK-EVEN FORMULA:
Break-Even Point (units) = Total Fixed Costs ÷ Contribution Margin per unit

BREAK-EVEN POINT (in ₦):
Break-Even Revenue = Total Fixed Costs ÷ (1 - (Variable Cost / Selling Price))`,
    examples: [
      'Fatima bakes and sells bread. Fixed costs: ₦50,000/month (rent, oven depreciation). She sells each loaf for ₦500. Variable cost per loaf: ₦200. Contribution margin = ₦300. Break-even = ₦50,000 ÷ ₦300 = 167 loaves. She must sell 167 loaves per month before making any profit.',
      'If Fatima sells 200 loaves in a month, her profit = (200 - 167) × ₦300 = 33 × ₦300 = ₦9,900.',
    ],
    misconceptions: [
      'Break-even is not a target — it is a minimum. Your actual target should be well above break-even.',
      'Break-even ignores the owner\'s salary. Add your own desired income to fixed costs for a more realistic picture.',
    ],
    actionSteps: [
      'List all your fixed monthly costs and add them up.',
      'Calculate your contribution margin per product/service.',
      'Divide fixed costs by contribution margin to get your monthly break-even volume.',
      'Compare this to your actual monthly sales — are you consistently above break-even?',
    ],
    references: ['SMEDAN Financial Management for SMEs', 'CBN SME Finance Guidelines'],
  },

];

// ── Seed function ─────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    let created = 0;
    let updated = 0;

    for (const entry of KB_ENTRIES) {
      const result = await KnowledgeBase.updateOne(
        { topicId: entry.topicId },
        { $set: entry },
        { upsert: true }
      );

      if (result.upsertedCount > 0) created++;
      else if (result.modifiedCount > 0) updated++;
    }

    console.log(`✅  Knowledge base seeded successfully.`);
    console.log(`    Created: ${created} | Updated: ${updated} | Total entries: ${KB_ENTRIES.length}`);

  } catch (error) {
    console.error('❌  Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
