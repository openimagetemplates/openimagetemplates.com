import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  metadataBase: new URL("https://openimagetemplates.com"),
  title: {
    default: "Open Image Templates",
    template: "%s | Open Image Templates",
  },
  description:
    "A free, open standard and community gallery for reusable AI image generation templates.",
  openGraph: {
    title: "Open Image Templates",
    description:
      "Copy visible prompts, inspect portable template JSON, and generate with NanoGPT in one click.",
    url: "https://openimagetemplates.com",
    siteName: "Open Image Templates",
    type: "website",
  },
};

const navItems = [
  { href: "/#gallery", label: "Templates" },
  { href: "/schema", label: "Schema" },
  { href: "/docs", label: "Docs" },
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
                showWordmark={false}
                className="h-9 w-auto"
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
              <a href="https://nano-gpt.com" className="font-medium text-zinc-950 hover:underline">
                NanoGPT
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
