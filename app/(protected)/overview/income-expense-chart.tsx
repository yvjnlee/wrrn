"use client";

import React from "react";
import { BaseAreaChart } from "@/components/custom/charts";

interface IncomeExpenseChartProps {
  data: { date: string; income: number; expense: number }[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <BaseAreaChart
      data={data}
      title="Income vs Expenses"
    />
  );
}
