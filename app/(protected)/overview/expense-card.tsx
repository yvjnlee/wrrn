import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ExpenseCard({ totalExpense }: { totalExpense: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Total Expenses</CardTitle>
        <CardDescription>This Month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-red-600">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            totalExpense
          )}
        </p>
      </CardContent>
    </Card>
  );
}
