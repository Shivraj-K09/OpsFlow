"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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

  const [page, setPage] = useState(1);
  const limit = 10;

  if (!metrics) {
    return <div className="p-6">Failed to load workload metrics.</div>;
  }

  const {
    teamMembers = [],
    teamCapacity = 0,
    overallocatedCount = 0,
    unassignedTasksCount = 0,
  } = metrics;
  const activeTasksCount = metrics.activeTasksCount || 0;

  const totalCount = teamMembers.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedMembers = teamMembers.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary-foreground/80 text-sm font-medium">
              Team Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamCapacity}%</div>
            <p className="text-primary-foreground/80 mt-1 text-xs">
              Average utilization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
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
            <p className="text-muted-foreground mt-1 text-xs">
              Members with &gt;5 active tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTasksCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Unassigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unassignedTasksCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Tasks in the backlog
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-background flex flex-col overflow-hidden rounded-md border">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Team Member
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Role
                </TableHead>
                <TableHead className="text-muted-foreground h-11 w-[30%] font-normal">
                  Capacity
                </TableHead>
                <TableHead className="text-muted-foreground h-11 text-right font-normal">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No members found in this workspace.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMembers.map((member: TeamMember) => (
                  <TableRow key={member.id} className="hover:bg-muted/30">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-border h-8 w-8 border">
                          {member.avatar_url && (
                            <AvatarImage
                              src={member.avatar_url}
                              alt={member.name || member.full_name || member.email || ""}
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <AvatarFallback
                            className={`text-[10px] text-white ${member.color}`}
                          >
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground text-sm font-medium">
                          {member.name || member.full_name || member.email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground p-4 text-sm">
                      {member.role}
                    </TableCell>

                    <TableCell className="p-4">
                      <div className="flex w-full flex-col gap-1.5">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
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
                          className="h-6 border-rose-500/20 bg-rose-500/10 text-[10px] font-medium text-rose-500"
                        >
                          Overloaded
                        </Badge>
                      ) : member.capacity >= 80 ? (
                        <Badge
                          variant="outline"
                          className="h-6 border-amber-500/20 bg-amber-500/10 text-[10px] font-medium text-amber-500"
                        >
                          Near Capacity
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="h-6 border-emerald-500/20 bg-emerald-500/10 text-[10px] font-medium text-emerald-500"
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
        </div>
        <div className="bg-muted/10 flex shrink-0 flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
          <div className="text-muted-foreground text-xs">
            Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1}-
            {Math.min(page * limit, totalCount)} of {totalCount} members
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
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
