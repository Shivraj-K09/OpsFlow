"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IconUser, IconShieldLock, IconUserCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { Member } from "@/lib/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function UserTableRow({
  member,
  currentUserId,
  currentUserRole,
  avatarColor,
  workspaceId,
}: {
  member: Member;
  currentUserId: string;
  currentUserRole: string;
  avatarColor: string;
  workspaceId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(member.role);
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAdmin = currentUserRole === "ADMIN";
  const isSelf = member.id === currentUserId;
  const canChangeRole = isAdmin && !isSelf;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === member.role) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, workspaceId }),
      });
      const result = await res.json();
      if (!res.ok || result?.error) {
        toast.error(result.error || "Failed to update role");
        setRole(member.role); // revert on error
      } else {
        toast.success(`${member.full_name}'s role updated to ${role}`);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        router.refresh();
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <TableRow
        onClick={() => setIsOpen(true)}
        className="hover:bg-muted/50 cursor-pointer transition-colors"
      >
        <TableCell className="p-4 font-medium">
          <div className="flex items-center gap-3">
            <Avatar className="border-background h-9 w-9 border-2 shadow-sm">
              <AvatarImage src={member.avatar_url || ""} />
              <AvatarFallback className={`text-white ${avatarColor}`}>
                {member.full_name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{member.full_name}</span>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                {member.email}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="secondary"
            className={`font-semibold capitalize ${
              member.role === "admin"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                : member.role === "manager"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {member.role}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground hidden sm:table-cell">
          {member.joined_at
            ? format(new Date(member.joined_at), "MMM d, yyyy")
            : "-"}
        </TableCell>
      </TableRow>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setRole(member.role);
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[500px]!"
        >
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <div className="flex items-center space-x-4 pt-4 pb-2">
                <Avatar className="border-border h-14 w-14 border shadow-sm">
                  <AvatarImage src={member.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {member.full_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {member.full_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {member.email}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-2">
              <FieldGroup>
                <Field className="space-y-1.5">
                  <FieldLabel className="text-muted-foreground text-xs">
                    Full Name
                  </FieldLabel>
                  <Input
                    value={member.full_name || ""}
                    disabled
                    className="h-10 cursor-not-allowed bg-transparent! opacity-70 shadow-none"
                  />
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel className="text-muted-foreground text-xs">
                    Email Address
                  </FieldLabel>
                  <Input
                    value={member.email || ""}
                    disabled
                    className="h-10 cursor-not-allowed bg-transparent! opacity-70 shadow-none"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field className="space-y-1.5">
                    <FieldLabel className="text-muted-foreground text-xs">
                      Joined Workspace
                    </FieldLabel>
                    <Input
                      value={
                        member.joined_at
                          ? format(new Date(member.joined_at), "MMM d, yyyy")
                          : "-"
                      }
                      disabled
                      className="h-10 cursor-not-allowed bg-transparent! opacity-70 shadow-none"
                    />
                  </Field>

                  <Field className="space-y-1.5">
                    <FieldLabel className="text-muted-foreground text-xs">
                      Workspace Role
                    </FieldLabel>
                    {canChangeRole ? (
                      <Select
                        value={role}
                        onValueChange={setRole}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-10 bg-transparent! shadow-none">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <IconShieldLock className="mr-2 size-4 text-indigo-500" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex items-center">
                              <IconUserCheck className="mr-2 size-4 text-purple-500" />
                              Manager
                            </div>
                          </SelectItem>
                          <SelectItem value="member">
                            <div className="flex items-center">
                              <IconUser className="mr-2 size-4 text-slate-500" />
                              Member
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={role.charAt(0).toUpperCase() + role.slice(1)}
                        disabled
                        className="h-10 cursor-not-allowed bg-transparent! capitalize opacity-70 shadow-none"
                      />
                    )}
                    {!canChangeRole && isSelf && (
                      <p className="text-muted-foreground mt-1 text-[10px]">
                        You cannot change your own role.
                      </p>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                {canChangeRole ? "Cancel" : "Close"}
              </Button>
              {canChangeRole && (
                <Button
                  type="submit"
                  disabled={isPending || role === member.role}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
