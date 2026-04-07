"use client";

import { useState } from "react";

export default function OpenPortalButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="self-start rounded-lg border border-white/[0.12] px-4 py-2 text-sm font-medium text-zinc-300 hover:border-white/25 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? "Opening…" : "Manage billing →"}
    </button>
  );
}
