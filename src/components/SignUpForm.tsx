"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type FormState } from "@/actions/auth";
import { DateOfBirth, Field, FormError, SubmitButton } from "@/components/forms";
import { SolicitorPlaceholder } from "@/components/SolicitorPlaceholder";
import { PASSWORD_MIN } from "@/lib/auth/rules";

export function SignUpForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, {});
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      <FormError message={e.form} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="firstName" label="First name" autoComplete="given-name" defaultValue={v.firstName} error={e.firstName} />
        <Field name="lastName" label="Last name" autoComplete="family-name" defaultValue={v.lastName} error={e.lastName} />
      </div>
      <Field name="email" label="Email" type="email" autoComplete="email" defaultValue={v.email} error={e.email} />
      <Field
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        hint={`At least ${PASSWORD_MIN} characters. A few random words works well.`}
        error={e.password}
      />
      <DateOfBirth values={v} error={e.dateOfBirth} />
      <div className="space-y-1.5">
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="confirmAdultInGB"
            aria-invalid={e.confirmAdultInGB ? true : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-gold)]"
          />
          <span>
            <SolicitorPlaceholder id="sign-up 18+ and Great Britain confirmation" />
          </span>
        </label>
        {e.confirmAdultInGB && <p className="text-sm text-urgent">{e.confirmAdultInGB}</p>}
      </div>
      <p className="space-x-1 text-xs text-muted">
        <SolicitorPlaceholder id="privacy notice" /> <SolicitorPlaceholder id="terms and draw rules" />
      </p>
      <SubmitButton pending={pending}>Get in</SubmitButton>
      <p className="text-center text-sm text-muted">
        Already in?{" "}
        <Link href="/sign-in" className="font-bold text-pale-gold underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
