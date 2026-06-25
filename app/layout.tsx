import type { Metadata, Viewport } from "next";
import { Lexend, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@/components/providers/Analytics";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://btechcareerhub.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "B.Tech Career Hub — GATE, PSU, CAT & Placement Prep",
    template: "%s | B.Tech Career Hub",
  },
  description:
    "Plan your career after B.Tech. Syllabus, PYQs, cutoffs, roadmaps and resources for GATE, PSU recruitment, CAT and campus placements — all in one place.",
  keywords: ["GATE", "PSU jobs", "CAT exam", "B.Tech placements", "GATE CSE", "engineering career India"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "B.Tech Career Hub",
    title: "B.Tech Career Hub — GATE, PSU, CAT & Placement Prep",
    description:
      "Plan your career after B.Tech. Syllabus, PYQs, cutoffs, roadmaps and resources for GATE, PSU recruitment, CAT and campus placements.",
    url: APP_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "B.Tech Career Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "B.Tech Career Hub",
    description: "GATE, PSU, CAT & Placement prep for Indian B.Tech students.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "B.Tech Career Hub",
  url: APP_URL,
  description: "A career-prep platform for Indian B.Tech students covering GATE, PSU recruitment, CAT and placements.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${lexend.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100dvh-3.5rem)] pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
