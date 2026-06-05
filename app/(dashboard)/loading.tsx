import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="bg-background text-muted-foreground flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <IconLoader2 className="text-primary size-8 animate-spin" />
        <p className="text-sm">Loading workspace...</p>
      </div>
    </div>
  );
}
