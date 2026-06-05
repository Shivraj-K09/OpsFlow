"use client";

import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardMetrics } from "@/lib/queries";
import { Task } from "@/lib/types";
import {
  IconChartBar,
  IconClipboardList,
  IconFolder,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";

interface DashboardClientProps {
  workspaceId: string;
}

export function DashboardClient({ workspaceId }: DashboardClientProps) {
  const { data: metrics } = useDashboardMetrics(workspaceId);

  if (!metrics) {
    return <div className="p-6">Failed to load metrics.</div>;
  }

  const {
    memberCount = 0,
    activeTaskCount = 0,
    completedTaskCount = 0,
    recentTasks = [],
    chartData = [],
  } = metrics;

  const [page, setPage] = useState(1);
  const limit = 5;
  const totalCount = recentTasks.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedTasks = recentTasks.slice((page - 1) * limit, page * limit);

  const totalTasks = activeTaskCount + completedTaskCount;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Total Members",
      value: memberCount,
      description: "Active in workspace",
      icon: IconUsers,
    },
    {
      title: "Active Tasks",
      value: activeTaskCount,
      description: "Needs your attention",
      icon: IconClipboardList,
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Of all created tasks",
      icon: IconChartBar,
    },
    {
      title: "Completed Tasks",
      value: completedTaskCount,
      description: "Done and dusted",
      icon: IconFolder,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="border-border hover:border-primary/50 shadow-sm transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="border-border flex flex-col gap-0 p-0 shadow-sm">
          <CardHeader className="px-4 py-2.5">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col overflow-hidden border-t p-0">
            <div className="overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow className="bg-background/95 sticky top-0 z-20 shadow-sm backdrop-blur-sm hover:bg-transparent">
                    <TableHead className="text-muted-foreground h-11 pl-6 font-normal">
                      Task
                    </TableHead>
                    <TableHead className="text-muted-foreground h-11 font-normal">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground h-11 pr-6 text-right font-normal">
                      Priority
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTasks.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground h-24 text-center"
                      >
                        No tasks found in this workspace. Create one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTasks.map((task: Task) => (
                      <TableRow
                        key={task.id}
                        className="border-border/50 hover:bg-transparent"
                      >
                        <TableCell className="pl-6 font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "done" ? "outline" : "default"
                            }
                            className="h-5 px-2 py-0 font-normal"
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground pr-6 text-right capitalize">
                          {task.priority}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </table>
            </div>
            <div className="bg-muted/10 flex shrink-0 flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
              <div className="text-muted-foreground text-xs">
                Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1}-
                {Math.min(page * limit, totalCount)} of {totalCount} tasks
              </div>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <div className="flex h-8 w-8 items-center justify-center text-xs font-medium">
                      {page}
                    </div>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
        <OverviewChart chartData={chartData} />
      </div>
    </div>
  );
}
