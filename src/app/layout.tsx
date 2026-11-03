import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Math 1/2 Study Lab",
  description:
    "Integrated Math 1 and 2 class textbook units with digitized classwork and instant feedback.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteHeader />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="relative z-10 border-t border-line/60 bg-surface/60">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 text-xs text-ink-soft">
              <span className="font-[family-name:var(--font-fraunces)] text-sm text-ink">
                Math 1/2
              </span>
              <span>Learning · Sharing · Practice tests</span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
