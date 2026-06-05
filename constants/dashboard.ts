import {
  IconChartBar,
  IconClipboardList,
  IconHistory,
  IconLayoutDashboard,
  IconUsersGroup,
} from "@tabler/icons-react";
import React from "react";

export type Role = "ADMIN" | "MANAGER" | "USER";

export const SIDEBAR_ROUTES = [
  {
    group: "Overview",
    items: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: IconLayoutDashboard,
        allowedRoles: ["ADMIN", "MANAGER"],
      },
      {
        path: "/dashboard/workload",
        label: "Workload Balancer",
        icon: IconChartBar,
        allowedRoles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        path: "/dashboard/tasks",
        label: "Tasks",
        icon: IconClipboardList,
        allowedRoles: ["ADMIN", "MANAGER", "USER"],
      },
      {
        path: "/dashboard/activity",
        label: "Activity Logs",
        icon: IconHistory,
        allowedRoles: ["ADMIN", "MANAGER", "USER"],
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        path: "/dashboard/users",
        label: "Users & Team",
        icon: IconUsersGroup,
        allowedRoles: ["ADMIN"],
      },
    ],
  },
];

export const BREADCRUMBS = SIDEBAR_ROUTES.reduce(
  (acc, group) => {
    group.items.forEach((item) => {
      acc[item.path] = {
        group: group.group,
        label: item.label,
        icon: item.icon,
      };
    });
    return acc;
  },
  {} as Record<
    string,
    { group: string; label: string; icon: React.ElementType }
  >,
);
