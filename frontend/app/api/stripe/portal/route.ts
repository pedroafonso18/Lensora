export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const { auth, clerkClient } = await import("@clerk/nextjs/server");

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const stripeCustomerId = user.publicMetadata?.stripeCustomerId as string | undefined;

  if (!stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found." }, { status: 404 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return NextResponse.json({ url: session.url });
}
