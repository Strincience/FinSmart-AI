const mongoose = require('mongoose');

const SalesLineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ExpenseLineSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    description: { type: String, default: '', trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const DailyEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    totalSales: { type: Number, required: true, min: 0 },
    salesLines: { type: [SalesLineSchema], default: [] },
    totalExpenses: { type: Number, required: true, min: 0 },
    expenseLines: { type: [ExpenseLineSchema], default: [] },
    cashReceived: { type: Number, required: true, min: 0 },
    outstandingCredit: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '', trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

DailyEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyEntry', DailyEntrySchema);
