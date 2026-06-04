"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  IconSearch, 
  IconFilter, 
  IconPlus, 
  IconDotsVertical 
} from "@tabler/icons-react";

import { CreateTaskDialog } from "./_components/create-task-dialog";
import { TaskDetailsSheet } from "./_components/task-details-sheet";

const TASKS = [
  {
    id: "TASK-8782",
    title: "Update authentication flow",
    project: "Project Alpha",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Connor",
    date: "Today",
  },
  {
    id: "TASK-8781",
    title: "Design new landing page",
    project: "Design Studio",
    status: "Review",
    priority: "Medium",
    assignee: "John Doe",
    date: "Tomorrow",
  },
  {
    id: "TASK-8780",
    title: "Fix API rate limiting bug",
    project: "Engineering Team",
    status: "Open",
    priority: "High",
    assignee: "Alice Smith",
    date: "Oct 24",
  },
  {
    id: "TASK-8779",
    title: "Write documentation for v2.0",
    project: "Documentation",
    status: "Open",
    priority: "Low",
    assignee: "Mike Johnson",
    date: "Oct 28",
  },
  {
    id: "TASK-8778",
    title: "Client presentation slides",
    project: "Project Beta",
    status: "Done",
    priority: "Medium",
    assignee: "Emily Chen",
    date: "Oct 21",
  },
  {
    id: "TASK-8777",
    title: "Database migration script",
    project: "Project Alpha",
    status: "In Progress",
    priority: "Urgent",
    assignee: "Sarah Connor",
    date: "Today",
  }
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "Urgent":
      return <Badge variant="destructive" className="font-normal text-[10px]">Urgent</Badge>;
    case "High":
      return <Badge variant="outline" className="font-normal text-[10px] text-orange-600 border-orange-600/30">High</Badge>;
    case "Medium":
      return <Badge variant="outline" className="font-normal text-[10px] text-blue-600 border-blue-600/30">Medium</Badge>;
    case "Low":
      return <Badge variant="secondary" className="font-normal text-[10px] text-muted-foreground">Low</Badge>;
    default:
      return null;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "In Progress":
      return <Badge className="font-normal text-[10px] bg-blue-500 hover:bg-blue-600 text-white">In Progress</Badge>;
    case "Review":
      return <Badge className="font-normal text-[10px] bg-purple-500 hover:bg-purple-600 text-white">Review</Badge>;
    case "Open":
      return <Badge variant="secondary" className="font-normal text-[10px]">Open</Badge>;
    case "Done":
      return <Badge className="font-normal text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white">Done</Badge>;
    default:
      return null;
  }
}

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof TASKS[0] | null>(null);

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
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <InputGroup className="h-9">
                <InputGroupInput placeholder="Search tasks..." className="pl-9 text-sm" />
              </InputGroup>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <IconFilter className="size-4 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button className="h-9" onClick={() => setIsCreateOpen(true)}>
              <IconPlus className="size-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-normal text-muted-foreground h-11">Task ID</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Title</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Status</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Priority</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Assignee</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Due Date</TableHead>
                <TableHead className="w-[50px] font-normal text-muted-foreground h-11"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TASKS.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => setSelectedTask(task)}
                >
                  <TableCell className="font-medium text-xs text-muted-foreground">
                    {task.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{task.title}</span>
                      <span className="text-xs text-muted-foreground">{task.project}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(task.priority)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {task.assignee}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.date}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{TASKS.length} of {TASKS.length} tasks
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8 text-xs" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <TaskDetailsSheet 
        open={!!selectedTask} 
        onOpenChange={(open) => !open && setSelectedTask(null)} 
        task={selectedTask} 
      />
    </div>
  );
}
