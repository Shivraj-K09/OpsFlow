import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm">Loading workspace...</p>
      </div>
    </div>
  );
}
