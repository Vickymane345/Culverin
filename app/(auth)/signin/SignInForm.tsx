"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import SocialButtons from "@/components/auth/SocialButtons";
import { signIn } from "../actions";

export default function SignInForm({ next, linkError }: { next: string; linkError?: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to open your dashboard.</p>

      <div className="mt-8">
        <SocialButtons next={next} />
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <FormMessage error={state?.error ?? linkError} />

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="mb-1.5 text-xs text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
        </div>

        <Button type="submit" disabled={pending} className="w-full py-3">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        New to Culverin Quantum?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
