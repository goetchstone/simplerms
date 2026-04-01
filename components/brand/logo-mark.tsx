// components/brand/logo-mark.tsx

interface LogoMarkProps {
  size?: number;
  className?: string;
  color?: string;
}

export function LogoMark({ size = 32, className, color = "currentColor" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Left leg */}
      <line x1="18" y1="110" x2="50" y2="20" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="82" y1="110" x2="50" y2="20" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Crossbar */}
      <line x1="30" y1="75" x2="70" y2="75" stroke={color} strokeWidth="5" strokeLinecap="round" />
      {/* Plumb dot */}
      <circle cx="50" cy="10" r="7" fill={color} />
    </svg>
  );
}
