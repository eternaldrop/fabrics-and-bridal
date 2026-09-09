"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogoutIcon } from "@/components/admin/icons";

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <button
      type="button"
      disabled={loggingOut}
      onClick={() => {
        setLoggingOut(true);
        signOut({ callbackUrl: "/" });
      }}
      className="w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-brand text-sm text-cream/60 hover:bg-blush/10 hover:text-blush transition-[background-color,color,transform] duration-150 active:scale-[0.97] disabled:opacity-50"
    >
      <LogoutIcon className="w-[18px] h-[18px] shrink-0" />
      {loggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}
