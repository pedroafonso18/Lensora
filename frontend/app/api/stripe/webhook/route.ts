export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err}` },
      { status: 400 }
    );
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (!clerkUserId) break;

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          stripeCustomerId: subscription.customer as string,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          priceId: subscription.items.data[0]?.price.id,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (!clerkUserId) break;

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          subscriptionStatus: "canceled",
          subscriptionId: null,
          priceId: null,
        },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
