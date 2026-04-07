export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { auth } = await import("@clerk/nextjs/server");

  // Verify the user is authenticated and obtain a fresh session token to
  // forward to the Rust backend for its own JWT verification.
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Could not obtain session token" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the review backend. Is it running?" },
      { status: 502 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
