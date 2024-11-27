import React from "react";
import { HeaderOverview } from "./header-overview";
import { IncomeCard } from "./income-card";
import { ExpenseCard } from "./expense-card";
import { RemainingBudgetCard } from "./remaining-budget";
import { Account, Transaction } from "../types";
import { getTransactions } from "../transactions/actions";
import { getAccounts } from "../accounts/actions";
import { SpendingByCategoryCard } from "./spending-by-category-chart";
import { IncomeExpenseChart } from "./income-expense-chart";

export default async function OverviewPage() {
    const transactions: Transaction[] | null = await getTransactions();
    const accounts: Account[] | null = await getAccounts();
  
    if (!transactions || !accounts) return <div>Loading...</div>;
  
    let totalIncome = 0;
    let totalExpense = 0;
  
    // Process transactions
    const incomeExpenseChartData: { date: string; income: number; expense: number }[] = [];
    const spendingByCategory: Record<string, number> = {};

    // Helper to find or create a day's data
    const findOrCreateDay = (date: string) => {
        let dayData = incomeExpenseChartData.find((item) => item.date === date);
        if (!dayData) {
            dayData = { date, income: 0, expense: 0 };
            incomeExpenseChartData.push(dayData);
        }
        return dayData;
    };

    // Group transactions by day
    transactions.forEach((transaction) => {
        const amount = transaction.amount || 0;
        const category = transaction.category || "Uncategorized";
    
        // Determine transaction day
        const transactionDay = new Date(transaction.date || "").toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    
        const dayData = findOrCreateDay(transactionDay);
    
        if (amount > 0) {
            // Positive amounts are income
            totalIncome += amount;
    
            // Add income to the day's data
            dayData.income += amount;
        } else if (amount < 0) {
            // Negative amounts are expenses (convert to absolute)
            const expense = Math.abs(amount);
            totalExpense += expense;
    
            // Add expense to the day's data
            dayData.expense += expense;
    
            // Track expense by category
            spendingByCategory[category] = (spendingByCategory[category] || 0) + expense;
        }
    });
  
    // Sort income and expense chart data by date
    incomeExpenseChartData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    // Calculate total balance
    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  
    // Calculate remaining budget
    const remainingBudget = totalBalance - totalExpense;
  
    // Transform spendingByCategory for chart
    const colorPalette = [
        "#FF6384", // Red
        "#36A2EB", // Blue
        "#FFCE56", // Yellow
        "#4BC0C0", // Teal
        "#9966FF", // Purple
        "#FF9F40", // Orange
        "#E7E9ED", // Grey
        "#33FF66", // Green
      ];
      
      const spendingByCategoryArray = Object.keys(spendingByCategory).map((category, index) => ({
        name: category,
        value: spendingByCategory[category],
        fillColor: colorPalette[index % colorPalette.length], // Cycle through colors
      }));
      
  
    return (
      <>
        <HeaderOverview />
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <IncomeCard totalIncome={totalIncome} />
          <ExpenseCard totalExpense={totalExpense} />
          <RemainingBudgetCard remaining={remainingBudget} />
  
          {/* Spending By Category Chart */}
          <SpendingByCategoryCard data={spendingByCategoryArray} />
  
          {/* Income vs Expense Chart */}
          <div className="col-span-1 md:col-span-2">
            <IncomeExpenseChart data={incomeExpenseChartData} />
          </div>
        </div>
      </>
    );
  }
  