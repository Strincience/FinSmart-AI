/* ─── src/components/FinSmartLogo.jsx ────────────────────────────────────────
   A self-contained SVG logo component.
   Props:
     size   (number)  — width & height in pixels. Default: 40
     className (string) — extra Tailwind classes for positioning/spacing

   The icon is intentionally simple and geometric:
     - A stylised "F" in white (stands for FinSmart / Finance)
     - A gold upward-trending spark/arrow (signals financial growth)
     - Deep navy-to-teal gradient background pill
   This same artwork is used in public/favicon.svg (static) and here (dynamic).
── ─────────────────────────────────────────────────────────────────────────── */

export default function FinSmartLogo({ size = 40, className = '' }) {
  // Use a unique id prefix so multiple instances on the page don't share
  // the same gradient id, which would cause the wrong gradient to render.
  const uid = `fsl-${size}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="FinSmart AI logo"
      role="img"
    >
      <defs>
        {/* Background gradient: navy → teal */}
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0D2137" />
          <stop offset="100%" stopColor="#0B7A75" />
        </linearGradient>

        {/* Gold spark gradient */}
        <linearGradient id={`${uid}-spark`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#C9922C" />
          <stop offset="100%" stopColor="#F0C060" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="64" height="64" rx="16" fill={`url(#${uid}-bg)`} />

      {/* Stylised "F" letterform */}
      <rect x="16" y="16" width="5"  height="32" rx="2.5" fill="white" opacity="0.95" />
      <rect x="16" y="16" width="22" height="5"  rx="2.5" fill="white" opacity="0.95" />
      <rect x="16" y="29" width="17" height="5"  rx="2.5" fill="white" opacity="0.95" />

      {/* Gold upward-trending spark — represents financial growth */}
      <path
        d="M38 42 L46 26 L50 34"
        stroke={`url(#${uid}-spark)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="46" cy="24" r="3" fill={`url(#${uid}-spark)`} />
    </svg>
  );
}
