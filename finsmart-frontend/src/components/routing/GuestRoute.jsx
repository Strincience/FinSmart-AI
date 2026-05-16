import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function GuestRoute({ children }) {
  const { loading, token, user, onboardingComplete } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-navy-200 font-body">
        Loading…
      </div>
    );
  }

  if (token && user) {
    const done = Boolean(user.onboardingCompletedAt);
    return <Navigate to={done ? '/dashboard' : '/onboarding'} replace />;
  }

  return children;
}
