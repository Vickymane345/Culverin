"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialButtons from "@/components/auth/SocialButtons";

export default function SignInPage() {
  const router = useRouter();

  // No backend yet. This simply routes to the dashboard.
  // Replace with a real sign-in call when auth is wired up.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">
        Sign in to open your dashboard.
      </p>

      <div className="mt-8">
        <SocialButtons />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="mb-1.5 text-xs text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
        </div>

        <label className="flex items-center gap-3 pt-1 text-sm text-muted">
          <input
            type="checkbox"
            className="size-4 rounded border-line bg-background accent-[#0066cc]"
          />
          Keep me signed in
        </label>

        <Button type="submit" className="w-full py-3">
          Sign in
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
