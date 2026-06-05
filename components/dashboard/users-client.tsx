"use client";

import { SearchInput } from "@/components/search-input";
import { Member } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "@/components/user-table-row";
import { useWorkspaceMembers } from "@/lib/queries";
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

function getColorForUser(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

interface UsersClientProps {
  workspaceId: string;
  role: string;
  currentUserId: string;
}

export function UsersClient({
  workspaceId,
  role,
  currentUserId,
}: UsersClientProps) {
  const { data: members = [] } = useWorkspaceMembers(workspaceId);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  let filteredMembers = members;
  if (q) {
    const query = q.toLowerCase();
    filteredMembers = members.filter(
      (m: Member) =>
        m.full_name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query),
    );
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="bg-background flex flex-1 flex-col overflow-hidden rounded-md border">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div className="flex flex-1 items-center gap-2">
            <SearchInput placeholder="Search users by name or email..." />
            <div className="text-muted-foreground ml-2 hidden text-sm font-medium sm:block">
              {filteredMembers.length} total members
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground h-11 pl-6 font-normal">
                  User
                </TableHead>
                <TableHead className="text-muted-foreground h-11 font-normal">
                  Role
                </TableHead>
                <TableHead className="text-muted-foreground hidden h-11 font-normal sm:table-cell">
                  Joined Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((user: Member) => {
                const colorClass = getColorForUser(user.full_name || "");

                return (
                  <UserTableRow
                    key={user.id}
                    member={user}
                    currentUserId={currentUserId}
                    currentUserRole={role || "USER"}
                    avatarColor={colorClass}
                    workspaceId={workspaceId}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="bg-muted/10 sticky bottom-0 z-10 flex items-center justify-between border-t p-4">
          <div className="text-muted-foreground text-xs">
            Showing 1-{filteredMembers.length} of {filteredMembers.length} users
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8 text-xs" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
