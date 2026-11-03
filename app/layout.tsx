import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ong-visa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ONG VISA - Cancers du sein et de l'utérus",
    template: "%s | ONG VISA",
  },
  description:
    "Plateforme de sensibilisation, de prévention et d'information sur les cancers du sein et de l'utérus au Togo.",
  keywords: [
    "cancer du sein",
    "cancer de l'utérus",
    "cancer du col de l'utérus",
    "cancer de l'endomètre",
    "prévention",
    "dépistage",
    "sensibilisation",
    "ONG VISA",
    "santé féminine",
    "cancer du sein Togo",
    "cancer de l'utérus Togo",
    "Lomé",
  ],
  authors: [{ name: "ONG VISA" }],
  creator: "ONG VISA",
  // Ajout pour la validation Google Search Console :
  verification: {
    google: "JTnAvF71VQTZICd8UEScZOPx9qvjl1EOlMTq0cYiqu4", // Colle ici la valeur de 'content' (ex: JTnAvF71VQTZIC...)
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "ONG VISA - Cancers du sein et de l'utérus",
    description:
      "Sensibilisation, prévention et dépistage des cancers du sein et de l'utérus au Togo.",
    siteName: "ONG VISA",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ONG VISA - Sensibilisation aux cancers du sein et de l'utérus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONG VISA - Cancers du sein et de l'utérus",
    description:
      "Sensibilisation, prévention et dépistage des cancers du sein et de l'utérus au Togo.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${workSans.variable} ${fraunces.variable}`}>
      <body className="antialiased min-h-screen bg-[#FAF6F0] text-[#2A2521] font-sans">
        {children}
      </body>
    </html>
  );
}