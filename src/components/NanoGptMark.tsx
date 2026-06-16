type NanoGptMarkProps = {
  className?: string;
};

export function NanoGptMark({ className = "h-5 w-5" }: NanoGptMarkProps) {
  return (
    <svg viewBox="0 0 181.45 186.88" className={`${className} shrink-0`} aria-hidden="true">
      <polygon fill="#0896bd" points="145.31 72.24 93.39 184.24 43.86 103.66 145.31 72.24" />
      <polyline fill="#11e9bb" points="106.21 2.68 146.51 64.44 44.1 96.46 70.86 27.88" />
      <polygon fill="#016cab" points="30.06 42.79 53.68 52.46 36.31 96.93 2.6 78.59 30.06 42.79" />
      <polygon fill="#0abfca" points="109.82 166.73 153.7 71.14 178.89 81.47 109.82 166.73" />
      <polygon fill="#10d8c1" points="173.61 71.76 154.18 63.48 129.51 25.14 134.6 21.19 173.61 71.76" />
      <polygon fill="#015a9e" points="65.92 153.78 12.44 91.91 34.91 104.09 35.83 104.85 65.92 153.78" />
    </svg>
  );
}
