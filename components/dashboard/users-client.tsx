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

export function UsersClient({ workspaceId, role, currentUserId }: UsersClientProps) {
  const { data: members = [] } = useWorkspaceMembers(workspaceId);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  let filteredMembers = members;
  if (q) {
    const query = q.toLowerCase();
    filteredMembers = members.filter(
      (m: Member) =>
        m.full_name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query)
    );
  }

  return (
    <div className="flex flex-col p-6 h-full w-full">
      <div className="flex-1 flex flex-col rounded-md border bg-background overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <SearchInput placeholder="Search users by name or email..." />
            <div className="text-sm text-muted-foreground font-medium hidden sm:block ml-2">
              {filteredMembers.length} total members
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-normal text-muted-foreground h-11 pl-6">
                  User
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Role
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Status
                </TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">
                  Joined Date
                </TableHead>
                <TableHead className="w-[50px] font-normal text-muted-foreground h-11"></TableHead>
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
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{filteredMembers.length} of {filteredMembers.length} users
          </div>
          <Pagination className="w-auto mx-0">
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
