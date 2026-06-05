"use client";

import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { SidebarWorkspaceSwitcher } from "@/components/sidebar-workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_ROUTES } from "@/constants/dashboard";
import Link from "next/link";
import { Workspace } from "@/lib/types";
import { type User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

export function AppSidebar({
  workspaces = [],
  activeWorkspaceId,
  user,
  userRole = "USER",
}: { workspaces: Workspace[], activeWorkspaceId?: string, user: User | null, userRole?: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Pre-compute visible routes at the top as requested
  const visibleRoutes = SIDEBAR_ROUTES.map((routeGroup) => ({
    ...routeGroup,
    items: routeGroup.items.filter((item) =>
      item.allowedRoles.includes(userRole),
    ),
  })).filter((routeGroup) => routeGroup.items.length > 0);

  const activeWorkspace = workspaces.find((w: Workspace) => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <Sidebar variant="sidebar">
      <SidebarWorkspaceSwitcher
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        userRole={userRole}
      />

      <SidebarContent className="gap-2">
        {visibleRoutes.map((routeGroup) => (
          <SidebarGroup key={routeGroup.group}>
            <SidebarGroupLabel>{routeGroup.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {routeGroup.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.path}
                        className="cursor-pointer"
                      >
                        <Link href={item.path} onClick={() => setOpenMobile(false)}>
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
        ))}
      </SidebarContent>

      <SidebarUserNav user={user} activeWorkspace={activeWorkspace} />
    </Sidebar>
  );
}
