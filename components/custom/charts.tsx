"use client"

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartDataItem {
    date: string;
    [key: string]: number | string;
}

interface DataTrendChartProps {
    data: ChartDataItem[];
    config: ChartConfig;
    title: string;
    description?: string;
}

interface PieChartItem {
  name: string;
  value: number;
  fillColor: string;
}

interface BasePieChartProps {
  data: PieChartItem[];
  title: string; // Center text (e.g., percentage or label)
  description?: string; // Optional subtitle
}

export function BasePieChart({ data, title, description }: BasePieChartProps) {
  if (!data || data.length === 0) {
    console.error("BasePieChart: No data provided.");
    return null;
  }

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={60}
        outerRadius={100}
        stroke="transparent"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fillColor} />
        ))}
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {title}
                  </tspan>
                  {description && (
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-sm"
                    >
                      {description}
                    </tspan>
                  )}
                </text>
              );
            }
            return null;
          }}
        />
      </Pie>
    </PieChart>
  );
}

export function BaseAreaChart({ data, config, title, description }: DataTrendChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>{ title }</CardTitle>
              <CardDescription>
              { description }
              </CardDescription>
          </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
            >
            <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
                Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
                Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
                Last 7 days
            </SelectItem>
            </SelectContent>
        </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={config}
              className="aspect-auto h-[250px] w-full"
          >
              <AreaChart data={filteredData}>
              <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                  />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                  />
                  </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                  })
                  }}
              />
              <ChartTooltip
                  cursor={false}
                  content={
                  <ChartTooltipContent
                      labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                      })
                      }}
                      indicator="dot"
                  />
                  }
              />
              <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  stackId="a"
              />
              <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
          </ChartContainer>
        </CardContent>
    </Card>
  );
}
