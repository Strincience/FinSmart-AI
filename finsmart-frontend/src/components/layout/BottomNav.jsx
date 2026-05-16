import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Home' },
  { to: '/chat', label: 'AI' },
  { to: '/daily-sales', label: 'Daily' },
  { to: '/monthly-finance', label: 'Month' },
  { to: '/settings', label: 'More' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-navy-900/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-stretch px-2 py-2 gap-1">
        {items.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 text-center rounded-lg py-2 text-[11px] font-body uppercase tracking-wide transition-all duration-150 ${
                isActive ? 'text-teal-300 bg-teal-500/12' : 'text-[#8A9BB0]'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
