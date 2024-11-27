"use client"

import * as React from "react";
import { Area, AreaChart, CartesianGrid, Cell, Label, Pie, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";

const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), {
  ssr: false,
  loading: () => 
  <div className="flex items-center justify-center w-64 h-64">
    <LoaderCircle
      className="animate-spin text-gray-500"
      size={250}
      color="currentColor"
    />
  </div>
});

interface ChartDataItem {
    date: string;
    [key: string]: number | string;
}

interface DataTrendChartProps {
    data: ChartDataItem[];
    config?: ChartConfig;
    title?: string;
    description?: string;
}

interface PieChartItem {
  name: string;
  value: number;
  fillColor: string;
}

interface BasePieChartProps {
  data: PieChartItem[];
  title?: string; // Center text (e.g., percentage or label)
  description?: string; // Optional subtitle
}

export function BasePieChart({ data, title, description }: BasePieChartProps) {
  if (!data || data.length === 0) {
    console.error("BasePieChart: No data provided.");
    return null;
  }

  return (
    <ChartContainer
      config={{}}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart width={250} height={250}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
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
    </ChartContainer>
  );
}

export function BaseAreaChart({ data, config, title, description }: DataTrendChartProps) {
  const [timeRange, setTimeRange] = React.useState("lifetime");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // Use the current date as the reference point
    let startDate;

    switch (timeRange) {
      case "lifetime":
        return true; // Include all data
      case "1y":
        startDate = new Date(referenceDate);
        startDate.setFullYear(referenceDate.getFullYear() - 1);
        break;
      case "1m":
        startDate = new Date(referenceDate);
        startDate.setMonth(referenceDate.getMonth() - 1);
        break;
      case "1w":
        startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - 7);
        break;
      default:
        return true; // Fallback to include all data
    }

    return startDate ? date >= startDate : true;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="lifetime" className="rounded-lg">
              Lifetime
            </SelectItem>
            <SelectItem value="1y" className="rounded-lg">
              Last Year
            </SelectItem>
            <SelectItem value="1m" className="rounded-lg">
              Last Month
            </SelectItem>
            <SelectItem value="1w" className="rounded-lg">
              Last Week
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config || {}}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                <stop offset="95%" stopColor="green" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                <stop offset="95%" stopColor="red" stopOpacity={0.1} />
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="green"
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="red"
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
