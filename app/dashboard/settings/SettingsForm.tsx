"use client";

import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { updateProfile } from "@/app/actions/profile";
import { NIGERIAN_STATES } from "@/lib/pricing";
import type { ProfileRow } from "@/lib/types";

export default function SettingsForm({ profile, email }: { profile: ProfileRow; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Settings</h1>
        <p className="mt-1 text-muted">Profile and account preferences.</p>
      </div>

      <form action={action} className="space-y-6">
        <FormMessage error={state?.error} message={state?.message} />

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>How we reach you about orders and repairs. Used to prefill checkout.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" defaultValue={profile.full_name ?? ""} autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} readOnly disabled className="opacity-70" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} autoComplete="tel" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                name="state"
                defaultValue={profile.state ?? "Lagos"}
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="address">Delivery address</Label>
              <Input id="address" name="address" defaultValue={profile.address ?? ""} autoComplete="street-address" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={profile.city ?? ""} autoComplete="address-level2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Leave blank to keep your current password.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="pw">New password</Label>
              <Input id="pw" name="pw" type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>
            <div>
              <Label htmlFor="pw2">Confirm password</Label>
              <Input id="pw2" name="pw2" type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
