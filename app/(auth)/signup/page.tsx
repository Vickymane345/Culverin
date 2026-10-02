"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import SocialButtons from "@/components/auth/SocialButtons";
import { signUp } from "../actions";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, undefined);

  if (state?.message) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-4 text-muted">{state.message}</p>
        <Link href="/signin" className="mt-8 inline-block text-sm text-accent hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted">
        Track orders, follow repairs and save what you want next.
      </p>

      <div className="mt-8">
        <SocialButtons />
      </div>

      <form action={action} className="space-y-4">
        <FormMessage error={state?.error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" autoComplete="given-name" placeholder="Victor" required />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="Chikwado" required />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 800 000 0000" />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="••••••••" minLength={8} required />
          <p className="mt-1.5 text-xs text-muted">
            At least 8 characters, with a number and a symbol.
          </p>
        </div>

        <label className="flex items-start gap-3 pt-1 text-sm text-muted">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-line bg-background accent-[#0066cc]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:underline">terms of service</Link> and{" "}
            <Link href="/privacy" className="text-accent hover:underline">privacy policy</Link> of
            Culverin Quantum Systems Limited.
          </span>
        </label>

        <Button type="submit" disabled={pending} className="w-full py-3">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
