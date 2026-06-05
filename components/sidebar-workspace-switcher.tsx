"use client";

// Removed actions.ts import
import { useRouter } from "next/navigation";
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
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PopoverItem,
  PopoverSeparator,
  PopoverShortcut,
} from "@/components/ui/popover-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WORKSPACE_ICONS } from "@/constants/workspace-icon";
import { cn } from "@/lib/utils";
import {
  IconHexagonFilled,
  IconLoader2,
  IconPlus,
  IconSearch,
  IconSelector,
  IconSettings,
} from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Workspace } from "@/lib/types";

export function SidebarWorkspaceSwitcher({
  workspaces = [],
  activeWorkspaceId,
}: {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
}) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | null>(null);
  const [selectedIconId, setSelectedIconId] = useState("hexagon");
  const [searchQuery, setSearchQuery] = useState("");
  const [createName, setCreateName] = useState("");
  const [editName, setEditName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeWorkspace =
    workspaces.find((w: Workspace) => w.id === activeWorkspaceId) || workspaces[0];

  const filteredWorkspaces = workspaces.filter((w: Workspace) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isCreateDuplicate =
    createName.trim() !== "" &&
    workspaces.some(
      (w: Workspace) => w.name.toLowerCase() === createName.trim().toLowerCase(),
    );
  const isEditDuplicate =
    editName.trim() !== "" &&
    workspaces.some(
      (w: Workspace) =>
        w.name.toLowerCase() === editName.trim().toLowerCase() &&
        w.id !== workspaceToEdit?.id,
    );

  useEffect(() => {
    if (isCreateWorkspaceOpen) {
      setCreateName(""); /* eslint-disable-line react-hooks/set-state-in-effect */
      setCreateError(null);
    }
  }, [isCreateWorkspaceOpen]);

  useEffect(() => {
    if (workspaceToEdit && isEditWorkspaceOpen) {
      setEditName(workspaceToEdit.name); /* eslint-disable-line react-hooks/set-state-in-effect */
      setEditError(null);
    }
  }, [workspaceToEdit, isEditWorkspaceOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (
        e.key.toLowerCase() === "c" &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setIsCreateWorkspaceOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const router = useRouter();

  const handleCreateWorkspace = (formData: FormData) => {
    setCreateError(null);
    startTransition(async () => {
      console.log("Creating workspace...");
      const res = await fetch("/api/workspaces", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.log("Create error:", data.error);
        setCreateError(data.error);
      } else {
        toast.success("Workspace created successfully!");
        setIsCreateWorkspaceOpen(false);
        setCreateError(null);
        router.refresh();
      }
    });
  };

  const onEditWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceToEdit) return;

    if (!editName.trim()) {
      setEditError("Workspace name is required");
      return;
    }

    startTransition(async () => {
      console.log("Updating workspace...");
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("workspace_icon", selectedIconId);
      const res = await fetch(`/api/workspaces/${workspaceToEdit.id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.log("Update error:", data.error);
        setEditError(data.error);
      } else {
        toast.success("Workspace updated successfully!");
        setIsEditWorkspaceOpen(false);
        setEditError(null);
        router.refresh();
      }
    });
  };

  const handleDeleteWorkspace = () => {
    if (!workspaceToEdit) return;
    if (
      !confirm(
        "Are you sure you want to delete this workspace? This cannot be undone.",
      )
    )
      return;

    startTransition(async () => {
      console.log("Deleting workspace...");
      const res = await fetch(`/api/workspaces/${workspaceToEdit.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.log("Delete error:", data.error);
        toast.error(data.error);
      } else {
        toast.success("Workspace deleted successfully!");
        setIsEditWorkspaceOpen(false);
        router.refresh();
      }
    });
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    startTransition(async () => {
      await fetch(`/api/workspaces/${workspaceId}/active`, { method: "POST" });
      setIsWorkspaceOpen(false);
      router.refresh();
    });
  };

  const SelectedIcon =
    WORKSPACE_ICONS.find((i) => i.id === selectedIconId)?.icon ||
    IconHexagonFilled;

  const ActiveWIcon =
    WORKSPACE_ICONS.find((i) => i.id === activeWorkspace?.icon)?.icon ||
    IconHexagonFilled;

  return (
    <>
      <SidebarHeader className="flex h-12 justify-center px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer">
                  <div className="flex size-6 items-center justify-center text-primary">
                    <ActiveWIcon className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeWorkspace
                        ? activeWorkspace.name
                        : "Select Workspace"}
                    </span>
                  </div>
                  <IconSelector className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] min-w-56 p-0 block overflow-hidden rounded-lg"
                align="start"
                side="bottom"
                sideOffset={8}
              >
                <div className="relative border-b border-border">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workspace..."
                    className="pl-9 h-10 text-sm rounded-none border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="p-1">
                  <ScrollArea className="h-[140px]">
                    <div className="flex flex-col gap-1">
                      {filteredWorkspaces.map((workspace: Workspace) => {
                        const WIcon =
                          WORKSPACE_ICONS.find((i) => i.id === workspace.icon)
                            ?.icon || IconHexagonFilled;
                        return (
                          <PopoverItem
                            key={workspace.id}
                            onClick={() => handleWorkspaceChange(workspace.id)}
                            className={
                              activeWorkspace?.id === workspace.id
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <WIcon
                              className={
                                activeWorkspace?.id === workspace.id
                                  ? "text-primary size-4"
                                  : "text-muted-foreground size-4"
                              }
                            />
                            <span className="flex-1 truncate">
                              {workspace.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 ml-auto hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation();
                                setWorkspaceToEdit(workspace);
                                setSelectedIconId(workspace.icon || "hexagon");
                                setIsEditWorkspaceOpen(true);
                                setIsWorkspaceOpen(false);
                              }}
                            >
                              <IconSettings className="size-3.5 text-muted-foreground" />
                            </Button>
                          </PopoverItem>
                        );
                      })}
                      {filteredWorkspaces.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No workspaces found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                <PopoverSeparator className="m-0" />
                <div className="p-1">
                  <PopoverItem
                    onClick={() => {
                      setIsCreateWorkspaceOpen(true);
                      setIsWorkspaceOpen(false);
                    }}
                  >
                    <IconPlus className="text-muted-foreground" />
                    Create workspace
                    <PopoverShortcut>
                      <Kbd>C</Kbd>
                    </PopoverShortcut>
                  </PopoverItem>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Dialog
        open={isCreateWorkspaceOpen}
        onOpenChange={(open) => {
          setIsCreateWorkspaceOpen(open);
          if (!open) setCreateError(null);
        }}
      >
        <DialogContent aria-describedby={undefined} className="sm:max-w-[450px]!">
          <DialogHeader className="-mx-4 -mt-4 p-4 border-b bg-muted/50 rounded-t-xl">
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Workspaces are shared environments for team collaboration.
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreateWorkspace} className="flex flex-col gap-4">
            <input type="hidden" name="workspace_icon" value={selectedIconId} />
            <FieldGroup>
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="workspace-name"
                  className="text-xs text-muted-foreground"
                >
                  Workspace Name
                </FieldLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="size-10 shrink-0 shadow-none"
                      >
                        <SelectedIcon className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="grid grid-cols-6 gap-1">
                        {WORKSPACE_ICONS.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Button
                              key={item.id}
                              variant={
                                selectedIconId === item.id
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="icon"
                              type="button"
                              className="size-8"
                              onClick={() => setSelectedIconId(item.id)}
                            >
                              <IconComponent className="size-4" />
                            </Button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Input
                    id="workspace-name"
                    name="workspace_name"
                    placeholder="e.g. Acme Inc."
                    required
                    autoFocus
                    value={createName}
                    onChange={(e) => {
                      setCreateName(e.target.value);
                      setCreateError(null);
                    }}
                    className={cn(
                      "h-10 shadow-none bg-transparent! flex-1",
                      (createError || isCreateDuplicate) &&
                        "border-destructive",
                    )}
                    disabled={isPending}
                  />
                </div>
                {(createError || isCreateDuplicate) && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {createError ||
                      "You already have a workspace with this name."}
                  </p>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCreateWorkspaceOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isCreateDuplicate || !createName.trim()}
              >
                {isPending ? (
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditWorkspaceOpen}
        onOpenChange={(open) => {
          setIsEditWorkspaceOpen(open);
          if (!open) setEditError(null);
        }}
      >
        <DialogContent aria-describedby={undefined} className="sm:max-w-[450px]!">
          <DialogHeader className="-mx-4 -mt-4 p-4 border-b bg-muted/50 rounded-t-xl">
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update your workspace name and icon, or permanently delete it.
            </DialogDescription>
          </DialogHeader>
          {workspaceToEdit && (
            <form
              onSubmit={onEditWorkspace}
              className="flex flex-col gap-4"
            >
              <input
                type="hidden"
                name="workspace_icon"
                value={selectedIconId}
              />
              <FieldGroup>
                <Field className="space-y-1.5">
                  <FieldLabel
                    htmlFor="edit-workspace-name"
                    className="text-xs text-muted-foreground"
                  >
                    Workspace Name
                  </FieldLabel>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          className="size-10 shrink-0 shadow-none"
                        >
                          <SelectedIcon className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <div className="grid grid-cols-6 gap-1">
                          {WORKSPACE_ICONS.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <Button
                                key={item.id}
                                variant={
                                  selectedIconId === item.id
                                    ? "secondary"
                                    : "ghost"
                                }
                                size="icon"
                                type="button"
                                className="size-8"
                                onClick={() => setSelectedIconId(item.id)}
                              >
                                <IconComponent className="size-4" />
                              </Button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input
                      id="edit-workspace-name"
                      name="workspace_name"
                      autoFocus
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setEditError(null);
                      }}
                      placeholder="e.g. Acme Inc."
                      required
                      className={cn(
                        "h-10 shadow-none bg-transparent! flex-1",
                        (editError || isEditDuplicate) && "border-destructive",
                      )}
                      disabled={isPending}
                    />
                  </div>
                  {(editError || isEditDuplicate) && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {editError ||
                        "You already have a workspace with this name."}
                    </p>
                  )}
                </Field>
              </FieldGroup>
              <DialogFooter className="sm:justify-between mt-2">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteWorkspace}
                  disabled={isPending}
                >
                  Delete Workspace
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditWorkspaceOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || isEditDuplicate || !editName.trim()}
                  >
                    {isPending ? (
                      <IconLoader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
