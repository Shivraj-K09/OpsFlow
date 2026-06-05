"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  IconLogout,
  IconSettings,
  IconLink,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Workspace } from "@/lib/types";
import { type User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SettingsDialog } from "@/components/settings-dialog";
import {
  PopoverItem,
  PopoverSeparator,
  PopoverLabel,
} from "@/components/ui/popover-menu";

export function SidebarUserNav({
  user,
  activeWorkspace,
}: {
  user: User | null;
  activeWorkspace: Workspace;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  const fullName = user?.user_metadata?.full_name || "User";
  const userInitials = fullName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url;

  useEffect(() => {
    setMounted(true); /* eslint-disable-line react-hooks/set-state-in-effect */
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer">
                  <Avatar className="h-6 w-6 rounded-lg after:rounded-lg">
                    {avatarUrl && (
                      <AvatarImage
                        src={avatarUrl}
                        alt={fullName}
                        className="rounded-lg"
                      />
                    )}
                    <AvatarFallback className="rounded-lg! bg-emerald-600 text-[10px] font-semibold text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.user_metadata?.full_name || user?.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="block w-[--radix-popover-trigger-width] min-w-56 rounded-lg p-1.5"
                side="top"
                align="start"
                sideOffset={8}
              >
                <PopoverLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg after:rounded-lg">
                      {avatarUrl && (
                        <AvatarImage
                          src={avatarUrl}
                          alt={fullName}
                          className="rounded-lg"
                        />
                      )}
                      <AvatarFallback className="rounded-lg bg-emerald-600 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.user_metadata?.full_name || "User"}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </PopoverLabel>
                <PopoverSeparator />
                <PopoverItem
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                >
                  <IconSettings className="text-muted-foreground" />
                  Settings
                </PopoverItem>
                <PopoverItem
                  data-disabled={!activeWorkspace ? true : undefined}
                  onClick={() => {
                    if (!activeWorkspace) return;
                    navigator.clipboard.writeText(
                      `${currentOrigin}/invite/${activeWorkspace.id.slice(0, 8)}`,
                    );
                    toast.success(
                      `Invite link for ${activeWorkspace.name} copied!`,
                    );
                    setIsProfileOpen(false);
                  }}
                >
                  <IconLink className="text-muted-foreground" />
                  Copy invite link
                </PopoverItem>

                {mounted && (
                  <PopoverItem
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  >
                    {theme === "dark" ? (
                      <IconSun className="text-muted-foreground" />
                    ) : (
                      <IconMoon className="text-muted-foreground" />
                    )}
                    Toggle theme
                  </PopoverItem>
                )}
                <PopoverSeparator />
                <PopoverItem onClick={handleLogout}>
                  <IconLogout className="text-muted-foreground" />
                  Log out
                </PopoverItem>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        user={user}
      />
    </>
  );
}
