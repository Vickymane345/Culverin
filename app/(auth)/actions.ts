"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { SITE_URL } from "@/lib/site";
import { safeNext } from "@/lib/safe-next";

export type AuthState = { error?: string; message?: string } | undefined;

const notConfigured: AuthState = {
  error: "Accounts are not switched on yet. Please try again shortly.",
};

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return notConfigured;
  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.message === "Email not confirmed"
          ? "Please confirm your email first. Check your inbox for the link."
          : "That email and password do not match.",
    };
  }
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return notConfigured;
  const firstName = field(formData, "firstName");
  const lastName = field(formData, "lastName");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const password = String(formData.get("password") ?? "");

  if (password.length < 8 || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return { error: "Use at least 8 characters, with a number and a symbol." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`.trim(), phone },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/dashboard`,
    },
  });
  if (error) return { error: error.message };

  // Email confirmation switched off in Supabase: the user is signed in already.
  if (data.session) redirect("/dashboard");

  return {
    message: `We sent a confirmation link to ${email}. Open it to finish setting up your account.`,
  };
}

export async function signInWithGoogle(formData: FormData) {
  if (!supabaseConfigured) redirect("/signin");
  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect("/signin?error=google");
  redirect(data.url);
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return notConfigured;
  const email = field(formData, "email");
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`,
  });
  // Same answer whether or not the account exists.
  return { message: "If that email has an account, a reset link is on its way." };
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return notConfigured;
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password !== confirm) return { error: "The two passwords do not match." };
  if (password.length < 8) return { error: "Use at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Your reset link has expired. Request a new one." };
  redirect("/dashboard");
}

export async function signOut() {
  if (supabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
