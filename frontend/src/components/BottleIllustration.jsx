/**
 * Original stylized soda-bottle illustration (no brand assets).
 * Tinted with the flavour's brand color via `color`.
 */
export default function BottleIllustration({ color, label, className }) {
  return (
    <svg
      viewBox="0 0 120 260"
      role="img"
      aria-label={`${label} bottle illustration`}
      className={
        className ??
        'h-56 w-auto drop-shadow-[0_18px_24px_rgba(33,25,21,0.22)] sm:h-64'
      }
    >
      {/* cap */}
      <rect x="46" y="6" width="28" height="16" rx="5" fill="#211915" />
      <rect x="46" y="20" width="28" height="4" fill="#211915" opacity="0.55" />
      {/* neck */}
      <path d="M48 24 h24 v18 c0 10 10 14 10 28 v10 H38 V60 c0-14 10-18 10-28 Z" fill={color} />
      {/* body */}
      <rect x="34" y="80" width="52" height="168" rx="24" fill={color} />
      {/* label band */}
      <rect x="34" y="132" width="52" height="56" fill="#FFF8EC" opacity="0.92" />
      <text
        x="60"
        y="157"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="#211915"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
      >
        SUPER
      </text>
      <text
        x="60"
        y="172"
        textAnchor="middle"
        fontSize="8"
        fontWeight="600"
        fill="#5C554D"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
      >
        {label.slice(0, 12)}
      </text>
      {/* glass highlight */}
      <rect x="42" y="90" width="9" height="148" rx="4.5" fill="#FFFFFF" opacity="0.28" />
      {/* bubbles */}
      <circle cx="74" cy="104" r="4" fill="#FFFFFF" opacity="0.5" />
      <circle cx="68" cy="118" r="2.6" fill="#FFFFFF" opacity="0.5" />
      <circle cx="76" cy="210" r="3.2" fill="#FFFFFF" opacity="0.4" />
      <circle cx="69" cy="226" r="2.2" fill="#FFFFFF" opacity="0.4" />
    </svg>
  )
}
