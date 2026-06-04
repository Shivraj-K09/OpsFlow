"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { 
  IconSun, 
  IconMoon 
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your profile and application preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 py-5">
          <FieldGroup>
            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20 mb-2">
              <Avatar className="h-16 w-16 shrink-0 border border-border shadow-sm">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground font-semibold">SH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-sm font-medium leading-none">Profile Picture</span>
                <span className="text-xs text-muted-foreground">PNG, JPG or GIF up to 2MB</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 shadow-sm shrink-0">Change</Button>
            </div>

            {/* Inputs Section */}
            <Field>
              <FieldLabel htmlFor="profile-name">Full Name</FieldLabel>
              <InputGroup className="h-9 !bg-background">
                <InputGroupInput 
                  id="profile-name"
                  defaultValue="Shivraj" 
                />
              </InputGroup>
            </Field>
            
            <Field>
              <FieldLabel htmlFor="profile-email">Email Address</FieldLabel>
              <InputGroup className="h-9 !bg-background">
                <InputGroupInput 
                  id="profile-email"
                  defaultValue="shivraj@example.com" 
                />
              </InputGroup>
            </Field>
            
            {/* Theme Section */}
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <div className="bg-muted p-1 rounded-lg flex items-center gap-1 mt-1 shadow-inner">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-2 h-8 rounded-md text-xs font-medium transition-all ${
                    theme === 'light' 
                      ? 'bg-background shadow-sm text-foreground ring-1 ring-border/50' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <IconSun className="size-3.5" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-2 h-8 rounded-md text-xs font-medium transition-all ${
                    theme === 'dark' 
                      ? 'bg-background shadow-sm text-foreground ring-1 ring-border/50' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <IconMoon className="size-3.5" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex-1 flex items-center justify-center gap-2 h-8 rounded-md text-xs font-medium transition-all ${
                    theme === 'system' 
                      ? 'bg-background shadow-sm text-foreground ring-1 ring-border/50' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  System
                </button>
              </div>
            </Field>
          </FieldGroup>
        </div>
        
        <DialogFooter className="m-0 px-6 py-5 border-t border-border bg-muted/20 items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
