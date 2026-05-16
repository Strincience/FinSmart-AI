import { format } from 'date-fns';

export default function WelcomeBanner({ businessName }) {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 shadow-card">
      <p className="text-sm text-teal-300/90 font-body mb-1">{today}</p>
      <h1 className="font-display text-2xl sm:text-3xl text-white tracking-tight">
        {greet}, {businessName}
      </h1>
      <p className="mt-2 text-sm text-[#8A9BB0] font-body max-w-xl">
        Here’s a concise view of how your cash and margins are behaving this month.
      </p>
    </section>
  );
}
