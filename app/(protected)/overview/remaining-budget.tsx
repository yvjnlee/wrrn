import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function RemainingBudgetCard({ remaining }: { remaining: number }) {
  const textColor = remaining >= 0 ? "text-green-500" : "text-red-500";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining Budget</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${textColor}`}>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(remaining)}
        </p>
      </CardContent>
    </Card>
  );
}
