import React from "react";
import { AccountList } from "./account-list";
import { getAccounts } from "./actions";
import { HeaderAccount } from "./header-accounts";

export default async function Page() {
    const accounts = await getAccounts();

    return (
        <>
            <HeaderAccount />

            <AccountList accounts={accounts}/>
        </>
    );
}