import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3000";

export async function POST(req: NextRequest) {
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
      headers: { "Content-Type": "application/json" },
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
