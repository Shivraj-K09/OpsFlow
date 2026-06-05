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
  const current =
    BREADCRUMBS[pathname as keyof typeof BREADCRUMBS] ||
    BREADCRUMBS["/dashboard"];
  const Icon = current.icon;
  return (
    <header className="border-border bg-background sticky top-0 z-10 flex h-12 w-full shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-2 [&_svg]:size-4" />
      <div className="bg-border hidden h-4 w-px sm:block" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block">
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              {current.group}
            </span>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground flex items-center gap-1.5 text-sm font-medium">
              <Icon className="text-primary size-4" />
              {current.label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
