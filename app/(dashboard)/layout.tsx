import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { getWorkspaces } from "@/lib/services/db";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeWorkspaceIdRaw = cookieStore.get("active_workspace")?.value;
  const supabase = await createClient();

  const [workspaces, { data: { user } }] = await Promise.all([
    getWorkspaces(),
    supabase.auth.getUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  let activeWorkspaceId = activeWorkspaceIdRaw;
  // If no active workspace is set, but the user has workspaces, set the first one
  if (!activeWorkspaceId && workspaces.length > 0) {
    activeWorkspaceId = workspaces[0].id;
  }

  // Fetch user role for the active workspace
  let userRole = "USER";
  if (activeWorkspaceId) {
    const { data: member } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", activeWorkspaceId)
      .eq("user_id", user.id)
      .single();
      
    if (member) {
      if (member.role === "owner" || member.role === "admin") userRole = "ADMIN";
      else if (member.role === "manager") userRole = "MANAGER";
      else userRole = "USER";
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        user={user}
        userRole={userRole}
      />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-h-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
