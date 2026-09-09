"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AccountSettingsForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileSubmitting(true);

    const res = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setProfileSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setProfileError(data.error ?? "Couldn't save your changes. Please try again.");
      return;
    }

    setProfileSuccess(true);
    router.refresh();
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordSubmitting(true);

    const res = await fetch("/api/admin/account/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPasswordSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPasswordError(data.error ?? "Couldn't change your password. Please try again.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setPasswordSuccess(true);
  }

  return (
    <div className="space-y-14">
      <form onSubmit={handleProfileSubmit} className="space-y-6 border border-taupe/30 rounded-brand p-6 max-w-md">
        <h2 className="font-serif text-xl">Profile</h2>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {profileError && <p key={profileError} className="animate-shake text-sm text-blush">{profileError}</p>}
        {profileSuccess && (
          <p className="animate-bounce-pop text-sm text-ink">
            Saved. Log out and back in for it to show everywhere.
          </p>
        )}

        <Button type="submit" disabled={profileSubmitting}>
          {profileSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-6 border border-taupe/30 rounded-brand p-6 max-w-md">
        <h2 className="font-serif text-xl">Change password</h2>

        <div>
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {passwordError && <p key={passwordError} className="animate-shake text-sm text-blush">{passwordError}</p>}
        {passwordSuccess && <p className="animate-bounce-pop text-sm text-ink">Password changed.</p>}

        <Button type="submit" disabled={passwordSubmitting}>
          {passwordSubmitting ? "Saving..." : "Change password"}
        </Button>
      </form>
    </div>
  );
}
