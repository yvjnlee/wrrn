"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BasePieChart } from "@/components/custom/charts";
import { Budget } from "../types";
import { BudgetDrawer } from "./budget-drawer";
import { Badge } from "@/components/ui/badge";

interface BudgetItemProps {
  budget: Budget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const {
    id,
    name,
    category,
    amount = 0,
    spent = 0,
    start_date,
    end_date,
  } = budget;

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<string | null>(null);

  // Calculate remaining budget and percentage spent
  const remaining = useMemo(() => Math.max(amount - spent, 0), [amount, spent]);
  const percentageSpent = useMemo(() => {
    if (!amount) return "0";
    return Math.min((spent / amount) * 100, 100).toFixed(1);
  }, [amount, spent]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
  
    // Get the parts of the date
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" }); // Full month name
    const day = date.getDate();
  
    return `${month} ${day}, ${year}`;
  };

  // Chart data for BasePieChart
  const chartData = [
    { name: "Spent", value: spent, fillColor: "green" },
    { name: "Remaining", value: remaining, fillColor: "#171717" },
  ];

  return (
    <>
      <div onClick={() => setIsDrawerOpen(id || null)} className="cursor-pointer">
        <Card className="flex flex-col h-full">
          {/* Card Header */}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">
                {name || "Unnamed Budget"}
              </CardTitle>
              <Badge variant="outline">{category || "Uncategorized"}</Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {formatDate(start_date)} - {formatDate(end_date)}
            </CardDescription>
          </CardHeader>

          {/* Card Content with BasePieChart */}
          <CardContent className="flex justify-center items-center">
            <BasePieChart
              data={chartData}
              title={`${percentageSpent}%`}
              description="Complete"
            />
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Total:</span>
              <Badge variant="outline">${amount  || "0.00"}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Spent:</span>
              <Badge variant="outline">${spent  || "0.00"}</Badge>
            </div>
            <div className="flex justify-between col-span-2">
              <span>Remaining:</span>
              <Badge variant="outline">
                {remaining <= 0 ? (
                  <span className="text-green-600">Completed</span>
                ) : (
                  `$${remaining }`
                )}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Budget Drawer */}
      <BudgetDrawer
        budget={budget}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </>
  );
}
