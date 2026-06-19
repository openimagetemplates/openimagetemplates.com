import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { NanoGptAuthButton } from "@/components/NanoGptAuthButton";
import { OpenImageTemplatesLogo } from "@/components/OpenImageTemplatesLogo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Open Image Templates",
  metadataBase: new URL("https://www.openimagetemplates.com"),
  title: {
    default: "Open Image Templates",
    template: "%s | Open Image Templates",
  },
  description:
    "A free, open standard and community gallery for reusable AI image generation templates.",
  keywords: [
    "Open Image Templates",
    "AI image templates",
    "image prompt templates",
    "AI prompt gallery",
    "prompt builder",
    "open prompt schema",
    "NanoGPT",
  ],
  authors: [{ name: "Open Image Templates", url: "https://www.openimagetemplates.com" }],
  creator: "Open Image Templates",
  publisher: "Open Image Templates",
  category: "technology",
  manifest: "/manifest.webmanifest",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "Open Image Templates",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Open Image Templates",
    description:
      "Copy visible prompts, inspect portable template JSON, and generate with NanoGPT in one click.",
    url: "https://www.openimagetemplates.com",
    siteName: "Open Image Templates",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Open Image Templates logo and prompt-template preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Image Templates",
    description:
      "Copy visible prompts, inspect portable template JSON, and generate with NanoGPT in one click.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ef",
  colorScheme: "light",
};

const navItems = [
  { href: "/templates", label: "Templates" },
  { href: "/schema", label: "Schema" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5f3ef]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Open Image Templates home">
              <OpenImageTemplatesLogo
                maskId="header-open-image-templates-logo-mask"
                animated
                showWordmark={false}
                className="h-12 w-auto"
              />
              <span className="leading-none text-zinc-950">
                <span className="block text-sm font-extrabold tracking-tight">Open Image</span>
                <span className="block text-sm font-normal tracking-tight">Templates</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white hover:text-zinc-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <NanoGptAuthButton />
          </div>
        </header>
        {children}
        <footer className="border-t border-black/10 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <OpenImageTemplatesLogo maskId="footer-open-image-templates-logo-mask" className="h-10 w-auto max-w-[190px]" />
              <p>Open Image Templates is a free prompt-template standard and gallery, sponsored by NanoGPT.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/schema" className="font-medium text-zinc-950 hover:underline">
                Schema
              </Link>
              <Link href="/docs" className="font-medium text-zinc-950 hover:underline">
                Docs
              </Link>
              <Link href="/blog" className="font-medium text-zinc-950 hover:underline">
                Blog
              </Link>
              <a href="https://nano-gpt.com" className="font-medium text-zinc-950 hover:underline">
                NanoGPT
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
