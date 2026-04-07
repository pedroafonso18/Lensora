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
      className="self-start rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
    >
      {loading ? "Opening…" : "Manage billing →"}
    </button>
  );
}
