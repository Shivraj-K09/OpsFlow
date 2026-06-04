import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow,
  TableHeader,
  TableHead
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  IconUsers, 
  IconChartBar, 
  IconClipboardList, 
  IconFolder,
  IconArrowUpRight,
  IconArrowDownRight
} from "@tabler/icons-react";
import { OverviewChart } from "./_components/overview-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <IconArrowUpRight className="size-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <IconClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <IconArrowUpRight className="size-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+4.5%</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workload Balance</CardTitle>
            <IconChartBar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <IconArrowDownRight className="size-3 text-rose-500" />
              <span className="text-rose-500 font-medium">-2%</span> capacity remaining
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <IconFolder className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <IconArrowUpRight className="size-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="flex flex-col shadow-sm border-border p-0 gap-0">
          <CardHeader className="py-2.5 px-4">
            <CardTitle className="text-lg font-semibold tracking-tight">Recent Urgent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden border-t">
            <ScrollArea className="h-[320px] w-full relative [&_[data-slot=scroll-area-scrollbar]]:hidden">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow className="hover:bg-transparent sticky top-0 z-20 bg-background/95 backdrop-blur-sm shadow-sm">
                    <TableHead className="font-normal text-muted-foreground h-11 pl-6">Task</TableHead>
                    <TableHead className="font-normal text-muted-foreground h-11">Status</TableHead>
                    <TableHead className="font-normal text-muted-foreground h-11 text-right pr-6">Assignee</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Database Migration</TableCell>
                  <TableCell className="text-muted-foreground">In Progress</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Sarah Connor</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">API Rate Limiting Issue</TableCell>
                  <TableCell className="text-muted-foreground">Open</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">John Doe</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Update Billing UI</TableCell>
                  <TableCell className="text-muted-foreground">In Review</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Alice Smith</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Fix Auth Token Expiry</TableCell>
                  <TableCell className="text-muted-foreground">In Progress</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Shivraj</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Setup Edge Functions</TableCell>
                  <TableCell className="text-muted-foreground">Open</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Mike Johnson</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Optimize Landing Images</TableCell>
                  <TableCell className="text-muted-foreground">Done</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Sarah Connor</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Add E2E Tests</TableCell>
                  <TableCell className="text-muted-foreground">In Review</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">John Doe</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableCell className="pl-6 font-medium">Refactor Redux Store</TableCell>
                  <TableCell className="text-muted-foreground">In Progress</TableCell>
                  <TableCell className="text-right pr-6 text-muted-foreground">Alice Smith</TableCell>
                </TableRow>
              </TableBody>
            </table>
            </ScrollArea>
            <div className="py-2 px-4 flex items-center justify-between bg-muted/10 sticky bottom-0 z-10 border-t">
              <div className="text-xs text-muted-foreground">
                Showing 1-8 of 8 tasks
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
          </CardContent>
        </Card>
        <OverviewChart />
      </div>
    </div>
  );
}
