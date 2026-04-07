import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "@/app/components/Logo";

const clerkAppearance = {
  variables: {
    colorBackground: "#111116",
    colorInputBackground: "#09090b",
    colorText: "#fafafa",
    colorTextSecondary: "#71717a",
    colorPrimary: "#4f46e5",
    colorInputText: "#fafafa",
    borderRadius: "0.5rem",
    colorBorder: "rgba(255,255,255,0.08)",
  },
  elements: {
    card: "shadow-none",
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-500 transition-colors text-white",
    footerActionLink: "text-indigo-400 hover:text-indigo-300",
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 relative">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(79,70,229,0.06) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 flex flex-col items-center gap-8 w-full"
        style={{ animation: "fade-up 0.4s ease-out both" }}
      >
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="group">
            <Logo
              size={44}
              className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Start your free trial.
          </h1>
          <p className="text-sm text-zinc-500">
            7 days free &middot; Credit card required &middot; Cancel anytime
          </p>
        </div>

        {/* Clerk component */}
        <SignUp appearance={clerkAppearance} />

        {/* Footer link */}
        <p className="text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
