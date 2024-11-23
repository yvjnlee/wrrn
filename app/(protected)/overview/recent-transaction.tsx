import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction } from "../types";

export function RecentTransactionsCard({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {transactions.map((transaction, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{transaction.date}</span>
              <span>{transaction.description}</span>
              <span
                className={
                  transaction.amount && transaction.amount > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"
                }
              >
                {transaction.amount}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
