import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Nested under ProtectedRoute — requires login; sends incomplete onboarding to wizard.
 */
export default function OnboardingGate() {
  const { loading, user } = useAuth();
  const onboardingComplete = Boolean(user?.onboardingCompletedAt);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-navy-200 font-body">
        Loading…
      </div>
    );
  }

  if (!onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
