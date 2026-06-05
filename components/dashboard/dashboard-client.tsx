"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconChartBar,
  IconClipboardList,
  IconFolder,
  IconUsers,
} from "@tabler/icons-react";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { useDashboardMetrics } from "@/lib/queries";

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
          <CardContent className="flex flex-1 flex-col overflow-hidden border-t p-0">
            <ScrollArea className="relative h-[320px] w-full **:data-[slot=scroll-area-scrollbar]:hidden">
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
                  {recentTasks.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground h-24 text-center"
                      >
                        No tasks found in this workspace. Create one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTasks.map((task: Task) => (
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
            </ScrollArea>
            <div className="bg-muted/10 sticky bottom-0 z-10 flex h-12 items-center justify-start border-t px-4">
              <div className="text-muted-foreground text-xs">
                Showing {Math.min(recentTasks.length, 8)} recent tasks
              </div>
            </div>
          </CardContent>
        </Card>
        <OverviewChart chartData={chartData} />
      </div>
    </div>
  );
}
