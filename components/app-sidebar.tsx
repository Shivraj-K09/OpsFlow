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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

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
  IconBadge,
  IconCreditCard,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingsDialog } from "@/components/settings-dialog";

function PopoverItem({ className, onSelect, onClick, children, ...props }: any) {
  return (
    <div
      role="menuitem"
      onClick={(e) => {
        if (onSelect) onSelect(e);
        if (onClick) onClick(e);
      }}
      className={cn(
        "group/popover-item relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PopoverSeparator({ className, ...props }: any) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

function PopoverLabel({ className, children, ...props }: any) {
  return (
    <div className={cn("px-1.5 py-1 text-xs font-medium text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

function PopoverShortcut({ className, children, ...props }: any) {
  return (
    <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground group-hover/popover-item:text-accent-foreground", className)} {...props}>
      {children}
    </span>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
            <Popover open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
              <PopoverTrigger asChild>
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
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] min-w-56 p-0 block overflow-hidden rounded-lg"
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
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconHexagonFilled className="text-primary size-4" />
                      OpsFlow
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconUser className="text-muted-foreground size-4" />
                      Personal
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconBriefcase className="text-muted-foreground size-4" />
                      Project Alpha
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconFolder className="text-muted-foreground size-4" />
                      Project Beta
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconCode className="text-muted-foreground size-4" />
                      Engineering Team
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconPalette className="text-muted-foreground size-4" />
                      Design Studio
                    </PopoverItem>
                    <PopoverItem onClick={() => setIsWorkspaceOpen(false)}>
                      <IconBook className="text-muted-foreground size-4" />
                      Documentation
                    </PopoverItem>
                  </ScrollArea>
                </div>
                <PopoverSeparator className="m-0" />
                <div className="p-1">
                  <PopoverItem
                    onClick={() => {
                      setIsCreateWorkspaceOpen(true);
                      setIsWorkspaceOpen(false);
                    }}
                  >
                    <IconPlus className="text-muted-foreground" />
                    Create workspace
                    <PopoverShortcut>
                      <Kbd>C</Kbd>
                    </PopoverShortcut>
                  </PopoverItem>
                </div>
              </PopoverContent>
            </Popover>
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
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
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
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] min-w-56 p-1.5 block rounded-lg"
                side="top"
                align="start"
                sideOffset={8}
              >
                <PopoverLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-emerald-600 text-white">SH</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Shivraj</span>
                      <span className="truncate text-xs">shivraj@example.com</span>
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
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${currentHost}/invite/x8j92k`);
                    toast.success("Invite link copied to clipboard!");
                    setIsProfileOpen(false);
                  }}
                >
                  <IconLink className="text-muted-foreground" />
                  Copy invite link
                </PopoverItem>

                {mounted && (
                  <PopoverItem
                    onClick={(e: any) => {
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
                <PopoverItem onClick={() => setIsProfileOpen(false)}>
                  <IconLogout className="text-muted-foreground" />
                  Log out
                </PopoverItem>
              </PopoverContent>
            </Popover>
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
