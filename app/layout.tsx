import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ong-visa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ONG VISA - Sensibilisation et Prévention du Cancer",
    template: "%s | ONG VISA",
  },
  description:
    "Plateforme dédiée à l'information, la sensibilisation et la prévention du cancer féminin au Togo. Découvrez les différents types de cancer, les options de dépistage et nos campagnes sur le terrain.",
  keywords: [
    "cancer",
    "prévention",
    "dépistage",
    "sensibilisation",
    "ONG VISA",
    "santé féminine",
    "cancer du sein Togo",
    "col de l'utérus",
    "Lomé",
  ],
  authors: [{ name: "ONG VISA" }],
  creator: "ONG VISA",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "ONG VISA - Sensibilisation & Dépistage du Cancer Féminin",
    description:
      "Sensibilisation, prévention et dépistage précoce des cancers du sein, du col de l'utérus et de l'ovaire au Togo.",
    siteName: "ONG VISA",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "ONG VISA - Lutte contre le cancer féminin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONG VISA - Santé Féminine & Dépistage",
    description:
      "Sensibilisation, prévention et dépistage précoce des cancers féminins au Togo.",
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
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}