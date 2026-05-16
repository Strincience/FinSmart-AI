import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import client from '../../api/client';
import { DAILY_EXPENSE_CATEGORIES } from '../../constants/businessOptions.js';

function localTodayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function emptySaleLine() {
  return { name: '', quantity: '', unitPrice: '' };
}

function emptyExpenseLine() {
  return { category: DAILY_EXPENSE_CATEGORIES[0], description: '', amount: '' };
}

export default function DailyEntryForm() {
  const [date, setDate] = useState(localTodayISO);
  const [totalSales, setTotalSales] = useState('');
  const [salesLines, setSalesLines] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState('');
  const [expenseLines, setExpenseLines] = useState([]);
  const [cashReceived, setCashReceived] = useState('');
  const [outstandingCredit, setOutstandingCredit] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const salesComputed = useMemo(
    () =>
      salesLines.reduce((sum, row) => {
        const q = Number(row.quantity) || 0;
        const p = Number(row.unitPrice) || 0;
        return sum + q * p;
      }, 0),
    [salesLines]
  );

  const expensesComputed = useMemo(
    () =>
      expenseLines.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
    [expenseLines]
  );

  function addSaleLine() {
    if (salesLines.length >= 10) {
      toast.error('You can add up to 10 breakdown rows.');
      return;
    }
    setSalesLines((rows) => [...rows, emptySaleLine()]);
  }

  function addExpenseLine() {
    if (expenseLines.length >= 10) {
      toast.error('You can add up to 10 breakdown rows.');
      return;
    }
    setExpenseLines((rows) => [...rows, emptyExpenseLine()]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ts = Number(totalSales);
    const te = Number(totalExpenses);
    const cr = Number(cashReceived);
    const oc = Number(outstandingCredit);
    if ([ts, te, cr, oc].some((v) => Number.isNaN(v) || v < 0)) {
      toast.error('Please enter valid non-negative numbers.');
      return;
    }

    const normalizedSales = salesLines
      .filter((r) => String(r.name || '').trim())
      .map((r) => ({
        name: r.name.trim(),
        quantity: Number(r.quantity) || 0,
        unitPrice: Number(r.unitPrice) || 0,
        lineTotal: (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0),
      }));

    const normalizedExpenses = expenseLines
      .filter((r) => r.category && String(r.amount).trim() !== '')
      .map((r) => ({
        category: r.category,
        description: r.description?.trim() || '',
        amount: Number(r.amount) || 0,
      }));

    setSaving(true);
    try {
      await client.post('/transactions/daily', {
        date,
        totalSales: ts,
        salesLines: normalizedSales,
        totalExpenses: te,
        expenseLines: normalizedExpenses,
        cashReceived: cr,
        outstandingCredit: oc,
        notes,
      });
      toast.success('Today’s entry saved.');
      setNotes('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not save entry.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 card-surface rounded-xl border border-white/[0.08] shadow-card p-6 sm:p-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label-finsmart">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-finsmart" />
        </div>
        <div className="rounded-lg border border-teal-500/25 bg-teal-500/10 p-4 text-xs text-teal-100 font-body">
          <p>
            Breakdown rows are optional—they help you remember what moved the numbers, but your headline totals are what power the dashboard.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label-finsmart">Total sales today (₦)</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={totalSales}
            onChange={(e) => setTotalSales(e.target.value)}
            className="input-finsmart"
            required
          />
          {Boolean(salesComputed) && (
            <p className="text-xs text-[#8A9BB0] mt-2 font-body">
              Breakdown arithmetic: ₦{salesComputed.toLocaleString('en-NG')}
            </p>
          )}
        </div>
        <div>
          <label className="label-finsmart">Total expenses today (₦)</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={totalExpenses}
            onChange={(e) => setTotalExpenses(e.target.value)}
            className="input-finsmart"
            required
          />
          {Boolean(expensesComputed) && (
            <p className="text-xs text-[#8A9BB0] mt-2 font-body">
              Breakdown arithmetic: ₦{expensesComputed.toLocaleString('en-NG')}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-white">Sales breakdown (optional)</h3>
          <button type="button" onClick={addSaleLine} className="btn-outline text-xs px-3 py-1.5">
            + Add row
          </button>
        </div>
        {salesLines.length === 0 ? (
          <p className="text-sm text-[#8A9BB0] font-body">No line items yet.</p>
        ) : (
          <div className="space-y-3">
            {salesLines.map((row, idx) => (
              <div key={idx} className="grid sm:grid-cols-4 gap-3">
                <input
                  className="input-finsmart sm:col-span-2"
                  placeholder="Product / service"
                  value={row.name}
                  onChange={(e) =>
                    setSalesLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, name: e.target.value } : line))
                    )
                  }
                />
                <input
                  className="input-finsmart"
                  placeholder="Qty"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.quantity}
                  onChange={(e) =>
                    setSalesLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, quantity: e.target.value } : line))
                    )
                  }
                />
                <input
                  className="input-finsmart"
                  placeholder="Unit price"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.unitPrice}
                  onChange={(e) =>
                    setSalesLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, unitPrice: e.target.value } : line))
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-white">Expense breakdown (optional)</h3>
          <button type="button" onClick={addExpenseLine} className="btn-outline text-xs px-3 py-1.5">
            + Add row
          </button>
        </div>
        {expenseLines.length === 0 ? (
          <p className="text-sm text-[#8A9BB0] font-body">No line items yet.</p>
        ) : (
          <div className="space-y-3">
            {expenseLines.map((row, idx) => (
              <div key={idx} className="grid sm:grid-cols-[1.1fr_minmax(0,1fr)_0.8fr] gap-3">
                <select
                  value={row.category}
                  onChange={(e) =>
                    setExpenseLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, category: e.target.value } : line))
                    )
                  }
                  className="input-finsmart"
                >
                  {DAILY_EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  className="input-finsmart"
                  placeholder="Description"
                  value={row.description}
                  onChange={(e) =>
                    setExpenseLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, description: e.target.value } : line))
                    )
                  }
                />
                <input
                  className="input-finsmart"
                  placeholder="Amount"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.amount}
                  onChange={(e) =>
                    setExpenseLines((lines) =>
                      lines.map((line, i) => (i === idx ? { ...line, amount: e.target.value } : line))
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label-finsmart">Cash received today (₦)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="input-finsmart"
            required
          />
        </div>
        <div>
          <label className="label-finsmart">Outstanding credit (₦)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={outstandingCredit}
            onChange={(e) => setOutstandingCredit(e.target.value)}
            className="input-finsmart"
            required
          />
        </div>
      </div>

      <div>
        <label className="label-finsmart">Notes (optional)</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-finsmart"
        />
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto">
        {saving ? 'Saving…' : 'Save today’s entry'}
      </button>
    </form>
  );
}
