"use client";

import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import { Account, Budget } from "../types";
import { deleteBudget, updateBudget } from "./actions";
import { Input } from "@/components/ui/input";
import { BasicDrawer } from "@/components/custom/drawers";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BasePieChart } from "@/components/custom/charts";
import { getAccounts } from "../accounts/actions";

interface BudgetDrawerProps {
  budget: Budget;
  isDrawerOpen: string | null;
  setIsDrawerOpen: (isOpen: string | null) => void;
}

export function BudgetDrawer({
  budget,
  isDrawerOpen,
  setIsDrawerOpen,
}: BudgetDrawerProps) {
  const [formState, setFormState] = useState<Partial<Budget>>(budget);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    budget.account_id || null
  );
  const [contribute, setContribute] = useState<number>(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data || []);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    };

    if (budget?.user_id) {
      fetchAccounts();
    }
  }, [budget?.user_id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleAccountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
    setFormState((prev) => ({
      ...prev,
      account_id: e.target.value,
    }));
  };

  const handleContributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContribute(parseFloat(e.target.value) || 0);
  };

  const handleSaveChanges = async () => {
    if (budget?.id) {
      const updatedBudget = {
        ...formState,
        spent: Math.max((budget.spent || 0) + contribute, 0), // Ensure spent doesn't go below 0
      };
      try {
        await updateBudget(updatedBudget);
        setIsDrawerOpen(null);
        window.location.reload();
      } catch (error) {
        console.error("Failed to save changes:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (budget?.id) {
      await deleteBudget(budget.id);
      setIsDrawerOpen(null); // Close the drawer after deleting
      window.location.reload();
    }
  };

  const { name, amount = 0, spent = 0 } = formState;

  const remaining = useMemo(() => Math.max(amount - spent, 0), [amount, spent]);
  const percentageSpent = useMemo(() => {
    if (!amount) return "0";
    return Math.min((spent / amount) * 100, 100).toFixed(1);
  }, [amount, spent]);

  const chartData = [
    { name: "Spent", value: spent, fillColor: "green" },
    { name: "Remaining", value: remaining, fillColor: "#171717" },
  ];

  return (
    <BasicDrawer
      isOpen={!!isDrawerOpen}
      onClose={() => setIsDrawerOpen(null)}
      onDelete={handleDelete}
      title={`Edit ${name || "Budget"}`}
      description="Modify the budget details as needed."
      onSave={handleSaveChanges}
    >
      <div className="p-4 space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="flex justify-center items-center p-4">
          <CardContent>
            <BasePieChart
              data={chartData}
              title={`${percentageSpent}%`}
              description="Spent"
            />
          </CardContent>
        </Card>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">Budget Name</Label>
            <Input
              name="name"
              placeholder="Budget Name"
              value={formState?.name || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Linked Account</Label>
            <select
              name="account_id"
              value={selectedAccount || ""}
              onChange={handleAccountChange}
              className="border rounded p-2 w-full text-sm"
            >
              <option value="" disabled>
                Select Account
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-semibold">Category</Label>
            <Input
              name="category"
              placeholder="Category"
              value={formState?.category || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Total Amount</Label>
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              value={formState?.amount?.toString() || ""}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label className="text-sm font-semibold">Start Date</Label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formState?.start_date
                  ? new Date(formState.start_date).toLocaleDateString()
                  : "Not Set"}
              </span>
              <Input
                name="start_date"
                placeholder="Start Date"
                type="date"
                value={formState?.start_date || ""}
                onChange={handleChange}
                className="w-auto"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">End Date</Label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formState?.end_date
                  ? new Date(formState.end_date).toLocaleDateString()
                  : "Not Set"}
              </span>
              <Input
                name="end_date"
                placeholder="End Date"
                type="date"
                value={formState?.end_date || ""}
                onChange={handleChange}
                className="w-auto"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Allocate Funds</Label>
            <Input
              name="contribute"
              placeholder="Allocate Amount"
              type="text"
              value={contribute.toString()}
              onChange={handleContributeChange}
            />
          </div>
        </div>
      </div>
    </BasicDrawer>
  );
}
