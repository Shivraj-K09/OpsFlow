"use client";

import { useState, useTransition, useEffect } from "react";
import { Member, Comment } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      let ignore = false;
      const load = async () => {
        await Promise.resolve(); // push to next tick to avoid synchronous setState warning
        if (ignore) return;
        setIsLoadingComments(true);
        try {
          const res = await fetch(`/api/comments?taskId=${task.id}`);
          const json = await res.json();
          if (!ignore) {
            setComments(json.data || []);
            setIsLoadingComments(false);
          }
        } catch {
          if (!ignore) setIsLoadingComments(false);
        }
      };
      load();
      return () => {
        ignore = true;
      };
      load();
      return () => {
        ignore = true;
      };
    }
  }, [open, task]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setComments([]);
      setNewComment("");
    }
    onOpenChange(isOpen);
  };

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
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks(workspaceId),
        });
        router.refresh();
      }
    });
  };

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="border-border/40 flex h-full w-full flex-col border-l p-0 shadow-2xl outline-none focus:outline-none focus-visible:outline-none sm:max-w-[550px]">
        <SheetHeader className="border-border/40 border-b p-5 pb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-muted-foreground text-[13px] font-medium">
              Task
            </span>
            <span className="text-muted-foreground text-[13px]">›</span>
            <span className="text-muted-foreground text-[13px]">
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

        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <div className="flex shrink-0 flex-col gap-1 p-5 pb-6">
              {/* Status Row */}
              <div className="group flex items-center py-1">
                <span className="text-muted-foreground w-32 text-[13px]">
                  Status
                </span>
                <Select
                  defaultValue={task.status.toLowerCase().replace(" ", "-")}
                  onValueChange={(val) =>
                    handleUpdateField("status", val.replace("-", " "))
                  }
                  disabled={
                    isPending ||
                    (userRole === "USER" && task.assignee_id !== currentUserId)
                  }
                >
                  <SelectTrigger className="group-hover:border-border/50 hover:bg-muted/40 h-7 w-fit rounded-md border border-transparent bg-transparent! px-2 text-[13px] shadow-none focus:ring-0">
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
              <div className="group flex items-center py-1">
                <span className="text-muted-foreground w-32 text-[13px]">
                  Assignee
                </span>
                <Select
                  defaultValue={task.assignee_id || "none"}
                  onValueChange={(val) => handleUpdateField("assignee_id", val)}
                  disabled={isPending || userRole === "USER"}
                >
                  <SelectTrigger className="group-hover:border-border/50 hover:bg-muted/40 h-7 w-fit rounded-md border border-transparent bg-transparent! px-2 text-[13px] shadow-none focus:ring-0">
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
              <div className="group flex items-center py-1">
                <span className="text-muted-foreground w-32 text-[13px]">
                  Priority
                </span>
                <Select
                  defaultValue={task.priority.toLowerCase()}
                  onValueChange={(val) => handleUpdateField("priority", val)}
                  disabled={isPending || userRole === "USER"}
                >
                  <SelectTrigger className="group-hover:border-border/50 hover:bg-muted/40 h-7 w-fit rounded-md border border-transparent bg-transparent! px-2 text-[13px] shadow-none focus:ring-0">
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
              <div className="group flex items-center py-1">
                <span className="text-muted-foreground w-32 text-[13px]">
                  Created At
                </span>
                <div className="text-foreground group-hover:border-border/50 flex h-7 items-center rounded-md border border-transparent px-2 text-[13px]">
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

          {/* Comments Section */}
          <div className="border-border/40 flex flex-1 flex-col overflow-hidden border-t min-h-0">
            <div className="shrink-0 px-5 pb-3 pt-5">
              <h3 className="text-foreground text-[13px] font-medium">
                Activity
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <div className="flex flex-col gap-6 pr-3">
                {isLoadingComments ? (
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <IconLoader2 className="size-3 animate-spin" />
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-muted-foreground text-xs">
                    No comments yet.
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="mt-0.5 size-6 rounded-sm">
                        {comment.avatar_url && (
                          <AvatarImage
                            src={comment.avatar_url}
                            alt={comment.author}
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <AvatarFallback
                          className={`rounded-sm text-[10px] text-white ${comment.color}`}
                        >
                          {comment.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium">
                            {comment.author}
                          </span>
                          <span className="text-muted-foreground text-[12px]">
                            {new Date(comment.created_at).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(comment.created_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                        <div className="text-foreground/80 text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Comment Input */}
        <div className="border-border/40 bg-background/95 border-t p-4 backdrop-blur">
          <div className="border-border/50 bg-muted/10 focus-within:border-border focus-within:bg-background rounded-md border p-2 transition-colors">
            <Textarea
              placeholder="Leave a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPending}
              className="min-h-[40px] resize-none border-none bg-transparent! p-1 text-[13px] shadow-none focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button
                size="sm"
                className="h-7 rounded px-3 text-[12px]"
                onClick={handleAddComment}
                disabled={isPending || !newComment.trim()}
              >
                {isPending ? (
                  <IconLoader2 className="mr-1 size-3 animate-spin" />
                ) : (
                  <IconSend className="mr-1 size-3" />
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
