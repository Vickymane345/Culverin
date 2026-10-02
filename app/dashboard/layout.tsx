import type { Metadata } from "next";
import { connection } from "next/server";
import Sidebar from "@/components/dashboard/Sidebar";
import { requireAccount } from "@/lib/account";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  if (!supabaseConfigured) {
    return (
      <main className="mx-auto max-w-lg p-10 text-center">
        <h1 className="text-2xl font-semibold">Accounts are not switched on yet</h1>
        <p className="mt-3 text-muted">Add the Supabase keys to the environment to enable sign-in and the dashboard.</p>
      </main>
    );
  }

  const { user, profile } = await requireAccount();

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <Sidebar
        name={profile.full_name || user.email || "Customer"}
        email={user.email ?? ""}
        isAdmin={profile.is_admin}
      />
      <main className="min-w-0 flex-1 p-4 sm:p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
