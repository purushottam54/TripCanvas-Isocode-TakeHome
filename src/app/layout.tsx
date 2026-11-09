import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TripCanvas | Handcrafted Kerala & South India Luxury Holidays",
    template: "%s | TripCanvas",
  },
  description:
    "Curated, transparent luxury travel through Kerala backwaters, misty tea plantations of Munnar, wildlife reserves, and historic temples. Official booking & tour consultation.",
  keywords: [
    "Kerala Tour Packages",
    "Alleppey Houseboat",
    "Munnar Holiday",
    "Thekkady Wildlife",
    "South India Tours",
    "Luxury Kerala Travel",
  ],
  authors: [{ name: "TripCanvas Kochi" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "TripCanvas",
    title: "TripCanvas | Handcrafted Kerala & South India Holidays",
    description:
      "Curated Kerala travel with transparent seasonal pricing and dedicated tour consultants.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Alleppey Houseboat at Sunset - TripCanvas",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-terracotta/20 selection:text-forest">
        {children}
      </body>
    </html>
  );
}

