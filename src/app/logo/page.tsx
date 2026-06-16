import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logo Concepts",
  description: "SVG logo concept explorations for Open Image Templates.",
  alternates: {
    canonical: "/logo",
  },
};

const concepts = [
  {
    name: "Power OI",
    note: "The O and I become a power symbol, with the top stroke reading as the on-switch.",
    component: <PowerOiLogo />,
  },
  {
    name: "OI Toggle",
    note: "The most product-like direction: O as the switch knob, I as the active state.",
    component: <ToggleOiLogo />,
  },
  {
    name: "OIT Mark",
    note: "Keeps the power idea but makes the initials more explicit by adding a strong T.",
    component: <CompactOitLogo />,
  },
  {
    name: "Single-Line Toggle",
    note: "A compact header version with the mark and full name on one baseline.",
    component: <SingleLineToggleLogo />,
  },
];

export default function LogoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Brand exploration</p>
      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
        Open Image Templates logo concepts
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
        Exploring the O/I idea as open, image, one, and the universal on/off symbol. These are inline SVG marks so the
        geometry can be refined and animated directly in the app.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {concepts.map((concept, index) => (
          <section key={concept.name} className="rounded-[8px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-500">0{index + 1}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{concept.name}</h2>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                SVG
              </span>
            </div>
            <div className="mt-5 rounded-[8px] bg-[#f7f7f4] p-5">
              {concept.component}
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">{concept.note}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-[8px] border border-black/10 bg-zinc-950 p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Animation notes</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Power stroke", "The I can slide down into the O on load."],
            ["Toggle state", "The O can move across the track when switching between find/create."],
            ["Template tile", "The ring can draw itself like a prompt becoming active."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[8px] bg-white/8 p-4">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function PowerOiLogo() {
  return (
    <svg viewBox="0 0 560 160" className="h-auto w-full" role="img" aria-labelledby="power-oi-title">
      <title id="power-oi-title">Power OI logo concept</title>
      <g transform="translate(28 24)">
        <path d="M68 12a56 56 0 1 0 0 112a56 56 0 0 0 45-89" fill="none" stroke="#08090d" strokeWidth="15" strokeLinecap="round" />
        <rect x="60.5" y="0" width="15" height="72" rx="7.5" fill="#12d5c1" />
        <rect x="62.5" y="40" width="11" height="34" rx="5.5" fill="#08090d" />
      </g>
      <LogoWordmark x={178} y={50} />
    </svg>
  );
}

function ToggleOiLogo() {
  return (
    <svg viewBox="0 0 560 160" className="h-auto w-full" role="img" aria-labelledby="toggle-oi-title">
      <title id="toggle-oi-title">OI toggle logo concept</title>
      <g transform="translate(28 43)">
        <rect x="0" y="0" width="132" height="72" rx="36" fill="#08090d" />
        <circle cx="36" cy="36" r="21" fill="#ffffff" />
        <circle cx="36" cy="36" r="14" fill="none" stroke="#0aa1bd" strokeWidth="5" />
        <rect x="84" y="17" width="13" height="38" rx="6.5" fill="#12d5c1" />
      </g>
      <LogoWordmark x={198} y={50} />
    </svg>
  );
}

function CompactOitLogo() {
  return (
    <svg viewBox="0 0 560 160" className="h-auto w-full" role="img" aria-labelledby="compact-oit-title">
      <title id="compact-oit-title">Compact OIT logo concept</title>
      <g transform="translate(28 28)">
        <path d="M58 14a48 48 0 1 0 34 82" fill="none" stroke="#08090d" strokeWidth="13" strokeLinecap="round" />
        <rect x="51.5" y="0" width="13" height="60" rx="6.5" fill="#12d5c1" />
        <path d="M116 13h72v19h-26v78h-20V32h-26z" fill="#08090d" />
      </g>
      <LogoWordmark x={254} y={50} />
    </svg>
  );
}

function SingleLineToggleLogo() {
  return (
    <svg viewBox="0 0 560 160" className="h-auto w-full" role="img" aria-labelledby="single-line-toggle-title">
      <title id="single-line-toggle-title">Single-line toggle logo concept</title>
      <g transform="translate(28 52)">
        <rect x="0" y="0" width="116" height="56" rx="28" fill="#08090d" />
        <circle cx="30" cy="28" r="17" fill="none" stroke="#ffffff" strokeWidth="8" />
        <rect x="76" y="13" width="12" height="30" rx="6" fill="#12d5c1" />
      </g>
      <text x="180" y="93" fontFamily="Inter, Arial, sans-serif" fontSize="34" fontWeight="780" fill="#08090d" letterSpacing="-1">
        Open Image Templates
      </text>
    </svg>
  );
}

function LogoWordmark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#08090d">
      <text x="0" y="31" fontFamily="Inter, Arial, sans-serif" fontSize="32" fontWeight="780" letterSpacing="-1">
        Open Image
      </text>
      <text x="0" y="66" fontFamily="Inter, Arial, sans-serif" fontSize="32" fontWeight="780" letterSpacing="-1">
        Templates
      </text>
    </g>
  );
}
