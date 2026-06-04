"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", tasks: 186 },
  { month: "Feb", tasks: 305 },
  { month: "Mar", tasks: 237 },
  { month: "Apr", tasks: 173 },
  { month: "May", tasks: 209 },
  { month: "Jun", tasks: 214 },
]

const chartConfig = {
  tasks: {
    label: "Completed Tasks",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function OverviewChart() {
  return (
    <Card className="flex flex-col shadow-sm border-border h-full">
      <CardHeader>
        <CardTitle>Task Completion Trend</CardTitle>
        <CardDescription>Performance overview from January - June 2026</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="w-full h-[300px] aspect-auto">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--color-tasks)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.3 }}
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
  )
}
