"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type FormState } from "@/actions/auth";
import { Field, FormError, SubmitButton } from "@/components/forms";

export function SignInForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  const e = state.errors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <FormError message={e.form} />
      <Field name="email" label="Email" type="email" autoComplete="email" defaultValue={state.values?.email} error={e.email} />
      <Field name="password" label="Password" type="password" autoComplete="current-password" error={e.password} />
      <SubmitButton pending={pending}>Sign in</SubmitButton>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/get-in" className="font-bold text-pale-gold underline">
          Get in
        </Link>
      </p>
    </form>
  );
}
