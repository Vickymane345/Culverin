import { requireAccount } from "@/lib/account";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { user, profile } = await requireAccount("/dashboard/settings");
  return <SettingsForm profile={profile} email={user.email ?? ""} />;
}
