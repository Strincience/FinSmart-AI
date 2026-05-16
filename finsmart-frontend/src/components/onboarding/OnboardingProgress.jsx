export default function OnboardingProgress({ step, total = 4 }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex justify-between text-xs text-[#8A9BB0] font-body mb-2">
        <span>Step {step} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
