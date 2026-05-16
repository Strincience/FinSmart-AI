const { NIGERIAN_STATES } = require('../constants/nigerianStates');

const BUSINESS_TYPES = ['Sole Proprietorship', 'Partnership', 'Limited Liability Company'];
const INDUSTRIES = ['Retail'];
const YEARS_OPS = ['less_than_1', '1_to_3', '3_to_5', '5_plus'];
const EMPLOYEE_BANDS = ['just_me', '2_to_5', '6_to_20', '20_plus'];
const SALES_CHANNELS = ['Physical store', 'Online', 'Both'];
const REVENUE_BANDS = ['below_100k', '100k_to_500k', '500k_to_1m', '1m_to_5m', 'above_5m'];
const EXPENSE_BANDS = ['below_50k', '50k_to_200k', '200k_to_500k', '500k_to_1m', 'above_1m'];
const TRACKING_OPTS = ['yes_manual', 'yes_software', 'no'];
const CHALLENGE_OPTS = [
  'Managing cash flow',
  'Understanding profit and loss',
  'Separating business and personal money',
  'Getting access to credit',
  'Avoiding financial fraud',
  'Tax compliance',
];
const GOAL_OPTS = [
  'Learn financial concepts',
  'Track my daily income and expenses',
  'Understand my profit margins',
  'Prepare for tax season',
  'Improve my cash flow',
  'Detect and avoid fraud',
];
const ENGAGEMENT_OPTS = ['Daily', 'Few times a week', 'Weekly', 'As needed'];
const LANGUAGE_OPTS = ['English', 'Pidgin-friendly English'];

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isSubset(arr, allowed) {
  return Array.isArray(arr) && arr.length > 0 && arr.every((x) => allowed.includes(x));
}

function validateBusinessProfilePayload(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'businessProfile must be an object.' };
  }

  const {
    businessName,
    businessType,
    industry,
    yearsInOperation,
    employeeCount,
    stateOfOperation,
    primarySalesChannel,
    hasCAC,
    usesAccountingSoftware,
    accountingSoftwareName,
    avgMonthlyRevenue,
    avgMonthlyExpenses,
    tracksFinances,
    financialChallenges,
    outstandingLoans,
    primaryGoals,
    engagementFrequency,
    preferredLanguage,
  } = raw;

  if (!isNonEmptyString(businessName)) {
    return { ok: false, error: 'Business name is required.' };
  }
  if (!BUSINESS_TYPES.includes(businessType)) {
    return { ok: false, error: 'Invalid business type.' };
  }
  if (!INDUSTRIES.includes(industry)) {
    return { ok: false, error: 'Invalid industry.' };
  }
  if (!YEARS_OPS.includes(yearsInOperation)) {
    return { ok: false, error: 'Invalid years in operation.' };
  }
  if (!EMPLOYEE_BANDS.includes(employeeCount)) {
    return { ok: false, error: 'Invalid employee count.' };
  }
  if (!NIGERIAN_STATES.includes(stateOfOperation)) {
    return { ok: false, error: 'Invalid state of operation.' };
  }
  if (!SALES_CHANNELS.includes(primarySalesChannel)) {
    return { ok: false, error: 'Invalid primary sales channel.' };
  }
  if (typeof hasCAC !== 'boolean') {
    return { ok: false, error: 'hasCAC must be true or false.' };
  }
  if (typeof usesAccountingSoftware !== 'boolean') {
    return { ok: false, error: 'usesAccountingSoftware must be true or false.' };
  }
  if (usesAccountingSoftware && !isNonEmptyString(accountingSoftwareName)) {
    return { ok: false, error: 'accountingSoftwareName is required when using software.' };
  }
  if (!REVENUE_BANDS.includes(avgMonthlyRevenue)) {
    return { ok: false, error: 'Invalid average monthly revenue band.' };
  }
  if (!EXPENSE_BANDS.includes(avgMonthlyExpenses)) {
    return { ok: false, error: 'Invalid average monthly expenses band.' };
  }
  if (!TRACKING_OPTS.includes(tracksFinances)) {
    return { ok: false, error: 'Invalid tracking option.' };
  }
  if (!isSubset(financialChallenges, CHALLENGE_OPTS)) {
    return { ok: false, error: 'Select at least one valid financial challenge.' };
  }
  if (typeof outstandingLoans !== 'boolean') {
    return { ok: false, error: 'outstandingLoans must be true or false.' };
  }
  if (!isSubset(primaryGoals, GOAL_OPTS)) {
    return { ok: false, error: 'Select at least one valid primary goal.' };
  }
  if (!ENGAGEMENT_OPTS.includes(engagementFrequency)) {
    return { ok: false, error: 'Invalid engagement frequency.' };
  }
  if (!LANGUAGE_OPTS.includes(preferredLanguage)) {
    return { ok: false, error: 'Invalid preferred language.' };
  }

  const value = {
    businessName: businessName.trim(),
    businessType,
    industry,
    yearsInOperation,
    employeeCount,
    stateOfOperation,
    primarySalesChannel,
    hasCAC,
    usesAccountingSoftware,
    accountingSoftwareName: usesAccountingSoftware ? String(accountingSoftwareName).trim() : null,
    avgMonthlyRevenue,
    avgMonthlyExpenses,
    tracksFinances,
    financialChallenges: [...new Set(financialChallenges)],
    outstandingLoans,
    primaryGoals: [...new Set(primaryGoals)],
    engagementFrequency,
    preferredLanguage,
  };

  return { ok: true, value };
}

module.exports = {
  validateBusinessProfilePayload,
  BUSINESS_TYPES,
  INDUSTRIES,
  YEARS_OPS,
  EMPLOYEE_BANDS,
  SALES_CHANNELS,
  REVENUE_BANDS,
  EXPENSE_BANDS,
  TRACKING_OPTS,
  CHALLENGE_OPTS,
  GOAL_OPTS,
  ENGAGEMENT_OPTS,
  LANGUAGE_OPTS,
};
