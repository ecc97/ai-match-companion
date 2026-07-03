"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-4 mb-8 inset-x-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-2xl flex items-center justify-between bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-lg shadow-black/40">
        <Link href="/" className="font-bold text-white tracking-tight text-sm sm:text-base">
          <Image
            src="/assets/img/ai-companion-logo.png"
            alt="AI Match Companion"
            width={32}
            height={32}
            unoptimized
          />
        </Link>

        {isHome ? (
          <Link
            href="#"
            className="bg-emerald-400 text-neutral-950 font-semibold text-sm px-4 py-2 rounded-full hover:bg-emerald-300 transition"
          >
            Start
          </Link>
        ) : (
          <Link
            href="/"
            className="bg-neutral-800 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-neutral-700 transition whitespace-nowrap"
          >
            Seleccionar equipo
          </Link>
        )}
      </div>
    </nav>
  );
}