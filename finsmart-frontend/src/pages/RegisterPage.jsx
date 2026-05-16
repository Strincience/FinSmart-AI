import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import FinSmartLogo from '../components/FinSmartLogo.jsx';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error || 'Could not create your account. Try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-surface rounded-xl p-8 border border-white/[0.08] shadow-card">
        <div className="flex flex-col items-center gap-2 mb-8">
          <FinSmartLogo size={48} />
          <h1 className="font-display text-2xl text-white text-center tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-[#8A9BB0] font-body text-center">
            Step 1 of onboarding — then we’ll learn about your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-red-400 font-body rounded-lg px-3 py-2 bg-red-500/10 border border-red-500/20">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-teal-400 mb-2">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-finsmart"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-teal-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-finsmart"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-teal-400 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-finsmart"
            />
            <p className="mt-1 text-xs text-[#8A9BB0]">At least 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-body font-semibold py-3 transition-all duration-150 ease-out disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8A9BB0] font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors duration-150">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
