import Link from "next/link";
import Image from "next/image";
import { FEATURED_TEAMS } from "@/config/matches.config";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
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
  );
}