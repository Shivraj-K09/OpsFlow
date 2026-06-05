"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { BREADCRUMBS } from "@/constants/dashboard";

export function AppHeader() {
  const pathname = usePathname();
  const current = BREADCRUMBS[pathname as keyof typeof BREADCRUMBS] || BREADCRUMBS["/dashboard"];
  const Icon = current.icon;
  return (
    <header className="sticky top-0 z-10 flex h-12 w-full shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-2 [&_svg]:size-4 text-muted-foreground hover:text-foreground" />
      <div className="h-4 w-px bg-border hidden sm:block" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {current.group}
            </span>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Icon className="size-4 text-primary" />
              {current.label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
