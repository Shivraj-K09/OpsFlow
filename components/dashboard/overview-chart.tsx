"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  tasks: {
    label: "Completed Tasks",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function OverviewChart({
  chartData = [],
}: {
  chartData?: { month: string; tasks: number }[];
}) {
  return (
    <Card className="border-border flex h-full flex-col shadow-sm">
      <CardHeader>
        <CardTitle>Task Completion Trend</CardTitle>
        <CardDescription>
          Performance overview for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tasks)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tasks)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip
              cursor={{
                stroke: "var(--color-tasks)",
                strokeWidth: 1,
                strokeDasharray: "3 3",
                opacity: 0.3,
              }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="var(--color-tasks)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fillTasks)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
