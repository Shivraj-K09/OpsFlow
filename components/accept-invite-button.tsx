"use client";

import { Button } from "@/components/ui/button";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AcceptInviteButton({ workspaceId }: { workspaceId: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsPending(true);
    const res = await fetch(`/api/invites/${workspaceId}/accept`, {
      method: "POST",
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      toast.error(data.error || "Failed to accept invite");
      setIsPending(false);
    } else {
      toast.success("Joined workspace successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleAccept}
      disabled={isPending}
      className="h-11 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
    >
      {isPending ? (
        <IconLoader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <IconCheck className="mr-2 size-4" />
      )}
      Accept Invitation
    </Button>
  );
}
