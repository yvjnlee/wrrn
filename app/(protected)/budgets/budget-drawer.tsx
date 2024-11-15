import React, { useState, useEffect, ChangeEvent } from "react";
import { Budget } from "../types";
import { getBudgetById, updateBudget } from "./actions";
import { Input } from "@/components/ui/input";
import { BasicDrawer } from "@/components/custom/drawers";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePieChart } from "@/components/custom/charts";
import { ChartConfig } from "@/components/ui/chart";

interface BudgetDrawerProps {
  isDrawerOpen: string | null;
  setIsDrawerOpen: (isOpen: string | null) => void;
}

export function BudgetDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
}: BudgetDrawerProps) {
  const [budget, setBudget] = useState<Partial<Budget> | null>(null);
  const [contribute, setContribute] = useState<number>(0); // Contribution amount
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      setIsLoading(true);
      if (isDrawerOpen) {
        const data = await getBudgetById(isDrawerOpen);
        setBudget(data || {});
      } else {
        setBudget(null);
      }
      setIsLoading(false);
    };

    fetchBudget();
  }, [isDrawerOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudget((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleContributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContribute(parseFloat(e.target.value));
  };

  const handleSaveChanges = async () => {
    if (budget?.id) {
      const updatedBudget = {
        ...budget,
        spent: (budget.spent || 0) + contribute, // Add contribution to spent
      };
      await updateBudget(budget.id, updatedBudget);
      setIsDrawerOpen(null);
      window.location.reload();
    }
  };

  const chartConfig = {
    amount: {
      label: "Amount",
    },
    saved: {
      label: "Saved",
      color: "hsl(var(--chart-1))",
    },
    remaining: {
      label: "Remaining",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const chartData = [
    { name: "Saved", value: Number(budget?.spent), fillColor: "white" },
    { name: "Remaining", value: Number(budget?.amount) - Number(budget?.spent), fillColor: "black" },
  ];  

  return (
    <BasicDrawer
      isOpen={!!isDrawerOpen}
      onClose={() => setIsDrawerOpen(null)}
      title={`Edit ${budget?.name || "Budget"}`}
      description="Modify the budget details as needed."
      onSave={handleSaveChanges}
    >
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div className="p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4">
          {/* Left Side - Form Fields */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Budget Name</Label>
              <Input
                name="name"
                placeholder="Budget Name"
                value={budget?.name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Category</Label>
              <Input
                name="category"
                placeholder="Category"
                value={budget?.category || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Total Amount</Label>
              <Input
                name="amount"
                placeholder="Amount"
                type="number"
                value={budget?.amount?.toString() || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Start Date</Label>
              <Input
                name="start_date"
                placeholder="Start Date"
                type="date"
                value={budget?.start_date || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">End Date</Label>
              <Input
                name="end_date"
                placeholder="End Date"
                type="date"
                value={budget?.end_date || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Spent</Label>
              <Input
                name="spent"
                placeholder="Spent"
                type="number"
                value={budget?.spent?.toString() || ""}
                readOnly
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Contribute</Label>
              <Input
                name="contribute"
                placeholder="Contribute Amount"
                type="number"
                value={contribute.toString()}
                onChange={handleContributeChange}
              />
            </div>
          </div>

          {/* Right Side - Chart Placeholder */}
          <Card className="flex justify-center items-center">
            <CardContent>
              <BasePieChart 
                data={ chartData }
                config={ chartConfig }
                title={ `${Number(budget?.spent)*100/Number(budget?.amount)}%` }
              />
            </CardContent>
          </Card>
        </div>
      )}
    </BasicDrawer>
  );
}
