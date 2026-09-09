import type { Metadata } from "next";
import { Fraunces, Inter, Parisienne } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Script/cursive accent — used only for hero carousel slide titles, never
// for body copy or buttons, so it stays a special accent.
const parisienne = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fabrics & Bridals",
  description:
    "Fabrics, made-to-measure outfits, and bridal styling consultations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${parisienne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <SessionProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
