"use client"

import React from "react";
import { Budget } from "../types";
import { BudgetItem } from "./budget-item";

interface BudgetListProps {
  budgets: Budget[] | null;
}

export function BudgetList({ budgets }: BudgetListProps) {
  return (
    <div className="grid grid-cols-1 min-h-[6`0vh] sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets && budgets.length > 0 ? (
        budgets.map((budget) => <BudgetItem key={budget.id} budget={budget} />)
      ) : (
        <div className="flex items-center justify-center col-span-full text-center text-gray-500 p-4">
          No budgets available.
        </div>
      )}
    </div>
  );
}
