import React from "react";
import { HeaderOverview } from "./header-overview";
import { IncomeCard } from "./income-card";
import { ExpenseCard } from "./expense-card";
import { RemainingBudgetCard } from "./remaining-budget";
// import { SpendingByCategoryCard } from "./spending-by-category-chart";
import { RecentTransactionsCard } from "./recent-transaction";
import { Account, Transaction } from "../types";
import { getTransactions } from "../transactions/actions";
import { getAccounts } from "../accounts/actions";

export default async function OverviewPage() {
    const totalIncome: number = 0;
    const totalExpense: number = 0;
    const remainingBudget: number = 0;
    // const spendingByCategory = {};
    const transactions: Transaction[] | null = await getTransactions();
    const accounts: Account[] | null = await getAccounts();

    // go thru transactions to get the month's data
    // totalIncome, totalExpenses
    // need to think about how budgeted money works as well as projected
    // remaining budget will be derived from the difference in the above

    const recentTransactions: Transaction[] = (transactions) ? transactions: [];

    console.log(accounts)

    // breakdown income, expenses, remaining budget based on accounts
    // 
    
    return (
        <>
            <HeaderOverview />
            <div>
                NOT FINAL JUST FOR TESTING
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <IncomeCard totalIncome={totalIncome} />
                <ExpenseCard totalExpense={totalExpense} />
                <RemainingBudgetCard remaining={remainingBudget} />
                {/* <SpendingByCategoryCard data={spendingByCategory} /> */}
                <div className="lg:col-span-2">
                    <RecentTransactionsCard transactions={recentTransactions} />
                </div>
            </div>
        </>
    );
}