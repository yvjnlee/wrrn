import React from "react";
import { getBudgets } from "./actions";
import { BudgetList } from "./budget-list";
import { HeaderBudget } from "./header-budgets";

export default async function BudgetsPage() {
    const budgets = await getBudgets();

    return (
        <>
            <HeaderBudget />

            <BudgetList budgets={budgets}/>
        </>
    );
}