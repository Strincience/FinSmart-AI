import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import client from '../api/client';
import FinSmartLogo from '../components/FinSmartLogo.jsx';
import OnboardingProgress from '../components/onboarding/OnboardingProgress.jsx';
import StepBasics from '../components/onboarding/steps/StepBasics.jsx';
import StepLocation from '../components/onboarding/steps/StepLocation.jsx';
import StepFinanceSnapshot from '../components/onboarding/steps/StepFinanceSnapshot.jsx';
import StepGoals from '../components/onboarding/steps/StepGoals.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function emptyDraft() {
  return {
    businessName: '',
    businessType: '',
    industry: 'Retail',
    yearsInOperation: '',
    employeeCount: '',
    stateOfOperation: '',
    primarySalesChannel: '',
    hasCAC: null,
    usesAccountingSoftware: null,
    accountingSoftwareName: '',
    avgMonthlyRevenue: '',
    avgMonthlyExpenses: '',
    tracksFinances: '',
    financialChallenges: [],
    outstandingLoans: null,
    primaryGoals: [],
    engagementFrequency: '',
    preferredLanguage: 'English',
  };
}

export default function OnboardingPage() {
  const { user, onboardingComplete, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(emptyDraft);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [onboardingComplete, navigate]);

  useEffect(() => {
    if (user?.businessProfile && typeof user.businessProfile === 'object') {
      setDraft((d) => ({ ...d, ...user.businessProfile }));
    }
  }, [user]);

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const validationMsg = useMemo(() => {
    if (step === 1) {
      if (!draft.businessName.trim()) return 'Please enter your business name.';
      if (!draft.businessType) return 'Choose a business type.';
      if (!draft.industry) return 'Select an industry.';
      if (!draft.yearsInOperation) return 'Choose years in operation.';
      if (!draft.employeeCount) return 'Choose employee count.';
    }
    if (step === 2) {
      if (!draft.stateOfOperation) return 'Select your state of operation.';
      if (!draft.primarySalesChannel) return 'Select a primary sales channel.';
      if (draft.hasCAC === null) return 'Let us know if you have a CAC number.';
      if (draft.usesAccountingSoftware === null) return 'Tell us if you use accounting software.';
      if (draft.usesAccountingSoftware && !draft.accountingSoftwareName.trim()) {
        return 'Please name the accounting software you use.';
      }
    }
    if (step === 3) {
      if (!draft.avgMonthlyRevenue) return 'Select a revenue band.';
      if (!draft.avgMonthlyExpenses) return 'Select an expenses band.';
      if (!draft.tracksFinances) return 'Choose how you track finances.';
      if (!draft.financialChallenges.length) return 'Pick at least one challenge.';
      if (draft.outstandingLoans === null) return 'Let us know about outstanding loans.';
    }
    if (step === 4) {
      if (!draft.primaryGoals.length) return 'Pick at least one goal.';
      if (!draft.engagementFrequency) return 'Choose how often you want to engage.';
      if (!draft.preferredLanguage) return 'Choose a language preference.';
    }
    return null;
  }, [step, draft]);

  async function finish() {
    setSubmitting(true);
    try {
      await client.patch('/users/me/business-profile', {
        businessProfile: {
          businessName: draft.businessName,
          businessType: draft.businessType,
          industry: draft.industry,
          yearsInOperation: draft.yearsInOperation,
          employeeCount: draft.employeeCount,
          stateOfOperation: draft.stateOfOperation,
          primarySalesChannel: draft.primarySalesChannel,
          hasCAC: draft.hasCAC,
          usesAccountingSoftware: draft.usesAccountingSoftware,
          accountingSoftwareName: draft.accountingSoftwareName || null,
          avgMonthlyRevenue: draft.avgMonthlyRevenue,
          avgMonthlyExpenses: draft.avgMonthlyExpenses,
          tracksFinances: draft.tracksFinances,
          financialChallenges: draft.financialChallenges,
          outstandingLoans: draft.outstandingLoans,
          primaryGoals: draft.primaryGoals,
          engagementFrequency: draft.engagementFrequency,
          preferredLanguage: draft.preferredLanguage,
        },
      });
      await refreshUser();
      toast.success('Profile saved. Welcome to your dashboard.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not save your profile.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (validationMsg) {
      toast.error(validationMsg);
      return;
    }
    if (step < 4) setStep((s) => s + 1);
    else finish();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FinSmartLogo size={40} />
          <div>
            <p className="font-display text-lg text-white">Business onboarding</p>
            <p className="text-xs text-[#8A9BB0] font-body">A few friendly questions—then you’re in.</p>
          </div>
        </div>

        <OnboardingProgress step={step} />

        <div className="card-surface rounded-xl border border-white/[0.08] shadow-card p-6 sm:p-10">
          {step === 1 && <StepBasics draft={draft} update={update} />}
          {step === 2 && <StepLocation draft={draft} update={update} />}
          {step === 3 && <StepFinanceSnapshot draft={draft} update={update} />}
          {step === 4 && <StepGoals draft={draft} update={update} />}

          <div className="flex flex-col sm:flex-row gap-3 justify-between mt-12">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="btn-outline order-2 sm:order-1 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={submitting}
              className="btn-primary order-1 sm:order-2"
            >
              {step === 4 ? (submitting ? 'Saving…' : 'Finish & go to dashboard') : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
