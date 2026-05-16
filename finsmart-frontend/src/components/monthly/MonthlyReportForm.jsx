import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import client from '../../api/client';

const EXPENSE_ROWS = [
  ['costOfGoodsSold', 'Cost of goods sold / stock purchased'],
  ['staffSalaries', 'Staff salaries & wages'],
  ['rentUtilities', 'Rent & utilities'],
  ['transportLogistics', 'Transport & logistics'],
  ['marketingAdvertising', 'Marketing & advertising'],
  ['loanRepayments', 'Loan repayments (principal + interest)'],
  ['taxPayments', 'Tax payments'],
  ['miscellaneousExpenses', 'Miscellaneous expenses'],
];

function num(val) {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

export default function MonthlyReportForm() {
  const today = new Date();
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(String(today.getMonth() + 1));

  const [expenses, setExpenses] = useState(() =>
    Object.fromEntries(EXPENSE_ROWS.map(([key]) => [key, '']))
  );

  const [revenueSection, setRevenueSection] = useState({
    totalMonthlyRevenue: '',
    revenueFromCreditSales: '',
    revenueCollectedFromPriorCredit: '',
  });

  const [cash, setCash] = useState({
    openingCash: '',
    closingCash: '',
    cashAtHand: '',
    cashInBank: '',
  });

  const [metrics, setMetrics] = useState({
    customersServed: '',
    newCustomers: '',
    operatingDays: '',
  });

  const [largeOneOff, setLargeOneOff] = useState(false);
  const [largeOneOffDescription, setLargeOneOffDescription] = useState('');
  const [largeOneOffAmount, setLargeOneOffAmount] = useState('');

  const [newAssets, setNewAssets] = useState(false);
  const [newAssetsDescription, setNewAssetsDescription] = useState('');
  const [newAssetsAmount, setNewAssetsAmount] = useState('');

  const [notes, setNotes] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [saving, setSaving] = useState(false);

  const totalExpensesCalc = useMemo(() => {
    return EXPENSE_ROWS.reduce((sum, [key]) => sum + num(expenses[key]), 0);
  }, [expenses]);

  function updateExpense(key, value) {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (largeOneOff && !largeOneOffDescription.trim()) {
      toast.error('Describe the large one-off expense.');
      return;
    }
    if (newAssets && !newAssetsDescription.trim()) {
      toast.error('Describe the new asset.');
      return;
    }

    const payload = {
      year: Number(year),
      month: Number(month),
      totalMonthlyRevenue: num(revenueSection.totalMonthlyRevenue),
      revenueFromCreditSales: num(revenueSection.revenueFromCreditSales),
      revenueCollectedFromPriorCredit: num(revenueSection.revenueCollectedFromPriorCredit),
      ...Object.fromEntries(EXPENSE_ROWS.map(([key]) => [key, num(expenses[key])])),
      totalExpenses: totalExpensesCalc,
      openingCash: num(cash.openingCash),
      closingCash: num(cash.closingCash),
      cashAtHand: num(cash.cashAtHand),
      cashInBank: num(cash.cashInBank),
      customersServed: Math.round(num(metrics.customersServed)),
      newCustomers: Math.round(num(metrics.newCustomers)),
      operatingDays: Math.round(num(metrics.operatingDays)),
      largeOneOff,
      largeOneOffDescription: largeOneOff ? largeOneOffDescription.trim() : '',
      largeOneOffAmount: largeOneOff ? num(largeOneOffAmount) : 0,
      newAssets,
      newAssetsDescription: newAssets ? newAssetsDescription.trim() : '',
      newAssetsAmount: newAssets ? num(newAssetsAmount) : 0,
      notes,
      biggestChallenge,
    };

    setSaving(true);
    try {
      await client.post('/transactions/monthly', payload);
      toast.success('Monthly report saved.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not save report.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 card-surface rounded-xl border border-white/[0.08] shadow-card p-6 sm:p-8">
      <section className="space-y-4">
        <h3 className="font-display text-xl text-white">Month &amp; revenue</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label-finsmart">Year</label>
            <input className="input-finsmart" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div>
            <label className="label-finsmart">Month</label>
            <select className="input-finsmart" value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }).map((_, idx) => {
                const m = idx + 1;
                return (
                  <option key={m} value={m}>
                    {new Date(2000, idx, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field
            label="Total monthly revenue (₦)"
            value={revenueSection.totalMonthlyRevenue}
            onChange={(v) => setRevenueSection((s) => ({ ...s, totalMonthlyRevenue: v }))}
          />
          <Field
            label="Revenue from credit sales (₦)"
            value={revenueSection.revenueFromCreditSales}
            onChange={(v) => setRevenueSection((s) => ({ ...s, revenueFromCreditSales: v }))}
          />
          <Field
            label="Cash collected from prior credit (₦)"
            value={revenueSection.revenueCollectedFromPriorCredit}
            onChange={(v) => setRevenueSection((s) => ({ ...s, revenueCollectedFromPriorCredit: v }))}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-white">Expenses</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {EXPENSE_ROWS.map(([key, label]) => (
            <div key={key}>
              <label className="label-finsmart">{label}</label>
              <input
                className="input-finsmart"
                type="number"
                min={0}
                inputMode="decimal"
                value={expenses[key]}
                onChange={(e) => updateExpense(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm text-teal-50 font-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Auto-calculated total expenses</span>
          <span className="font-display text-2xl text-white">₦{totalExpensesCalc.toLocaleString('en-NG')}</span>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-white">Cash position</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Opening cash (₦)" value={cash.openingCash} onChange={(v) => setCash((c) => ({ ...c, openingCash: v }))} />
          <Field label="Closing cash (₦)" value={cash.closingCash} onChange={(v) => setCash((c) => ({ ...c, closingCash: v }))} />
          <Field label="Cash at hand (₦)" value={cash.cashAtHand} onChange={(v) => setCash((c) => ({ ...c, cashAtHand: v }))} />
          <Field label="Cash in bank (₦)" value={cash.cashInBank} onChange={(v) => setCash((c) => ({ ...c, cashInBank: v }))} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-white">Business metrics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field
            label="Customers served"
            value={metrics.customersServed}
            onChange={(v) => setMetrics((m) => ({ ...m, customersServed: v }))}
            integer
          />
          <Field
            label="New customers"
            value={metrics.newCustomers}
            onChange={(v) => setMetrics((m) => ({ ...m, newCustomers: v }))}
            integer
          />
          <Field
            label="Operating days"
            value={metrics.operatingDays}
            onChange={(v) => setMetrics((m) => ({ ...m, operatingDays: v }))}
            integer
          />
        </div>

        <ToggleBlock
          label="Large one-off expense?"
          checked={largeOneOff}
          onChange={setLargeOneOff}
          description={
            largeOneOff && (
              <>
                <textarea
                  className="input-finsmart"
                  placeholder="Describe the expense"
                  value={largeOneOffDescription}
                  onChange={(e) => setLargeOneOffDescription(e.target.value)}
                />
                <Field
                  label="Amount (₦)"
                  value={largeOneOffAmount}
                  onChange={setLargeOneOffAmount}
                />
              </>
            )
          }
        />

        <ToggleBlock
          label="New assets purchased?"
          checked={newAssets}
          onChange={setNewAssets}
          description={
            newAssets && (
              <>
                <textarea
                  className="input-finsmart"
                  placeholder="Describe the asset(s)"
                  value={newAssetsDescription}
                  onChange={(e) => setNewAssetsDescription(e.target.value)}
                />
                <Field label="Amount (₦)" value={newAssetsAmount} onChange={setNewAssetsAmount} />
              </>
            )
          }
        />
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-xl text-white">Notes</h3>
        <div>
          <label className="label-finsmart">Observations about the month</label>
          <textarea className="input-finsmart" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div>
          <label className="label-finsmart">Biggest financial challenge this month</label>
          <textarea
            className="input-finsmart"
            rows={3}
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
          />
        </div>
      </section>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : 'Save monthly report'}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, integer }) {
  return (
    <div>
      <label className="label-finsmart">{label}</label>
      <input
        className="input-finsmart"
        type="number"
        min={integer ? 0 : undefined}
        step={integer ? 1 : 'any'}
        inputMode={integer ? 'numeric' : 'decimal'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ToggleBlock({ label, checked, onChange, description }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-body text-[#cbd5f5] flex-1">{label}</span>
        <button
          type="button"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            !checked ? 'bg-teal-600 text-white' : 'border border-white/15 text-[#cbd5f5]'
          }`}
          onClick={() => onChange(false)}
        >
          No
        </button>
        <button
          type="button"
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            checked ? 'bg-teal-600 text-white' : 'border border-white/15 text-[#cbd5f5]'
          }`}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
      </div>
      <div className="space-y-3">{description}</div>
    </div>
  );
}
