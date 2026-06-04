"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="border border-border overflow-hidden">
        <AppHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
