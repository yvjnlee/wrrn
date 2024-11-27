import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BasePieChart } from "@/components/custom/charts"; // Assuming you have a pie chart component

export function SpendingByCategoryCard({ data }: { data: { name: string; value: number; fillColor: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent>
        <BasePieChart data={data} />
      </CardContent>
    </Card>
  );
}
