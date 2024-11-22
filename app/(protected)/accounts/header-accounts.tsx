import React from "react";
import { SubHeader } from "@/components/custom/headers";
import { AddAccount } from "./add-account";

export function HeaderAccount() {
    return (
        <SubHeader 
            title="Accounts"
            actions={
                <>
                    <AddAccount />
                </>
            }
        />
    );
}