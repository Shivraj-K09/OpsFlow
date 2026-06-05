"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "@/lib/types";
import {
  IconDotsVertical,
  IconShieldLock,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function UserActions({
  member,
  currentUserId,
  currentUserRole,
}: {
  member: Member;
  currentUserId: string;
  currentUserRole: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Only Admins can change roles
  if (currentUserRole !== "ADMIN") return null;

  // Cannot change your own role
  if (member.id === currentUserId) return null;

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    toast.loading("Updating role...");

    const res = await fetch(`/api/members/${member.id}`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    const result = await res.json();

    toast.dismiss();
    if (!res.ok || result.error) {
      toast.error(result.error || "Failed to update role");
    } else {
      toast.success(`${member.full_name}'s role updated to ${newRole}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
    }

    setIsUpdating(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isUpdating}>
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconShieldLock className="size-4 mr-2" />
            Change Role
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => handleRoleChange("admin")}
                disabled={member.role === "admin"}
              >
                <IconShieldLock className="size-4 mr-2 text-indigo-500" />
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("manager")}
                disabled={member.role === "manager"}
              >
                <IconUserCheck className="size-4 mr-2 text-purple-500" />
                Manager
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRoleChange("user")}
                disabled={member.role === "user"}
              >
                <IconUser className="size-4 mr-2 text-slate-500" />
                Member
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
