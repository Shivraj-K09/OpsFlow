import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getWorkspaces = cache(async () => {
  const supabase = await createClient();

  // RLS ensures the user only sees workspaces they are a member of
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }

  return workspaces;
});

export const getCurrentWorkspaceRole = cache(async (targetWorkspaceId?: string) => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const cookieStore = await cookies();
  const activeWorkspaceId = targetWorkspaceId || cookieStore.get("active_workspace")?.value;
  if (!activeWorkspaceId) return null;

  const { data: member } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", activeWorkspaceId)
    .eq("user_id", userData.user.id)
    .single();

  if (member) {
    if (member.role === "admin") return "ADMIN";
    if (member.role === "manager") return "MANAGER";
    return "USER";
  }
  return null;
});

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { error: "Unauthorized" };

  const name = formData.get("workspace_name") as string;
  const icon = (formData.get("workspace_icon") as string) || "hexagon";

  if (!name || name.trim() === "") {
    return { error: "Workspace name is required" };
  }

  // Fast duplicate check
  const { data: duplicate } = await supabase
    .from("workspaces")
    .select("id")
    .ilike("name", name)
    .limit(1);

  if (duplicate && duplicate.length > 0) {
    return { error: "You already have a workspace with this name." };
  }

  const { data, error } = await supabase.rpc("create_workspace", {
    workspace_name: name,
    workspace_icon: icon,
  });

  if (error) {
    console.error("Error creating workspace:", error);
    return { error: error.message };
  }

  // Set the newly created workspace as active
  if (data) {
    const cookieStore = await cookies();
    cookieStore.set("active_workspace", data);
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, workspaceId: data };
}

export async function setActiveWorkspace(workspaceId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { error: "Unauthorized" };

  // Verify user is a member of this workspace before setting it active
  const { data: member } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userData.user.id)
    .single();

  if (!member) return { error: "You are not a member of this workspace." };

  const cookieStore = await cookies();
  cookieStore.set("active_workspace", workspaceId);
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updateWorkspace(formData: FormData, workspaceId: string) {
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (role !== "ADMIN") {
    return { error: "Unauthorized: Only administrators can modify the workspace." };
  }

  const supabase = await createClient();
  const name = formData.get("workspace_name") as string;
  const icon = (formData.get("workspace_icon") as string) || "hexagon";

  if (!name || name.trim() === "") {
    return { error: "Workspace name is required" };
  }

  // Fast duplicate check
  const { data: duplicate } = await supabase
    .from("workspaces")
    .select("id")
    .ilike("name", name)
    .neq("id", workspaceId)
    .limit(1);

  if (duplicate && duplicate.length > 0) {
    return { error: "You already have a workspace with this name." };
  }

  const { error } = await supabase
    .from("workspaces")
    .update({ name, icon })
    .eq("id", workspaceId);

  if (error) {
    console.error("Error updating workspace:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function deleteWorkspace(workspaceId: string) {
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (role !== "ADMIN") {
    return { error: "Unauthorized: Only administrators can delete the workspace." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) {
    console.error("Error deleting workspace:", error);
    return { error: error.message };
  }

  // Remove active_workspace cookie or set to another workspace
  const cookieStore = await cookies();
  const activeWorkspace = cookieStore.get("active_workspace")?.value;

  if (activeWorkspace === workspaceId) {
    const remainingWorkspaces = await getWorkspaces();
    if (remainingWorkspaces.length > 0) {
      cookieStore.set("active_workspace", remainingWorkspaces[0].id);
    } else {
      cookieStore.delete("active_workspace");
    }
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function getDashboardMetrics(workspaceId: string) {
  const supabase = await createClient();
  const role = await getCurrentWorkspaceRole(workspaceId);

  if (!workspaceId || !role) {
    return {
      memberCount: 0,
      activeTaskCount: 0,
      completedTaskCount: 0,
      recentTasks: [],
      chartData: [],
    };
  }

  // Execute all 4 queries in parallel to avoid a massive 4-step waterfall
  const [
    { count: memberCount },
    { count: activeTaskCount },
    { data: recentTasks },
    { data: doneTasks }
  ] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .neq("status", "done"),
    supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("tasks")
      .select("created_at")
      .eq("workspace_id", workspaceId)
      .eq("status", "done")
  ]);

  const tasksList = doneTasks || [];
  const chartData = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthNames[d.getMonth()];

    const count = tasksList.filter((t) => {
      const taskDate = new Date(t.created_at);
      return (
        taskDate.getMonth() === d.getMonth() &&
        taskDate.getFullYear() === d.getFullYear()
      );
    }).length;

    chartData.push({ month: monthName, tasks: count });
  }

  return {
    memberCount: memberCount || 0,
    activeTaskCount: activeTaskCount || 0,
    completedTaskCount: tasksList.length,
    recentTasks: recentTasks || [],
    chartData,
  };
}

export async function getWorkspaceTasks(workspaceId: string) {
  const supabase = await createClient();
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (!workspaceId || !role) return [];

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return tasks || [];
}

export async function getWorkspaceMembers(workspaceId: string) {
  const supabase = await createClient();
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (!workspaceId || !role) return [];

  const { data: members } = await supabase
    .from("workspace_members")
    .select("user_id, role, created_at")
    .eq("workspace_id", workspaceId);

  if (!members || members.length === 0) return [];

  const userIds = members.map((m) => m.user_id);
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  if (pError) {
    console.error("Error fetching profiles:", pError);
  }

  const adminClient = createAdminClient();
  const userResponses = await Promise.all(
    userIds.map((id) => adminClient.auth.admin.getUserById(id))
  );

  const emailsMap = new Map<string, string>();
  userResponses.forEach((res) => {
    if (res.data.user) {
      emailsMap.set(res.data.user.id, res.data.user.email || "");
    }
  });

  const enrichedMembers = members.map((member) => {
    const profile = profiles?.find((p) => p.id === member.user_id);
    return {
      ...profile,
      id: member.user_id,
      role: member.role,
      joined_at: member.created_at,
      email: emailsMap.get(member.user_id) || "No email",
      full_name: profile?.full_name || "Unknown User",
    };
  });

  return enrichedMembers;
}

export async function updateMemberRole(userId: string, newRole: string, workspaceId: string) {
  if (!workspaceId) return { error: "Workspace ID is required" };

  const supabase = await createClient();
  const adminClient = createAdminClient();

  const role = await getCurrentWorkspaceRole(workspaceId);
  if (role !== "ADMIN") return { error: "Unauthorized" };

  const { data: userData } = await supabase.auth.getUser();
  if (userData?.user?.id === userId) {
    return { error: "You cannot change your own role." };
  }

  // Validate that the target newRole is a valid app_role
  const validRoles = ["admin", "manager", "member"];
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role specified." };
  }

  const { error } = await adminClient
    .from("workspace_members")
    .update({ role: newRole })
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function getActivityLogs(workspaceId: string, page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (!workspaceId || !role) return { logs: [], totalCount: 0 };

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Query activity logs
  const { data: logs, error, count } = await supabase
    .from("activity_logs")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return { logs: [], totalCount: 0 };
  }

  if (!logs || logs.length === 0) return { logs: [], totalCount: count || 0 };

  // Fetch the workspace name
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .single();

  const workspaceName = workspace?.name || "Workspace";

  // Get unique user IDs to fetch profiles
  const userIds = [...new Set(logs.filter(log => log.user_id).map(log => log.user_id))];
  
  let profiles: Record<string, unknown>[] = [];
  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", userIds);
    profiles = profilesData || [];
  }

  // Merge logs with profiles and workspace name
  const enrichedLogs = logs.map(log => {
    const profile = profiles.find(p => p.id === log.user_id);
    return {
      ...log,
      profile: profile || { full_name: "Unknown User", avatar_url: null },
      workspace_name: workspaceName
    };
  });

  return { logs: enrichedLogs, totalCount: count || 0 };
}

export async function createTask(formData: FormData, workspaceId: string) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const assignee_id = formData.get("assignee") as string;

  // We'll map project to a generic field or drop it since it's not in schema
  // We'll set default status to 'open'

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { error: "Not logged in" };

  // Explicitly verify membership for the target workspace
  const { data: member } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userData.user.id)
    .single();

  if (!member) {
    return { error: "Unauthorized: You do not have access to this workspace." };
  }

  const { error } = await supabase.from("tasks").insert({
    title,
    description: description || null,
    priority: priority || "medium",
    status: "open",
    workspace_id: workspaceId,
    creator_id: userData.user.id,
    assignee_id: assignee_id !== "none" ? assignee_id : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getWorkloadMetrics(workspaceId: string) {
  const supabase = await createClient();
  const role = await getCurrentWorkspaceRole(workspaceId);
  if (!workspaceId || !role) return null;

  // 1. Fetch members + profiles
  const { data: membersData } = await supabase
    .from("workspace_members")
    .select("user_id, role")
    .eq("workspace_id", workspaceId);

  const userIds = membersData?.map((m) => m.user_id) || [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  const members =
    membersData?.map((m) => {
      const profile = profiles?.find((p) => p.id === m.user_id);
      const fullName = profile?.full_name || "Unknown Member";
      return {
        id: m.user_id,
        name: fullName,
        role: m.role === "admin" ? "Workspace Admin" : "Member",
        initials: fullName.substring(0, 2).toUpperCase(),
        avatar_url: profile?.avatar_url,
      };
    }) || [];

  // 2. Fetch active tasks
  const { data: activeTasks } = await supabase
    .from("tasks")
    .select("id, assignee_id")
    .eq("workspace_id", workspaceId)
    .neq("status", "done");

  const tasksList = activeTasks || [];

  // 3. Calculate metrics
  let unassignedTasksCount = 0;
  let overallocatedCount = 0;
  let totalCapacityPercent = 0;

  const teamMembersWithStats = members.map((member) => {
    const assignedTasks = tasksList.filter((t) => t.assignee_id === member.id);
    const taskCount = assignedTasks.length;
    const capacity = Math.round((taskCount / 5) * 100); // 5 tasks = 100%

    if (capacity > 100) overallocatedCount++;
    totalCapacityPercent += Math.min(capacity, 100);

    // Generate consistent colors based on first letter
    const colors = [
      "bg-emerald-600",
      "bg-rose-500",
      "bg-blue-500",
      "bg-amber-500",
      "bg-purple-500",
      "bg-indigo-500",
    ];
    const charCode = member.name.charCodeAt(0) || 0;
    const color = colors[charCode % colors.length];

    return {
      ...member,
      tasks: taskCount,
      capacity,
      color,
    };
  });

  unassignedTasksCount = tasksList.filter((t) => !t.assignee_id).length;

  const avgTeamCapacity =
    teamMembersWithStats.length > 0
      ? Math.round(totalCapacityPercent / teamMembersWithStats.length)
      : 0;

  const activeTasksCount = tasksList.length;

  return {
    teamMembers: teamMembersWithStats.sort((a, b) => b.capacity - a.capacity), // Highest workload first
    teamCapacity: avgTeamCapacity,
    overallocatedCount,
    unassignedTasksCount,
    activeTasksCount,
  };
}

export async function acceptWorkspaceInvite(workspaceId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { error: "Not logged in" };

  // Check if already member
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userData.user.id)
    .single();

  if (!existing) {
    // Insert new member using Security Definer RPC to bypass RLS
    const { error: insertError } = await supabase.rpc("join_workspace", {
      p_workspace_id: workspaceId,
      p_user_id: userData.user.id,
      p_role: "member"
    });
      
    if (insertError) {
      console.error("Failed to join workspace:", insertError.message);
      return { error: insertError.message };
    }
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set("active_workspace", workspaceId, { path: "/" });
  
  return { success: true };
}

export async function getTaskComments(taskId: string) {
  const supabase = await createClient();
  const { data: comments, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error || !comments) return [];

  const userIds = Array.from(new Set(comments.map(c => c.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  return comments.map(c => {
    const profile = profiles?.find(p => p.id === c.user_id);
    const fullName = profile?.full_name || "Unknown Member";
    
    // Generate color
    const colors = ["bg-emerald-600", "bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-indigo-500"];
    const charCode = fullName.charCodeAt(0) || 0;
    
    return {
      ...c,
      author: fullName,
      initials: fullName.substring(0, 2).toUpperCase(),
      avatar_url: profile?.avatar_url,
      color: colors[charCode % colors.length]
    };
  });
}

export async function addTaskComment(taskId: string, text: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("task_comments")
    .insert({
      task_id: taskId,
      text: text,
      user_id: userData.user.id
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateTaskField(taskId: string, field: string, value: string | null) {
  // Prevent Mass Assignment Vulnerability
  const allowedFields = ["title", "description", "status", "priority", "assignee_id"];
  if (!allowedFields.includes(field)) {
    return { error: "Invalid task field provided." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { error: "Unauthorized" };

  // Fetch the task first to check ownership and workspace
  const { data: task } = await supabase
    .from("tasks")
    .select("workspace_id, assignee_id")
    .eq("id", taskId)
    .single();

  if (!task) return { error: "Task not found" };

  const role = await getCurrentWorkspaceRole(task.workspace_id);
  if (!role) return { error: "Unauthorized access to this workspace." };

  if (role === "USER") {
    // Standard users can only update status
    if (field !== "status") {
      return { error: "Unauthorized: You can only update the status of your tasks." };
    }
    // They must be the assignee
    if (task.assignee_id !== userData.user.id) {
      return { error: "Unauthorized: You can only update tasks assigned to you." };
    }
  }

  // If the value is 'none' for assignee, convert it to null
  const finalValue = (field === 'assignee_id' && value === 'none') ? null : value;
  
  const { error } = await supabase
    .from("tasks")
    .update({ [field]: finalValue })
    .eq("id", taskId);

  if (error) return { error: error.message };
  
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/workload");
  return { success: true };
}
