type OpenImageTemplatesLogoProps = {
  className?: string;
  maskId: string;
  animated?: boolean;
  variant?: "solid" | "outline";
  showWordmark?: boolean;
};

export function OpenImageTemplatesLogo({
  className = "h-10 w-auto",
  maskId,
  animated = false,
  variant = "solid",
  showWordmark = true,
}: OpenImageTemplatesLogoProps) {
  const viewBox = showWordmark ? "0 0 560 160" : "0 0 196 160";
  const titleId = `${maskId}-title`;

  return (
    <svg viewBox={viewBox} className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Open Image Templates</title>
      {variant === "solid" ? (
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="140" height="72" rx="36" fill="white" />
            <circle cx="44" cy="36" r="14" fill="none" stroke="black" strokeWidth="8" />
            <rect x="92" y="20" width="8" height="32" rx="4" fill="black" />
          </mask>
        </defs>
      ) : null}

      <g className={animated ? "oit-logo-mark" : undefined} transform="translate(28 44)">
        {variant === "solid" ? (
          <rect x="0" y="0" width="140" height="72" rx="36" fill="#08090d" mask={`url(#${maskId})`} />
        ) : (
          <>
            <rect x="0" y="0" width="140" height="72" rx="36" fill="none" stroke="#08090d" strokeWidth="8" />
            <circle cx="44" cy="36" r="14" fill="none" stroke="#08090d" strokeWidth="8" />
            <rect x="92" y="20" width="8" height="32" rx="4" fill="#08090d" />
          </>
        )}
        {animated ? (
          <g className="oit-logo-bento" aria-hidden="true">
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-1" x="4" y="4" width="36" height="28" rx="13" fill="#015a9e" />
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-2" x="44" y="4" width="36" height="28" rx="13" fill="#11e9bb" />
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-3" x="84" y="4" width="52" height="28" rx="13" fill="#08090d" />
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-4" x="4" y="40" width="56" height="28" rx="13" fill="#08090d" />
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-5" x="64" y="40" width="32" height="28" rx="13" fill="#015a9e" />
            <rect className="oit-logo-bento-cell oit-logo-bento-cell-6" x="100" y="40" width="36" height="28" rx="13" fill="#11e9bb" />
          </g>
        ) : null}
      </g>

      {showWordmark ? (
        <g transform="translate(196 45)" fill="#08090d">
          <text x="0" y="34" fontFamily="Inter, system-ui, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1.5">
            Open Image
          </text>
          <text x="0" y="70" fontFamily="Inter, system-ui, sans-serif" fontSize="34" fontWeight="400" letterSpacing="-0.5">
            Templates
          </text>
        </g>
      ) : null}
    </svg>
  );
}
