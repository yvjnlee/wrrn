"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Account, Budget, Transaction } from "../types";
import { AccountDrawer } from "./account-drawer";
import { getAccountBudgets } from "../budgets/actions";
import { getAccountTransactions } from "../transactions/actions";

interface AccountItemProps {
  account: Account;
}

export function AccountItem({ account }: AccountItemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgetData = await getAccountBudgets(account.id);
        setBudgets(budgetData || []);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } 
    };

    const fetchTransactions = async () => {
      try {
        const transactionData = await getAccountTransactions(account.id);
        setTransactions(transactionData || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchBudgets();
    fetchTransactions();
    setIsLoading(false);
  }, [account.id]);

  const totalBudgeted = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const remainingFunds = (account.balance || 0) - (totalSpent || 0);


  const handleCardClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card
        className="shadow-sm cursor-pointer p-4"
        onClick={handleCardClick}
      >
        {/* Card Header */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            {account.account_name || "Unnamed Account"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {account.account_type || "Unknown Type"}
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Balance:</span>
            <Badge variant="outline">
              ${account.balance?.toLocaleString() || "0.00"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Budgets:</span>
            <Badge variant="secondary">
              {isLoading ? "Loading..." : budgets.length || "None"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Budgeted:</span>
            <Badge variant="outline">
              ${totalBudgeted.toLocaleString()}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Remaining Funds:</span>
            <Badge
              variant={remainingFunds && remainingFunds >= 0 ? "default" : "destructive"}
              className={remainingFunds && remainingFunds >= 0 ? "bg-green-100 text-green-700" : ""}
            >
              ${remainingFunds && remainingFunds.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Drawer */}
      <AccountDrawer
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        account={account}
        budgets={budgets}
        transactions={transactions}
      />
    </>
  );
}
