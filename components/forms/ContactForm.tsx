"use client";

import { useActionState } from "react";
import { sendEnquiry } from "@/app/actions/requests";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

const topics = [
  "Product enquiry",
  "Solar installation",
  "App / web development",
  "Graphic design & animation",
  "Order support",
  "General",
];

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendEnquiry, undefined);

  return (
    <form action={action} className="space-y-4">
      <FormMessage error={state?.error} message={state?.message} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" name="name" autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="c-phone">Phone (optional)</Label>
          <Input id="c-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <Label htmlFor="c-topic">Topic</Label>
          <select
            id="c-topic"
            name="topic"
            className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" name="message" rows={5} required />
        </div>
      </div>
      <Button type="submit" disabled={pending} className="w-full py-3 sm:w-auto">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
