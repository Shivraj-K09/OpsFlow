"use client";

import { useState } from "react";
import { ActivityLog } from "@/lib/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconDownload } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { SearchInput } from "@/components/search-input";
import { useActivityLogs } from "@/lib/queries";
import { useSearchParams } from "next/navigation";

const colors = [
  "bg-emerald-600",
  "bg-rose-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
];

function getInitials(name: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getColorForUser(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

interface ActivityClientProps {
  workspaceId: string;
}

export function ActivityClient({ workspaceId }: ActivityClientProps) {
  const [page, setPage] = useState(1);
  const { data } = useActivityLogs(workspaceId, page);
  const logs = data?.logs || [];
  const totalCount = data?.totalCount || 0;
  const limit = 20;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  let filteredLogs = logs;
  if (q) {
    const query = q.toLowerCase();
    filteredLogs = logs.filter(
      (log: ActivityLog) =>
        log.action?.toLowerCase().includes(query) ||
        log.target?.toLowerCase().includes(query) ||
        log.workspace_name?.toLowerCase().includes(query) ||
        log.profile?.full_name?.toLowerCase().includes(query),
    );
  }

  const handleExport = () => {
    if (filteredLogs.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Action,Target,Workspace,Author,Timestamp\n" +
      filteredLogs
        .map(
          (log: ActivityLog) =>
            `"${log.action}","${log.target || "-"}","${log.workspace_name}","${log.profile?.full_name || "Unknown"}","${new Date(log.created_at).toLocaleString()}"`,
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activity_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-md border">
        <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <SearchInput placeholder="Search activity..." />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9" onClick={handleExport}>
              <IconDownload className="mr-2 size-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground h-11 pl-6 font-normal">
                  Action
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Target
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Workspace
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Author
                </TableHead>
                <TableHead className="text-muted-foreground h-11 pr-6 text-right font-normal">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-48 text-center"
                  >
                    No activity found in this workspace yet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log: ActivityLog) => {
                  const userName = log.profile?.full_name || "Unknown User";
                  const initials = getInitials(userName);
                  const color = getColorForUser(userName);

                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground p-4 pl-6 text-sm capitalize">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-foreground p-4 text-sm font-medium">
                        {log.target || "-"}
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant="secondary"
                          className="bg-muted/50 text-muted-foreground hover:bg-muted/50 rounded-sm border-transparent text-xs font-normal"
                        >
                          {log.workspace_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="border-border h-6 w-6 border">
                            {log.profile?.avatar_url && (
                              <AvatarImage
                                src={log.profile.avatar_url}
                                alt={userName}
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <AvatarFallback
                              className={`text-[9px] font-medium text-white ${color}`}
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {userName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground p-4 pr-6 text-right text-sm">
                        {formatDistanceToNow(new Date(log.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="bg-muted/10 sticky bottom-0 z-10 flex items-center justify-between border-t p-4">
          <div className="text-muted-foreground text-xs">
            Showing page {page} of {totalPages} ({totalCount} total activities)
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <div className="flex h-8 w-8 items-center justify-center text-xs font-medium">
                  {page}
                </div>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
