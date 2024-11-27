import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function IncomeCard({ totalIncome }: { totalIncome: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-500">Total Income</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-green-600">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            totalIncome
          )}
        </p>
      </CardContent>
    </Card>
  );
}
