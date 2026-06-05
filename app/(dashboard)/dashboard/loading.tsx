import { IconLoader2 } from "@tabler/icons-react";

export default function DashboardLoading() {
  return (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="text-primary size-8 animate-spin" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}
