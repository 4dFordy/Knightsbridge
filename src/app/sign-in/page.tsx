import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/SignInForm";
import { currentPlayer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function SignInPage() {
  if (await currentPlayer()) redirect("/account");
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl font-black">Sign in.</h1>
      <SignInForm />
    </div>
  );
}
