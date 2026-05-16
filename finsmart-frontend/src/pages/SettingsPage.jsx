import FinSmartLogo from '../components/FinSmartLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const profile = user?.businessProfile || {};

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-2xl text-white mb-2">Settings</h1>
        <p className="text-sm text-[#8A9BB0] font-body">
          Snapshot of your signed-in workspace. More controls will land here soon.
        </p>
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-card p-6 space-y-6">
        <div className="flex items-start gap-4">
          <FinSmartLogo size={48} />
          <div className="min-w-0">
            <p className="font-display text-lg text-white truncate">{profile.businessName || 'Your workspace'}</p>
            <p className="text-sm text-teal-200 break-all">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-[#e2e8f0] font-body">
          <Detail label="Industry" value={profile.industry} />
          <Detail label="State" value={profile.stateOfOperation} />
          <Detail label="Goals" value={profile.primaryGoals?.join(', ') || '—'} />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button type="button" onClick={() => logout()} className="btn-outline">
            Sign out everywhere on this browser
          </button>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.12em] text-[#8A9BB0] mb-1">{label}</dt>
      <dd className="font-body">{value}</dd>
    </div>
  );
}
