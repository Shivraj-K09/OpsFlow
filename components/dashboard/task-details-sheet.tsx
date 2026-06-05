"use client";

import { useState, useTransition, useEffect } from "react";
import { Member, Comment } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { IconSend, IconLoader2 } from "@tabler/icons-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee_id?: string;
  created_at: string;
}

interface TaskDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  members: Member[];
  workspaceId: string;
  userRole: string;
  currentUserId: string;
}

export function TaskDetailsSheet({
  open,
  onOpenChange,
  task,
  members,
  workspaceId,
  userRole,
  currentUserId,
}: TaskDetailsSheetProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && task) {
      setIsLoadingComments(true); /* eslint-disable-line react-hooks/set-state-in-effect */
      fetch(`/api/comments?taskId=${task.id}`)
        .then((res) => res.json())
        .then((json) => {
          setComments(json.data || []);
          setIsLoadingComments(false);
        });
    } else {
      setComments([]);
      setNewComment("");
    }
  }, [open, task]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;

    startTransition(async () => {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({ taskId: task.id, text: newComment }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to add comment");
      } else {
        setNewComment("");
        const freshRes = await fetch(`/api/comments?taskId=${task.id}`);
        const freshJson = await freshRes.json();
        setComments(freshJson.data || []);
      }
    });
  };

  const handleUpdateField = async (field: string, value: string) => {
    if (!task) return;
    startTransition(async () => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(`Failed to update ${field}`);
      } else {
        toast.success(`Task updated successfully`);
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks(workspaceId) });
        router.refresh();
      }
    });
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[550px] w-full p-0 flex flex-col h-full border-l border-border/40 shadow-2xl">
        <SheetHeader className="p-5 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] text-muted-foreground font-medium">
              Task
            </span>
            <span className="text-[13px] text-muted-foreground">›</span>
            <span className="text-[13px] text-muted-foreground">
              {task.id.slice(0, 8)}
            </span>
          </div>
          <SheetTitle className="text-lg font-semibold tracking-tight">
            {task.title}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Task details and team discussion.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              {/* Status Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">
                  Status
                </span>
                <Select
                  defaultValue={task.status.toLowerCase().replace(" ", "-")}
                  onValueChange={(val) =>
                    handleUpdateField("status", val.replace("-", " "))
                  }
                  disabled={isPending || (userRole === "USER" && task.assignee_id !== currentUserId)}
                >
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none bg-transparent! text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
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
                <span className="w-32 text-[13px] text-muted-foreground">
                  Assignee
                </span>
                <Select
                  defaultValue={task.assignee_id || "none"}
                  onValueChange={(val) => handleUpdateField("assignee_id", val)}
                  disabled={isPending || userRole === "USER"}
                >
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none bg-transparent! text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.full_name || "Unknown Member"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Row */}
              <div className="flex items-center py-1 group">
                <span className="w-32 text-[13px] text-muted-foreground">
                  Priority
                </span>
                <Select
                  defaultValue={task.priority.toLowerCase()}
                  onValueChange={(val) => handleUpdateField("priority", val)}
                  disabled={isPending || userRole === "USER"}
                >
                  <SelectTrigger className="h-7 w-fit border border-transparent group-hover:border-border/50 shadow-none bg-transparent! text-[13px] hover:bg-muted/40 px-2 rounded-md focus:ring-0">
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
                <span className="w-32 text-[13px] text-muted-foreground">
                  Created At
                </span>
                <div className="h-7 px-2 flex items-center text-[13px] text-foreground border border-transparent group-hover:border-border/50 rounded-md">
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-4 pt-5 border-t border-border/40">
              <h3 className="text-[13px] font-medium text-foreground">
                Activity
              </h3>

              <div className="flex flex-col gap-6">
                {isLoadingComments ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconLoader2 className="size-3 animate-spin" />
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    No comments yet.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="size-6 mt-0.5 rounded-sm">
                        {comment.avatar_url && (
                          <AvatarImage
                            src={comment.avatar_url}
                            alt={comment.author}
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <AvatarFallback
                          className={`text-[10px] text-white rounded-sm ${comment.color}`}
                        >
                          {comment.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium">
                            {comment.author}
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(comment.created_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                        <div className="text-[13px] text-foreground/80 leading-relaxed wrap-break-word whitespace-pre-wrap">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Add Comment Input */}
        <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="rounded-md border border-border/50 bg-muted/10 p-2 focus-within:border-border focus-within:bg-background transition-colors">
            <Textarea
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPending}
              className="resize-none min-h-[40px] border-none shadow-none bg-transparent! text-[13px] focus-visible:ring-0 p-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                className="h-7 px-3 text-[12px] rounded"
                onClick={handleAddComment}
                disabled={isPending || !newComment.trim()}
              >
                {isPending ? (
                  <IconLoader2 className="size-3 animate-spin mr-1" />
                ) : (
                  <IconSend className="size-3 mr-1" />
                )}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
