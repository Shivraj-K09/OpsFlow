import { Button } from "@/components/ui/button";
import { Member } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  workspaceId: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  members,
  workspaceId,
}: CreateTaskDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      formData.append("workspaceId", workspaceId);
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to create task");
      } else {
        toast.success("Task created successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks(workspaceId) });
        router.refresh();
        onOpenChange(false);
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to assign a new task to your team.
          </DialogDescription>
        </DialogHeader>

        <form action={onSubmit}>
          <div className="py-2 flex flex-col gap-6">
            <FieldGroup>
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="title"
                  className="text-xs text-muted-foreground"
                >
                  Task Title
                </FieldLabel>
                <Input
                  name="title"
                  id="title"
                  required
                  placeholder="e.g. Update authentication flow"
                  className="h-10 shadow-none bg-transparent!"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field className="space-y-1.5">
                  <FieldLabel
                    htmlFor="priority"
                    className="text-xs text-muted-foreground"
                  >
                    Priority
                  </FieldLabel>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger
                      id="priority"
                      className="h-10 shadow-none bg-transparent!"
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel
                    htmlFor="assignee"
                    className="text-xs text-muted-foreground"
                  >
                    Assignee
                  </FieldLabel>
                  <Select name="assignee" defaultValue="none">
                    <SelectTrigger
                      id="assignee"
                      className="h-10 shadow-none bg-transparent!"
                    >
                      <SelectValue placeholder="Select team member" />
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
                </Field>
              </div>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="description"
                  className="text-xs text-muted-foreground"
                >
                  Description (Optional)
                </FieldLabel>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Add any extra context for this task..."
                  className="resize-none min-h-[100px] shadow-none bg-transparent!"
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
