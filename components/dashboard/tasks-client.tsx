"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, Member } from "@/lib/types";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconFolder,
  IconAlertCircle,
  IconArrowUp,
  IconArrowRight,
  IconArrowDown,
  IconCircleDashed,
  IconCircleDot,
  IconCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { CreateTaskDialog } from "./create-task-dialog";
import { TaskDetailsSheet } from "./task-details-sheet";
import { useTasks, useWorkspaceMembers } from "@/lib/queries";

function getPriorityBadge(priority: string) {
  switch (priority.toLowerCase()) {
    case "urgent":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-red-500/20 bg-red-500/10 text-[11px] font-medium text-red-500"
        >
          <IconAlertCircle className="size-3" />
          Urgent
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-orange-500/20 bg-orange-500/10 text-[11px] font-medium text-orange-500"
        >
          <IconArrowUp className="size-3" />
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-blue-500/20 bg-blue-500/10 text-[11px] font-medium text-blue-500"
        >
          <IconArrowRight className="size-3" />
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground bg-muted/50 border-border/50 flex w-fit items-center gap-1 text-[11px] font-medium"
        >
          <IconArrowDown className="size-3" />
          Low
        </Badge>
      );
    default:
      return null;
  }
}

function getStatusBadge(status: string) {
  switch (status.toLowerCase().replace(" ", "-")) {
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-blue-500/20 bg-blue-500/10 text-[11px] font-medium text-blue-500"
        >
          <IconCircleDot className="size-3" />
          In Progress
        </Badge>
      );
    case "review":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-purple-500/20 bg-purple-500/10 text-[11px] font-medium text-purple-500"
        >
          <IconCircle className="size-3" />
          Review
        </Badge>
      );
    case "open":
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground bg-muted/50 border-border/50 flex w-fit items-center gap-1 text-[11px] font-medium"
        >
          <IconCircleDashed className="size-3" />
          Open
        </Badge>
      );
    case "done":
      return (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1 border-emerald-500/20 bg-emerald-500/10 text-[11px] font-medium text-emerald-500"
        >
          <IconCircleCheck className="size-3" />
          Done
        </Badge>
      );
    default:
      return null;
  }
}

interface TasksClientProps {
  workspaceId: string;
  userRole: string;
  currentUserId: string;
}

export function TasksClient({
  workspaceId,
  userRole,
  currentUserId,
}: TasksClientProps) {
  const { data: tasks = [] } = useTasks(workspaceId);
  const { data: members = [] } = useWorkspaceMembers(workspaceId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const getMemberName = (id?: string) => {
    if (!id) return "Unassigned";
    const member = members.find((m: Member) => m.id === id);
    return member ? member.full_name || member.email : "Unassigned";
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const taskStatus = task.status.toLowerCase().replace(" ", "-");
    const matchesStatus = statusFilter === "all" || taskStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = filteredTasks.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const paginatedTasks = filteredTasks.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex w-full flex-col p-6">
      <div className="bg-background flex flex-col overflow-hidden rounded-md border">
        <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <InputGroup className="h-9">
                <InputGroupInput
                  placeholder="Search tasks..."
                  className="pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole !== "USER" && (
              <Button className="h-9" onClick={() => setIsCreateOpen(true)}>
                <IconPlus className="mr-2 size-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground h-11 pl-6 font-normal">
                  Title
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Priority
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Assignee
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Created At
                </TableHead>
                <TableHead className="text-muted-foreground h-11 w-[50px] pr-6 font-normal"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-72 align-middle">
                    <div className="flex w-full items-center justify-center">
                      <Empty className="mx-auto flex flex-col items-center justify-center rounded-none border-0 bg-transparent">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconFolder className="size-5" />
                          </EmptyMedia>
                          <EmptyTitle>No tasks found</EmptyTitle>
                          <EmptyDescription>
                            {searchQuery || statusFilter !== "all" 
                              ? "Try adjusting your filters"
                              : "Create one to get started!"}
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTasks.map((task: Task) => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-muted/50 group cursor-pointer transition-colors"
                    onClick={() => setSelectedTask(task)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                          {task.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell className="text-sm">
                      {getMemberName(task.assignee_id)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(task.created_at), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <IconDotsVertical className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-muted/10 shrink-0 flex flex-col sm:flex-row items-center justify-between border-t p-4 gap-4">
          <div className="text-muted-foreground text-xs">
            Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1}-{Math.min(page * limit, totalCount)} of {totalCount} tasks
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
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
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        members={members}
        workspaceId={workspaceId}
      />
      <TaskDetailsSheet
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        task={selectedTask}
        members={members}
        workspaceId={workspaceId}
        userRole={userRole}
        currentUserId={currentUserId}
      />
    </div>
  );
}
