import type { Metadata } from "next";
import { Chakra_Petch, Oxanium } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
});

const oxanium = Oxanium({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const SITE_NAME = "AI Match Companion";
const SITE_DESCRIPTION =
  "Análisis inteligente de partidos de fútbol con IA. Sigue a tus selecciones nacionales favoritas, descubre claves tácticas y jugadores a seguir en cada encuentro.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "AI Match Companion" }],
  generator: "Next.js",
  keywords: [
    "fútbol",
    "análisis de partidos",
    "IA",
    "selecciones nacionales",
    "mundial",
    "inteligencia artificial",
    "deportes",
  ],
  metadataBase: new URL("https://ai-match-companion.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${chakraPetch.variable} ${oxanium.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
