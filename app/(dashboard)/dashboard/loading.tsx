import { IconLoader2 } from "@tabler/icons-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}
