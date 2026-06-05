"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function PopoverItem({
  className,
  onSelect,
  onClick,
  children,
  ...props
}: React.ComponentProps<"div"> & { onSelect?: (e: React.MouseEvent) => void }) {
  return (
    <div
      role="menuitem"
      onClick={(e) => {
        if (onSelect) onSelect(e);
        if (onClick) onClick(e);
      }}
      className={cn(
        "group/popover-item hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PopoverSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />
  );
}

export function PopoverLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground px-1.5 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PopoverShortcut({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground group-hover/popover-item:text-accent-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
