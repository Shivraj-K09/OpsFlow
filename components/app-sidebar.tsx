"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_ROUTES, CURRENT_USER_ROLE } from "@/constants/dashboard";
import { WORKSPACE_ICONS } from "@/constants/workspace-icon";
import {
  IconBook,
  IconBriefcase,
  IconChartBar,
  IconClipboardList,
  IconCode,
  IconFolder,
  IconHexagonFilled,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconMoon,
  IconPalette,
  IconPlus,
  IconSearch,
  IconSelector,
  IconSettings,
  IconShieldLock,
  IconSun,
  IconUser,
  IconUsers,
  IconLink,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingsDialog } from "@/components/settings-dialog";

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState("hexagon");
  const [currentHost, setCurrentHost] = useState("opsflow.com");

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.host);
      setIsMac(
        navigator.platform.toLowerCase().includes("mac") ||
          navigator.userAgent.toLowerCase().includes("mac"),
      );
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (
        e.key.toLowerCase() === "c" &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setIsCreateWorkspaceOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const SelectedIcon =
    WORKSPACE_ICONS.find((i) => i.id === selectedIconId)?.icon ||
    IconHexagonFilled;

  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="flex h-12 justify-center px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer">
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarFallback className="rounded-md bg-emerald-600 text-white text-[10px] font-semibold">
                      OP
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">OpsFlow</span>
                  </div>
                  <IconSelector className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 overflow-hidden p-0 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={8}
              >
                <div className="relative border-b border-border">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workspace..."
                    className="pl-9 h-10 text-sm rounded-none border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="p-1">
                  <ScrollArea className="h-[140px]">
                    <DropdownMenuItem>
                      <IconHexagonFilled className="text-primary size-4" />
                      OpsFlow
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconUser className="text-muted-foreground size-4" />
                      Personal
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconBriefcase className="text-muted-foreground size-4" />
                      Project Alpha
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconFolder className="text-muted-foreground size-4" />
                      Project Beta
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconCode className="text-muted-foreground size-4" />
                      Engineering Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPalette className="text-muted-foreground size-4" />
                      Design Studio
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconBook className="text-muted-foreground size-4" />
                      Documentation
                    </DropdownMenuItem>
                  </ScrollArea>
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-1">
                  <DropdownMenuItem
                    onSelect={() => setIsCreateWorkspaceOpen(true)}
                  >
                    <IconPlus className="text-muted-foreground" />
                    Create workspace
                    <DropdownMenuShortcut>
                      <Kbd>C</Kbd>
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        {SIDEBAR_ROUTES.map((routeGroup) => {
          const visibleItems = routeGroup.items.filter((item) =>
            item.allowedRoles.includes(CURRENT_USER_ROLE)
          );

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={routeGroup.group}>
              <SidebarGroupLabel>{routeGroup.group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {visibleItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.path}
                          className="cursor-pointer"
                        >
                          <Link href={item.path}>
                            <IconComponent />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer">
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarFallback className="rounded-md bg-emerald-600 text-white text-[10px] font-semibold">
                      SH
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Shivraj</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                    <IconSettings className="text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => {
                      navigator.clipboard.writeText(`https://${currentHost}/invite/x8j92k`);
                      toast.success("Invite link copied to clipboard!");
                    }}
                  >
                    <IconLink className="text-muted-foreground" />
                    Copy invite link
                  </DropdownMenuItem>

                  {mounted && (
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <IconSun className="text-muted-foreground" />
                      ) : (
                        <IconMoon className="text-muted-foreground" />
                      )}
                      Toggle theme
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconLogout className="text-muted-foreground" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
      >
        <DialogContent className="max-w-[450px]! p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
            <DialogTitle>Create new workspace</DialogTitle>
            <DialogDescription>
              Workspaces are shared environments for team collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                <InputGroup className="h-9 !bg-background">
                  <InputGroupAddon>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-[calc(var(--radius)-3px)]"
                        >
                          <SelectedIcon className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-2" align="start">
                        <div className="grid grid-cols-7 gap-1">
                          {WORKSPACE_ICONS.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <Button
                                key={item.id}
                                variant={
                                  selectedIconId === item.id
                                    ? "secondary"
                                    : "ghost"
                                }
                                size="icon"
                                className="size-8"
                                onClick={() => setSelectedIconId(item.id)}
                              >
                                <IconComponent className="size-4" />
                              </Button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="workspace-name"
                    placeholder="Acme Inc."
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="workspace-url">Workspace URL</FieldLabel>
                <InputGroup className="h-9 !bg-background">
                  <InputGroupAddon>
                    <InputGroupText>{currentHost}/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput id="workspace-url" placeholder="acme" />
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter className="m-0 px-6 py-5 border-t border-border bg-muted/20 items-center">
            <Button
              variant="outline"
              onClick={() => setIsCreateWorkspaceOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsCreateWorkspaceOpen(false)}>
              Create workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </Sidebar>
  );
}
