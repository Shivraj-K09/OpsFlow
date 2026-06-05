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
              className="shadow-sm border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="flex flex-col shadow-sm border-border p-0 gap-0">
          <CardHeader className="py-2.5 px-4">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden border-t">
            <ScrollArea className="h-[320px] w-full relative **:data-[slot=scroll-area-scrollbar]:hidden">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 z-20 bg-background/95 backdrop-blur-sm shadow-sm">
                    <TableHead className="font-normal text-muted-foreground h-11 pl-6">
                      Task
                    </TableHead>
                    <TableHead className="font-normal text-muted-foreground h-11">
                      Status
                    </TableHead>
                    <TableHead className="font-normal text-muted-foreground h-11 text-right pr-6">
                      Priority
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTasks.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No tasks found in this workspace. Create one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTasks.map((task: Task) => (
                      <TableRow
                        key={task.id}
                        className="hover:bg-transparent border-border/50"
                      >
                        <TableCell className="pl-6 font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "done" ? "outline" : "default"
                            }
                            className="font-normal px-2 py-0 h-5"
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 text-muted-foreground capitalize">
                          {task.priority}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </table>
            </ScrollArea>
            <div className="h-12 px-4 flex items-center justify-start bg-muted/10 sticky bottom-0 z-10 border-t">
              <div className="text-xs text-muted-foreground">
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
