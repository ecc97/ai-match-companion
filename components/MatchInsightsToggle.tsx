"use client";

import { useState } from "react";
import type { TeamSquadPlayer } from "@/lib/types/match";

export function MatchInsightsToggle({ squad }: { squad: TeamSquadPlayer[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full bg-emerald-400 text-neutral-950 font-semibold rounded-full py-3 hover:bg-emerald-300 transition"
            >
                {open ? "Ocultar plantilla completa" : "View Detailed Match Insights"}
            </button>

            {open && (
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {squad.map((player) => (
                        <li key={player.id} className="bg-neutral-900 rounded-lg px-3 py-2 text-neutral-300">
                            {player.name}
                            <span className="block text-neutral-500 text-xs">{player.position}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}