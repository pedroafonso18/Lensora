import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { UserButton } from "@clerk/nextjs";
import OpenPortalButton from "@/app/components/OpenPortalButton";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const meta = user?.publicMetadata as
    | {
        subscriptionStatus?: string;
        priceId?: string;
        stripeCustomerId?: string;
      }
    | undefined;

  const status = meta?.subscriptionStatus ?? "none";
  const isActive = status === "active" || status === "trialing";

  const planName =
    meta?.priceId === process.env.STRIPE_STARTER_PRICE_ID
      ? "Starter"
      : meta?.priceId
      ? "Professional"
      : null;

  const statusLabel: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    canceled: "Canceled",
    past_due: "Past due",
    none: "No subscription",
  };

  const statusColor: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    trialing: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    canceled: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    past_due: "text-red-400 bg-red-500/10 border-red-500/20",
    none: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <Link href="/review" className="flex items-center gap-2.5 group">
          <Logo
            className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
            size={24}
          />
          <span className="text-base font-bold tracking-tight text-white">Lensora</span>
        </Link>
        <UserButton />
      </header>

      <main className="mx-auto max-w-2xl w-full px-8 py-14 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white mb-4">Account</h1>

        {/* Profile */}
        <section className="rounded-xl border border-white/[0.06] p-6 flex flex-col gap-4">
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-zinc-600">
            Profile
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-200 font-medium">Name</span>
              <span className="mx-3 text-zinc-700">·</span>
              {user?.fullName ?? "—"}
            </p>
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-200 font-medium">Email</span>
              <span className="mx-3 text-zinc-700">·</span>
              {user?.emailAddresses?.[0]?.emailAddress ?? "—"}
            </p>
          </div>
          <p className="text-xs text-zinc-700">Managed by Clerk</p>
        </section>

        {/* Subscription */}
        <section className="rounded-xl border border-white/[0.06] p-6 flex flex-col gap-4">
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-zinc-600">
            Subscription
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-white text-lg">
                {planName ?? "No active plan"}
              </p>
              <span
                className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  statusColor[status] ?? statusColor.none
                }`}
              >
                {statusLabel[status] ?? status}
              </span>
            </div>
            {!isActive && (
              <Link
                href="/pricing"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shrink-0"
              >
                Choose a plan
              </Link>
            )}
          </div>
          {isActive && planName === "Starter" && (
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-400">
              Upgrade to{" "}
              <span className="font-semibold text-indigo-300">Professional</span> for
              unlimited reviews.{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-2 hover:text-indigo-200 transition-colors"
              >
                See plans →
              </Link>
            </div>
          )}
        </section>

        {/* Billing */}
        {meta?.stripeCustomerId && (
          <section className="rounded-xl border border-white/[0.06] p-6 flex flex-col gap-4">
            <p className="text-xs font-mono tracking-[0.15em] uppercase text-zinc-600">
              Billing
            </p>
            <p className="text-sm text-zinc-500">
              Manage your payment method, view invoices, or cancel your subscription.
            </p>
            <OpenPortalButton />
            <p className="text-xs text-zinc-700">
              You can change or cancel your plan from the Stripe portal.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
