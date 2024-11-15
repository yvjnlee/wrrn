"use client"

import React, { useState } from "react";
import { Budget } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BudgetDrawer } from "./budget-drawer";

interface BudgetItemProps {
  budget: Budget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<string | null>(null);

  const handleCardClick = () => {
    setIsDrawerOpen(budget.id || null); // Set the budget ID when opening the drawer
  };

  return (
    <>
      <Card className="shadow-sm cursor-pointer" onClick={handleCardClick}>
        <CardHeader>
          <CardTitle>{budget.name || "Budget"}</CardTitle>
          <CardDescription>Account: {budget.account_id || "N/A"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Amount:</span>
            <Badge variant="outline">${budget.amount?.toLocaleString() || "0.00"}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Spent:</span>
            <Badge variant="outline">${budget.spent?.toLocaleString() || "0.00"}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Remaining:</span>
            <Badge variant="outline">
              {budget.amount && budget.spent !== undefined ? (
                (budget.amount - budget.spent) <= 0 ? (
                  <span className="text-green-600">Completed</span>
                ) : (
                  `$${(budget.amount - budget.spent).toLocaleString()}`
                )
              ) : "N/A"}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <p>Category: {budget.category || "Uncategorized"}</p>
            <p>Start Date: {budget.start_date || "N/A"}</p>
            <p>End Date: {budget.end_date || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Drawer */}
      <BudgetDrawer
        isDrawerOpen={isDrawerOpen} // Open only if the current budget's ID matches
        setIsDrawerOpen={() => setIsDrawerOpen(null)} // Close by setting to null
      />
    </>
  );
}
