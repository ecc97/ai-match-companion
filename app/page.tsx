import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FEATURED_TEAMS } from "@/config/matches.config";

export const metadata: Metadata = {
  title: "Análisis de Partidos con IA",
  description:
    "Explora las selecciones nacionales y descubre análisis tácticos generados por inteligencia artificial para cada partido.",
  openGraph: {
    title: "AI Match Companion — Análisis de Partidos con IA",
    description:
      "Explora las selecciones nacionales y descubre análisis tácticos generados por inteligencia artificial para cada partido.",
    url: "/",
  },
  twitter: {
    title: "AI Match Companion — Análisis de Partidos con IA",
    description:
      "Explora las selecciones nacionales y descubre análisis tácticos generados por inteligencia artificial para cada partido.",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Match Companion",
  description:
    "Análisis inteligente de partidos de fútbol con IA. Sigue a tus selecciones nacionales favoritas y descubre análisis tácticos.",
  url: "https://ai-match-companion.vercel.app",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  author: {
    "@type": "Organization",
    name: "AI Match Companion",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="flex flex-col justify-center min-h-screen bg-homeMain text-white px-4 py-8">
        <h1 className="text-xl font-bold mb-6 text-center">AI Match Companion</h1>
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          {FEATURED_TEAMS.map((team) => (
            <Link
              key={team.slug}
              href={`/team/${team.slug}`}
              className="flex items-center gap-3 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition"
            >
              <Image
                src={`https://flagcdn.com/w80/${team.flagCode}.png`}
                alt={`Bandera de ${team.displayName}`}
                width={32}
                height={24}
                className="rounded-sm object-cover"
                unoptimized // dominio externo, sin loader propio configurado
              />
              <span>{team.displayName}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}