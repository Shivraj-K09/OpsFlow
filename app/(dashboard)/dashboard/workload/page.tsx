import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TEAM_MEMBERS = [
  {
    name: "Sarah Connor",
    role: "Lead Developer",
    initials: "SC",
    capacity: 95,
    tasks: 12,
    color: "bg-emerald-600",
  },
  {
    name: "John Doe",
    role: "UI/UX Designer",
    initials: "JD",
    capacity: 110,
    tasks: 18,
    color: "bg-rose-500",
  },
  {
    name: "Alice Smith",
    role: "Backend Engineer",
    initials: "AS",
    capacity: 65,
    tasks: 8,
    color: "bg-blue-500",
  },
  {
    name: "Mike Johnson",
    role: "QA Tester",
    initials: "MJ",
    capacity: 40,
    tasks: 5,
    color: "bg-amber-500",
  },
  {
    name: "Emily Chen",
    role: "Product Manager",
    initials: "EC",
    capacity: 80,
    tasks: 10,
    color: "bg-purple-500",
  },
];

export default function WorkloadPage() {
  return (
    <div className="flex flex-col gap-6 p-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Team Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Optimal utilization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overallocated Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate rebalancing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total free time this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unassigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks in the backlog
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-normal text-muted-foreground h-11">Team Member</TableHead>
              <TableHead className="font-normal text-muted-foreground h-11">Role</TableHead>
              <TableHead className="font-normal text-muted-foreground w-[30%] h-11">Capacity</TableHead>
              <TableHead className="font-normal text-muted-foreground text-right h-11">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEAM_MEMBERS.map((member) => (
              <TableRow key={member.name} className="hover:bg-muted/30">
                <TableCell className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className={`text-white text-[10px] ${member.color}`}>
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm text-foreground">{member.name}</span>
                  </div>
                </TableCell>
                
                <TableCell className="p-4 text-sm text-muted-foreground">
                  {member.role}
                </TableCell>
                
                <TableCell className="p-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{member.tasks} tasks</span>
                      <span>{member.capacity}%</span>
                    </div>
                    <Progress 
                      value={member.capacity > 100 ? 100 : member.capacity} 
                      className="h-1.5"
                      indicatorClassName={member.capacity > 100 ? "bg-rose-500" : member.capacity > 85 ? "bg-amber-500" : "bg-emerald-500"}
                    />
                  </div>
                </TableCell>
                
                <TableCell className="p-4 text-right">
                  {member.capacity > 100 ? (
                    <Badge variant="outline" className="font-medium text-[10px] text-rose-500 border-rose-500/20 bg-rose-500/10 h-6">Overloaded</Badge>
                  ) : member.capacity > 85 ? (
                    <Badge variant="outline" className="font-medium text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/10 h-6">Near Capacity</Badge>
                  ) : (
                    <Badge variant="outline" className="font-medium text-[10px] text-emerald-500 border-emerald-500/20 bg-emerald-500/10 h-6">Available</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10 sticky bottom-0 z-10">
          <div className="text-xs text-muted-foreground">
            Showing 1-{TEAM_MEMBERS.length} of {TEAM_MEMBERS.length} members
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
