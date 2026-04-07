interface Props {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer lens rim */}
      <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Aperture inner ring */}
      <circle cx="14" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Focus marks — top, bottom, left, right */}
      <line x1="14" y1="1.5" x2="14" y2="5"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="23"  x2="14" y2="26.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="14" x2="5"   y2="14"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23"  y1="14" x2="26.5" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Focal point */}
      <circle cx="14" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}
