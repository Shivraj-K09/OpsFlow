"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkloadMetrics } from "@/lib/queries";
import { Member } from "@/lib/types";
import { cn } from "@/lib/utils";

type TeamMember = Member & {
  tasks: number;
  capacity: number;
  trend: string;
  highPriority: number;
};

interface WorkloadClientProps {
  workspaceId: string;
}

export function WorkloadClient({ workspaceId }: WorkloadClientProps) {
  const { data: metrics } = useWorkloadMetrics(workspaceId);

  if (!metrics) {
    return <div className="p-6">Failed to load workload metrics.</div>;
  }

  const {
    teamMembers = [],
    teamCapacity = 0,
    overallocatedCount = 0,
    unassignedTasksCount = 0,
    activeTasksCount = 0,
  } = metrics;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Team Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamCapacity}%</div>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Average utilization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overallocated Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-3xl font-bold",
                overallocatedCount > 0 ? "text-destructive" : "",
              )}
            >
              {overallocatedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Members with &gt;5 active tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTasksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unassigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unassignedTasksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks in the backlog
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-normal text-muted-foreground h-11">
                Team Member
              </TableHead>
              <TableHead className="font-normal text-muted-foreground h-11">
                Role
              </TableHead>
              <TableHead className="font-normal text-muted-foreground w-[30%] h-11">
                Capacity
              </TableHead>
              <TableHead className="font-normal text-muted-foreground text-right h-11">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No members found in this workspace.
                </TableCell>
              </TableRow>
            ) : (
              teamMembers.map((member: TeamMember) => (
                <TableRow key={member.id} className="hover:bg-muted/30">
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        {member.avatar_url && (
                          <AvatarImage
                            src={member.avatar_url}
                            alt={member.full_name || member.email || ""}
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <AvatarFallback
                          className={`text-white text-[10px] ${member.color}`}
                        >
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm text-foreground">
                        {member.full_name || member.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="p-4 text-sm text-muted-foreground">
                    {member.role}
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{member.tasks} tasks</span>
                        <span>{member.capacity}%</span>
                      </div>
                      <Progress
                        value={member.capacity > 100 ? 100 : member.capacity}
                        className="h-1.5"
                        indicatorClassName={
                          member.capacity > 100
                            ? "bg-rose-500"
                            : member.capacity > 85
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }
                      />
                    </div>
                  </TableCell>

                  <TableCell className="p-4 text-right">
                    {member.capacity > 100 ? (
                      <Badge
                        variant="outline"
                        className="font-medium text-[10px] text-rose-500 border-rose-500/20 bg-rose-500/10 h-6"
                      >
                        Overloaded
                      </Badge>
                    ) : member.capacity >= 80 ? (
                      <Badge
                        variant="outline"
                        className="font-medium text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/10 h-6"
                      >
                        Near Capacity
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="font-medium text-[10px] text-emerald-500 border-emerald-500/20 bg-emerald-500/10 h-6"
                      >
                        Available
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{teamMembers.length} of {teamMembers.length} members
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8 text-xs" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
