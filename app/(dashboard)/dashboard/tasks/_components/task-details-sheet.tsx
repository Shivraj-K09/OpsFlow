import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { IconSend } from "@tabler/icons-react";

interface Task {
  id: string;
  title: string;
  project: string;
  status: string;
  priority: string;
  assignee: string;
  date: string;
}

interface TaskDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const COMMENTS = [
  {
    id: 1,
    author: "Manager",
    initials: "MG",
    color: "bg-blue-500",
    text: "Please make sure the documentation is updated before completing this task.",
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Sarah Connor",
    initials: "SC",
    color: "bg-emerald-600",
    text: "Working on it now. Should have it ready for review by end of day.",
    time: "45 mins ago",
  },
];

export function TaskDetailsSheet({ open, onOpenChange, task }: TaskDetailsSheetProps) {
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full p-0 flex flex-col h-full border-l border-border/40 shadow-2xl">
        <SheetHeader className="p-5 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] text-muted-foreground font-medium">{task.project}</span>
            <span className="text-[13px] text-muted-foreground">›</span>
            <span className="text-[13px] text-muted-foreground">{task.id}</span>
          </div>
          <SheetTitle className="text-lg font-semibold tracking-tight">{task.title}</SheetTitle>
          <SheetDescription className="sr-only">Task details and team discussion.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 flex flex-col gap-8">
            
            <div className="flex flex-col gap-1">
              {/* Status Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">Status</span>
                <Select defaultValue={task.status.toLowerCase().replace(" ", "-")}>
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none !bg-transparent text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Assignee Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">Assignee</span>
                <Select defaultValue={task.assignee.toLowerCase().split(" ")[0]}>
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none !bg-transparent text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Connor</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="alice">Alice Smith</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Priority Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">Priority</span>
                <Select defaultValue={task.priority.toLowerCase()}>
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none !bg-transparent text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">Due Date</span>
                <div className="h-7 px-2 flex items-center text-[13px] text-foreground border border-transparent group-hover:border-border/50 rounded-md">
                  {task.date}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-4 pt-5 border-t border-border/40">
              <h3 className="text-[13px] font-medium text-foreground">Activity</h3>
              
              <div className="flex flex-col gap-6">
                {COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="size-6 mt-0.5 rounded-sm">
                      <AvatarFallback className={`text-[10px] text-white rounded-sm ${comment.color}`}>
                        {comment.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">{comment.author}</span>
                        <span className="text-[12px] text-muted-foreground">{comment.time}</span>
                      </div>
                      <div className="text-[13px] text-foreground/80 leading-relaxed">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </ScrollArea>

        {/* Add Comment Input */}
        <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="rounded-md border border-border/50 bg-muted/10 p-2 focus-within:border-border focus-within:bg-background transition-colors">
            <Textarea 
              placeholder="Leave a comment..." 
              className="resize-none min-h-[40px] border-none shadow-none !bg-transparent text-[13px] focus-visible:ring-0 p-1" 
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" className="h-7 px-3 text-[12px] rounded">
                Comment
              </Button>
            </div>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
