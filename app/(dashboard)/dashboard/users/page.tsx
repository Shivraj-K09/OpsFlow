import {
  getCurrentWorkspaceRole,
  getWorkspaceMembers,
} from "@/lib/services/db";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "@/components/dashboard/users-client";

export const metadata: Metadata = {
  title: "Users & Teams",
  description: "Manage your workspace members and roles",
};

export default async function UsersPage() {
  const role = await getCurrentWorkspaceRole();
  // Only ADMINs can manage workspace members
  if (role !== "ADMIN") {
    redirect("/dashboard/tasks");
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id || "";

  const queryClient = getQueryClient();

  // Pre-fetch queries on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users(activeWorkspaceId || ""),
    queryFn: () => getWorkspaceMembers(activeWorkspaceId || ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient
        workspaceId={activeWorkspaceId || ""}
        role={role || "USER"}
        currentUserId={currentUserId}
      />
    </HydrationBoundary>
  );
}
