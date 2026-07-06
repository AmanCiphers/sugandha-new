"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ORDER_STATUSES } from "@/constants";
import { toast } from "sonner";

export default function OrderStatusUpdate({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      toast.success("Status updated");
    } catch (err) {
      toast.error(err.message);
      setStatus(currentStatus);
    } finally {
      setUpdating(false);
    }
  };

  const currentLabel = ORDER_STATUSES.find((s) => s.value === currentStatus)?.label || currentStatus;

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-md border border-border/40 bg-background px-3 py-2 text-sm"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        size="sm"
        className="w-full rounded-full"
        onClick={handleUpdate}
        disabled={status === currentStatus || updating}
      >
        {updating ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
