"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { type User } from "@supabase/supabase-js";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function SettingsDialog({
  open,
  onOpenChange,
  user,
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    onOpenChange(false);
  };

  const fullName = user?.user_metadata?.full_name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = fullName.substring(0, 2).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="overflow-hidden p-0 sm:max-w-[450px]"
      >
        <DialogHeader className="border-border bg-muted/20 border-b px-6 py-4">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your profile and application preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 py-5">
          <FieldGroup>
            <div className="border-border bg-muted/20 mb-2 flex items-center gap-4 rounded-xl border p-4">
              <Avatar className="border-border h-16 w-16 shrink-0 rounded-lg border shadow-sm after:rounded-lg">
                {avatarUrl && (
                  <AvatarImage
                    src={avatarUrl}
                    alt={fullName}
                    className="rounded-lg"
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-sm leading-none font-medium">
                  Profile Picture
                </span>
                <span className="text-muted-foreground text-xs">
                  PNG, JPG or GIF up to 2MB
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 shrink-0 shadow-sm"
              >
                Change
              </Button>
            </div>

            {/* Inputs Section */}
            <Field>
              <FieldLabel htmlFor="profile-name">Full Name</FieldLabel>
              <InputGroup className="bg-background! h-9">
                <InputGroupInput id="profile-name" defaultValue={fullName} />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-email">Email Address</FieldLabel>
              <InputGroup className="bg-background! h-9">
                <InputGroupInput
                  id="profile-email"
                  defaultValue={email}
                  disabled
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel>Theme</FieldLabel>
              <div className="bg-muted mt-1 flex items-center gap-1 rounded-lg p-1 shadow-inner">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-md text-xs font-medium transition-all ${
                    theme === "light"
                      ? "bg-background text-foreground ring-border/50 shadow-sm ring-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <IconSun className="size-3.5" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-md text-xs font-medium transition-all ${
                    theme === "dark"
                      ? "bg-background text-foreground ring-border/50 shadow-sm ring-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <IconMoon className="size-3.5" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-md text-xs font-medium transition-all ${
                    theme === "system"
                      ? "bg-background text-foreground ring-border/50 shadow-sm ring-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  System
                </button>
              </div>
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="border-border bg-muted/20 m-0 items-center justify-between border-t px-6 py-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
