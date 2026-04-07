import { SignUp } from "@clerk/nextjs";
import Logo from "@/app/components/Logo";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:opacity-80 transition">
          <Logo size={32} />
          <span className="text-xl font-bold text-gray-900">Lensora</span>
        </Link>
        <p className="text-sm text-gray-500">Create your account — 7-day free trial included</p>
      </div>
      <SignUp />
    </div>
  );
}
