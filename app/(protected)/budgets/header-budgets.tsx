import React from "react";
import { SubHeader } from "@/components/custom/headers";
import { AddBudget } from "./add-budget";

export function HeaderBudget() {
    return (
        <SubHeader 
            title="Budgets"
            actions={
                <>
                    <AddBudget />
                </>
            }
        />
    );
}