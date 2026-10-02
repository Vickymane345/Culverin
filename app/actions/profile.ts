"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string } | undefined;

export async function updateProfile(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getUser();
  if (!user) return { error: "Please sign in again." };

  const read = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 200) || null;
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: read("name"),
      phone: read("phone"),
      address: read("address"),
      city: read("city"),
      state: read("state"),
    })
    .eq("id", user.id);
  if (error) return { error: "Could not save your profile." };

  const password = String(formData.get("pw") ?? "");
  const confirm = String(formData.get("pw2") ?? "");
  if (password || confirm) {
    if (password !== confirm) return { error: "Profile saved, but the two passwords do not match." };
    if (password.length < 8) return { error: "Profile saved, but the password needs at least 8 characters." };
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) return { error: `Profile saved, but the password was not changed: ${pwError.message}` };
  }

  revalidatePath("/dashboard", "layout");
  return { message: password ? "Profile and password updated." : "Profile updated." };
}
