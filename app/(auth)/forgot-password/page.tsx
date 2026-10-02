"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { requestPasswordReset } from "../actions";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-2 text-muted">We will email you a link to choose a new one.</p>

      <form action={action} className="mt-8 space-y-4">
        <FormMessage error={state?.error} message={state?.message} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <Button type="submit" disabled={pending} className="w-full py-3">
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        <Link href="/signin" className="text-accent hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
