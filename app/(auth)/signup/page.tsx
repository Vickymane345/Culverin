"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialButtons from "@/components/auth/SocialButtons";

export default function SignUpPage() {
  const router = useRouter();

  // No backend yet. This simply routes to the dashboard.
  // Replace with a real sign-up call when auth is wired up.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="••••••••" required />
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
            I agree to the terms of service and privacy policy of Culverin
            Quantum Systems Limited.
          </span>
        </label>

        <Button type="submit" className="w-full py-3">
          Create account
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
