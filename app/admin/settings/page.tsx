import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountSettingsForm } from "@/components/admin/account-settings-form";
import { Reveal } from "@/components/ui/reveal";
import { GearIcon } from "@/components/admin/icons";

export const metadata = { title: "Settings — Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/settings");

  return (
    <Reveal>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-blush/20 text-blush flex items-center justify-center shrink-0">
          <GearIcon className="w-5 h-5" />
        </span>
        <h1 className="font-serif text-3xl">Settings</h1>
      </div>
      <p className="text-taupe mb-8">Manage your admin account.</p>

      <AccountSettingsForm
        initialName={session.user.name ?? ""}
        initialEmail={session.user.email ?? ""}
      />
    </Reveal>
  );
}
