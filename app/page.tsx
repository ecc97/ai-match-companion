import Link from "next/link";
import { FEATURED_TEAMS } from "@/config/matches.config";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
      <h1 className="text-xl font-bold mb-6 text-center">AI Match Companion</h1>
      <div className="max-w-md mx-auto space-y-3">
        {FEATURED_TEAMS.map((team) => (
          <Link
            key={team.slug}
            href={`/team/${team.slug}`}
            className="block bg-neutral-900 rounded-xl p-4 text-center capitalize hover:bg-neutral-800 transition"
          >
            {team.slug}
          </Link>
        ))}
      </div>
    </main>
  );
}