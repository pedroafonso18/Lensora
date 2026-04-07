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
  const meta = user?.publicMetadata as {
    subscriptionStatus?: string;
    priceId?: string;
    stripeCustomerId?: string;
  } | undefined;

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/review" className="flex items-center gap-2">
          <Logo className="text-indigo-600" size={24} />
          <span className="text-lg font-bold text-gray-900">Lensora</span>
        </Link>
        <UserButton />
      </header>

      <main className="mx-auto max-w-2xl w-full px-6 py-12 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>

        {/* Profile */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Profile</h2>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Name: </span>{user?.fullName ?? "—"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Email: </span>
            {user?.emailAddresses?.[0]?.emailAddress ?? "—"}
          </p>
        </section>

        {/* Subscription */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-gray-900">{planName ?? "No active plan"}</p>
              <span className={`self-start rounded-full px-2 py-0.5 text-xs font-semibold ${
                isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {statusLabel[status] ?? status}
              </span>
            </div>
            {!isActive && (
              <Link
                href="/pricing"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Choose a plan
              </Link>
            )}
          </div>
          {isActive && planName === "Starter" && (
            <div className="rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Upgrade to <strong>Professional</strong> for unlimited reviews.{" "}
              <Link href="/pricing" className="underline font-medium">See plans →</Link>
            </div>
          )}
        </section>

        {/* Billing */}
        {meta?.stripeCustomerId && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col gap-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Billing</h2>
            <p className="text-sm text-gray-500">
              Manage your payment method, view invoices, or cancel your subscription.
            </p>
            <OpenPortalButton />
          </section>
        )}
      </main>
    </div>
  );
}
