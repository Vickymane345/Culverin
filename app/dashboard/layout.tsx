import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Culverin Quantum Systems",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
