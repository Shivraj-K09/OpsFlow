import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
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
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  IconSearch, 
  IconUserPlus, 
  IconDotsVertical,
  IconShieldLock,
  IconMail
} from "@tabler/icons-react";

const USERS = [
  {
    id: 1,
    name: "Shivraj",
    email: "shivraj@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "Just now",
    initials: "SH",
    color: "bg-emerald-600",
  },
  {
    id: 2,
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    role: "Manager",
    status: "Active",
    lastActive: "2 hours ago",
    initials: "SC",
    color: "bg-emerald-600",
  },
  {
    id: 3,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    status: "Offline",
    lastActive: "1 day ago",
    initials: "JD",
    color: "bg-rose-500",
  },
  {
    id: 4,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "User",
    status: "Active",
    lastActive: "5 mins ago",
    initials: "AS",
    color: "bg-blue-500",
  },
  {
    id: 5,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "User",
    status: "Invited",
    lastActive: "Never",
    initials: "MJ",
    color: "bg-amber-500",
  },
];

function getRoleBadge(role: string) {
  switch (role) {
    case "Admin":
      return <Badge variant="default" className="bg-indigo-500 hover:bg-indigo-600 font-normal text-[10px]"><IconShieldLock className="size-3 mr-1"/> Admin</Badge>;
    case "Manager":
      return <Badge variant="secondary" className="font-normal text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200">Manager</Badge>;
    case "User":
      return <Badge variant="outline" className="font-normal text-[10px]">User</Badge>;
    default:
      return null;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Active":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </div>
      );
    case "Offline":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          Offline
        </div>
      );
    case "Invited":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <IconMail className="size-3.5" />
          Pending
        </div>
      );
    default:
      return null;
  }
}

export default function UsersPage() {
  return (
    <div className="flex flex-col p-6 h-full w-full">
      <div className="flex-1 flex flex-col rounded-md border bg-background overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full sm:w-80">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <InputGroup className="h-9">
                <InputGroupInput placeholder="Search users by name or email..." className="pl-9 text-sm" />
              </InputGroup>
            </div>
            <div className="text-sm text-muted-foreground font-medium hidden sm:block ml-2">
              {USERS.length} total members
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="h-9">
              <IconUserPlus className="size-4 mr-2" />
              Invite Users
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-normal text-muted-foreground h-11 pl-6">User</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Role</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Status</TableHead>
                <TableHead className="font-normal text-muted-foreground h-11">Last Active</TableHead>
                <TableHead className="w-[50px] font-normal text-muted-foreground h-11"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className={`text-white text-[10px] font-medium ${user.color}`}>
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastActive}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{USERS.length} of {USERS.length} users
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="h-8 px-3 text-xs" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="h-8 w-8 text-xs" isActive>1</PaginationLink>
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
