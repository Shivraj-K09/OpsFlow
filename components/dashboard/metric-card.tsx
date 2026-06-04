import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  progress?: number;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  progress,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-white/5 bg-background/50 backdrop-blur-xl transition-all hover:bg-white/[0.02] hover:border-white/10 group">
      {/* Subtle gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-8 items-center justify-center rounded-md bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        {description && !trend && !progress && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}

        {trend && (
          <div className="mt-1 flex items-center text-xs">
            <span
              className={
                trend.isPositive ? "text-emerald-500" : "text-rose-500"
              }
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}

        {progress !== undefined && (
          <div className="mt-3 flex flex-col gap-1.5">
            <Progress value={progress} className="h-1.5 bg-white/5" />
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <span>Efficiency</span>
              <span className="text-primary">{progress}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
