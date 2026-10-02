"use client";

import { useActionState } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { updatePassword } from "../actions";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>

      <form action={action} className="mt-8 space-y-4">
        <FormMessage error={state?.error} />
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        <Button type="submit" disabled={pending} className="w-full py-3">
          {pending ? "Saving…" : "Save password"}
        </Button>
      </form>
    </div>
  );
}
