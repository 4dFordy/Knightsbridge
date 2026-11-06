import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/SignUpForm";
import { currentPlayer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Get in" };
export const dynamic = "force-dynamic";

export default async function GetInPage() {
  if (await currentPlayer()) redirect("/account");
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl font-black">Get in.</h1>
      <p className="text-muted">Create your Innit account. It takes a minute.</p>
      <SignUpForm />
    </div>
  );
}
