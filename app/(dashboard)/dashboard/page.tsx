import { cookies } from "next/headers";
import {
  getDashboardMetrics,
  getCurrentWorkspaceRole,
} from "@/lib/services/db";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your workspace operations",
};

export default async function DashboardPage() {
  const role = await getCurrentWorkspaceRole();
  if (role === "USER") {
    redirect("/dashboard/tasks");
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  if (!activeWorkspaceId) {
    return <div className="p-6">No workspace selected.</div>;
  }

  const queryClient = getQueryClient();

  // Pre-fetch queries on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.metrics(activeWorkspaceId),
    queryFn: () => getDashboardMetrics(activeWorkspaceId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient workspaceId={activeWorkspaceId} />
    </HydrationBoundary>
  );
}
