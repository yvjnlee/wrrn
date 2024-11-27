import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function RemainingBudgetCard({ remaining }: { remaining: number }) {
  const textColor = remaining >= 0 ? "text-green-500" : "text-red-500";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining Balance</CardTitle>
        <CardDescription>All Time</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${textColor}`}>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(remaining)}
        </p>
      </CardContent>
    </Card>
  );
}
