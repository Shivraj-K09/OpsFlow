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
        "group/popover-item relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PopoverSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
}

export function PopoverLabel({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PopoverShortcut({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-hover/popover-item:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
