import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { Masthead } from "./components/Masthead";
import { ScrollReveal } from "./components/ScrollReveal";
import { SiteNav } from "./components/SiteNav";
import { GrainOverlay } from "./components/GrainOverlay";
import { Shortcuts } from "./components/Shortcuts";
import { Konami } from "./components/Konami";
import { ConsoleGreeting } from "./components/ConsoleGreeting";
import { TabTitleCycle } from "./components/TabTitleCycle";
import { CursorSpotlight } from "./components/CursorSpotlight";
import { PageAnimatePresence } from "./components/PageAnimatePresence";

const editorial = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Utsav Doye — Full Stack Developer",
  description: "I turn complex problems into boring, reliable systems.",
  metadataBase: new URL("https://utsav.dev"),
  openGraph: {
    title: "Utsav Doye — Full Stack Developer",
    description: "I turn complex problems into boring, reliable systems.",
    url: "https://utsav.dev",
    siteName: "Utsav Doye",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utsav Doye — Full Stack Developer",
    description: "I turn complex problems into boring, reliable systems.",
  },
  icons: {
    icon: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${editorial.variable} ${mono.variable} antialiased`}>
        <div dangerouslySetInnerHTML={{ __html: "<!-- \n╔═══════════════════════════════════════════╗\n║  hey. you opened devtools.                ║\n║  curious people make the best developers. ║  \n║                                           ║\n║  since you're here:                       ║\n║  utsavdoye07@gmail.com                    ║\n║  /secret                                  ║\n╚═══════════════════════════════════════════╝\n-->" }} style={{ display: 'none' }} />
        <ConsoleGreeting />
        <TabTitleCycle />
        <CursorSpotlight />
        <GrainOverlay />
        <Shortcuts />
        <Konami />
        <CustomCursor />
        <ScrollReveal />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-[#e8ff00] focus:px-3 focus:py-2 focus:font-mono focus:text-black"
        >
          Skip to content
        </a>

        <SiteNav />
        <Masthead />

        <main id="content" className="min-h-[calc(100svh-160px)] pt-28 overflow-hidden">
          <PageAnimatePresence>
            {children}
          </PageAnimatePresence>
        </main>

        <Footer />
      </body>
    </html>
  );
}
