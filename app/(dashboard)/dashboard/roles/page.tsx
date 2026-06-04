import { IconCheck, IconMinus } from "@tabler/icons-react";

export default function RolesPage() {
  return (
    <div className="flex flex-col p-6 h-full w-full gap-6">
      <div className="flex-1 rounded-md border bg-background overflow-hidden flex flex-col">
        <div className="grid grid-cols-4 border-b bg-muted/50 p-4 sticky top-0 z-10">
          <div className="font-medium text-muted-foreground text-sm flex items-center pl-4">
            Feature & Permission
          </div>
          <div className="font-semibold text-foreground flex flex-col items-center justify-center gap-1">
            Administrator
            <span className="text-xs font-normal text-muted-foreground">
              System Default
            </span>
          </div>
          <div className="font-semibold text-foreground flex flex-col items-center justify-center gap-1">
            Manager
            <span className="text-xs font-normal text-muted-foreground">
              Custom Role
            </span>
          </div>
          <div className="font-semibold text-foreground flex flex-col items-center justify-center gap-1">
            Standard User
            <span className="text-xs font-normal text-muted-foreground">
              System Default
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Overview Category */}
          <div className="bg-muted/20 p-3 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-5">
              Overview
            </span>
          </div>
          <div className="grid grid-cols-4 border-b hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">View Dashboard</div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
          </div>
          <div className="grid grid-cols-4 border-b hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">
              View Workload Balancer
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
          </div>

          {/* Operations Category */}
          <div className="bg-muted/20 p-3 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-5">
              Operations
            </span>
          </div>
          <div className="grid grid-cols-4 border-b hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">Manage Tasks</div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
          </div>
          <div className="grid grid-cols-4 border-b hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">View Activity Logs</div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
          </div>

          {/* Administration Category */}
          <div className="bg-muted/20 p-3 border-b">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-5">
              Administration
            </span>
          </div>
          <div className="grid grid-cols-4 border-b hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">Manage Users & Team</div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
          </div>
          <div className="grid grid-cols-4 hover:bg-muted/30 p-4 items-center transition-colors">
            <div className="text-sm font-medium pl-4">
              Manage Roles & Access
            </div>
            <div className="flex justify-center">
              <IconCheck className="text-emerald-500 size-5" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
            <div className="flex justify-center">
              <IconMinus className="text-muted-foreground size-5 opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
