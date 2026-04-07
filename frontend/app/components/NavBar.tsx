"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

interface Props {
  /** Slot rendered on the right side of the nav (e.g. UserButton + links) */
  right?: React.ReactNode;
}

export default function NavBar({ right }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between border-b transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-md border-white/[0.06]"
          : "bg-transparent border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <Logo
          className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
          size={26}
        />
        <span className="text-base font-bold tracking-tight text-white">
          Lensora
        </span>
      </Link>

      <div className="flex items-center gap-4">{right}</div>
    </nav>
  );
}
