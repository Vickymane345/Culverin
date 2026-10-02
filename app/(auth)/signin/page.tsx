import type { Metadata } from "next";
import SignInForm from "./SignInForm";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

const linkErrors: Record<string, string> = {
  link: "That link has expired or was already used. Sign in, or request a new one.",
  google: "Google sign-in did not complete. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <SignInForm next={safeNext(next)} linkError={error ? linkErrors[error] : undefined} />;
}
