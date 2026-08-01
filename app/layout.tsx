import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { HeroProvider } from "@/components/ui/hero-context";
import { getHero } from "@/lib/hero";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VATSSA Homepage",
  description: "Welcome to the VATSIM Sub-Sahara Africa Division.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved here, not in the banner: every page renders a hero, and doing it
  // once per request means the right photo is in the server-rendered HTML
  // instead of being swapped in after hydration.
  const hero = await getHero();

  return (
    <html lang="en" className={`${montserrat.className} antialiased h-full`}>
      <body className="min-h-full flex flex-col">
        <HeroProvider hero={hero}>
          <Navbar />
          {children}
          <Footer />
        </HeroProvider>
      </body>
    </html>
  );
}
