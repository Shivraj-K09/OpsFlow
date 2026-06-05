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
  IconCircleCheck
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
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
        <Badge variant="outline" className="font-medium text-[11px] text-red-500 bg-red-500/10 border-red-500/20 flex items-center gap-1 w-fit">
          <IconAlertCircle className="size-3" />
          Urgent
        </Badge>
      );
    case "high":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-orange-500 bg-orange-500/10 border-orange-500/20 flex items-center gap-1 w-fit">
          <IconArrowUp className="size-3" />
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-blue-500 bg-blue-500/10 border-blue-500/20 flex items-center gap-1 w-fit">
          <IconArrowRight className="size-3" />
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-muted-foreground bg-muted/50 border-border/50 flex items-center gap-1 w-fit">
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
        <Badge variant="outline" className="font-medium text-[11px] text-blue-500 bg-blue-500/10 border-blue-500/20 flex items-center gap-1 w-fit">
          <IconCircleDot className="size-3" />
          In Progress
        </Badge>
      );
    case "review":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-purple-500 bg-purple-500/10 border-purple-500/20 flex items-center gap-1 w-fit">
          <IconCircle className="size-3" />
          Review
        </Badge>
      );
    case "open":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-muted-foreground bg-muted/50 border-border/50 flex items-center gap-1 w-fit">
          <IconCircleDashed className="size-3" />
          Open
        </Badge>
      );
    case "done":
      return (
        <Badge variant="outline" className="font-medium text-[11px] text-emerald-500 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1 w-fit">
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

  const getMemberName = (id?: string) => {
    if (!id) return "Unassigned";
    const member = members.find((m: Member) => m.id === id);
    return member ? member.full_name || member.email : "Unassigned";
  }

  return (
    <div className="flex flex-col p-6 h-full w-full">
      <div className="flex-1 flex flex-col rounded-md border bg-background overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4" />
              <InputGroup className="h-9">
                <InputGroupInput
                  placeholder="Search tasks..."
                  className="pl-9 text-sm"
                />
              </InputGroup>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole !== "USER" && (
              <Button className="h-9" onClick={() => setIsCreateOpen(true)}>
                <IconPlus className="size-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-normal text-muted-foreground h-11 pl-6">
                  Title
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Status
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Priority
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Assignee
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Created At
                </TableHead>
                <TableHead className="w-[50px] font-normal text-muted-foreground h-11 pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-72 align-middle">
                    <div className="flex w-full items-center justify-center">
                      <Empty className="rounded-none border-0 bg-transparent flex flex-col items-center justify-center mx-auto">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconFolder className="size-5" />
                          </EmptyMedia>
                          <EmptyTitle>No tasks found</EmptyTitle>
                          <EmptyDescription>
                            Create one to get started!
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task: Task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => setSelectedTask(task)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {task.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell className="text-sm">{getMemberName(task.assignee_id)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(task.created_at), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{tasks.length} of {tasks.length} tasks
          </div>
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
