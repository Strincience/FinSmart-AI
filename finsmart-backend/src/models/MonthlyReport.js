const mongoose = require('mongoose');

const OneOffSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const MonthlyReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    year: { type: Number, required: true, min: 2000, max: 2100 },
    month: { type: Number, required: true, min: 1, max: 12 },
    totalMonthlyRevenue: { type: Number, required: true, min: 0 },
    revenueFromCreditSales: { type: Number, required: true, min: 0 },
    revenueCollectedFromPriorCredit: { type: Number, required: true, min: 0 },
    costOfGoodsSold: { type: Number, required: true, min: 0 },
    staffSalaries: { type: Number, required: true, min: 0 },
    rentUtilities: { type: Number, required: true, min: 0 },
    transportLogistics: { type: Number, required: true, min: 0 },
    marketingAdvertising: { type: Number, required: true, min: 0 },
    loanRepayments: { type: Number, required: true, min: 0 },
    taxPayments: { type: Number, required: true, min: 0 },
    miscellaneousExpenses: { type: Number, required: true, min: 0 },
    totalExpenses: { type: Number, required: true, min: 0 },
    openingCash: { type: Number, required: true },
    closingCash: { type: Number, required: true },
    cashAtHand: { type: Number, required: true },
    cashInBank: { type: Number, required: true },
    customersServed: { type: Number, required: true, min: 0 },
    newCustomers: { type: Number, required: true, min: 0 },
    operatingDays: { type: Number, required: true, min: 0 },
    largeOneOff: { type: Boolean, required: true },
    largeOneOffDescription: { type: String, default: '', trim: true },
    largeOneOffAmount: { type: Number, default: 0, min: 0 },
    newAssets: { type: Boolean, required: true },
    newAssetsDescription: { type: String, default: '', trim: true },
    newAssetsAmount: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: '', trim: true, maxlength: 10000 },
    biggestChallenge: { type: String, default: '', trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

MonthlyReportSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyReport', MonthlyReportSchema);
