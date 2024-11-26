"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Account, Budget, Transaction } from "../types";
import { BasicDrawer } from "@/components/custom/drawers";
import { BudgetDrawer } from "../budgets/budget-drawer";
import { deleteAccount, updateAccount } from "./actions";
import { TransactionTable } from "../transactions/transaction-table";

interface AccountDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  onClose: () => void;
  account: Account | null;
  budgets: Budget[] | null;
  transactions: Transaction[]; // Placeholder transactions for now
}

export function AccountDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  onClose,
  account,
  budgets = [],
  transactions = [],
}: AccountDrawerProps) {
  const [formState, setFormState] = useState<Partial<Account>>(account || {});
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  if (!account) return null;

  // Aggregate budget details
  const totalBudgeted = budgets?.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const totalSpent = budgets?.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const remainingFunds = (account.balance || 0) - (totalSpent || 0);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "balance" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };  

  // Save changes to the account
  const handleSaveChanges = async () => {
    if (formState?.id) {
      try {
        await updateAccount(formState); // Save changes
        onClose(); // Close the drawer
        window.location.reload(); // Reload the page to fetch updated data
      } catch (error) {
        console.error("Failed to save changes:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (account?.id) {
      await deleteAccount(account.id);
      setIsDrawerOpen(false); // Close the drawer after deleting
      window.location.reload();
    }
  };

  return (
    <>
      <BasicDrawer
        isOpen={isDrawerOpen}
        onClose={onClose}
        onSave={handleSaveChanges}
        onDelete={handleDelete}
        title={formState.account_name || "Unnamed Account"}
        description={formState.account_type || "Unknown Type"}
      >
        {/* Account Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Account Name</Label>
                <Input
                  name="account_name"
                  value={formState.account_name || ""}
                  onChange={handleChange}
                  className="bg-muted-foreground/10 border"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Account Type</Label>
                <Input
                  name="account_type"
                  value={formState.account_type || "Unknown Type"}
                  onChange={handleChange}
                  className="bg-muted-foreground/10 border"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Balance</Label>
                <Input
                  name="balance"
                  value={formState.balance?.toString() || "0.00"}
                  onChange={handleChange}
                  className="bg-muted-foreground/10 border"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Total Budgeted</Label>
                <Input
                  value={totalBudgeted?.toLocaleString() || "0.00"}
                  readOnly
                  className="bg-muted-foreground/10 border"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">Remaining Funds</Label>
                <Input
                  value={remainingFunds?.toLocaleString() || "0.00"}
                  readOnly
                  className="bg-muted-foreground/10 border"
                />
              </div>
            </div>

            {/* Linked Budgets */}
            <div className="mt-6">
              <Label className="text-sm font-semibold mb-2 block">Linked Budgets</Label>
              {budgets && budgets.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {budgets.map((budget) => (
                    <Badge
                      key={budget.id}
                      onClick={() => setSelectedBudget(budget)}
                      variant="default"
                      className="hover:bg-muted-foreground cursor-pointer"
                    >
                      {budget.name || "Unnamed Budget"}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No linked budgets.</p>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <Label className="text-sm font-semibold">Recent Transactions</Label>
            {transactions.length > 0 ? (
              <TransactionTable data={transactions}/>
            ) : (
              <p className="text-sm text-muted-foreground">No recent transactions.</p>
            )}
          </div>
        </div>
      </BasicDrawer>

      {/* Budget Drawer */}
      {selectedBudget && (
        <BudgetDrawer
          budget={selectedBudget}
          isDrawerOpen={selectedBudget.id}
          setIsDrawerOpen={() => setSelectedBudget(null)}
        />
      )}
    </>
  );
}
