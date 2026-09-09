"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = ["requested", "responded", "ongoing", "finished"] as const;

const statusLabels: Record<string, string> = {
  requested: "Requested",
  responded: "Responded",
  ongoing: "Ongoing",
  finished: "Finished",
};

const statusStyles: Record<string, string> = {
  requested: "border-rose/60 text-blush",
  responded: "border-taupe/40 text-ink",
  ongoing: "border-blush/60 text-blush",
  finished: "border-taupe/30 text-taupe",
};

export function ConsultationStatusSelect({
  consultationId,
  initialStatus,
}: {
  consultationId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleChange(next: string) {
    const previous = status;
    setStatus(next);
    setError(false);

    const res = await fetch(`/api/admin/consultations/${consultationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) {
      setStatus(previous);
      setError(true);
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        aria-label="Request status"
        className={`text-xs border rounded-brand pl-2.5 pr-7 py-1.5 bg-cream appearance-none cursor-pointer transition-[border-color,opacity] duration-150 hover:border-ink disabled:opacity-60 bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%238b8378%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.4rem_center] bg-[length:14px] ${
          statusStyles[status] ?? "border-taupe/40 text-ink"
        }`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {statusLabels[opt]}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-blush mt-1">Couldn&apos;t save — try again.</p>}
    </div>
  );
}
