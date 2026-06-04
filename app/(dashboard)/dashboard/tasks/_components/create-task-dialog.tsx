import { Button } from "@/components/ui/button";
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

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to assign a new task to your team.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 flex flex-col gap-6">
          <FieldGroup>
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="title" className="text-xs text-muted-foreground">Task Title</FieldLabel>
              <Input id="title" placeholder="e.g. Update authentication flow" className="h-10 shadow-none !bg-transparent" />
            </Field>

            <Field className="space-y-1.5">
              <FieldLabel htmlFor="project" className="text-xs text-muted-foreground">Project</FieldLabel>
              <Input id="project" placeholder="e.g. Project Alpha" className="h-10 shadow-none !bg-transparent" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="priority" className="text-xs text-muted-foreground">Priority</FieldLabel>
                <Select defaultValue="medium">
                  <SelectTrigger id="priority" className="h-10 shadow-none !bg-transparent">
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
                <FieldLabel htmlFor="assignee" className="text-xs text-muted-foreground">Assignee</FieldLabel>
                <Select>
                  <SelectTrigger id="assignee" className="h-10 shadow-none !bg-transparent">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Connor</SelectItem>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="alice">Alice Smith</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="emily">Emily Chen</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field className="space-y-1.5">
              <FieldLabel htmlFor="description" className="text-xs text-muted-foreground">Description (Optional)</FieldLabel>
              <Textarea
                id="description"
                placeholder="Add any extra context for this task..."
                className="resize-none min-h-[100px] shadow-none !bg-transparent"
              />
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
