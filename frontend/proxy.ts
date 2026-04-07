import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/review(.*)", "/account(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing(.*)",
  "/api/stripe/webhook(.*)",
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  // Webhook route must remain unauthenticated
  if (isPublicRoute(req)) return NextResponse.next();

  if (isProtectedRoute(req)) {
    // 1. Ensure user is authenticated
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // 2. Ensure user has an active subscription (stored in Clerk public metadata)
    const meta = sessionClaims?.metadata as { subscriptionStatus?: string } | undefined;
    const status = meta?.subscriptionStatus;
    const isSubscribed = status === "active" || status === "trialing";

    if (!isSubscribed) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
