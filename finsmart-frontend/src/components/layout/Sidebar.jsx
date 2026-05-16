import { NavLink } from 'react-router-dom';

import FinSmartLogo from '../FinSmartLogo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const linkBase =
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-150 ease-out md:justify-center lg:justify-start';

function NavIcon({ children }) {
  return <span className="w-5 h-5 flex-shrink-0 opacity-90">{children}</span>;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const profile = user?.businessProfile || {};
  const businessName = profile.businessName || user?.name || 'Your business';

  const initial = businessName.trim().slice(0, 1).toUpperCase();

  const items = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <NavIcon>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM3.75 15a2.25 2.25 0 012.25-2.25h2.25A2.25 2.25 0 0110.5 15v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V15zM13.5 15a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 15v2.25a2.25 2.25 0 01-2.25 2.25h-2.25A2.25 2.25 0 0113.5 17.25V15z" />
          </svg>
        </NavIcon>
      ),
    },
    {
      to: '/chat',
      label: 'AI Advisor',
      icon: (
        <NavIcon>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.05 21l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </NavIcon>
      ),
    },
    {
      to: '/daily-sales',
      label: 'Daily Sales',
      icon: (
        <NavIcon>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </NavIcon>
      ),
    },
    {
      to: '/monthly-finance',
      label: 'Monthly Report',
      icon: (
        <NavIcon>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </NavIcon>
      ),
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: (
        <NavIcon>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.292.24-.437.613-.431.992a9.578 9.578 0 010 .255c-.006.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </NavIcon>
      ),
    },
  ];

  return (
    <aside className="hidden md:flex md:w-[72px] lg:w-[240px] flex-col h-screen flex-shrink-0 border-r border-white/[0.07] bg-navy-900/80 backdrop-blur-xl py-6 px-3 lg:px-4">
      <div className="mb-8 flex items-center gap-3 md:justify-center lg:justify-start px-1 lg:px-2">
        <FinSmartLogo size={38} />
        <div className="leading-tight hidden lg:block">
          <span className="font-display text-base text-white">FinSmart AI</span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl px-2 py-2 mb-8 md:flex-col lg:flex-row md:text-center lg:text-left">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-teal-500/35 text-white shrink-0"
          style={{
            background: 'linear-gradient(135deg,#0f2d45,#0d2640)',
          }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 hidden lg:block">
          <p className="truncate text-sm text-white font-body font-semibold">{businessName}</p>
          <p className="text-xs text-[#8A9BB0] truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 shadow-[inset_0_0_0_1px_rgba(62,227,207,0.18)]'
                  : 'text-[#c5d4e5]/90 hover:bg-white/[0.04]'
              }`
            }
          >
            {icon}
            <span className="hidden lg:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-auto rounded-lg border border-white/10 text-[#e2e8f0]/90 hover:border-red-500/40 hover:text-red-300 text-sm font-body py-2.5 px-2 lg:px-3 transition-all duration-150 md:text-xs lg:text-sm"
      >
        <span className="lg:hidden" aria-hidden>⎋</span>
        <span className="hidden lg:inline">Log out</span>
      </button>
    </aside>
  );
}
