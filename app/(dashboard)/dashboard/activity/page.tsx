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
  IconFilter,
  IconDownload,
  IconGitMerge,
  IconMessageCircle,
  IconFileText,
  IconSettings,
  IconUserPlus
} from "@tabler/icons-react";

const ACTIVITY_LOGS = [
  {
    id: 1,
    user: "Sarah Connor",
    initials: "SC",
    color: "bg-emerald-600",
    action: "merged pull request",
    target: "#142 Add Authentication Flow",
    project: "Project Alpha",
    time: "10 minutes ago",
    icon: IconGitMerge,
    iconColor: "text-emerald-500",
  },
  {
    id: 2,
    user: "John Doe",
    initials: "JD",
    color: "bg-rose-500",
    action: "commented on task",
    target: "TASK-8782",
    project: "Project Alpha",
    time: "45 minutes ago",
    icon: IconMessageCircle,
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    user: "Alice Smith",
    initials: "AS",
    color: "bg-blue-500",
    action: "uploaded a new document",
    target: "Q3 Strategy Presentation.pdf",
    project: "Project Beta",
    time: "2 hours ago",
    icon: IconFileText,
    iconColor: "text-amber-500",
  },
  {
    id: 4,
    user: "System",
    initials: "SY",
    color: "bg-slate-800",
    action: "completed automated backup",
    target: "Database Instance 1",
    project: "OpsFlow Core",
    time: "4 hours ago",
    icon: IconSettings,
    iconColor: "text-slate-500",
  },
  {
    id: 5,
    user: "Mike Johnson",
    initials: "MJ",
    color: "bg-amber-500",
    action: "invited a new user",
    target: "david.williams@example.com",
    project: "Engineering Team",
    time: "Yesterday, 2:30 PM",
    icon: IconUserPlus,
    iconColor: "text-purple-500",
  },
  {
    id: 6,
    user: "Sarah Connor",
    initials: "SC",
    color: "bg-emerald-600",
    action: "created a new workspace",
    target: "Project Gamma",
    project: "Global",
    time: "Yesterday, 10:15 AM",
    icon: IconPlus,
    iconColor: "text-emerald-500",
  }
];

// Helper to provide a generic plus icon since it was missing
function IconPlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function ActivityPage() {
  return (
    <div className="flex flex-col p-6 h-full w-full">
      <div className="flex-1 flex flex-col rounded-md border bg-background overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full sm:w-80">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <InputGroup className="h-9">
                <InputGroupInput placeholder="Search activity..." className="pl-9 text-sm" />
              </InputGroup>
            </div>
            <Button variant="outline" className="h-9 shrink-0">
              <IconFilter className="size-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9">
              <IconDownload className="size-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-normal text-muted-foreground h-11 pl-6">Activity</TableHead>
              <TableHead className="font-normal text-muted-foreground h-11">Author</TableHead>
              <TableHead className="font-normal text-muted-foreground h-11 text-right pr-6">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY_LOGS.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/30">
                <TableCell className="p-4 pl-6">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-medium">{log.project}</span>
                    <span className="text-muted-foreground">{log.action}</span>
                    <Badge variant="outline" className="font-normal text-[10px] h-5 px-1.5">{log.target}</Badge>
                  </div>
                </TableCell>
                <TableCell className="p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-border">
                      <AvatarFallback className={`text-white text-[9px] font-medium ${log.color}`}>
                        {log.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{log.user}</span>
                  </div>
                </TableCell>
                <TableCell className="p-4 pr-6 text-right text-sm text-muted-foreground">
                  {log.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{ACTIVITY_LOGS.length} of {ACTIVITY_LOGS.length} activities
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
